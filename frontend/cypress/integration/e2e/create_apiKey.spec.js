describe('ApiKey operations', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })
  it('Create Api key', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/account/api-keys')
    cy.get('#ApiKeysPage_no_apikey_button').click()
    cy.get('#ApiKeyModal_tag').type('myApiKey')

    cy.intercept('POST', '/account/api_key').as('createApiKey')
    cy.get('#ApiKeyModal_submit').click()

    cy.get('#ApiKeyModal_close').click()
    cy.get('#AppSnackbar')
  })

  it('Rename Api key', function() {
    cy.get('#ApiKeysTable_myApiKey_detail').click()
    cy.get('#ApiKeyModal_tag').clear().type('myApiKeyUpdated')
    cy.get('#ApiKeyModal_submit').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Token de API atualizado')
  })
  // TODO
  // it('Delete Api key', function() {
  //   // the id is set on code assuming that only one apiKey has this tag
  //   cy.get('#ApiKeysTable_myApiKeyUpdated_delete').click()
  //   cy.get('#ConfirmModal_positive').click()
  //   cy.get('[class=snotifyToast__body]')
  //     .should('contain', 'Chave de API deletada')
  // })
})