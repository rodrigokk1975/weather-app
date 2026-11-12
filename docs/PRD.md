# PRD: App de Clima (JavaScript Puro)

## 1. Visão Geral
Aplicação web de consulta meteorológica construída com HTML5 semântico, CSS3 moderno e JavaScript puro (ES Modules), consumindo a API pública da Open-Meteo. O objetivo é demonstrar domínio de consumo assíncrono, tratamento defensivo de erros, estados visuais de interface e organização modular sem o uso de frameworks.

## 2. Requisitos Funcionais
- **RF01: Buscar cidade por nome**
  - Usuário digita o nome de uma localidade e submete o formulário via clique ou tecla Enter.
  - Submissão com campo vazio deve alertar o usuário sem disparar requisições.
- **RF02: Exibir clima atual**
  - Apresentar temperatura em graus Celsius (°C), condição meteorológica traduzida com ícone/emoji, umidade relativa do ar (%) e velocidade do vento (km/h).
- **RF03: Exibir previsão de 5 dias**
  - Apresentar cards diários com data formatada, ícone da condição meteorológica e temperaturas mínimas e máximas (°C).
- **RF04: Estados de interface**
  - Exibir visualmente os estados: inicial (sem busca), carregando (com botão desabilitado), sucesso (dados renderizados) e erro (mensagens amigáveis e específicas para cada falha).
- **RF05: Persistência local**
  - Salvar no `localStorage` a última cidade buscada com sucesso e recarregá-la ao abrir a aplicação. Falhas no armazenamento não devem travar a aplicação.

## 3. Requisitos Não Funcionais
- Sem frameworks ou dependências de runtime (Vanilla JS com `type="module"`).
- Responsividade completa (Mobile-First / Flexbox & CSS Grid).
- Acessibilidade básica (labels explícitos, foco visível, contraste adequado e avisos com `aria-live="polite"`).
- Sem chaves de API expostas no código.
- Interface e documentação em Português (PT-BR).

## 4. Decisões Técnicas
- **API:** Open-Meteo (Geocoding API + Forecast API com `timezone=auto`).
- **Mapeamento de Condições:** Interpretação dos códigos meteorológicos WMO em `utils.js`.
- **Testes:** Runner nativo `node:test` e asserções com `node:assert/strict` para funções utilitárias puras.
- **Controle de Versão:** Conventional Commits com 1 commit por etapa.

## 5. Estrutura de Arquivos
```text
weather-app/
├── index.html
├── css/style.css
├── js/
│   ├── main.js
│   ├── api.js
│   ├── ui.js
│   ├── utils.js
│   └── storage.js
├── tests/
│   └── utils.test.js
├── docs/PRD.md
├── MEMORY.md
├── README.md
└── package.json
```
