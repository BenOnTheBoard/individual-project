describe('individual-project', () => {
  let consoleErrors = [];

  beforeEach(() => {
    consoleErrors = [];
    cy.on('window:before:load', (win) => {
      cy.stub(win.console, 'error').callsFake((msg) => {
        consoleErrors.push(msg);
      });
    });
  });

  // ------------ Home Page ------------

  it('navbar links should appear', () => {
    cy.visit('/');
    cy.get('#homeLink').should('exist');
    cy.get('#aboutLink').should('exist');
    cy.get('#algorithmsLink').should('exist');
    cy.get('#feedbackLink').should('exist');
  });

  it('social media icons should appear', () => {
    cy.visit('/');
    cy.get('#github-icon').should('exist');
    cy.get('#linkedin-icon').should('exist');
  });

  it('about link works', () => {
    cy.visit('/');
    cy.get('#aboutLink').click();
    cy.contains('h1', 'About');
  });

  it('algorithms link works', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.contains('h1', 'Algorithm');
  });

  it('feedback link works', () => {
    cy.visit('/');
    cy.get('#feedbackLink').click();
    cy.contains('h1', 'Feedback');
  });

  // ------------ Algorithms ------------

  function buttonTests(): void {
    cy.get('#forwardButton').click();
    cy.get('#backButton').click();
    cy.get('#endButton').click();
    cy.get('#restartButton').click();
    cy.get('#playButton').click();
    cy.wait(1000);
    cy.get('#playButton').click();
  }

  it('smp-man-gs', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#smp-man-gs').type('5', { force: true });
    cy.get('#smp-man-gs').type('{enter}', { force: true });
    buttonTests();
  });

  it('smp-man-egs', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#smp-man-egs').type('5', { force: true });
    cy.get('#smp-man-egs').type('{enter}', { force: true });
    buttonTests();
  });

  it('hr-resident-egs', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#hr-resident-egs1').type('5', { force: true });
    cy.get('#hr-resident-egs2').type('5', { force: true });
    cy.get('#hr-resident-egs2').type('{enter}', { force: true });
    buttonTests();
  });

  it('hr-hospital-egs', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#hr-hospital-egs1').type('5', { force: true });
    cy.get('#hr-hospital-egs2').type('5', { force: true });
    cy.get('#hr-hospital-egs2').type('{enter}', { force: true });
    buttonTests();
  });

  it('smp-room-irv', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#smp-room-irv').type('6', { force: true });
    cy.get('#smp-room-irv').type('{enter}', { force: true });
    buttonTests();
  });

  it('spa-stu-egs', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#spa-stu-egs1').type('5', { force: true });
    cy.get('#spa-stu-egs2').type('5', { force: true });
    cy.get('#spa-stu-egs2').type('{enter}', { force: true });
    buttonTests();
  });

  it('smt-super-man', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#smt-super-man').type('5', { force: true });
    cy.get('#smt-super-man').type('{enter}', { force: true });
    buttonTests();
  });

  it('hrt-super-res', () => {
    cy.visit('/');
    cy.get('#algorithmsLink').click();
    cy.get('#hrt-super-res1').type('5', { force: true });
    cy.get('#hrt-super-res2').type('5', { force: true });
    cy.get('#hrt-super-res2').type('{enter}', { force: true });
    buttonTests();
  });

  afterEach(() => {
    cy.wrap(consoleErrors, { log: false }).should('have.length', 0);
  });
});
