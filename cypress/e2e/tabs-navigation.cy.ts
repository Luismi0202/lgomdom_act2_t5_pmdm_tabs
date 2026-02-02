/**
 * E2E Test: Navegación entre tabs
 * Verifica que la navegación por las 5 tabs funcione correctamente
 */
describe('Navegación por Tabs', () => {
  beforeEach(() => {
    // Interceptar las llamadas a la API para mayor estabilidad
    cy.intercept('GET', '**/api_category.php', { fixture: 'categories.json' }).as('getCategories');
    cy.visit('/');
  });

  it('debería cargar la página de inicio por defecto', () => {
    cy.url().should('include', '/tabs/home');
    cy.get('ion-content').should('be.visible');
  });

  it('debería navegar a la tab de búsqueda', () => {
    cy.get('ion-tab-button[tab="search"]').click();
    cy.url().should('include', '/tabs/search');
    cy.wait('@getCategories');
    cy.get('ion-content').should('be.visible');
  });

  it('debería navegar a la tab de favoritos', () => {
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');
    cy.get('ion-content').should('be.visible');
  });

  it('debería navegar a la tab de estadísticas', () => {
    cy.get('ion-tab-button[tab="stats"]').click();
    cy.url().should('include', '/tabs/stats');
    cy.get('ion-content').should('be.visible');
  });

  it('debería navegar a la tab de perfil', () => {
    cy.get('ion-tab-button[tab="profile"]').click();
    cy.url().should('include', '/tabs/profile');
    cy.get('ion-content').should('be.visible');
  });

  it('debería mostrar el tab activo correctamente', () => {
    // Verificar que el tab home está activo inicialmente
    cy.get('ion-tab-button[tab="home"]').should('have.class', 'tab-selected');

    // Navegar a otro tab y verificar el cambio
    cy.get('ion-tab-button[tab="search"]').click();
    cy.get('ion-tab-button[tab="search"]').should('have.class', 'tab-selected');
    cy.get('ion-tab-button[tab="home"]').should('not.have.class', 'tab-selected');
  });

  it('debería mantener el estado al cambiar entre tabs', () => {
    // Ir a favoritos
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');

    // Volver a home
    cy.get('ion-tab-button[tab="home"]').click();
    cy.url().should('include', '/tabs/home');

    // Volver a favoritos (debería mantener el estado)
    cy.get('ion-tab-button[tab="favorites"]').click();
    cy.url().should('include', '/tabs/favorites');
  });
});
