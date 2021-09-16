describe('Key operations', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('requests/api/key.json').as('keysResp')

    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.intercept('GET', '/api/certificate', { fixture: 'requests/api/certificate.json' })
    cy.intercept('GET', '/api/key/*', { fixture: 'requests/api/get_key.json' })
    cy.intercept('GET', '/api/key', { fixture: 'requests/api/key.json' })
    cy.intercept('GET', '/api/data/keytype', { fixture: 'requests/api/keytype.json' })
    cy.intercept('GET', '/hsm', { fixture: 'requests/hsm/get_hsm.json' })
    cy.intercept('GET', '/offer', { fixture: 'requests/offer/offer.json' })
    cy.intercept('GET', '/api/data/occurrencetype', { fixture: 'requests/api/occurrencetype.json' })
    cy.intercept('GET', '/contract/type/*', { fixture: 'requests/contract/type.json' })
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.loginStubbed(this.auth.email, this.auth.password)
  })
  it('Go to keys tab', function() {
    cy.visit('/certs-keys')
    cy.get('#tab_keys').click()
  })
  it('Rename Key', function() {
    cy.intercept('PUT', '/api/key', {message:"Key updated successfully!!!","id":"1Ig4iOCuFcMLujhE"})
    cy.get(`#${this.keysResp[0].id}_optionsActivator`).click()
    cy.get(`#${this.keysResp[0].id}_info`).click()

    //type new tag and update
    cy.get('#CreateKeyModal_tag').clear().type(`${this.keysResp[0].label}Updated`)
    cy.get('#CreateKeyModal_submit').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
  it('Delete Key', function() {
    cy.intercept('DELETE', '/api/key', {message:"Key deleted successfully!!!"})
    cy.get(`#${this.keysResp[0].id}_optionsActivator`).click()
    cy.get(`#${this.keysResp[0].id}_delete`).click()
    cy.get('#ConfirmModal_confirmId').clear().type(`${this.keysResp[0].id}`)
    cy.get('#ConfirmModal_positive').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
})