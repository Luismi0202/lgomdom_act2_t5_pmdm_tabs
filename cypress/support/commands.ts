// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to navigate to a specific tab
     * @example cy.navigateToTab('search')
     */
    navigateToTab(tabName: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to wait for API to load
     * @example cy.waitForApi()
     */
    waitForApi(): Chainable<void>;

    /**
     * Custom command to start a quiz with default settings
     * @example cy.startQuiz()
     */
    startQuiz(): Chainable<void>;
  }
}

// Navigate to a specific tab
Cypress.Commands.add('navigateToTab', (tabName: string) => {
  return cy.get(`ion-tab-button[tab="${tabName}"]`).click();
});

// Wait for API loading state to finish
Cypress.Commands.add('waitForApi', () => {
  cy.get('ion-spinner', { timeout: 10000 }).should('not.exist');
});

// Start a quiz with default settings
Cypress.Commands.add('startQuiz', () => {
  cy.navigateToTab('search');
  cy.waitForApi();
  cy.get('ion-button').contains('Iniciar Quiz').click();
  cy.waitForApi();
});
