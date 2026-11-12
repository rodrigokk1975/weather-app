# ☀️ App de Clima (JavaScript Puro)

Uma aplicação web moderna, acessível e responsiva para consulta de previsão meteorológica, desenvolvida utilizando exclusivamente **HTML5 semântico, CSS3 moderno e Vanilla JavaScript (ES Modules)**, consumindo dados em tempo real da API pública da [Open-Meteo](https://open-meteo.com/).

---

## 🎯 Destaques do Projeto

- **Zero Dependências em Produção:** Desenvolvido puramente com as APIs nativas do navegador.
- **Arquitetura Modular:** Separação estrita de responsabilidades entre módulos (`api.js`, `ui.js`, `utils.js`, `storage.js`, `main.js`).
- **Tratamento Defensivo de Erros:**
  - Falha de conexão de rede (`TypeError` no fetch).
  - Respostas HTTP com erro (`response.ok === false`).
  - Cidades não localizadas pela geocodificação da Open-Meteo (`results` ausente/vazio).
  - Validação no lado do cliente para busca vazia.
- **Feedback de Estados na UI:**
  - **Inicial/Vazio:** Orienta o usuário a realizar a primeira busca.
  - **Carregando:** Spinner animado com desabilitação de novos cliques no botão durante a requisição.
  - **Sucesso:** Clima atual detalhado e previsão estendida dos próximos 5 dias.
  - **Erro:** Mensagens amigáveis com ícone e aviso acessível (`aria-live="polite"`).
- **Persistência Inteligente:** Salva e recupera a última cidade pesquisada com sucesso via `localStorage` (com tratamento de exceção para navegação privada ou falha de leitura).
- **Testes Automatizados:** Cobertura de funções utilitárias puras utilizando o test runner nativo do Node.js (`node:test`), sem sobrecarga de frameworks externos.

---

## 📸 Funcionalidades

1. **Busca Semântica:** Formulário acessível que suporta clique no botão ou pressionamento da tecla <kbd>Enter</kbd>.
2. **Clima Atual:**
   - Nome da localidade (Cidade, Estado e País).
   - Data atual formatada por extenso em português.
   - Temperatura em graus Celsius (°C).
   - Condição climática traduzida com ícone/emoji representativo (baseado no padrão WMO).
   - Métricas adicionais: Umidade relativa (%) e Velocidade do vento (km/h).
3. **Previsão de 5 Dias:**
   - Cards diários com dia da semana, data resumida, ícone da condição e temperaturas máxima e mínima.
4. **Design Responsivo & Mobile-First:** Experiência consistente desde smartphones compactos até telas de desktop.

---

## 📁 Estrutura de Arquivos

```text
weather-app/
├── index.html          # Estrutura HTML5 semântica e acessível
├── css/
│   └── style.css       # Estilos CSS modernos, variáveis e responsividade
├── js/
│   ├── main.js         # Ponto de entrada e orquestração de fluxo/eventos
│   ├── api.js          # Consumo das APIs de Geocoding e Forecast da Open-Meteo
│   ├── ui.js           # Gerenciamento dos estados e renderização do DOM
│   ├── utils.js        # Funções utilitárias puras (código WMO, datas e números)
│   └── storage.js      # Gerenciamento resiliente de localStorage
├── tests/
│   └── utils.test.js   # Testes unitários com node:test
├── docs/
│   └── PRD.md          # Especificação detalhada de requisitos (PRD)
├── MEMORY.md           # Diário de bordo e histórico de decisões técnicas
├── README.md           # Documentação completa do projeto
└── package.json        # Configuração de módulo ES ("type": "module") e script de teste
```

---

## 🚀 Como Executar Localmente

Como a aplicação adota **ES Modules** nativos (`type="module"`), o navegador requer um protocolo HTTP para carregar os módulos (o protocolo `file://` bloqueia importações por segurança CORS).

### Opção 1: Extensão Live Server (VS Code)
1. Instale a extensão **Live Server** no VS Code.
2. Clique com o botão direito sobre o arquivo `index.html` e selecione **"Open with Live Server"**.

### Opção 2: Via npx (Node.js)
```bash
npx serve .
```

### Opção 3: Via Python
```bash
# Python 3
python -m http.server 8000
```
Depois, abra `http://localhost:8000` no seu navegador.

---

## 🧪 Como Rodar os Testes Automatizados

O projeto utiliza o executor nativo do Node.js (**Node 18+**):

```bash
npm test
```

Os testes cobrem:
- Mapeamento correto de todos os códigos WMO para descrições e emojis.
- Resiliência do tradutor para códigos inválidos, numéricos, strings, `null` ou `undefined`.
- Arredondamento e formatação de temperaturas positivas e negativas.
- Formatação de datas em formato ISO para cards diários e data atual por extenso.

---

## 📄 Atribuição e Direitos Autorais

Os dados meteorológicos são fornecidos pela [Open-Meteo](https://open-meteo.com/) sob a licença [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).
