import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;
  let consoleErrors = [];

  beforeEach(() => {
    page = new AppPage();

    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((msg) => {
        consoleErrors.push(msg);
      });
    });
  });

  // ------------ Home Page ------------

  it('navbar links should appear', () => {
    page.navigateTo();
    cy.get('#homeLink').should('exist');
    cy.get('#aboutLink').should('exist');
    cy.get('#algorithmsLink').should('exist');
    cy.get('#feedbackLink').should('exist');
  });

  it('social media icons should appear', () => {
    page.navigateTo();
    cy.get('#github-icon').should('exist');
    cy.get('#linkedin-icon').should('exist');
  });

  it('about link works', () => {
    page.navigateTo();
    cy.get('#aboutLink').click();
    cy.contains('h1', 'Welcome').click();
  });

  it('algorithms link works', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.contains('h1', 'Learn').click();
  });

  it('feedback link works', () => {
    page.navigateTo();
    cy.get('#feedbackLink').click();
    cy.contains('h1', 'feedback').click();
  });

  // ------------ Algorithms ------------

  it('smp-man-gs', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.get('#smp-man-gs').click();
    cy.get('#smp-man-gs').type('5');
    cy.get('#smp-man-gs').type('{enter}');
    cy.get('#forwardButton').click();
  });

  it('smp-man-egs', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.get('#smp-man-egs').click();
    cy.get('#smp-man-egs').type('5');
    cy.get('#smp-man-egs').type('{enter}');
    cy.get('#forwardButton').click();
  });

  it('hr-resident-egs', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.get('#hr1').click();
    cy.get('#hr1').type('5');
    cy.get('#hr2').click();
    cy.get('#hr2').type('5');
    cy.get('#hr2').type('{enter}');
    cy.get('#forwardButton').click();
  });

  it('hr-hospital-egs', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.get('#hr1').click();
    cy.get('#hr1').type('5');
    cy.get('#hr2').click();
    cy.get('#hr2').type('5');
    cy.get('#hr2').type('{enter}');
    cy.get('#forwardButton').click();
  });

  it('smp-room-irv', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.get('#smp-room-irv').click();
    cy.get('#smp-room-irv').type('6');
    cy.get('#smp-room-irv').type('{enter}');
    cy.get('#forwardButton').click();
  });

  it('spa-stu-egs', () => {
    page.navigateTo();
    cy.get('#algorithmsLink').click();
    cy.get('#spa1').click();
    cy.get('#spa1').type('5');
    cy.get('#spa2').click();
    cy.get('#spa2').type('5');
    cy.get('#spa2').type('{enter}');
    cy.get('#forwardButton').click();
  });

  afterEach(() => {
    cy.wrap(consoleErrors, { log: false }).should('have.length', 0);
  });
});
