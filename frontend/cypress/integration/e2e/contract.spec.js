describe('Subscribe to all public services', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })
  it('Go to services page', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/services')
  })
  it('subscribe to all services', function() {
    cy.get('.box_servico').its('length').then((len) => {

      // subscribe
      const toogleSubscription = (notificationMsg, offerId) => {
        cy.visit(`service/${offerId}`)
        
        // Offers that don't require subscribing need to be included in the array
        const freeOfferIds = [5]
        const isFreeOffer = freeOfferIds.includes(offerId)
        // Assumming the offers's id as in core/compose/sqls/ds_4-offers.sql
        if (!isFreeOffer) {
          cy.get('#ServiceDetailPage_title')
          cy.get('#ServiceDetailPage_toggle_hired_btn').click({ force: true })
          cy.get('#ServiceDetailPage_toggle_hired_confirm').click()
          cy.get('[class=snotifyToast__body]').should('contain', notificationMsg)
        }
      
        cy.visit('/services')
        cy.get('#ServicesPage_title')
      }      
      // subscribe
      for (let i = 1; i <= len; i++) {
        toogleSubscription('Serviço contratado', i)
      }
      cy.percySnapshot('All services subscribed')

      // unsubscribe
      for (let i = 1; i <= len; i++) {
        toogleSubscription('Serviço cancelado', i)
      }
    })
  })
})