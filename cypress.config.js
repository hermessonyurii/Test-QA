const { defineConfig } = require('cypress');
require('dotenv').config();

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Relatório de Testes Automatizados - SGBr Sistemas (Keycloak / SG Master)',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/reports',
  },
  video: false,
  screenshotOnRunFailure: true,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'https://auth.sgbr.com.br',
    testIsolation: true,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
  expose: {
    authUrl: 'https://auth.sgbr.com.br/realms/sgbr/protocol/openid-connect/auth?client_id=sgmaster-web&redirect_uri=https%3A%2F%2Fsgmaster.com.br%2Fempresas&state=2badf35f-5308-41ae-afb7-dbdb3d705605&response_mode=fragment&response_type=code&scope=openid&nonce=1f0cbda8-c67b-4691-8c90-84ba16a83747',
    appUrl: 'https://sgmaster.com.br/empresas',
    sgAgendaUrl: 'https://admin.sgagenda.com.br/',
  }
});
