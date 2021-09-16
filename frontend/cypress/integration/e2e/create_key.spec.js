describe('Create Key', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })
  it('Create key', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/certs-keys')
    cy.get('#ObjectsPage_optionsActivator').click()
    cy.get('#ObjectsPage_createKey').click()
    cy.get('#CreateKeyModal_tag').type('myKey')
    cy.get('#CreateKeyModal_keyType').typeAndReturn('rsa 2048')
    cy.get('#CreateKeyModal_submit').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
})