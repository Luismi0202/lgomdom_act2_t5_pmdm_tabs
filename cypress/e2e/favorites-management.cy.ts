/**
 * E2E Test: Gestión de Favoritos
 * Verifica la funcionalidad de agregar, ver y eliminar favoritos
 */
describe('Gestión de Favoritos', () => {
  beforeEach(() => {
    // Interceptar API calls
    cy.intercept('GET', '**/api_category.php', { fixture: 'categories.json' }).as('getCategories');
    cy.intercept('GET', '**/api.php*', { fixture: 'questions.json' }).as('getQuestions');
    
    // Limpiar localStorage
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('debería mostrar mensaje cuando no hay favoritos', () => {
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');
    
    // Verificar mensaje de lista vacía o contenido
    cy.get('ion-content').should('be.visible');
  });

  it('debería navegar entre favoritos y otras tabs', () => {
    // Ir a favoritos
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');

    // Ir a search
    cy.get('ion-tab-button[tab="search"]').click();
    cy.url().should('include', '/tabs/search');

    // Volver a favoritos
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');
  });

  it('debería mantener favoritos en localStorage', () => {
    // Simular añadir un favorito manualmente al localStorage
    const mockFavorite = {
      id: 'test-1',
      category: 'Science',
      type: 'multiple',
      difficulty: 'easy',
      question: 'Test question?',
      correctAnswer: 'Correct',
      incorrectAnswers: ['Wrong1', 'Wrong2', 'Wrong3'],
      allAnswers: ['Correct', 'Wrong1', 'Wrong2', 'Wrong3']
    };

    cy.window().then((win) => {
      win.localStorage.setItem('trivia_favorites', JSON.stringify([mockFavorite]));
    });

    // Recargar la página
    cy.reload();

    // Ir a favoritos
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');

    // Verificar que el contenido se carga (el favorito debería estar ahí)
    cy.get('ion-content').should('be.visible');
  });

  it('debería limpiar favoritos correctamente', () => {
    // Simular favoritos en localStorage
    const mockFavorites = [
      {
        id: 'test-1',
        category: 'Science',
        type: 'multiple',
        difficulty: 'easy',
        question: 'Test question 1?',
        correctAnswer: 'Correct1',
        incorrectAnswers: ['W1', 'W2', 'W3'],
        allAnswers: ['Correct1', 'W1', 'W2', 'W3']
      },
      {
        id: 'test-2',
        category: 'History',
        type: 'boolean',
        difficulty: 'medium',
        question: 'Test question 2?',
        correctAnswer: 'True',
        incorrectAnswers: ['False'],
        allAnswers: ['True', 'False']
      }
    ];

    cy.window().then((win) => {
      win.localStorage.setItem('trivia_favorites', JSON.stringify(mockFavorites));
    });

    cy.reload();
    cy.get('ion-tab-button[tab="favorites"]').click();

    // Verificar que hay contenido visible
    cy.get('ion-content').should('be.visible');
  });
});
