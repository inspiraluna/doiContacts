const SEED_PASSWORD = "13456abC"
describe("App E2E", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3002")
    })
    const createNewWallet = () => {
        // balance blanket camp festival party robot social stairs noodle piano copy drastic
        //kiwi acquire security left champion peasant royal sheriff absent calm alert letter (password: 13456abC)
        cy.get("#createWallet").click()
        cy.get("#preview").click()
        cy.get("#createWallet").click()
        cy.get("#checked").click()
        cy.get("#next").click()
        cy.get("#skipButton").click()
        cy.get("#close").click()
        cy.get("#skipButton").click()
        cy.get("#skip").click()
        cy.get("#standard-adornment-email").type("peter@ci-doichain.org")
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#standard-adornment-password2").type(SEED_PASSWORD)
        cy.get("#next").click()
        cy.wait(20000)
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
        cy.get("#walletIcon").click()
    }
    const restoreWallet = () => {
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "kiwi acquire security left champion peasant royal sheriff absent calm alert letter"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#next").click()
        cy.wait(7000)
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
        cy.get("#walletIcon").click()
    }

    it("creates a new wallet, adds a new wallet and updates one of the wallets", () => {
        createNewWallet()
        cy.get("#phoneIcon").click()
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#senderName").type("Peter")
        cy.get("#senderEmail").type("peter@ci-doichain.org")
        cy.get("#subject").type("myWallet")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").type(
            "Hello, please give me permission to write you an email. _confirmation_url_ Yours Peter"
        )
        cy.get("#back").click()
        cy.get("#redirectUrl").type("www.doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#senderName").should("have.text", "Name: Peter")
        cy.get("#sentEmail").should("have.text", "Email: peter@ci-doichain.org")
        cy.get("#subj").should("have.text", "Subject: myWallet")
        cy.get("#content").should(
            "have.text",
            "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Peter"
        )
        cy.get("#redUrl").should("have.text", "Redirect-Url: https://www.doichain.org")
        cy.get("#walletIcon").click()
        cy.get("#editWallet").click()
        cy.get("#senderName").clear()
        cy.get("#senderName").type("Alice")
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
        cy.get("#senderName").should("have.text", "Name: Alice")
        cy.get("#sentEmail").should("have.text", "Email: alice@ci-doichain.org")
        cy.get("#subj").should("have.text", "Subject: Doichain Contacts Request")
        cy.get("#content").should(
            "have.text",
            "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Alice"
        )
        cy.get("#redUrl").should("have.text", "Redirect-Url: http://www.doichain.org")
    })

    it("tests the receive button", () => {
        createNewWallet()
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#walletIcon").click()
        cy.get("#detail").click()
        cy.get("#receive").click()
        cy.get("#receiveDoi").should("have.text", "Receive DOI for address:")
    })

    it("tests the send button", () => {
        createNewWallet()
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#walletIcon").click()
        cy.get("#detail").click()
        cy.wait(2000)
        cy.get("#send").click()
        cy.get("#sendDoi").should("have.text", "Send DOI from address:")
    })

    it("update wallet", () => {
        createNewWallet()
        cy.get("#editWallet").click()
         cy.get("#senderName").clear()
         cy.get("#senderName").type("Bob")
        cy.get("#senderEmail").clear()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#subject").clear()
        cy.get("#subject").type("Doichain Contacts Request")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").clear()
        cy.get("#editTemp").type(
            "Hello, please give me permission to write you an email. _confirmation_url_ Yours Bob"
        )
        cy.get("#back").click()
        cy.get("#redirectUrl").clear()
        cy.get("#redirectUrl").type("http://www.doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#senderName").should("have.text", "Name: Bob")
        cy.get("#sentEmail").should("have.text", "Email: bob@ci-doichain.org")
        cy.get("#subj").should("have.text", "Subject: Doichain Contacts Request")
        cy.get("#content").should(
            "have.text",
            "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Bob"
        )
        cy.get("#redUrl").should("have.text", "Redirect-Url: http://www.doichain.org")
    })

    it("delete wallet", () => {
        createNewWallet()
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#walletIcon").click()
        cy.get("#deleteWallet").click()
        cy.get("#closeAlert").click()
        cy.get("#deleteWallet").click()
        cy.get("#removeWallet").click()
        cy.visit("http://localhost:3000")
        cy.get("#walletIcon").click()
    })

    it("should test the balance", () => {
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "kiwi acquire security left champion peasant royal sheriff absent calm alert letter"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#next").click()
        cy.get("#walletIcon").click()
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
        cy.get("#balance").then($span => {
            const balance = parseFloat($span.text())
            expect(balance).to.eq(0)
        })
        cy.get("#unconfirmedBalance").then($span => {
            oldBalance = parseFloat($span.text())
            expect(oldBalance).to.eq(oldBalance - amountToSend)
        })
    })

    it.only("creates another wallet and sends money on it", () => {
        restoreWallet()
        cy.get("#add").click()
        cy.get("#senderName").type("Peter")
        cy.get("#senderEmail").type("peter@ci-doichain.org")
        cy.get("#subject").type("myWallet")
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").type(
            "Hello, please give me permission to write you an email. _confirmation_url_ Yours Peter"
        )
        cy.get("#back").click()
        cy.get("#redirectUrl").type("www.doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#doiCoinAddress").then($li => {
            const address = $li.text()
            cy.get("#walletIcon").click()
            cy.get("#detail").click()
            cy.get("#send").click()
            cy.get("#toAddress").type(address)
        })
        const amountToSend = 0.5
        cy.get("#amount").type(amountToSend)
        cy.get("#sendAmount").click()
        cy.get("#back").click()
    })

    it("tests the languages", () => {
        restoreWallet()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#cancel").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("ru")
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#cancel").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("fr")
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#cancel").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
    })

    it("should create a contact", () => {
        restoreWallet()
        cy.get("#phoneIcon").click()
        cy.get("#addButton").click()
        cy.get("#toAddress").type("bob@ci-doichain.org")
        cy.get("#requestPermissiom").click()
        cy.wait(2000)
        cy.get("#phoneIcon").click()
    })

    it("clicks copy the address to clipbooard and snackbar shows up", () => {
        createNewWallet()
        cy.get("#walletIcon").click()
        cy.get("#detail").click()
        cy.window().then(win => {
            cy.stub(win, "prompt")
                .returns(win.prompt)
                .as("copyToClipboardPrompt")
        })
        cy.get("#address").then($span => {
            const link = $span.text()
            cy.get("#copy").click()
            cy.get("@copyToClipboardPrompt").should("be.called")
            cy.get("#client-snackbar").should("have.text", "Doichain address copied to clipboard")
            cy.get("@copyToClipboardPrompt").should(prompt => {
                expect(prompt.args[0][1]).to.equal(link)
            })
        })
    })

    it("restores a wallet then shows recovery phrase", () => {
        restoreWallet()
        cy.get("#settingsIcon").click()
        cy.get("#showSeedPhrase").click()
        cy.get("#enterPassword").click()
        cy.get("#standard-adornment-password").type("abcdefgh1Z")
        cy.get("#unlock").click()
        cy.get("#seed").should("have.text", "kiwi acquire security left champion peasant royal sheriff absent calm alert letter")
    })

    it("creates a new wallet then shows recovery phrase", () => {
        cy.get("#createWallet").click()
        cy.get("#randomSeed").then($h1 => {
            const seed = $h1.text()
        cy.get("#checked").click()
        cy.get("#next").click()
        cy.get("#skipButton").click()
        cy.get("#close").click()
        cy.get("#skipButton").click()
        cy.get("#skip").click()
        cy.get("#standard-adornment-email").type("peter@ci-doichain.org")
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#standard-adornment-password2").type(SEED_PASSWORD)
        cy.get("#next").click()
        cy.wait(20000)
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
        cy.get("#showSeedPhrase").click()
        cy.get("#enterPassword").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.get("#seed").should("have.text", seed)
    })
    })
    
    it("should create a contact but should not be possible to add twice the same email address", () => {
        restoreWallet()
        cy.wait(2000)
        cy.get("#phoneIcon").click()
        cy.get("#addButton").click()
        cy.get("#toAddress").type("bob@ci-doichain.org")
        cy.get("#requestPermissiom").click()
        cy.wait(2000)
        cy.get("#phoneIcon").click()
        cy.wait(2000)
        cy.get("#addButton").click()
        cy.get("#toAddress").type("bob@ci-doichain.org")
        cy.get("#client-snackbar").should(
            "have.text",
            "this email already exist, please use another one"
        )
        cy.get("#requestPermissiom").should("not.exist")
        cy.get("#toAddress").clear()
        cy.get("#toAddress").type("alice@ci-doichain.org")
        cy.get("#requestPermissiom").should("be.visible")
        cy.get("#requestPermissiom").click()
    })

     it("should test the password validation messages", () => {
         cy.get("#createWallet").click()
         cy.get("#preview").click()
         cy.get("#createWallet").click()
         cy.get("#checked").click()
         cy.get("#next").click()
         cy.get("#skipButton").click()
         cy.get("#close").click()
         cy.get("#skipButton").click()
         cy.get("#skip").click()
         cy.get("#standard-adornment-email").type("peter@ci-doichain.org")
         cy.get("#standard-adornment-password").type("abc")
         cy.get("#standard-adornment-password2").type("abc")
         cy.get("#component-error-text").should("have.text", "Password is too short")
         cy.get("#standard-adornment-password").type("defaa")
         cy.get("#standard-adornment-password2").type("defaa")
         cy.get("#component-error-text").should(
             "have.text",
             "At least 1 character must be uppercase"
         )
         cy.get("#standard-adornment-password").type("G")
         cy.get("#standard-adornment-password2").type("G")
         cy.get("#component-error-text").should("have.text", "Should contain at least 1 number")
         cy.get("#standard-adornment-password").clear()
         cy.get("#standard-adornment-password2").clear()
         cy.get("#standard-adornment-password").type("AAANNJJJ")
         cy.get("#standard-adornment-password2").type("AAANNJJJ")
         cy.get("#component-error-text").should(
             "have.text",
             "At least 1 character must be lowercase"
         )
         cy.get("#standard-adornment-password").clear()
         cy.get("#standard-adornment-password2").clear()
         cy.get("#standard-adornment-password").type("Aabb ooo1")
         cy.get("#standard-adornment-password2").type("Aabb ooo1")
         cy.get("#component-error-text").should("have.text", "Password should not contain spaces")
         cy.get("#standard-adornment-password").clear()
         cy.get("#standard-adornment-password2").clear()
         cy.get("#standard-adornment-password").type(
             "Aabbooo1fffjfhfhjjmcncbcbvmdndbdncnmvcmcncnshsjcnbs"
         )
         cy.get("#standard-adornment-password2").type(
             "Aabbooo1fffjfhfhjjmcncbcbvmdndbdncnmvcmcncnshsjcnbs"
         )
         cy.get("#component-error-text").should(
             "have.text",
             "Password should not contain more than 32 characters"
         )
         cy.get("#standard-adornment-password").clear()
         cy.get("#standard-adornment-password2").clear()
         cy.get("#standard-adornment-password").type("Password123")
         cy.get("#standard-adornment-password2").type("Password123")
         cy.get("#component-error-text").should("have.text", "This password is not allowed")
     })
})
