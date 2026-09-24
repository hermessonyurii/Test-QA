describe('SG Agenda - 01. Autenticação e Segurança', () => {
  before(() => {
    // Evita restaurar sessão autenticada de specs anteriores (02/03/04)
    Cypress.session.clearAllSavedSessions();
  });

  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.visitarLoginSgAgenda();
  });

  it('CT01: Deve exibir todos os elementos da tela de autenticação', () => {
    cy.contains('Organize.').should('be.visible');
    cy.contains('Agende.').should('be.visible');
    cy.contains('Cresça.').should('be.visible');
    cy.contains('Deus seja louvado!').should('be.visible');

    cy.contains('Bem-vindo!').should('be.visible');
    cy.get('input[placeholder*="e-mail"]').should('be.visible');
    cy.get('input[placeholder*="senha"]').should('be.visible');
    cy.contains('button', /entrar/i).should('be.visible');
    cy.contains('Esqueceu sua senha').should('be.visible');
    cy.contains('Criar conta').should('be.visible');

    cy.tirarEvidenciaSgAgenda('01_tela_login_elementos');
  });

  it('CT02: Deve validar obrigatoriedade dos campos (submissão vazia)', () => {
    cy.contains('button', /entrar/i).click();

    cy.url().should('include', '/login');
    cy.contains('Bem-vindo!').should('be.visible');

    cy.tirarEvidenciaSgAgenda('02_login_submissao_vazia');
  });

  it('CT03: Deve exibir erro ao informar usuário inexistente', () => {
    cy.get('input[placeholder*="e-mail"]').type('usuario_inexistente_qa@sgagenda.com.br');
    cy.get('input[placeholder*="senha"]').type('SenhaInvalida123!', { log: false });
    cy.contains('button', /entrar/i).click();

    cy.get('body', { timeout: 10000 }).should(($body) => {
      const text = $body.text();
      expect(
        text.includes('inválid') ||
        text.includes('incorret') ||
        text.includes('não encontrad') ||
        text.includes('Erro') ||
        text.includes('falha')
      ).to.be.true;
    });

    cy.tirarEvidenciaSgAgenda('03_login_usuario_inexistente');
  });

  it('CT04: Deve exibir erro ao informar senha incorreta para usuário cadastrado', () => {
    cy.env(['LOGIN_USER']).then(({ LOGIN_USER }) => {
      cy.get('input[placeholder*="e-mail"]').type(LOGIN_USER);
    });
    cy.get('input[placeholder*="senha"]').type('SenhaTotalmenteErrada999!', { log: false });
    cy.contains('button', /entrar/i).click();

    cy.get('body', { timeout: 10000 }).should(($body) => {
      const text = $body.text();
      expect(
        text.includes('inválid') ||
        text.includes('incorret') ||
        text.includes('Erro') ||
        text.includes('falha')
      ).to.be.true;
    });

    cy.tirarEvidenciaSgAgenda('04_login_senha_incorreta');
  });

  it('CT05: Deve navegar para a tela de recuperação de senha e validar interface', () => {
    cy.contains('Esqueceu sua senha').click();

    cy.url().should('satisfy', (u) => u.includes('esqueci') || u.includes('reset') || u.includes('recuperar') || u.includes('password'));
    cy.get('body').should('be.visible');

    cy.tirarEvidenciaSgAgenda('05_tela_recuperacao_senha');
  });

  it('CT06: Deve realizar login com sucesso e carregar os dados da empresa ativa', () => {
    cy.loginSgAgendaPorFormulario();

    cy.contains('QA 03').should('be.visible');
    cy.contains('Hermesson QA 01').should('be.visible');
    cy.contains('Dashboard').should('be.visible');

    cy.tirarEvidenciaSgAgenda('06_login_sucesso_dashboard');
  });
});
