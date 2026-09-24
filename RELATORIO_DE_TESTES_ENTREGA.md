# Relatório de Testes Automatizados de Qualidade (QA)

**Projetos cobertos:** SG Master Web (SGBr / Keycloak) e SG Agenda (painel admin)  
**QA responsável:** Hermesson  
**Framework:** Cypress 16.1.0 + Mochawesome  
**Status da última suíte completa do SG Agenda (24/09/2026):** 19/19 aprovados  
**Escopo total do repositório:** 25 casos de teste automatizados

---

## 1. Resumo executivo

Foi implementada uma suíte E2E que simula o usuário real no navegador: abre a URL, preenche campos, clica, valida mensagens e tira evidência em tela.

Objetivo de negócio: reduzir retrabalho de regressão em **login** (porta de entrada dos dois produtos) e nos **módulos mais usados do SG Agenda** (clientes, catálogo, planos, PDV e agendamentos), com relatório HTML reproduzível a cada execução.

| Indicador | Valor |
|---|---|
| Casos automatizados | 25 |
| SG Master | 6 (autenticação SSO) |
| SG Agenda | 19 (login, layout, cadastros, vendas/agenda) |
| Credenciais no Git | Não (arquivo local `cypress.env.json`) |

---

## 2. Ambientes

| Sistema | URLs |
|---|---|
| SG Master / Keycloak | `https://auth.sgbr.com.br` → `https://sgmaster.com.br/empresas` |
| SG Agenda | `https://admin.sgagenda.com.br/` (tenant `testeqa-03`) |

Navegador de execução: Electron/Chrome via Cypress. Dados de login isolados em variável de ambiente, senha mascarada nos logs.

---

## 3. O que cada bloco cobre (visão gerencial)

**SG Master — risco de não entrar no produto**  
Tela íntegra, campos obrigatórios, usuário/senha inválidos, recuperação de senha e login com SSO até a área de empresas.

**SG Agenda — risco de painel inutilizável**  
- Segurança da tela de login (mesmo raciocínio do Master).  
- Layout em desktop, notebook, tablet e celular (overflow e menus).  
- Abertura dos fluxos de cadastro (cliente, serviço, produto, plano).  
- PDV (busca, vendedor, ações de finalizar) e grade de agendamentos.

Não substitui teste exploratório nem homologação de regra de negócio financeira; cobre **regressão visual/funcional dos caminhos principais**.

---

## 4. Detalhamento SG Master (CT01–CT06)

| ID | Cenário | Resultado esperado |
|---|---|---|
| CT01 | Componentes da tela de login | Título, campos, Entrar, Esqueceu a senha |
| CT02 | Submit vazio | Bloqueio HTML5 (`required`) |
| CT03 | Usuário inexistente | Mensagem de credencial inválida |
| CT04 | Senha incorreta | Mesma mensagem de falha |
| CT05 | Recuperação de senha | Tela de reset e retorno ao login |
| CT06 | Login válido | Redirect para `/empresas` no SG Master |

---

## 5. Detalhamento SG Agenda (CT01–CT19)

| ID | Cenário |
|---|---|
| CT01–CT06 | Login: UI, vazio, usuário inválido, senha errada, recuperar senha, sucesso (QA 03) |
| CT07–CT10 | Responsividade 1920, 1366, iPad, iPhone |
| CT11 | Tema escuro |
| CT12–CT15 | Clientes, serviços, produtos, planos (listagem + abrir formulário) |
| CT16–CT17 | PDV (interface e botões de finalização) |
| CT18–CT19 | Agendamentos (filtros/calendário e novo agendamento) |

Última execução conjunta dos 4 specs do Agenda: **19 passing, 0 failing** (~1 min 29 s).

---

## 6. Como reproduzir

```bash
npm install
copy cypress.env.example.json cypress.env.json
npm test
```

Abrir `cypress/reports/index.html` após a run.
