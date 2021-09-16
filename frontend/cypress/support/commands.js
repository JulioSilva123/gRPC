import '@percy/cypress';
Cypress.Commands.add('hexStringToBuffer', (hexString) => {
  const intArray = parseHexString(hexString)
  const uint32Array = new Uint8Array(intArray)
  return uint32Array.buffer
  function parseHexString (str) {
    var result = []
    while (str.length >= 2) {
      result.push(parseInt(str.substring(0, 2), 16))
      str = str.substring(2, str.length)
    }
    return result
  }
})
// -- This is a parent command --
Cypress.Commands.add('login', (usr, pwd) => {
    cy.visit('/login')
    cy.get('#login_email')
      .clear().type(usr)
    cy.get('#login_password')
      .type(pwd)

    cy.intercept('POST', '/account/login').as('login')
    cy.get('#login_submit').click()
    cy.wait('@login').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('loginStubbed', (usr, pwd) => {
  cy.visit('/login')
  cy.get('#login_email')
    .clear().type(usr)
  cy.get('#login_password')
    .type(pwd)

  cy.intercept('POST', '/account/login', { fixture: 'requests/account/login_200.json' }).as('login')
  cy.get('#login_submit').click()
  cy.wait('@login').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('console', {
  prevSubject: true
}, (subject, method) => {
  // the previous subject is automatically received
  // and the commands arguments are shifted

  // allow us to change the console method used
  method = method || 'log'

  // log the subject to the console
  console[method]('The subject is', subject)

  // whatever we return becomes the new subject
  //
  // we don't want to change the subject so
  // we return whatever was passed in
  return subject
})

Cypress.Commands.add('typeAndReturn', {
  prevSubject: true
}, (subject, text) => {
  cy.get(subject).type(text + '\n', { force: true })
})

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })