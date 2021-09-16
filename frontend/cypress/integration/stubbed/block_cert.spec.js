describe('Block existing certificate', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('requests/api/certificate.json').as('certsResp')
    cy.fixture('requests/hsm/get_hsm.json').as('hsmResp')

    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.intercept('GET', '/api/certificate', { fixture: 'requests/api/certificate.json' })
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
  it('Go to cert-keys page', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/certs-keys')
  })
  // Assuming the existence of this cert id (with tag labCertW)
  it("Block cert on hsm_lan", function() {
    cy.intercept('POST', `/certificate/${this.certsResp[0]}/block/${this.hsmResp[0].id}`, { fixture: 'requests/api/post_certificateBlock.json' })
    cy.get(`#${this.certsResp[0].id}_optionsActivator`).click()
    cy.get(`#${this.certsResp[0].id}_block`).click()
    
    cy.get(`#CertBlockInHsmModal_${this.hsmResp[0].id}`).check({force: true})
    cy.get('#CertBlockInHsmModal_apply').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
  it("Unblock cert on hsm_lan", function() {
    cy.intercept('DELETE', `/certificate/${this.certsResp[0]}/unblock/${this.hsmResp[0].id}`, { fixture: 'requests/api/delete_certificate_unblock.json' })
    cy.get(`#${this.certsResp[0].id}_optionsActivator`).click()
    cy.get(`#${this.certsResp[0].id}_block`).click()
    
    cy.get(`#CertBlockInHsmModal_${this.hsmResp[0].id}`).check({force: true})
    cy.get('#CertBlockInHsmModal_apply').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
})