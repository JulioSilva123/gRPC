describe('Svault tests', function() {
  beforeEach(() => {
    cy.fixture('act_test.json').as('auth')
    cy.fixture('svault.json').as('testData')
  })
  it('Do login', function() {
    cy.visit('/login')
    cy.login(this.auth.email, this.auth.password)
  })
  it('Go to vaults page', function() {
    cy.get('#DashboardPage_title')
    cy.visit('/vault')
  })

  // go to vault page then services page to hire LGPD offer
  it('Contract LPGD service', function() {
    cy.get('#VaultPage_noServiceBtn').click()
    cy.get('#ServiceDetailPage_toggle_hired_btn').click()
    cy.get('#ServiceDetailPage_toggle_hired_confirm').click()
    cy.get('[class=snotifyToast__body]')
      .should('contain', 'Serviço contratado')
  })

  // go back and iterate over vault array
  it('Create vaults from testData', function() {
    cy.visit('/vault')
    this.testData.vaults.forEach((engine, index) => {
      // ASSUMING NO VAULT IS LISTED BEFORE THE FIRST
      if (index === 0) {
        cy.get('#VaultPage_noDataBtn').click()
      } else cy.get('#VaultPage_add_vault').click()

      // Set tag
      cy.get('#CreateVaultModal_tag').type(engine.tag)

      // Click submit
      cy.get('#CreateVaultModal_submit').click()
      cy.get(`#VaultDataTable_${engine.tag}_tokenize`)
    })
  })

  // Iterate over engine array
  it('Create engines from testData', function() {
    cy.get(`#VaultDataTable_${this.testData.encode[0].vault}_tokenize`).click()
    cy.get('#VaultPage_go_to_engine').click()
    this.testData.engines.forEach((engine, index) => {
      let engineFormatOptionTitle
      switch (engine.format) {
        case 'CPF':
          engineFormatOptionTitle = 'CPF'
          break;
        case 'CNPJ':
          engineFormatOptionTitle = 'CNPJ'
          break;
        case 'PAN':
          engineFormatOptionTitle = 'Cartão de crédito'
          break;
        case 'IEL':
          engineFormatOptionTitle = 'Título de eleitor'
          break;
        case 'NUM':
          engineFormatOptionTitle = 'Livre numérico'
          break;
        case 'ALPHA':
          engineFormatOptionTitle = 'Livre alfanumérico'
          break;
        default:
          break;
      }

      if (index === 0) {
        cy.get('#EnginePage_noDataBtn').click()
      } else cy.get('#EnginePage_add_engine').click()

      // Set tag
      cy.get('#CreateEngineModal_tag').type(engine.tag)

      // Set format
      cy.get('[data-cy=CreateEngineModal_condensedOption_select]').parent().click()
      cy.get(".v-menu__content").contains(engineFormatOptionTitle).click()

      //Set storage
      const engineStorageOption = engine.storage === 'cloud' ? 'storage_internal' : 'storage_external'
      cy.get(`#${engineStorageOption}`).click()

      // Click submit
      cy.get('#CreateEngineModal_submit').click()

      cy.get('[class=snotifyToast__body]')
        .should('contain', 'Sucesso')
    })
  })

  // encode (Cloud and Download) & decode (Only Cloud)
  it('Encode then decode', function() {
    cy.visit('/vault')
    this.testData.encode.forEach((encode) => {
      // #ENCODE
      cy.get(`#VaultDataTable_${encode.vault}_tokenize`).click()

      // STEP - PARAM SELECTION
      // Set engine
      cy.get('[data-cy=ParamSelectionStep_engine_selection]').parent().click()
      cy.get(".v-menu__content").contains(encode.engine).click()

      cy.get('#ParamSelectionStep_submit').click()

      // STEP - INPUT SECRET
      cy.get('#SecretEntryStep_secret').type(encode.secret)
      cy.get('#TokenParamStep_submit').click()

      cy.get('[class=snotifyToast__body]')
        .should('contain', 'Sucesso')
      
      // STEP - TOKEN OUTPUT
      cy.wait(1000)
      cy.get('#TokenBlobOutputStep_token')
        .invoke('val')
        .then(token => {
          cy.log(token)
          cy.get('#TokenBlobOutputStep_token').trigger('keydown', { keyCode: 27 })
          
          // #DECODE
          // Open vault
          cy.get(`#VaultDataTable_${encode.vault}_detail`).click()
          cy.get(`#TokenDataTable_${token}_retrieve`).click()

          // STEP - MASK INPUT
          cy.get('#DecodeTokenModal_mask').type(encode.mask)
          cy.get('#DecodeTokenModal_submit').click()
          cy.get('[class=snotifyToast__body]')
            .should('contain', 'Sucesso')

          // STEP - DECODED SECRET
          cy.wait(1000)
          cy.get('#DecodeTokenModal_decodeSecret')
            .invoke('val')
            .then(secret => {
              cy.wrap(secret).should('eq', encode.decoded)
              cy.get('#DecodeTokenModal_decodeSecret').trigger('keydown', { keyCode: 27 })
              cy.get('#TokenPage_back_btn').click()
            })
        })
    })
  })
})