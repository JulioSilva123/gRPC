describe('HSM operations', function() {
  let hsmId
  let hsmTag = 'myHSM'
  let hsmNewTag = 'myHSMUpdated'
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })
  it('Create hsm', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/account/hsm-lan')
    cy.get('#HsmPage_add').click()
    cy.get('#AddHsmModal_tag').type(hsmTag)
    
    cy.intercept('POST', '/hsm').as('hsm')

    cy.get('#AddHsmModal_submit').click()

    cy.wait('@hsm').its('response').then((res) => {
      hsmId = res.body.id
    })

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })

  it('Close AddHsmModal', function() {
    cy.get('body').trigger('keydown', { keyCode: 27 })
  })

  it('Rename hsm', function() {
    // Waiting for HID on request payload
    // cy.get(`#HsmDataTable_${hsmId}_info`).click()
    //
    cy.get(`#HsmDataTable_${hsmTag}_info`).click()
    cy.get('#HsmDetailModal_tag').clear().type('myHSMUpdated')
    cy.get('#HsmDetailModal_submit').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso').then(() => {
        hsmTag = hsmNewTag
      })
  })
  it('Delete hsm', function() {
    // Waiting for HID on request payload
    // cy.get(`#HsmDataTable_${hsmId}_delete`).click()
    cy.get(`#HsmDataTable_${hsmTag}_delete`).click()
    cy.get('#ConfirmModal_positive').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
})