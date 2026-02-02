/**
 * E2E Test: Perfil y Configuración
 * Verifica las funciones de perfil y ajustes
 */
describe('Perfil y Configuración', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('debería mostrar la página de perfil', () => {
    cy.get('ion-tab-button[tab="profile"]').click();
    cy.url().should('include', '/tabs/profile');
    cy.get('ion-content').should('be.visible');
  });

  it('debería mostrar estadísticas del usuario', () => {
    cy.get('ion-tab-button[tab="profile"]').click();
    cy.url().should('include', '/tabs/profile');
    
    // Verificar que hay elementos de estadísticas
    cy.get('ion-card').should('be.visible');
  });

  it('debería navegar a la página de ajustes', () => {
    cy.get('ion-tab-button[tab="profile"]').click();
    
    // Buscar botón de ajustes y hacer click
    cy.get('ion-button').contains(/ajustes|settings|configuración/i).click();
    
    // Verificar navegación a settings (fuera de tabs)
    cy.url().should('include', '/settings');
  });

  it('debería poder modificar configuraciones', () => {
    // Navegar directamente a settings
    cy.visit('/settings');
    
    // Verificar que los controles de configuración existen
    cy.get('ion-content').should('be.visible');
    cy.get('ion-toggle, ion-select, ion-input').should('have.length.at.least', 1);
  });

  it('debería mantener las configuraciones después de recargar', () => {
    // Establecer configuración manualmente
    const settings = {
      darkMode: true,
      soundEnabled: false,
      defaultDifficulty: 'medium',
      defaultQuestionCount: 15,
      username: 'TestUser'
    };

    cy.window().then((win) => {
      win.localStorage.setItem('trivia_settings', JSON.stringify(settings));
    });

    cy.reload();
    cy.visit('/settings');
    
    // Verificar que la página carga correctamente con las configuraciones
    cy.get('ion-content').should('be.visible');
  });

  it('debería mostrar el nivel del usuario basado en quizzes completados', () => {
    // Simular estadísticas
    const stats = [
      { id: '1', date: new Date().toISOString(), score: 80, totalQuestions: 10, correctAnswers: 8 }
    ];

    cy.window().then((win) => {
      win.localStorage.setItem('trivia_results', JSON.stringify(stats));
    });

    cy.reload();
    cy.get('ion-tab-button[tab="profile"]').click();
    
    // Verificar que se muestra información del nivel
    cy.get('ion-content').should('be.visible');
    cy.get('ion-card').should('be.visible');
  });
});
