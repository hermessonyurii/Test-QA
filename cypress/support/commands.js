/**
 * Comandos customizados para SG Master / SGBr
 */
Cypress.Commands.add('tirarEvidencia', (nomeEvidencia) => {
  const sanitizeName = nomeEvidencia.replace(/[^a-zA-Z0-9_-]/g, '_');
  cy.screenshot(`evidencias/${sanitizeName}`, { capture: 'viewport' });
});

Cypress.Commands.add('fazerLogin', (usuario, senha) => {
  if (usuario) {
    cy.get('#username').clear().type(usuario);
  }
  if (senha) {
    cy.get('#password').clear().type(senha, { log: false });
  }
  cy.get('button[name="login"]').click();
});

/**
 * Comandos customizados para SG Agenda (admin.sgagenda.com.br)
 *
 * Cypress 16 limpa cookies/localStorage/sessionStorage entre testes,
 * mas NÃO limpa IndexedDB. A SPA Vue persiste a sessão ali, e isso
 * vaza entre specs quando a suíte inteira roda no mesmo browser.
 */
const apagarIndexedDB = (win) => {
  if (!win.indexedDB) {
    return Promise.resolve();
  }

  const excluir = (nomes) =>
    Promise.all(
      nomes.filter(Boolean).map(
        (nome) =>
          new Promise((resolve) => {
            const req = win.indexedDB.deleteDatabase(nome);
            req.onsuccess = () => resolve();
            req.onerror = () => resolve();
            req.onblocked = () => resolve();
          })
      )
    );

  if (typeof win.indexedDB.databases === 'function') {
    return win.indexedDB.databases().then((dbs) => excluir(dbs.map((db) => db.name)));
  }

  return excluir(['localforage', 'keyval-store', 'firebaseLocalStorageDb']);
};

const credenciaisSgAgenda = (usuario, senha) => {
  if (usuario && senha) {
    return cy.wrap({ user: usuario, pass: senha }, { log: false });
  }

  return cy.env(['LOGIN_USER', 'LOGIN_PASSWORD']).then((env) => ({
    user: env.LOGIN_USER,
    pass: env.LOGIN_PASSWORD,
  }));
};

Cypress.Commands.add('tirarEvidenciaSgAgenda', (nomeEvidencia) => {
  const sanitizeName = nomeEvidencia.replace(/[^a-zA-Z0-9_-]/g, '_');
  cy.screenshot(`evidencias_sgagenda/${sanitizeName}`, { capture: 'viewport' });
});

Cypress.Commands.add('aceitarCookiesSgAgenda', () => {
  cy.get('body', { timeout: 15000 }).should('be.visible');
  cy.wait(500);
  cy.get('body').then(($body) => {
    const botao = [...$body.find('button')].find((el) =>
      /aceitar cookies/i.test(el.innerText || '')
    );
    if (botao) {
      cy.wrap(botao).click({ force: true });
    }
  });
});

Cypress.Commands.add('limparPersistenciaSgAgenda', () => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();

  cy.window().then((win) => {
    try {
      win.localStorage.clear();
    } catch (e) {
      /* origem ainda pode ser about:blank */
    }
    try {
      win.sessionStorage.clear();
    } catch (e) {
      /* ignore */
    }
    return apagarIndexedDB(win);
  });
});

Cypress.Commands.add('visitarLoginSgAgenda', () => {
  const url = Cypress.expose('sgAgendaUrl');

  cy.then(() => Cypress.session.clearCurrentSessionData());

  cy.clearAllCookies();
  cy.clearAllLocalStorage();
  cy.clearAllSessionStorage();

  cy.visit(url, {
    onBeforeLoad(win) {
      try {
        win.localStorage.clear();
        win.sessionStorage.clear();
      } catch (e) {
        /* ignore */
      }
    },
  });

  cy.limparPersistenciaSgAgenda();
  cy.reload();
  cy.aceitarCookiesSgAgenda();

  cy.get('input[placeholder*="e-mail"]', { timeout: 20000 }).should('be.visible');
  cy.contains('Bem-vindo!').should('be.visible');
});

Cypress.Commands.add('loginSgAgendaPorFormulario', (usuario, senha) => {
  credenciaisSgAgenda(usuario, senha).then(({ user, pass }) => {
    const url = Cypress.expose('sgAgendaUrl');

    cy.visit(url, {
      onBeforeLoad(win) {
        try {
          win.localStorage.clear();
          win.sessionStorage.clear();
        } catch (e) {
          /* ignore */
        }
      },
    });

    cy.limparPersistenciaSgAgenda();
    cy.reload();
    cy.aceitarCookiesSgAgenda();

    cy.get('input[placeholder*="e-mail"]', { timeout: 20000 }).should('be.visible').clear().type(user);
    cy.get('input[placeholder*="senha"]').clear().type(pass, { log: false });
    cy.contains('button', /entrar/i).click({ force: true });
    cy.contains('Dashboard', { timeout: 20000 }).should('be.visible');
  });
});

Cypress.Commands.add('loginSgAgenda', (usuario, senha) => {
  credenciaisSgAgenda(usuario, senha).then(({ user, pass }) => {
    const url = Cypress.expose('sgAgendaUrl');

    cy.session(
      ['sg-agenda', user],
      () => {
        cy.visit(url);
        cy.limparPersistenciaSgAgenda();
        cy.reload();
        cy.aceitarCookiesSgAgenda();
        cy.get('input[placeholder*="e-mail"]', { timeout: 20000 }).should('be.visible').clear().type(user);
        cy.get('input[placeholder*="senha"]').clear().type(pass, { log: false });
        cy.contains('button', /entrar/i).click({ force: true });
        cy.contains('Dashboard', { timeout: 20000 }).should('be.visible');
      },
      {
        cacheAcrossSpecs: true,
        validate() {
          cy.visit(url);
          cy.contains('Dashboard', { timeout: 15000 }).should('be.visible');
        },
      }
    );

    cy.visit(url);
    cy.aceitarCookiesSgAgenda();
    cy.contains('Dashboard', { timeout: 20000 }).should('be.visible');
  });
});
