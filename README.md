# 🚀 Meus Workflows n8n

Este repositório é dedicado ao armazenamento, documentação e versionamento de todas as minhas automações criadas no **n8n**. Aqui você encontrará soluções que conectam APIs, processam dados com IA e otimizam tarefas diárias.



---

## 🛠️ Como utilizar este repositório
Cada pasta neste repositório representa um projeto específico. Para importar qualquer workflow:
1. Faça o download do arquivo `.json` desejado.
2. No seu n8n, clique em **Workflows** > **Import from File**.
3. Configure suas próprias credenciais nos nós que exigirem (APIs, Banco de Dados, etc).

---

## 📂 Projetos em Destaque

### 🏛️ [ATLAS - IA News Intelligence](./ATLAS)
Automação avançada que filtra feeds RSS, utiliza **Llama 3 (Groq)** para análise de sentimento e sumarização, armazena logs no **Airtable** e envia um digest visual via **Gmail**.
- **Status:** ✅ Operacional
- **Tags:** `IA`, `LLM`, `Airtable`, `Gmail`, `RSS`


---

## ⚙️ Minha Stack de Automação
- **Orquestrador:** n8n (Docker-based)
- **Linguagem Auxiliar:** JavaScript / Node.js
- **Modelos de IA:** Groq (Llama 3.1), Google Gemini
- **Bancos de Dados:** Airtable, PostgreSQL

---

## 🛡️ Segurança & Privacidade
Os arquivos `.json` exportados neste repositório **não contêm credenciais sensíveis** (tokens, senhas ou chaves de API). O n8n remove essas informações automaticamente durante a exportação. Ao importar, você deverá configurar suas próprias credenciais no painel do n8n.

---
📫 **Contato:** [Seu e-mail ou LinkedIn]
