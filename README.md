# ☀️ App de Clima (JavaScript Puro)

Aplicação web de consulta de previsão do tempo desenvolvida em HTML5, CSS3 e JavaScript puro (ES Modules), consumindo a API aberta da [Open-Meteo](https://open-meteo.com/).

## 🎯 Objetivo
Demonstrar competências essenciais de desenvolvimento frontend em Vanilla JavaScript:
- Requisições assíncronas com `fetch` e `async/await`.
- Tratamento defensivo de erros (falhas de conexão, cidade inexistente, respostas inesperadas).
- Feedback visual para os estados da interface (vazio, carregando, erro e sucesso).
- Manipulação semântica do DOM e renderização dinâmica.
- Arquitetura desacoplada em módulos ES (`import` / `export`).
- Testes unitários com o test runner nativo do Node.js (`node:test`).
- Persistência no cliente com `localStorage`.

## 📋 Pré-requisitos
- Navegador moderno com suporte a ES Modules (Chrome, Firefox, Safari, Edge).
- Node.js versão 18 ou superior (apenas para rodar os testes automatizados).

## 🚀 Como Executar Localmente
Por utilizar módulos nativos do JavaScript (`type="module"`), o arquivo `index.html` deve ser servido através de um servidor HTTP local para evitar bloqueios de CORS por protocolo de arquivo (`file://`):

1. **Via VS Code:**
   Instale a extensão **Live Server**, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.
2. **Via npx:**
   ```bash
   npx serve .
   ```
3. **Via Python:**
   ```bash
   python -m http.server 8000
   ```

## 🧪 Como Rodar os Testes
```bash
npm test
```

## 📄 Licença e Atribuição
Os dados meteorológicos são fornecidos por [Open-Meteo](https://open-meteo.com/) sob os termos da licença [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
