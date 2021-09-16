describe('Import Cert', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('import_cert.json').as('testData')
  })
  it('Do login', function() {
    cy.login(this.auth.email, this.auth.password)
  })

  // PEM FILE
  it('Open Modal', function() {
    cy.visit('/certs-keys')
    cy.get('#ObjectsPage_title')
    cy.get('#ObjectsPage_optionsActivator').click()
    cy.get('#ObjectsPage_importCert').click()
    cy.get('#CertImportModal_certLabel').type(this.testData.pemFile)
  })

  it('Import PEM cert', function() {
    cy.fixture(this.testData.pemFile).then((content) => {
      cy.get('input[type=file]').then(function(el) {
        const file = new File([content], this.testData.pemFile)
        const list = new DataTransfer()

        list.items.add(file)
        const myFileList = list.files

        el[0].files = myFileList
        el[0].dispatchEvent(new Event('change', { bubbles: true }))
      })
    })
    cy.get('#CertImportModal_submit').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })

  // BIN FILE
  it('Open Modal again', function() {
    cy.visit('/certs-keys')
    cy.get('#ObjectsPage_title')
    cy.get('#ObjectsPage_optionsActivator').click()
    cy.get('#ObjectsPage_importCert').click()
    cy.get('#CertImportModal_certLabel').type(this.testData.binFile)
  })
  it('Import BIN cert', function() {
    cy.fixture(this.testData.binFile, 'hex').then((content) => {
    
      cy.hexStringToBuffer(content).then((buffer) => {

        cy.get('input[type=file]').then(function(el) {
          const file = new File([buffer], this.testData.binFile)
          const list = new DataTransfer()

          list.items.add(file)
          const myFileList = list.files

          el[0].files = myFileList
          el[0].dispatchEvent(new Event('change', { bubbles: true }))
        })
      })
    })
    cy.get('#CertImportModal_submit').click()

    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })
})