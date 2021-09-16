describe('Snapshot all menu pages', function() {
  before(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })

  it('Visit Dashboard', function() {
    cy.get('#DashboardPage_title')
    cy.wait(1000)
    cy.percySnapshot('Dashboard')
  })

  it('Visit Services', function() {
    cy.visit('/services')
    cy.get('#ServicesPage_title')
    cy.percySnapshot('Services')
  })

  it('Visit Objects', function() {
    cy.visit('/certs-keys')
    cy.get('#ObjectsPage_title')
    cy.percySnapshot('Objects')
  })

  it('Visit Telemetry', function() {
    cy.visit('/telemetry')
    cy.get('#TelemetryPage_title')
    cy.percySnapshot('Telemetry')
  })

  it('Visit Settings', function() {
    cy.visit('/account/settings')
    cy.get('#SettingsPage_title')
    cy.percySnapshot('Settings')
  })

  it('Visit API Keys', function() {
    cy.visit('/account/api-keys')
    cy.get('#ApiKeysPage_title')
    cy.percySnapshot('API Keys')
  })

  it('Visit HSM LAN', function() {
    cy.visit('/account/hsm-lan')
    cy.get('#HsmPage_title')
    cy.percySnapshot('HSM LAN')
  })
})
