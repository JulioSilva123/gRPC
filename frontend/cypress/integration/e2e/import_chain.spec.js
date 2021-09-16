describe('Import Chain', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('import_chain.json').as('testData')
  })
  it('Do login', function() {
    cy.login(this.auth.email, this.auth.password)
  })

  it('Open Modal', function() {
    cy.visit('/certs-keys')
    cy.get('#ObjectsPage_title')
    cy.get('#ObjectsPage_optionsActivator').click()
    cy.get('#ObjectsPage_importChain').click()
    cy.get('#ChainImportModal_chainLabel').type(this.testData.p7bFile)
  })

  it('Import p7b chain', function() {
    cy.fixture(this.testData.p7bFile).then((content) => {
      cy.get('input[type=file]').then(function(el) {
        const file = new File([content], this.testData.p7bFile)
        const list = new DataTransfer()

        list.items.add(file)
        const myFileList = list.files

        el[0].files = myFileList
        el[0].dispatchEvent(new Event('change', { bubbles: true }))
      })
    })
    cy.get('#ChainImportModal_submit').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })

})