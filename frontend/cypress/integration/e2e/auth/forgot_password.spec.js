describe('Forgot password tests', function() {
  beforeEach(() => {
    cy.fixture('act_test2.json').as('existentUser')
    cy.fixture('new_act3.json').as('notExistentUser')
  })
  // EXPECT SUCCESS
  it('Try to reset password', function() {
    cy.visit('/forgot-password')

    cy.get('#ForgotPasswordPage_email').type(this.existentUser.email)
    cy.get('#ForgotPasswordPage_submit').click()
    cy.get('#ForgotPasswordPage_emailSentMessage').should('be.visible')
    cy.percySnapshot('Password reset email sent')
  })
  // EXPECT ERROR
  it('Try to reset password of inexistent account', function() {
    cy.visit('/forgot-password')
    cy.get('#ForgotPasswordPage_email').type(this.notExistentUser.email)
    cy.get('#ForgotPasswordPage_submit').click()
    cy.get('#ForgotPasswordPage_error_card').should('be.visible')
    cy.percySnapshot('account not found error at ForgotPassword')
  })
})