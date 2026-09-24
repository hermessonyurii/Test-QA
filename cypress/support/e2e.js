// Suporte global para Cypress
import 'cypress-mochawesome-reporter/register';
import './commands';

// Impede que exceções não tratadas de scripts da própria aplicação quebrem a execução do teste
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
