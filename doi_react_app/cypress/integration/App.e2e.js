describe("App E2E", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })
    const createNewWallet = () => {
        // balance blanket camp festival party robot social stairs noodle piano copy drastic
        cy.get("#createWallet").click()
        cy.get("#preview").click()
        cy.get("#createWallet").click()
        cy.get("#checked").click()
        cy.get("#next").click()
        cy.get("#skipButton").click()
        cy.get("#close").click()
        cy.get("#skipButton").click()
        cy.get("#skip").click()
        cy.get("#standard-adornment-password").type("abcdefgh1Z")
        cy.get("#standard-adornment-password2").type("abcdefgh1Z")
        cy.get("#next").click()
        cy.contains("Wallets").click()
        cy.get("h1").should("have.text", "DoiCoin Wallets")
    }

    it.only("creates a new wallet, adds a new wallet and updates one of the wallets", () => {
        createNewWallet()
        cy.contains("Contacts").click()
        cy.get("h1").should("have.text", "Doi Contacts")
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("gouabyk14@yahoo.fr")
        cy.get("#subject").type("myWallet")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").type("Hello, please give me permission to write you an email. _confirmation_url_ Yours Gouaby")
        cy.get("#back").click()
        cy.get("#redirectUrl").type("le_kg@yahoo.com")
        cy.get("#addWallet").click()
        cy.wait(2000)
        cy.get("#cancel").click()
        // Update one of the wallets
        cy.get("#editWallet").click()
        cy.get("#senderEmail").clear()
        cy.get("#senderEmail").type("nico@le-space.de")
        cy.get("#subject").clear()
        cy.get("#subject").type("Doichain Contacts Request")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").clear()
        cy.get("#editTemp").type("Hello, please give me permission to write you an email. _confirmation_url_ Yours Nico")
        cy.get("#back").click()
        cy.get("#redirectUrl").clear()
        cy.get("#redirectUrl").type("http://www.doichain.org")
        cy.get("#addWallet").click()
        cy.wait(2000)
        cy.get("#cancel").click()
        // cy.contains("Wallets").click()
        // cy.contains("Contacts").click()
        // cy.get("#addButton").click()
    })

    it("restore a wallet", () => {
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "balance blanket camp festival party robot social stairs noodle piano copy drastic"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type("aaaaaA1aa")
        cy.get("#next").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.wait(5000)
        cy.contains("Wallets").click()
    })

    it("should try to create a contact and fail", () => {
        cy.contains("Contacts").click()
        cy.get("#addButton").click() //TODO please fix
        cy.contains("#error")
    })

    it("tests the receive button", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("gouabyk14@yahoo.fr")
        cy.get("#addWallet").click()
        cy.get("#receive").click() //TODO please fix this create an endless loop at the moment
    })

    it("tests the send button", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("gouabyk14@yahoo.fr")
        cy.get("#addWallet").click()
        cy.get("#send").click() //TODO please fix this create an endless loop at the moment
    })

    it("tests the cancel button", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("gouabyk14@yahoo.fr")
        cy.get("#addWallet").click()
        cy.get("#cancel").click()
    })

    it("update wallet", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#editWallet").click()
        cy.get("#senderEmail").clear()
        cy.get("#senderEmail").type("le_kg@yahoo.com")
        cy.get("#addWallet").click()
        cy.get("#cancel").click()
    })

    it("delete wallet", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("gouabyk14@yahoo.fr")
        cy.get("#addWallet").click()
        cy.get("#cancel").click()
        cy.get("#deleteWallet").click()
        cy.get("#closeAlert").click()
        cy.get("#removeWallet").click()
        cy.visit("http://localhost:3000")
        cy.contains("Wallets").click()
    })
    it("should have a balance", () => {
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "balance blanket camp festival party robot social stairs noodle piano copy drastic"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type("aaaaaA1aa")
        cy.get("#next").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.wait(5000)
        cy.contains("Balance").should("have.text", "Balance: 1.00000000 DOI")
        cy.get("#send").click()
        cy.get("#back").click()
        cy.get("#receive").click()
        cy.get("#back").click()
    })
})
