import { fundWallet } from "doichain/lib/fundWallet" 
import { changeNetwork } from "doichain/lib/network"
import { createNewSeedPhrase, createWallet} from './utils/index'
import { SEED_PASSWORD} from './utils/constants'

describe("Wallet E2E Tests", () => {

    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })
    
    it("creates new seed, a wallet with some funding", () => {
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")

    })
    //create a function for updating a wallet including checking the details via asserts
    it("adds a new wallet and updates details of it", () => {
        createNewSeedPhrase()
        
        const senderName = "Peter"
        const email = "peter@ci-doichain.org"
        const subject = "Welcome to Peters newsletter!"
        const emailBody = "Hello, please give me permission to write you an email. ${confirmation_url} Yours" 
        createWallet(senderName,email,subject,emailBody)
       
        const upatedSenderName = "Alice"
        const updatedEmail = "alice@ci-doichain.org"
        const updatedSubject = "Doichain Contacts Request"
        const updatedEmailBody = "Hello, please give me permission to write you an email. ${confirmation_url} Yours Alice"
        const updatedRedirectUrl = "http://www.doichain.org"

        cy.log("udpate data in wallet")
        cy.get("#walletIcon").click()
        cy.get("#editWallet").click()
        cy.get("#senderName").clear()
        cy.get("#senderName").type(upatedSenderName)
        cy.get("#senderEmail").clear()
        cy.get("#senderEmail").type(updatedEmail)
        cy.get("#subject").clear()
        cy.get("#subject").type(updatedSubject)
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").clear()
        cy.get("#editTemp").type(updatedEmailBody,{parseSpecialCharSequences: false})
        cy.get("#back").click()
        cy.get("#redirectUrl").clear()
        cy.get("#redirectUrl").type(updatedRedirectUrl)
        cy.get("#saveWallet").click()

        cy.log('checking updated details in wallet')

        cy.get("#senderName").should("have.text", "Name: "+upatedSenderName)
        cy.get("#sentEmail").should("have.text", "Email: "+updatedEmail)
        cy.get("#subj").should("have.text", "Subject: "+updatedSubject)
        cy.get("#content").should("have.text","Content: "+updatedEmailBody)
        cy.get("#redUrl").should("have.text", "Redirect-Url: "+updatedRedirectUrl)
    })

    //TODO 1) please check if wallet is in the wallet list and add assert
    //TODO 2) delete a wallet by its index - create a function from it! 

    it("deletes a wallet", () => {
        createNewSeedPhrase()
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#senderEmail").type("bob@ci-doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.wait(500)
        cy.get("#walletIcon").click()
        cy.wait(500)
        cy.get("#deleteWallet").click()
        cy.get("#closeAlert").click()
        cy.get("#deleteWallet").click()
        cy.get("#removeWallet").click()
        cy.visit("http://localhost:3001")
        cy.get("#walletIcon").click()
    })

    it("creates 2 wallets, funds 1 wallet and sends money to the second. Checks balance, transaction history and confirmation", () => {
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
        cy.wait(500)
        createWallet("Bob", "bob@ci-doichain.org", "Welcome to Bob's newsletter")
        //1. fund first wallet
        cy.get("#doiCoinAddress").then($li => {
            const addressOfSecondWallet = $li.text().split(" ")[0]
            cy.get("#walletIcon").click()
            cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click on the first wallet and send DOI to the 2nd
            cy.get("#doiCoinAddress").then(async $li2 => {
                const addressOfFirstWallet = $li2.text().split(" ")[0]
                cy.get("#balance").then(async $span => {
                    const balance = parseFloat($span.text())
                    if (balance < 100) {
                        const doi = 10
                        cy.log('funding first wallet')
                        changeNetwork('regtest')
                        await fundWallet(addressOfFirstWallet, doi)
                        cy.wait(2000)
                        cy.get("#walletIcon").click()
                        cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click first wallet
                    }
                    cy.wait(2000)
                    //2. send 0.00005000 DOI to 2nd wallet
                    cy.get("#send").click()
                    cy.get("#toAddress").type(addressOfSecondWallet)
                    const amountToSend = 0.00005
                    cy.get("#amount").type(amountToSend)
                    cy.get("#sendAmount").click()
                    cy.get("#standard-adornment-password").type(SEED_PASSWORD)
                    cy.get("#unlock").click()
                    cy.wait(2000)
                    //3. check the balance of the 2nd wallet
                    cy.get("#walletIcon").click()
                    cy.get("#walletList > li").each(($el, index, $list) => { //click the last wallet in the list
                        (index === $list.length - 1) ? cy.wrap($el).click(): ""
                    })
                    cy.wait(2000)
                    cy.get("#balance").then(async $span => {
                        const balance = parseFloat($span.text())
                        const amount = 0.00005
                        expect(balance).to.eq(amount)
                        //4. check if the last transaction is inside the transaction history with the rigth amount
                        cy.get("#txList > div").each(($el, index, $list) => {
                            if (index === 0) {
                                const firstTx = parseFloat($el.find("#txAmount").text())
                                expect(firstTx).to.eq(amount)
                                //5. confirmations should be 0
                                const confirm = parseFloat($el.find("#confirmations").text())
                                expect(confirm).to.eq(0)
                            }
                            //6. transactions history should have only 1 transaction
                            expect($list.length).to.eq(1)
                        })
                        //7. fund the first wallet again and check if the transaction now has a confirmation
                        const doi = 1
                        await fundWallet(addressOfSecondWallet, doi)
                        cy.get("#walletIcon").click()
                        cy.get("#walletList > li").each(($el, index, $list) => { //click the last wallet in the list
                            (index === $list.length - 1) ? cy.wrap($el).click(): ""
                        })
                        cy.wait(10000)
                        cy.get("#txList > div").each(($el, index, $list) => {
                            cy.wait(4000)
                            expect($list.length).to.eq(2)
                            const confirm = parseFloat($el.find("#confirmations").text())
                            expect(confirm).to.eq(1)
                        })
                        //.8 check balance and transaction of the first wallet
                        cy.get("#walletIcon").click()
                        cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "")
                        cy.wait(2000)
                        cy.get("#balance").then(async $span => {
                            const balance = parseFloat($span.text())
                            const amount = 9.99494718
                            expect(balance).to.eq(amount)
                        })
                        cy.get("#txList > div").each(($el, index, $list) => {
                            expect($list.length).to.eq(3)
                           // cy.wait(2000)
                           if(index === 2){
                                const confirm = parseFloat($el.find("#confirmations").text())
                                expect(confirm).to.eq(1)
                            }
                        })
                    })
                })
            })
        })
    })
})

it("click 'copy address to clipbooard' and snackbar shows up", () => {
    createNewSeedPhrase()
    createWallet("Bob", "bob@ci-doichain.org", "Welcome to Bob's newsletter")
    cy.wait(500)
    cy.get("#walletIcon").click()
    cy.wait(500)
    cy.get("#detail").click()
    cy.get("#receive").click()
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
