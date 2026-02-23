require('dotenv').config({ path: './bot/.env' });
import { create, get, post } from 'axios';

const { AIRTABLE_PAT, BASE_ID, TABLE_ID, N8N_WEBHOOK_URL } = process.env;

const LOG_TABLE_NAME = "Historico_Incidentes";

// 3. Configuração da instância da API do Airtable
const apiAirtable = create({
    baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
    headers: {
        Authorization: `Bearer ${AIRTABLE_PAT}`,
        'Content-Type': 'application/json'
    }
});

// Rastreador de tempo offline (em memória)
const downtimeTracker = {};

/**
 * Função principal que verifica o status de cada site
 */
async function checkSites() {
    console.log(`\n🕒 [${new Date().toLocaleTimeString()}] Monitorando sites...`);

    try {
        // Busca os sites na tabela principal
        const { data } = await apiAirtable.get(`/${TABLE_ID}`);

        for (const record of data.records) {
            const { id, fields } = record;
            const siteName = fields['Nome do Site'] || 'Sem Nome';
            const url = fields['URL'];
            const statusNoBanco = fields['Status Atual'];

            if (!url) continue;

            const start = Date.now();

            try {
                // Tenta acessar o site
                await get(url, { timeout: 15000 });
                const latencyStr = `${Date.now() - start}ms`;

                // Se o site voltou a ficar online
                if (statusNoBanco === 'OFFLINE') {
                    const dadosQueda = downtimeTracker[id] || { inicio: new Date() };
                    const duracao = Math.round((new Date() - dadosQueda.inicio) / 60000);

                    console.log(`✅ ${siteName} VOLTOU (${duracao} min fora)`);

                    // Notifica n8n, atualiza tabela principal e gera log de retorno
                    await notifyN8N('UP', siteName, url, duracao, latencyStr, "OPERANTE");
                    await updateStatusPrincipal(id, 'ONLINE', '🟢 OPERANTE', latencyStr);
                    await logIncidente(id, siteName, 'RETORNO', duracao, "Site restabelecido");

                    delete downtimeTracker[id];
                } else {
                    // Site continua online, apenas atualiza latência
                    await updateStatusPrincipal(id, 'ONLINE', '🟢 OPERANTE', latencyStr);
                    console.log(`🟢 ${siteName}: OK (${latencyStr})`);
                }

            } catch (err) {
                const latencyStr = `${Date.now() - start}ms`;

                // Se o site acabou de cair
                if (statusNoBanco !== 'OFFLINE') {
                    console.log(`❌ ${siteName} CAIU!`);
                    downtimeTracker[id] = { inicio: new Date() };

                    await notifyN8N('DOWN', siteName, url, 0, latencyStr, err.message);
                    await updateStatusPrincipal(id, 'OFFLINE', `🔴 ${err.message}`, latencyStr);
                    await logIncidente(id, siteName, 'QUEDA', 0, err.message);
                } else {
                    // Site continua offline
                    await updateStatusPrincipal(id, 'OFFLINE', `🔴 ${err.message}`, latencyStr);
                    console.log(`⚠️ ${siteName}: Continua fora...`);
                }
            }
        }
    } catch (e) {
        console.error("❌ Erro geral na verificação:", e.response?.data?.error || e.message);
    }
}

/**
 * Atualiza o status do site na tabela principal
 */
async function updateStatusPrincipal(id, status, msg, latency) {
    try {
        await apiAirtable.patch(`/${TABLE_ID}`, {
            records: [{
                id,
                fields: {
                    'Status Atual': status,
                    'Mensagem de Erro': msg,
                    'Latencia': latency
                }
            }]
        });
    } catch (e) {
        console.error(`Erro ao atualizar status do site ${id}:`, e.message);
    }
}

/**
 * Cria um registro na tabela de histórico vinculando ao site
 */
async function logIncidente(siteRecordId, siteName, evento, duracao, motivo) {
    const dataFormatada = new Date().toLocaleString('pt-BR');
    try {
        await apiAirtable.post(`/${LOG_TABLE_NAME}`, {
            records: [{
                fields: {
                    'Site_Link': [siteRecordId], // Link relacional (ID do record)
                    'Evento': String(evento),
                    'Data/Hora': dataFormatada,
                    'Duracao': parseInt(duracao) || 0, // Envia como número para o Rollup
                    'Erro/Motivo': String(motivo)
                }
            }]
        });
        console.log(`📝 Log de ${evento} vinculado com sucesso.`);
    } catch (e) {
        console.error("❌ Erro ao salvar log no Airtable:", e.response?.data?.error?.message || e.message);
    }
}

/**
 * Envia notificação para o Webhook do n8n
 */
async function notifyN8N(event, name, url, duration, latency, error) {
    if (!N8N_WEBHOOK_URL) return;
    try {
        await post(N8N_WEBHOOK_URL, {
            evento: event,
            site: name,
            url: url,
            tempo_fora: duration,
            latencia: latency,
            erro_msg: error
        });
    } catch (e) {
        console.error("❌ Erro ao notificar n8n:", e.message);
    }
}

// Inicia o loop de verificação (1 em 1 minuto)
setInterval(checkSites, 60000);

// Execução imediata ao ligar o bot
checkSites();