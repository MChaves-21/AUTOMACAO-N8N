const axios = require('axios');
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/uptime-monitor';

const sites = [
    { name: 'Google', url: 'https://wwGSFDGFDSw.google.com' },
    { name: 'Github', url: 'https://wwwGDFSGDSFG.google.com' },
    { name: 'Monitor Murilo', url: 'https://wGDFSGDFSww.google.com' }
];

const statusCache = {};

async function notifyN8N(site, status, details) {
    try {
        await axios.post(N8N_WEBHOOK_URL, {
            event: status === 'OFFLINE' ? 'SITE_DOWN' : 'SITE_RECOVERED',
            name: site.name,
            url: site.url,
            latency: details.latency || 'N/A',
            error: details.error || null,
            // Enviamos um timestamp puro para facilitar cálculos matemáticos no n8n
            timestamp_raw: new Date().toISOString(),
            timestamp_br: new Date().toLocaleString('pt-BR')
        });
        console.log(`📡 Notificação: ${site.name} -> ${status}`);
    } catch (err) {
        console.error(`❌ Erro n8n: ${err.message}`);
    }
}

async function checkSite(site, retries = 2) {
    const start = Date.now();
    try {
        await axios.get(site.url, { timeout: 8000 });
        return { status: 'ONLINE', latency: `${Date.now() - start}ms` };
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            return checkSite(site, retries - 1);
        }
        return { status: 'OFFLINE', error: error.message };
    }
}

async function monitorLoop() {
    console.log(`\n--- Verificação: ${new Date().toLocaleString('pt-BR')} ---`);
    for (const site of sites) {
        const result = await checkSite(site);
        const previousStatus = statusCache[site.name];

        // FORÇAR NOTIFICAÇÃO NO PRIMEIRO CICLO (TESTE)
        if (previousStatus === undefined) {
            console.log(`ℹ️ Testando envio inicial para: ${site.name}`);
            statusCache[site.name] = result.status;
            await notifyN8N(site, result.status, result);
        }
        else if (previousStatus !== result.status) {
            statusCache[site.name] = result.status;
            await notifyN8N(site, result.status, result);
        } else {
            console.log(`${result.status === 'ONLINE' ? '✅' : '❌'} ${site.name} sem alteração.`);
        }
    }
    setTimeout(monitorLoop, 6);
}

console.log('🚀 Monitor Inteligente V2 (Downtime Ready) Iniciado...');
monitorLoop();