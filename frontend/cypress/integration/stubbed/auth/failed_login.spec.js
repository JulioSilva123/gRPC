describe('Failed attempts to login', function() {
  beforeEach(() => {
    cy.fixture('new_act2.json').as('newUser')
    cy.intercept('GET', '/api/data/keytype', { fixture: 'requests/api/keytype.json' })
  })
  it('Do signup', function() {
    cy.intercept('POST', '/account/sign_up', { fixture: 'requests/account/sign_up_200.json' })
    cy.visit('/join')
    cy.get('#signup_username').type(this.newUser.name)
    cy.get('#signup_email').type(this.newUser.email)
    cy.get('#signup_cpfcnpj').type(this.newUser.cnpj)
    cy.get('#signup_company').type(this.newUser.company)
    cy.get('#signup_phone').type(this.newUser.phone)
    cy.get('#signup_password').type(this.newUser.password)
    cy.get('#signup_submit').click()
    cy.get('#EmailSentPage_title')
  })

  it('Try to login', function() {
    cy.intercept('POST', '/account/login', { statusCode: 403, fixture: 'requests/account/login_notActive.json' })
    cy.visit('/login')
    cy.get('#login_email').type(this.newUser.email)
    cy.get('#login_password').type(this.newUser.password)
    cy.get('#login_submit').click()
    cy.get('#login_error_card').should('contain', 'Email precisa ser verificado')
    cy.percySnapshot('account not activated error at login')
  })
})
