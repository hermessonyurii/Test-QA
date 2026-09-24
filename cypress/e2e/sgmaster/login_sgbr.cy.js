describe('Suíte de Testes Automatizados - Autenticação SGBr / SG Master', () => {
  let authUrl;
  let validUser;
  let validPassword;

  beforeEach(() => {
    authUrl = Cypress.expose('authUrl');
    cy.env(['LOGIN_USER', 'LOGIN_PASSWORD']).then((env) => {
      validUser = env.LOGIN_USER;
      validPassword = env.LOGIN_PASSWORD;
    });
    // Acessa a URL de autenticação Keycloak fornecida
    cy.visit(authUrl);
  });

  it('CT01: Deve carregar a página e exibir todos os componentes essenciais de autenticação', () => {
    // 1. Validação do título da página
    cy.title().should('contain', 'SGBr Sistemas');

    // 2. Validação dos cabeçalhos visuais
    cy.contains('SGBr Sistemas').should('be.visible');
    cy.contains('Entrar na sua conta').should('be.visible');

    // 3. Validação dos campos de entrada
    cy.get('#username')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Nome de usuário ou e-mail')
      .and('have.attr', 'required');

    cy.get('#password')
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Senha')
      .and('have.attr', 'type', 'password')
      .and('have.attr', 'required');

    // 4. Validação do botão de submissão
    cy.get('button[name="login"]')
      .should('be.visible')
      .and('contain.text', 'Entrar');

    // 5. Validação do link de recuperação
    cy.contains('a', 'Esqueceu sua senha?')
      .should('be.visible')
      .and('have.attr', 'href')
      .and('include', 'reset-credentials');

    // Captura de evidência para o relatório
    cy.tirarEvidencia('01_elementos_interface_login');
  });

  it('CT02: Deve validar a obrigatoriedade dos campos (submissão vazia)', () => {
    // Clica no botão Entrar com os campos em branco
    cy.get('button[name="login"]').click();

    // Valida que o campo #username continua inválido pelo atributo HTML5 required
    cy.get('#username:invalid').should('exist');

    // Captura de evidência
    cy.tirarEvidencia('02_validacao_campos_obrigatorios_vazios');
  });

  it('CT03: Deve exibir mensagem de erro ao submeter credenciais de usuário inexistente', () => {
    const fakeUser = 'usuario_inexistente_sgbr_999@sgbr.com.br';
    const fakePass = 'SenhaInvalida@2026';

    cy.fazerLogin(fakeUser, fakePass);

    // Validação da mensagem de erro exibida pelo Keycloak
    cy.contains('Nome de usuário ou senha inválida.').should('be.visible');

    // Captura de evidência
    cy.tirarEvidencia('03_tentativa_usuario_inexistente');
  });

  it('CT04: Deve exibir mensagem de erro ao submeter usuário válido com senha incorreta', () => {
    // Utiliza o usuário válido mas com senha errada
    cy.fazerLogin(validUser, 'SenhaTotalmenteErrada123!');

    // Valida retorno de falha de autenticação
    cy.contains('Nome de usuário ou senha inválida.').should('be.visible');

    // Captura de evidência
    cy.tirarEvidencia('04_tentativa_senha_incorreta');
  });

  it('CT05: Deve navegar para a página "Esqueceu sua senha?" e validar os elementos de recuperação', () => {
    // Clica no link de recuperação de senha
    cy.contains('a', 'Esqueceu sua senha?').click();

    // Valida redirecionamento para o endpoint de reset de credenciais
    cy.url().should('include', 'reset-credentials');
    cy.contains('Esqueceu sua senha?').should('be.visible');

    // Valida presença do campo de e-mail / usuário para recuperação
    cy.get('#username').should('be.visible');

    // Captura de evidência da tela de recuperação
    cy.tirarEvidencia('05_tela_recuperacao_senha');

    // Valida retorno para a tela de login
    cy.contains('a', 'Voltar ao Login').should('be.visible').click();
    cy.contains('Entrar na sua conta').should('be.visible');
  });

  it('CT06: Deve realizar login com sucesso utilizando as credenciais válidas configuradas', () => {
    expect(validUser, 'Usuário configurado').to.be.a('string').and.not.be.empty;
    expect(validPassword, 'Senha configurada').to.be.a('string').and.not.be.empty;

    // Realiza login seguro sem expor senha nos logs
    cy.fazerLogin(validUser, validPassword);

    // Transição de domínio com suporte seguro do Cypress
    cy.origin('https://sgmaster.com.br', () => {
      // Valida que o redirecionamento pós-autenticação alcançou a aplicação
      cy.url({ timeout: 35000 }).should('include', 'empresas');
      cy.get('body', { timeout: 35000 }).should('be.visible');
      // Aguarda renderização dos componentes internos
      cy.wait(3000);
      cy.screenshot('evidencias/06_login_sucesso_sgmaster', { capture: 'viewport' });
    });
  });
});
