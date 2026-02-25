# 🏛️ ATLAS: AI-Driven News Intelligence & Automation

**ATLAS** é um ecossistema de automação de ponta para curadoria de notícias. O projeto transforma o fluxo massivo de informações da web em inteligência estruturada, utilizando modelos de linguagem de larga escala (LLMs) para análise, sumarização e distribuição automatizada.



## 🚀 O que o ATLAS faz?

1.  **Monitoramento Multicanal:** Varre feeds RSS globais em busca das últimas notícias.
2.  **Filtragem Inteligente:** Processa apenas conteúdos das últimas 24 horas e evita duplicatas.
3.  **Análise de Sentimento & Sumarização:** Utiliza o modelo **Llama 3 (Groq)** para ler as notícias, resumir os pontos chave, categorizar o assunto e definir o sentimento (Positivo, Neutro ou Negativo).
4.  **Histórico Estruturado:** Salva cada notícia processada no **Airtable**, criando um banco de dados para consultas futuras.
5.  **Distribuição Visual:** Gera um e-mail HTML elegante e envia automaticamente para o destinatário.

## 📸 Visual do Projeto

### 🌐 Workflow (n8n)
O coração da automação, conectando gatilhos de tempo, IA e APIs de saída.
![Workflow do ATLAS](img/workflow-completo.png)

### 📊 Interface e Entrega
| Inteligência em Dados (Airtable) | Entrega Final (E-mail) |
| :---: | :---: |
| ![Banco de Dados](img/banco-airtable.png) | ![Exemplo de E-mail](img/exemplo-email.png) |

## 🛠️ Tecnologias Utilizadas

- **n8n**: Orquestrador de fluxo de trabalho.
- **Groq (Llama 3.1 8B)**: Engine de Inteligência Artificial para processamento de linguagem natural.
- **Airtable**: Banco de dados relacional para persistência de notícias.
- **Gmail API**: Sistema de entrega de e-mails.
- **JavaScript**: Lógica personalizada para validação de dados e limpeza de HTML.

## 📦 Como Instalar o ATLAS

1.  Certifique-se de ter o **n8n** instalado (Desktop ou Self-hosted).
2.  Faça o download do arquivo `workflow.json` deste repositório.
3.  No seu n8n, vá em **Workflows > Import from File** e selecione o arquivo baixado.
4.  Configure suas credenciais:
    - **Groq API Key** (Obtenha em console.groq.com)
    - **Airtable Personal Access Token**
    - **Gmail OAuth2**
5.  No nó "ENVIA O EMAIL", altere o campo "Send To" para o seu e-mail.
6.  Ative o nó **Schedule Trigger** para rodar no horário de sua preferência.

---
🚀 *Desenvolvido para transformar informação em poder.*
