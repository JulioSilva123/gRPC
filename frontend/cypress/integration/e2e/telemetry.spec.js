describe('Telemetry', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.login(this.auth.email, this.auth.password)
  })
  it('Visit telemetry page', function() {
    cy.visit('/telemetry')
    cy.get('#TelemetryPage_title')
    cy.percySnapshot('Telemetry before play')
  })
  it('Generate logs and assert', function() {
    cy.get('#Logmon_play')
    const hsmUtilCommand = 'hsmutil -a 127.0.0.1 -p signhash -u master -w 12345678 -k rsa2048 -h sha256 -t 4 -i 10'
    cy.exec(hsmUtilCommand).then((result) => {
      cy.log(result.code)
      cy.log(result.stdout)
      cy.log(result.stderr)
    })
    cy.wait(2000)
    cy.percySnapshot('Telemetry after play')
  })
})