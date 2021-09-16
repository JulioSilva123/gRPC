describe('Certificate report', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('cert_report.json').as('testData')
  })
  it('Do login', function() {
    cy.login(this.auth.email, this.auth.password)
  })
  it('Snapshot empty occurrence list', function() {
    cy.visit('/certs-report')
    cy.get('#CertReportPage_title')
    cy.percySnapshot('Report without occurrences')
  })
  it('Snapshot occurrence list', function() {
    for (let data of this.testData) {
      for (let i = 0; i < data.iterations; i++) {
        // hsmFQN must match name used during 'Import pfx on hsm_lan' step on ci workflow
        const hsmUtilCommand = `hsmutil -a 127.0.0.1 -u master -w 12345678 -j signhash -kn ${data.hsmFQN} -filein cypress/fixtures/testFiles/alice.pfx -hash sha256`
        cy.exec(hsmUtilCommand).then((result) => {
          cy.log(result.code)
          cy.log(result.stdout)
          cy.log(result.stderr)
        })
      }
    }
    // Wait for the occurence to be insert in the db
    cy.wait(8000)
    cy.get('#CertReportPage_reload').click()
    
    for (let data of this.testData) {
      //Id must not contain ':' nor \s
      cy.get(`#CertReportList_panel_container_${data.md}`)
        .children().first()
        .children().first()
        .children().eq(3).within(() => {
          cy.get('p').should('contain', data.iterations)
        })
      cy.get(`#CertReportList_panel_container_${data.md}`).click()
    }
    cy.percySnapshot('Report with occurrences')
  })
})