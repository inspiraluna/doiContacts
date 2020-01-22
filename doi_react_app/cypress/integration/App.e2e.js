describe('App E2E', () => {
    it('should assert that true is equal to true', () => {
      expect(true).to.equal(true);
    });
    it('should have a tab Wallets', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Wallets').click();
        cy.get('h1')
          .should('have.text', 'DoiCoin Wallets');
      });
  });