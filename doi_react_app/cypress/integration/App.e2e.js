describe('App E2E', () => {
   beforeEach(() => {
     cy.visit('http://localhost:3000');
   })

    it('should have a tab Wallets', () => {
        cy.contains('Wallets').click();
        cy.get('h1')
          .should('have.text', 'DoiCoin Wallets');
      });

      it('should have a tab Contacts', () => {  
        cy.contains('Contacts').click();
        cy.get('h1')
          .should('have.text', 'Doi Contacts');
      });

      it('try to create a contact and fail', () => {  
        cy.contains('Contacts').click();
        cy.get('#addButton').click()
      });

      it('create a wallet', () => {  
        cy.contains('Wallets').click();
        cy.get('#add').click()
        cy.get('#senderEmail').type('gouabyk14@yahoo.fr')
        cy.get('#addWallet').click()
        cy.contains('Wallets').click();
        cy.contains('Contacts').click();
        cy.get('#addButton').click()    
      });  

      it('test the receive button and fail', () => {  
        cy.contains('Wallets').click();
        cy.get('#add').click()
        cy.get('#senderEmail').type('gouabyk14@yahoo.fr')
        cy.get('#addWallet').click()
        cy.get('#receive').click()
      });

      it('test the send button and fail', () => {  
        cy.contains('Wallets').click();
        cy.get('#add').click()
        cy.get('#senderEmail').type('gouabyk14@yahoo.fr')
        cy.get('#addWallet').click()
        cy.get('#send').click()
      });

      it('test the cancel button', () => {  
        cy.contains('Wallets').click();
        cy.get('#add').click()
        cy.get('#senderEmail').type('gouabyk14@yahoo.fr')
        cy.get('#addWallet').click()
        cy.get('#cancel').click()
      });

      it('update wallet', () => {  
        cy.contains('Wallets').click();
        cy.get('#add').click()
        cy.get('#senderEmail').type('gouabyk14@yahoo.fr')
        cy.get('#addWallet').click()
        cy.get('#cancel').click()
        cy.get('#editWallet').click()
        cy.get('#senderEmail').type('gouabyk14@yahoo.fr').clear()
        cy.get('#senderEmail').type('le_kg@yahoo.com')
        cy.get('#addWallet').click()
        cy.get('#cancel').click()
      });

       it.only('delete wallet', () => {  
         cy.contains('Wallets').click();
         cy.get('#add').click()
         cy.get('#senderEmail').type('gouabyk14@yahoo.fr')
         cy.get('#addWallet').click()
         cy.get('#cancel').click()
         cy.get('#deleteWallet').click() 
         cy.get('#closeAlert').click()
         cy.get('#removeWallet').click()
         cy.visit('http://localhost:3000') 
         cy.contains('Wallets').click() 
      });
      
  });