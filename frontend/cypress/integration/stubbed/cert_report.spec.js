describe('Certificate report', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('cert_report.json').as('testData')

    cy.intercept('GET', '/account/get_user_info', { fixture: 'requests/account/get_user_info/200.json' })
    cy.intercept('GET', '/api/certificate', { fixture: 'requests/api/certificate.json' })
    cy.intercept('GET', '/api/key', { fixture: 'requests/api/key.json' })
    cy.intercept('GET', '/api/data/keytype', { fixture: 'requests/api/keytype.json' })
    cy.intercept('GET', '/hsm', { fixture: 'requests/hsm/get_hsm.json' })
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.loginStubbed(this.auth.email, this.auth.password)
  })
  it('Snapshot empty occurrence list', function() {
    cy.intercept('GET', '/billing/ocurrencebycertificate**', {
      statusCode: 200,
      body: []
    })
    cy.visit('/certs-report')
    cy.get('#CertReportPage_title')
    cy.percySnapshot('Report without occurrences')
  })
  it('Snapshot occurrence list', function() {
    cy.intercept('GET', '/billing/ocurrencebycertificate**', { fixture: 'requests/billing/PK_TOUCH_HSM_LAN/ocurrencebycertificate.json' })
    cy.get('#CertReportPage_reload').click()
    for (let data of this.testData) {
      //Id must not contain ':' nor \s
      cy.get(`#CertReportList_panel_container_${data.md}`)
        .children().first()
        .children().first()
        .children().eq(3).within(() => {
          cy.get('p').should('contain', data.iterations)
        })
      
      cy.intercept('GET', '/billing/logdetails**', { fixture: 'requests/billing/PK_TOUCH_HSM_LAN/logdetail.json' })
      cy.get(`#CertReportList_panel_container_${data.md}`).click()
    }
    cy.percySnapshot('Report with occurrences')
  })
})