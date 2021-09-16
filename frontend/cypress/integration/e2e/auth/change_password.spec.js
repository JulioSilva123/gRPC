describe('Change password test', function() {
  beforeEach(() => {
    cy.fixture('act_test2.json').as('auth')
  })

  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })

  it('change password', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/change-password')
    cy.get('#PasswordCheckCard_password').type(this.auth.password)
    cy.get('#PasswordCheckCard_submit').click()
    cy.get('#ChangePassword_newPassword').type('qwertyui')
    cy.get('#ChangePassword_repeatPassword').type('qwertyui')
    cy.percySnapshot('before password change')
    cy.get('#ChangePassword_submit').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
})