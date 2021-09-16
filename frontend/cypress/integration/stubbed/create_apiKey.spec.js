describe('ApiKey operations', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.intercept('GET', '/hsm', { fixture: 'requests/hsm/get_hsm.json' })
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.loginStubbed(this.auth.email, this.auth.password)
  })
  it('Create Api key', function() {
    cy.intercept('GET', '/account/api_key', { fixture: 'requests/account/get_api_key/none.json' })
    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.get('#DashboardPage_title')
    cy.visit('/account/api-keys')
    cy.get('#ApiKeysPage_no_apikey_button').click()
    cy.get('#ApiKeyModal_tag').type('one')

    cy.intercept('POST', '/account/api_key', { fixture: 'requests/account/post_api_key.json' })
    cy.get('#ApiKeyModal_submit').click()


    cy.get('#ApiKeyModal_close').click()
    cy.get('#AppSnackbar')
  })

  it('Rename Api key', function() {
    cy.intercept('GET', '/hsm', { fixture: 'requests/hsm/get_hsm.json' })
    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.intercept('PUT', '/account/api_key/*', { fixture: 'requests/account/post_api_key.json' })
    cy.intercept('GET', '/account/api_key', { fixture: 'requests/account/get_api_key/one.json' })
    cy.reload()
    cy.get('#ApiKeysTable_myApiKey_detail').click()

    cy.intercept('GET', '/account/api_key', { fixture: 'requests/account/get_api_key/one.json' })
    cy.get('#ApiKeyModal_tag').clear().type('myApiKeyUpdated')
    cy.get('#ApiKeyModal_submit').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Token de API atualizado')
  })
  // it('Delete Api key', function() {
  //   // the id is set on code assuming that only one apiKey has this tag
  //   cy.get('#ApiKeysTable_myApiKeyUpdated_delete').click()
  //   cy.get('#ConfirmModal_positive').click()
  //   cy.get('[class=snotifyToast__body]')
  //     .should('contain', 'Chave de API deletada')
  // })
})