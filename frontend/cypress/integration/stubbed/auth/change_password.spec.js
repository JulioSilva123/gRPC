describe('Change password test', function() {
  beforeEach(() => {
    cy.fixture('act_test2.json').as('auth')
    cy.intercept('GET', '/api/data/keytype', { fixture: 'requests/api/keytype.json' })
    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.intercept('GET', '/hsm', { fixture: 'requests/hsm/get_hsm.json' })
  })

  it('Do login', function() {
    cy.visit('/login')
    cy.loginStubbed(this.auth.email, this.auth.password)
  })

  it('change password', function() {
    cy.intercept('POST', '/account/login', { fixture: 'requests/account/login_200.json' })
    cy.intercept('POST', '/account/change_password', { fixture: 'requests/account/change_password.json' })

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