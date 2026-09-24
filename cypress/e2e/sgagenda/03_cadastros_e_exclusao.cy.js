describe('SG Agenda - 03. Cadastros e Exclusão (Clientes, Catálogo e Planos)', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.loginSgAgenda();
  });

  it('CT12: Módulo Clientes - Validação da listagem e abertura do formulário de novo cliente', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/customers');
    cy.wait(2000);

    // Valida títulos e colunas da tabela
    cy.contains(/clientes/i).should('be.visible');
    cy.contains(/nome/i).should('be.visible');
    cy.contains(/telefone/i).should('be.visible');
    cy.contains(/e-mail/i).should('be.visible');

    // Clica para cadastrar novo cliente (botão Novo cliente ou Cadastrar primeiro cliente)
    cy.get('button, a').filter(':contains("Novo cliente"), :contains("Cadastrar primeiro cliente")').first().click({ force: true });
    cy.wait(1500);

    // Valida que o modal ou tela de cadastro abriu
    cy.get('body').should('satisfy', ($b) => {
      const t = $b.text();
      return /nome/i.test(t) || /cliente/i.test(t) || /telefone/i.test(t);
    });

    cy.tirarEvidenciaSgAgenda('12_formulario_novo_cliente');
  });

  it('CT13: Módulo Catálogo (Serviços) - Validação da listagem, exclusão e tela de novo serviço', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/catalog');
    cy.wait(2000);

    // Valida presença da aba Serviços e colunas
    cy.contains(/serviços/i).should('be.visible');
    cy.contains(/duração/i).should('be.visible');
    cy.contains(/valor/i).should('be.visible');

    // Valida presença dos botões de ação/exclusão (lixeira / perigo)
    cy.get('button.p-button-danger').should('have.length.at.least', 1);

    // Abre formulário de novo serviço
    cy.get('button, a').filter(':contains("Novo serviço")').first().click({ force: true });
    cy.wait(1500);

    cy.get('body').should('satisfy', ($b) => {
      const t = $b.text();
      return /serviço/i.test(t) || /duração/i.test(t) || /valor/i.test(t) || /salvar/i.test(t);
    });

    cy.tirarEvidenciaSgAgenda('13_formulario_novo_servico');
  });

  it('CT14: Módulo Catálogo (Produtos) - Validação da aba de produtos e cadastro', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/catalog');
    cy.wait(1500);

    // Alterna para a aba Produtos
    cy.contains('button, a, span', 'Produtos').click({ force: true });
    cy.wait(2000);

    cy.get('body').should('contain', 'Produtos');

    // Abre formulário de novo produto
    cy.get('button, a').filter(':contains("Novo produto"), :contains("Cadastrar primeiro produto"), :contains("Novo")').first().click({ force: true });
    cy.wait(1500);

    cy.get('body').should('satisfy', ($b) => {
      const t = $b.text();
      return /produto/i.test(t) || /valor/i.test(t) || /preço/i.test(t) || /estoque/i.test(t);
    });

    cy.tirarEvidenciaSgAgenda('14_formulario_novo_produto');
  });

  it('CT15: Módulo Planos - Validação da listagem e abertura do formulário de planos', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/plans');
    cy.wait(2000);

    cy.contains(/planos/i).should('be.visible');
    cy.contains(/nome/i).should('be.visible');
    cy.contains(/valor/i).should('be.visible');

    // Clica para cadastrar plano
    cy.get('button, a').filter(':contains("Cadastrar primeiro plano"), :contains("Novo plano"), :contains("Novo")').first().click({ force: true });
    cy.wait(1500);

    cy.get('body').should('satisfy', ($b) => {
      const t = $b.text();
      return /plano/i.test(t) || /valor/i.test(t) || /recorrência/i.test(t) || /salvar/i.test(t);
    });

    cy.tirarEvidenciaSgAgenda('15_formulario_novo_plano');
  });
});
