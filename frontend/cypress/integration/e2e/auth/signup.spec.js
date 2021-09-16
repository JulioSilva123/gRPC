describe('Sign up test', function() {
  beforeEach(() => {
    cy.fixture('new_act.json').as('newUser')
  })
  it('Succesfull sign up at welcome', function() {
      // Timeout for the page finish loading
    cy.visit('/join', { timeout: 60000 })
    cy.get('#signup_username').type(this.newUser.name)
    cy.get('#signup_email').type(this.newUser.email)
    cy.get('#signup_cpfcnpj').type(this.newUser.cnpj)
    cy.get('#signup_company').type(this.newUser.company)
    cy.get('#signup_phone').type(this.newUser.phone)
    cy.get('#signup_password').type(this.newUser.password)
    cy.get('#signup_submit').click()
    cy.get('#EmailSentPage_title')
    cy.percySnapshot('signup finished')
  })

  it('with taken email, at SignUpPage', function() {
    cy.fixture('act_test.json').then(existentUser => {
      cy.visit('/join')
      cy.get('#signup_username').type(existentUser.name)
      cy.get('#signup_email').type(existentUser.email)
      cy.get('#signup_cpfcnpj').type(this.newUser.cnpj)
      cy.get('#signup_company').type(this.newUser.company)
      cy.get('#signup_phone').type(this.newUser.phone)
      cy.get('#signup_password').type(existentUser.password)
      cy.get('#signup_submit').click()
      cy.get('#signup_error_card').should('contain', 'Email em uso')
      cy.percySnapshot()
    })
  })
})