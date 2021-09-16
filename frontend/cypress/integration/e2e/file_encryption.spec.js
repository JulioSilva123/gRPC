describe('File encryption', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('file_encryption.json').as('testData')
  })
  it('Do login', function() {
    cy.login(this.auth.email, this.auth.password)
  })
  it('Visit File encryption page', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/file-encryption')
    cy.get('#FileEncryptionPage_title')
  })
  it('DO ENCRYPTION WITH PWD', function() {
    cy.fixture(this.testData.oringinalFile).then((content) => {
      cy.get('input[type=file]').then(function(el) {
        const file = new File([content], this.testData.oringinalFile)
        const list = new DataTransfer()

        list.items.add(file)
        const myFileList = list.files

        el[0].files = myFileList
        el[0].dispatchEvent(new Event('change', { bubbles: true }))
      })
    })
    cy.get('[data-cy=FileEncryptionPage_secret_select]').parent().click()
    cy.get(".v-menu__content").contains('Informar sua própria senha').click()
    cy.get('#FileEncryptionPage_password').clear().type(this.testData.pwd)
    cy.get('#FileEncryptionPage_encrypt').click()
    
    // Check if the pwd text field has been reseted, witch means the encryption
    // was complete
    cy.get('#FileEncryptionPage_password').should('have.value', '')
  })

  it('DO WRONG DECRYPTION WITH PWD', function() {
    cy.fixture(this.testData.encryptedFile, 'hex').then((content) => {
      cy.hexStringToBuffer(content).then((buffer) => {
        cy.get('input[type=file]').then(function(el) {
          const file = new File([buffer], this.testData.encryptedFile)
          const list = new DataTransfer()

          list.items.add(file)
          const myFileList = list.files

          el[0].files = myFileList
          el[0].dispatchEvent(new Event('change', { bubbles: true }))
        })
      })
    })
    const wrongPwd = `${this.testData.pwd}9`
    cy.get('#FileEncryptionPage_password').clear().type(wrongPwd)
    cy.get('#FileEncryptionPage_decrypt').click()
    
    cy.get('[class=snotifyToast__body]').should('contain', 'Erro de criptografia, arquivo corrompido ou senha incorreta')
  })

  it('DO DECRYPTION WITH PWD', function() {
    cy.fixture(this.testData.encryptedFile, 'hex').then((content) => {
      cy.hexStringToBuffer(content).then((buffer) => {
        cy.get('input[type=file]').then(function(el) {
          const file = new File([buffer], this.testData.encryptedFile)
          const list = new DataTransfer()

          list.items.add(file)
          const myFileList = list.files

          el[0].files = myFileList
          el[0].dispatchEvent(new Event('change', { bubbles: true }))
        })
      })
    })
    cy.get('[data-cy=FileEncryptionPage_secret_select]').parent().click()
    cy.get(".v-menu__content").contains('Informar sua própria senha').click()
    cy.get('#FileEncryptionPage_password').clear().type(this.testData.pwd)
    cy.get('#FileEncryptionPage_decrypt').click()
    
    // Check if the pwd text field has been reseted, witch means the encryption
    // was complete
    cy.get('#FileEncryptionPage_password').should('have.value', '')
  })

  it('Create secret', function() {
    cy.get('#FileEncryptionPage_add_secret').click()
    cy.get('#NewSecretModal_tag').type('my_secret')
    cy.get('#NewSecretModal_submit').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Sucesso')
  })

  it('DO ENCRYPTION WITH SECRET', function() {
    cy.fixture(this.testData.oringinalFile).then((content) => {
      cy.get('input[type=file]').then(function(el) {
        const file = new File([content], 'file_encryption.txt')
        const list = new DataTransfer()

        list.items.add(file)
        const myFileList = list.files

        el[0].files = myFileList
        el[0].dispatchEvent(new Event('change', { bubbles: true }))
      })
    })
    cy.get('[data-cy=FileEncryptionPage_secret_select]').parent().click()
    cy.get(".v-menu__content").contains('my_secret').click()
    cy.get('#FileEncryptionPage_encrypt').click()
    
    // test if the file exists
    cy.readFile('cypress/downloads/file_encryption.txt.dlp').should('exist')
  })

  it('DO DECRYPTION WITH SECRET', function() {
    cy.readFile('cypress/downloads/file_encryption.txt.dlp', 'hex').then((content) => {
      console.log(content)
      cy.get('input[type=file]').then(function(el) {
        const file = new File([content], 'file_encryption.txt.dlp')
        const list = new DataTransfer()

        list.items.add(file)
        const myFileList = list.files

        el[0].files = myFileList
        el[0].dispatchEvent(new Event('change', { bubbles: true }))
      })
    })
    cy.get('[data-cy=FileEncryptionPage_secret_select]').parent().click()
    cy.get(".v-menu__content").contains('my_secret').click()
    cy.get('#FileEncryptionPage_decrypt').click()

    // test if the file exists
    cy.readFile('cypress/downloads/file_encryption.txt').should('exist')
  })
})