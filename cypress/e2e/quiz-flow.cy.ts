/**
 * E2E Test: Flujo completo de Quiz
 * Verifica el flujo desde configuración hasta resultado
 */
describe('Flujo de Quiz', () => {
  beforeEach(() => {
    // Interceptar API calls con fixtures
    cy.intercept('GET', '**/api_category.php', { fixture: 'categories.json' }).as('getCategories');
    cy.intercept('GET', '**/api.php*', { fixture: 'questions.json' }).as('getQuestions');
    
    // Limpiar localStorage antes de cada test
    cy.clearLocalStorage();
    cy.visit('/tabs/search');
    cy.wait('@getCategories');
  });

  it('debería mostrar el formulario de configuración de quiz', () => {
    cy.get('ion-select').should('have.length.at.least', 1);
    cy.get('ion-button').contains(/iniciar|start/i).should('be.visible');
  });

  it('debería iniciar un quiz y mostrar preguntas', () => {
    // Iniciar quiz
    cy.get('ion-button').contains(/iniciar|start/i).click();
    cy.wait('@getQuestions');

    // Verificar que se muestra una pregunta
    cy.get('ion-card').should('be.visible');
    cy.get('ion-card-content').should('be.visible');
  });

  it('debería permitir seleccionar una respuesta', () => {
    // Iniciar quiz
    cy.get('ion-button').contains(/iniciar|start/i).click();
    cy.wait('@getQuestions');

    // Seleccionar una respuesta (la primera opción disponible)
    cy.get('ion-item').first().click();
  });

  it('debería mostrar el progreso del quiz', () => {
    // Iniciar quiz
    cy.get('ion-button').contains(/iniciar|start/i).click();
    cy.wait('@getQuestions');

    // Verificar indicador de progreso
    cy.get('ion-progress-bar').should('be.visible');
  });

  it('debería completar el quiz y mostrar resultados', () => {
    // Iniciar quiz
    cy.get('ion-button').contains(/iniciar|start/i).click();
    cy.wait('@getQuestions');

    // Responder todas las preguntas (simulado con el fixture de 5 preguntas)
    for (let i = 0; i < 5; i++) {
      // Seleccionar primera respuesta disponible
      cy.get('ion-item.answer-item').first().click();
      
      // Click en siguiente o finalizar
      cy.get('ion-button').contains(/siguiente|next|finalizar|finish/i).click({ force: true });
    }

    // Verificar que se muestran los resultados
    cy.get('ion-card').should('be.visible');
  });
});
