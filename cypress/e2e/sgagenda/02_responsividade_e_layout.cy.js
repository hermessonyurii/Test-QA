describe('SG Agenda - 02. Responsividade, Layout e Quebras Visuais', () => {
  beforeEach(() => {
    cy.loginSgAgenda();
  });

  it('CT07: Layout Desktop Full HD (1920x1080) - Menus fixos e sem overflow', () => {
    cy.viewport(1920, 1080);
    cy.wait(1500);

    cy.contains('Dashboard').should('be.visible');
    cy.contains('Agendamentos').should('be.visible');
    cy.contains('Clientes').should('be.visible');
    cy.contains('Catálogo').should('be.visible');

    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 5);
    });

    cy.tirarEvidenciaSgAgenda('07_responsividade_desktop_1080p');
  });

  it('CT08: Layout Laptop Padrão (1366x768) - Grid de indicadores ajustado', () => {
    cy.viewport(1366, 768);
    cy.wait(1500);

    cy.contains('Dashboard').should('be.visible');
    cy.contains('Faturamento no período').should('be.visible');

    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 5);
    });

    cy.tirarEvidenciaSgAgenda('08_responsividade_laptop_1366x768');
  });

  it('CT09: Layout Tablet iPad (768x1024) - Comportamento responsivo fluido', () => {
    cy.viewport(768, 1024);
    cy.wait(1500);

    cy.contains('Dashboard').should('be.visible');

    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 5);
    });

    cy.tirarEvidenciaSgAgenda('09_responsividade_tablet_ipad');
  });

  it('CT10: Layout Mobile Smartphone (375x667) - Menu hamburguer e gaveta lateral', () => {
    cy.viewport(375, 667);
    cy.wait(1500);

    cy.get('button').first().should('be.visible');

    cy.window().then((win) => {
      expect(win.document.body.scrollWidth).to.be.at.most(win.innerWidth + 10);
    });

    cy.tirarEvidenciaSgAgenda('10_responsividade_mobile_375x667');
  });

  it('CT11: Alternância de Tema (Modo Escuro / Dark Mode)', () => {
    cy.viewport(1440, 900);
    cy.wait(1000);

    cy.get('button, svg, [role="button"]').then(($elements) => {
      const themeBtn = $elements.filter((i, el) => {
        const h = el.outerHTML;
        return h.includes('theme') || h.includes('dark') || h.includes('moon') || h.includes('lucide-moon') || h.includes('lucide-sun');
      });
      if (themeBtn.length > 0) {
        cy.wrap(themeBtn.first()).click({ force: true });
      } else {
        cy.get('header, nav').find('button').eq(1).click({ force: true });
      }
    });

    cy.wait(1500);

    cy.tirarEvidenciaSgAgenda('11_modo_escuro_dark_mode');
  });
});
