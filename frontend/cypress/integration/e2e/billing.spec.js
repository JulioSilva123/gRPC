describe('Billing tests', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })
  it('Set occurrences to last month', function () {
    cy.exec(`./cypress/scripts/billing.sh`)
  })
  it('Go to billing page', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/account/billing')
    cy.percySnapshot('Billing with 6 pk touches')
  })
})