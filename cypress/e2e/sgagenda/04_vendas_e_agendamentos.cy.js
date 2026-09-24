describe('SG Agenda - 04. Vendas (PDV) e Agendamentos', () => {
  beforeEach(() => {
    cy.viewport(1440, 900);
    cy.loginSgAgenda();
  });

  it('CT16: Módulo Vendas (PDV) - Validação da interface do Ponto de Venda e componentes', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/sales');
    cy.wait(2000);

    // Clica na aba PDV
    cy.contains('button, a, span', 'PDV').click({ force: true });
    cy.wait(1500);

    // Validação dos elementos centrais do PDV
    cy.get('input[placeholder*="Busque um serviço ou produto"]').should('be.visible');
    cy.contains('Vendedor').should('be.visible');
    cy.contains('Hermesson QA 01').should('be.visible');
    cy.contains('Cliente cadastrado').should('be.visible');

    cy.tirarEvidenciaSgAgenda('16_vendas_interface_pdv');
  });

  it('CT17: Módulo Vendas - Ações e botões de finalização de venda', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/sales');
    cy.wait(2000);
    cy.contains('button, a, span', 'PDV').click({ force: true });
    cy.wait(1500);

    // Validação da barra de ações inferior
    cy.contains('Total').should('be.visible');
    cy.contains('button', 'Cancelar venda').should('be.visible');
    cy.contains('button', 'Salvar').should('be.visible');
    cy.contains('button', 'Finalizar').should('be.visible');

    cy.tirarEvidenciaSgAgenda('17_vendas_botoes_finalizacao');
  });

  it('CT18: Módulo Agendamentos - Navegação na grade de horários e filtros de período', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/schedules');
    cy.wait(2000);

    // Validação dos filtros de período
    cy.contains('Equipe').should('be.visible');
    cy.contains('Hoje').should('be.visible');
    cy.contains('Esta semana').should('be.visible');
    cy.contains('Este mês').should('be.visible');

    // Validação da coluna do profissional
    cy.contains('Hermesson QA 01').should('be.visible');

    // Validação do widget do calendário à direita
    cy.contains('Calendário').should('be.visible');

    cy.tirarEvidenciaSgAgenda('18_agendamentos_grade_calendario');
  });

  it('CT19: Módulo Agendamentos - Abertura do formulário de novo agendamento', () => {
    cy.visit('https://admin.sgagenda.com.br/testeqa-03/schedules');
    cy.wait(2000);

    // Clica no botão de adicionar agendamento (+ na barra superior ou botão de ação)
    cy.get('button').filter(':contains("+"), [aria-label*="agendamento"], [title*="agendamento"]').first().click({ force: true });
    cy.wait(1500);

    // Valida que abriu a tela ou modal de agendamento
    cy.get('body').should('satisfy', ($b) => {
      const t = $b.text();
      return t.includes('Agendamento') || t.includes('Cliente') || t.includes('Serviço') || t.includes('Horário') || t.includes('Profissional');
    });

    cy.tirarEvidenciaSgAgenda('19_modal_novo_agendamento');
  });
});
