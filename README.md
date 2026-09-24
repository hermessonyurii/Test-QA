# Testes Automatizados QA — SG Master e SG Agenda

Projeto de testes **End-to-End (E2E)** com **Cypress 16.1.0** e relatório **Mochawesome**.

Cobre dois sistemas:

| Sistema | O que é testado | Specs |
|---|---|---|
| **SG Master** (SSO Keycloak) | Login, validações, recuperação de senha e acesso pós-SSO | 6 casos |
| **SG Agenda** (painel admin) | Login, layout/responsividade, cadastros e PDV/agendamentos | 19 casos |

**Total: 25 casos de teste.**

---

## Pré-requisitos

- Node.js 18+ (recomendado 20 ou 22)
- Conta de teste nos ambientes (credenciais **não** vão para o Git)

## Configuração local

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd Test-QA
npm install
```

Copie o modelo de credenciais e preencha com o usuário de QA:

```bash
copy cypress.env.example.json cypress.env.json
```

Edite `cypress.env.json`:

```json
{
  "LOGIN_USER": "seu_usuario_qa@exemplo.com",
  "LOGIN_PASSWORD": "sua_senha"
}
```

Esse arquivo está no `.gitignore` e **não deve ser commitado**.

## Como executar

| Comando | O que faz |
|---|---|
| `npm test` | Roda **todos** os 25 testes (headless) |
| `npm run test:sgmaster` | Só SG Master |
| `npm run test:sgagenda` | Só SG Agenda |
| `npm run test:headed` | Todos os testes com janela do navegador |
| `npm run cypress:open` | Interface interativa do Cypress |

No Windows também existem atalhos `.bat` na raiz (`executar_todos_os_testes.bat`, `executar_testes_sgmaster.bat`, `executar_testes_sgagenda.bat`).

Após a execução, o relatório HTML fica em `cypress/reports/index.html`.

## Segurança

- Senhas só em `cypress.env.json` (local).
- No Cypress 16, credenciais são lidas com `cy.env(['LOGIN_USER', 'LOGIN_PASSWORD'])`.
- URLs públicas ficam em `Cypress.expose(...)` no `cypress.config.js`.
- Senha digitada nos testes usa `{ log: false }` para não aparecer no log.

## Documentação

- [DOCUMENTACAO_TESTES.md](DOCUMENTACAO_TESTES.md) — estrutura, matriz de CTs e como cada peça funciona
- [RELATORIO_DE_TESTES_ENTREGA.md](RELATORIO_DE_TESTES_ENTREGA.md) — relatório executivo para apresentação
