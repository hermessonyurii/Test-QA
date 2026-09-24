# Documentação técnica — Testes Automatizados QA

**Ferramenta:** Cypress 16.1.0 + cypress-mochawesome-reporter  
**Sistemas:** SG Master (Keycloak / SSO) e SG Agenda (admin Vue + PrimeVue)  
**Total:** 25 casos de teste (6 + 19)

---

## 1. Objetivo do projeto

Automatizar fluxos críticos de autenticação e do painel administrativo para:

- Detectar regressão de login, layout e módulos principais sem repetir o mesmo roteiro manual.
- Gerar evidências (prints) e relatório HTML a cada execução.
- Rodar a suíte inteira de forma isolada (um spec não pode “contaminar” o outro com sessão/cookies).

---

## 2. Estrutura do repositório

```text
Test-QA/
├── cypress.config.js                 # Configuração Cypress 16 (timeouts, reporter, expose)
├── cypress.env.example.json          # Modelo de credenciais (versionado)
├── cypress.env.json                  # Credenciais reais (NÃO versionado)
├── package.json                      # Scripts npm e dependências
├── cypress/
│   ├── e2e/
│   │   ├── sgmaster/
│   │   │   └── login_sgbr.cy.js      # CT01–CT06 SG Master
│   │   └── sgagenda/
│   │       ├── 01_autenticacao.cy.js
│   │       ├── 02_responsividade_e_layout.cy.js
│   │       ├── 03_cadastros_e_exclusao.cy.js
│   │       └── 04_vendas_e_agendamentos.cy.js
│   ├── support/
│   │   ├── e2e.js                    # Import global + ignore uncaught exception da app
│   │   └── commands.js               # Login, evidências, limpeza de sessão SG Agenda
│   └── fixtures/                     # Catálogos auxiliares de elementos
├── DOCUMENTACAO_TESTES.md
├── RELATORIO_DE_TESTES_ENTREGA.md
└── README.md
```

---

## 3. Para que serve cada arquivo importante

| Arquivo | Função |
|---|---|
| `cypress.config.js` | Timeouts, `testIsolation: true`, reporter Mochawesome, URLs públicas via `expose` |
| `cypress/support/e2e.js` | Carrega comandos e o reporter; evita que erro JS da aplicação derrube o teste |
| `cypress/support/commands.js` | Reuso: login Keycloak, login SG Agenda, sessão (`cy.session`), limpeza de IndexedDB, prints |
| Specs em `cypress/e2e/` | Os casos de teste propriamente ditos (`describe` / `it`) |
| `cypress.env.json` | Usuário e senha de QA (segredo local) |
| Relatório em `cypress/reports/` | HTML gerado **depois** da execução (não versionado) |

### Cypress 16 (importante)

- `Cypress.env()` **não existe**. Valores públicos: `Cypress.expose('chave')`. Segredos: `cy.env(['LOGIN_USER', 'LOGIN_PASSWORD'])` (Promise).
- Login Keycloak → SG Master muda de domínio: usa `cy.origin('https://sgmaster.com.br', ...)`.
- `testIsolation` limpa cookies, localStorage e sessionStorage. **Não limpa IndexedDB.** Por isso o SG Agenda (SPA Vue) tem comandos que apagam IndexedDB antes do login “como visitante”.

---

## 4. Matriz de casos de teste

### 4.1 SG Master — `cypress/e2e/sgmaster/login_sgbr.cy.js`

Ambiente: `https://auth.sgbr.com.br` (Keycloak) → `https://sgmaster.com.br/empresas`

| ID | O que valida | Por quê |
|---|---|---|
| CT01 | Tela de login completa (campos, botão, “Esqueceu sua senha?”) | Interface quebrada impede qualquer acesso |
| CT02 | Submit vazio / HTML5 `required` | Não pode autenticar sem dados |
| CT03 | Usuário inexistente → mensagem de erro | Segurança e feedback claro |
| CT04 | Senha errada com usuário válido → erro | Mesmo motivo |
| CT05 | Fluxo “Esqueceu sua senha?” e volta ao login | Recuperação de acesso |
| CT06 | Login válido + redirect SSO para Empresas | Caminho feliz do produto |

### 4.2 SG Agenda — autenticação (`01_autenticacao.cy.js`)

Ambiente: `https://admin.sgagenda.com.br/` (tenant `testeqa-03`)

| ID | O que valida |
|---|---|
| CT01 | Elementos da tela de login (copy institucional + formulário) |
| CT02 | Submit vazio permanece em `/login` |
| CT03 | Usuário inexistente gera mensagem de falha |
| CT04 | Senha incorreta para usuário cadastrado |
| CT05 | Link de recuperação de senha |
| CT06 | Login válido, empresa **QA 03** e usuário **Hermesson QA 01** no Dashboard |

Este spec **não** reutiliza sessão autenticada: começa sempre como visitante (`visitarLoginSgAgenda`).

### 4.3 SG Agenda — layout (`02_responsividade_e_layout.cy.js`)

| ID | Viewport | O que valida |
|---|---|---|
| CT07 | 1920×1080 | Menu (Dashboard, Agendamentos, Clientes, Catálogo) sem overflow horizontal |
| CT08 | 1366×768 | Dashboard + “Faturamento no período” |
| CT09 | 768×1024 | Tablet sem quebra de largura |
| CT10 | 375×667 | Mobile (botão visível, overflow controlado) |
| CT11 | 1440×900 | Alternância de tema (claro/escuro) |

### 4.4 SG Agenda — cadastros (`03_cadastros_e_exclusao.cy.js`)

| ID | Módulo | O que valida |
|---|---|---|
| CT12 | Clientes | Listagem (nome, telefone, e-mail) e abertura do formulário novo cliente |
| CT13 | Catálogo / Serviços | Colunas, botão de exclusão (danger) e formulário novo serviço |
| CT14 | Catálogo / Produtos | Aba Produtos e formulário novo produto |
| CT15 | Planos | Listagem e formulário de plano |

### 4.5 SG Agenda — vendas e agenda (`04_vendas_e_agendamentos.cy.js`)

| ID | Módulo | O que valida |
|---|---|---|
| CT16 | PDV | Busca, vendedor, cliente cadastrado |
| CT17 | PDV | Total, Cancelar, Salvar, Finalizar |
| CT18 | Agendamentos | Filtros (Hoje / semana / mês), profissional, calendário |
| CT19 | Agendamentos | Abertura do formulário/modal de novo agendamento |

---

## 5. Isolamento de sessão (SG Agenda)

Quando os 4 specs do Agenda rodavam juntos, 01 e 02 falhavam de forma intermitente; isolados passavam. Causa: a SPA persiste login no **IndexedDB**, que o Cypress não limpa automaticamente.

Solução em `commands.js`:

- `visitarLoginSgAgenda` — limpa cookies, storages, IndexedDB e sessão Cypress; exige tela “Bem-vindo!”.
- `loginSgAgendaPorFormulario` — login real pela UI (CT06).
- `loginSgAgenda` — `cy.session` com cache entre specs 02–04 (mais rápido e estável).

---

## 6. Como executar

```bash
npm install
copy cypress.env.example.json cypress.env.json
npm test
```

Relatório: `cypress/reports/index.html`  
Evidências: `cypress/screenshots/`
