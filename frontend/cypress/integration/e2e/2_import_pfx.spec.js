describe('Import PFX', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('import_pfx.json').as('testData')
  })
  it('Do login', function() {
    cy.login(this.auth.email, this.auth.password)
  })
  it('Import PFX', function() {
    cy.visit('/certs-keys')
    cy.get('#ObjectsPage_title')

    for (let data of this.testData) {
      cy.get('#ObjectsPage_optionsActivator').click()
      cy.get('#ObjectsPage_importKey').click()
      cy.get('#P12ImportModal_certLabel').type(`${data.file}_cert`)
      cy.get('#P12ImportModal_keyLabel').type(`${data.file}_key`)
      cy.get('#P12ImportModal_password').type(data.password)
    
      cy.fixture(data.file, 'hex').then((content) => {
      
        cy.hexStringToBuffer(content).then((buffer) => {
          cy.get('input[type=file]').then(function(el) {

            const file = new File([buffer], data.file)
            const list = new DataTransfer()

            list.items.add(file)
            const myFileList = list.files

            el[0].files = myFileList
            el[0].dispatchEvent(new Event('change', { bubbles: true }))
          })
        })
      })
      cy.get('#P12ImportModal_submit').click()

      cy.get('[class=snotifyToast__body]')
        .should('contain', 'Sucesso')
    }
  })
})