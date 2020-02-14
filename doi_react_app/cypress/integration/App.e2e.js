describe("App E2E", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })
    const createNewWallet = () => {
        // balance blanket camp festival party robot social stairs noodle piano copy drastic
        //kiwi acquire security left champion peasant royal sheriff absent calm alert letter (password: 13456abC)
        cy.get("#selectLang").select("en")
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
    }
    const restoreWallet = () => {
        cy.get("#selectLang").select("en")
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "kiwi acquire security left champion peasant royal sheriff absent calm alert letter"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type("13456abC")
        cy.get("#next").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.wait(2000)
        cy.contains("Wallets").click()
    }

    it("creates a new wallet, adds a new wallet and updates one of the wallets", () => {
        createNewWallet()
        cy.contains("Contacts").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("peter@ci-doichain.org")
        cy.get("#subject").type("myWallet")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").type(
            "Hello, please give me permission to write you an email. _confirmation_url_ Yours Peter"
        )
        cy.get("#back").click()
        cy.get("#redirectUrl").type("www.doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#sentEmail").should("have.text", "Email: peter@ci-doichain.org")
        cy.get("#subj").should("have.text", "Subject: myWallet")
        cy.get("#content").should(
            "have.text",
            "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Peter"
        )
        cy.get("#redUrl").should("have.text", "Redirect-Url: https://www.doichain.org")
        cy.get("#cancel").click()
        cy.get("#editWallet").click()
        cy.get("#senderEmail").clear()
        cy.get("#senderEmail").type("alice@ci-doichain.org")
        cy.get("#subject").clear()
        cy.get("#subject").type("Doichain Contacts Request")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").clear()
        cy.get("#editTemp").type(
            "Hello, please give me permission to write you an email. _confirmation_url_ Yours Alice"
        )
        cy.get("#back").click()
        cy.get("#redirectUrl").clear()
        cy.get("#redirectUrl").type("http://www.doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#sentEmail").should("have.text", "Email: alice@ci-doichain.org")
        cy.get("#subj").should("have.text", "Subject: Doichain Contacts Request")
        cy.get("#content").should(
            "have.text",
            "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Alice"
        )
        cy.get("#redUrl").should("have.text", "Redirect-Url: http://www.doichain.org")
        cy.get("#cancel").click()
    })

    it("should create a contact", () => {
        restoreWallet()
        cy.contains("Contacts").click()
        cy.get("#addButton").click() 
        cy.get("#toAddress").type("bob@ci-doichain.org") 
        cy.get("#requestPermissiom").click()
        cy.wait(2000)
        cy.contains("Contacts").click()
    })

    it("tests the receive button", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.get("#receive").click()
    })

    it("tests the send button", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.get("#send").click()
    })

    it("tests the cancel button", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#cancel").click()
    })

    it("update wallet", () => {
        createNewWallet()
        cy.get("#editWallet").click()
        cy.get("#senderEmail").clear()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#cancel").click()
    })

    it("delete wallet", () => {
        createNewWallet()
        cy.contains("Wallets").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#cancel").click()
        cy.get("#deleteWallet").click()
        cy.get("#closeAlert").click()
        cy.get("#deleteWallet").click()
        cy.get("#removeWallet").click()
        cy.visit("http://localhost:3000")
        cy.contains("Wallets").click()
    })

    it("should test the balance", () => {
        cy.get("#selectLang").select("en")
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "kiwi acquire security left champion peasant royal sheriff absent calm alert letter"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type("13456abC")
        cy.get("#next").click()
        cy.contains("Wallets").click()
        cy.get("#detail").click()
        cy.wait(2000)
        let oldBalance = 0
        cy.get("#balance").then($span => {
            const balance = parseFloat($span.text())
            if (balance > 0) oldBalance = balance
            else
                cy.get("#unconfirmedBalance").then($span => {
                    oldBalance = parseFloat($span.text())
                })
        })
        cy.log(oldBalance)
        cy.get("#send").click()
        cy.get("#toAddress").type("n1NTAvj98a2zRGcwrPASLmWoxSDpoHZeQX")
        const amountToSend = 0.5
        cy.get("#amount").type(amountToSend)
        cy.get("#sendAmount").click()
        cy.get("#back").click()
        cy.get("#balance").then(($span) => {
            const balance = parseFloat($span.text())
            expect(balance).to.eq(0)
        }) 
        cy.get("#unconfirmedBalance").then($span => {
            oldBalance = parseFloat($span.text())
            expect(oldBalance).to.eq(oldBalance - amountToSend)
        })
    })
})
