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
  });