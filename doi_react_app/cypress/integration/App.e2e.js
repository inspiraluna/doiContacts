import {
    fundWallet
} from "doichain/lib/fundWallet"
import {
    createHdKeyFromMnemonic
} from "doichain/lib/createHdKeyFromMnemonic"
import {
    generateKeyPairFromHdKey
} from "doichain/lib/generateKeyPairFromHdKey"
import {
    changeNetwork,
    DEFAULT_NETWORK
} from "doichain/lib/network"
import chaiColors from 'chai-colors'
chai.use(chaiColors);
//import { network } from "doichain"
const bitcoin = require("bitcoinjs-lib")


const SEED_PASSWORD = "13456abC"
describe("App E2E", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })
    before(() => {
        cy.task("deleteAllEmailsFromPop3", {
            hostname: 'localhost',
            port: 110,
            username: 'bob@ci-doichain.org',
            password: 'bob',
            bobdapp_url: 'http://localhost:4000/'
        }, {
            timeout: 30000
        }).then(async $msgcount => {
            cy.log($msgcount)
})
    })

    const createNewSeedPhrase = () => {
        // balance blanket camp festival party robot social stairs noodle piano copy drastic
        //kiwi acquire security left champion peasant royal sheriff absent calm alert letter (password: 13456abC)
        cy.get("#selectNetwork").select("regtest")
        cy.get("#createWallet").click()
        cy.get("#preview").click()
        cy.get("#createWallet").click()
        return new Cypress.Promise((resolve, reject) => {
            cy.get("#randomSeed").then(($h1) => {
                cy.get("#checked").click()
                cy.get("#next").click()
                cy.get("#skipButton").click()
                cy.get("#close").click()
                cy.get("#skipButton").click()
                cy.get("#skip").click()
                cy.get("#standard-adornment-password").type(SEED_PASSWORD)
                cy.get("#standard-adornment-password2").type(SEED_PASSWORD)
                cy.get("#next").click()
                cy.wait(1000)

                const seed1 = $h1.text() //.replace(/ /g, "")
                cy.log(seed1)
                resolve(seed1)
            })
        })
    }

    const restoreWallet = () => {
        // cy.get('img').attribute('src').then($gouaby => {
        //     expect($gouaby).to.eq("/static/media/logo.bc06d135.jpg")
        // })
        cy.get("#selectNetwork").select("regtest")
        cy.get("#restoreWallet").click()
        cy.get("#preview").click()
        cy.get("#restoreWallet").click()
        cy.get("#textarea").type(
            "kiwi acquire security left champion peasant royal sheriff absent calm alert letter"
        )
        cy.get("#checked").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#next").click()
        cy.wait(5000)
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
        cy.get("#walletIcon").click()
    }

    const createWallet = (senderName, senderEmail, subject) => {
        cy.get("#walletIcon").click()
        cy.wait(500)
        cy.get("#add").click()
        cy.get("#senderName").type(senderName)
        cy.get("#senderEmail").type(senderEmail)
        cy.get("#subject").type(subject)
        cy.get("#editEmailTemplate").click()
        cy.get("#editTemp").type(
            "Hello, please give me permission to write you an email. ${confirmation_url} Yours", {
                parseSpecialCharSequences: false
            }
        )
        cy.get("#back").click()
        cy.get("#redirectUrl").type("https://www.doichain.org")
        cy.get("#saveWallet").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
    }

    it("creates a new seed phrase, adds a new wallet and updates one of the wallets", () => {
        createNewSeedPhrase()
        cy.get("#phoneIcon").click()
        cy.get("#walletIcon").click()
        cy.wait(500)
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
        cy.wait(500)
        cy.get("#senderName").should("have.text", "Name: Peter")
        cy.get("#sentEmail").should("have.text", "Email: peter@ci-doichain.org")
        cy.get("#subj").should("have.text", "Subject: myWallet")
        cy.get("#content").should(
            "have.text",
            "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Peter"
        )
        cy.get("#redUrl").should("have.text", "Redirect-Url: https://www.doichain.org")
        cy.get("#walletIcon").click()
        cy.wait(500)
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

    // it("tests the receive button", () => {
    //     createNewSeedPhrase()
    //     cy.get("#walletIcon").click()
    //     cy.get("#add").click()
    //     cy.get("#senderEmail").type("bob@ci-doichain.org")
    //     cy.get("#saveWallet").click()
    //     cy.get("#standard-adornment-password").type(SEED_PASSWORD)
    //     cy.get("#unlock").click()
    //     cy.get("#walletIcon").click()
    //     cy.get("#detail").click()
    //     cy.get("#receive").click()
    //     cy.get("#receiveDoi").should("have.text", "Receive DOI for address:")
    // })

    // it("tests the send button", () => {
    //     createNewSeedPhrase()
    //     cy.get("#walletIcon").click()
    //     cy.get("#add").click()
    //     cy.get("#senderEmail").type("bob@ci-doichain.org")
    //     cy.get("#saveWallet").click()
    //     cy.get("#standard-adornment-password").type(SEED_PASSWORD)
    //     cy.get("#unlock").click()
    //     cy.get("#walletIcon").click()
    //     cy.get("#detail").click()
    //     cy.wait(2000)
    //     cy.get("#send").click()
    //     cy.get("#sendDoi").should("have.text", "Send DOI from address:")
    // })

    // it("update wallet", () => {
    //     createNewSeedPhrase()
    //     cy.get("#editWallet").click()
    //      cy.get("#senderName").clear()
    //      cy.get("#senderName").type("Bob")
    //     cy.get("#senderEmail").clear()
    //     cy.get("#senderEmail").type("bob@ci-doichain.org")
    //     cy.get("#subject").clear()
    //     cy.get("#subject").type("Doichain Contacts Request")
    //     cy.get("#editEmailTemplate").click()
    //     cy.get("#editTemp").clear()
    //     cy.get("#editTemp").type(
    //         "Hello, please give me permission to write you an email. _confirmation_url_ Yours Bob"
    //     )
    //     cy.get("#back").click()
    //     cy.get("#redirectUrl").clear()
    //     cy.get("#redirectUrl").type("http://www.doichain.org")
    //     cy.get("#saveWallet").click()
    //     cy.get("#standard-adornment-password").type(SEED_PASSWORD)
    //     cy.get("#unlock").click()
    //     cy.get("#senderName").should("have.text", "Name: Bob")
    //     cy.get("#sentEmail").should("have.text", "Email: bob@ci-doichain.org")
    //     cy.get("#subj").should("have.text", "Subject: Doichain Contacts Request")
    //     cy.get("#content").should(
    //         "have.text",
    //         "Content: Hello, please give me permission to write you an email. _confirmation_url_ Yours Bob"
    //     )
    //     cy.get("#redUrl").should("have.text", "Redirect-Url: http://www.doichain.org")
    // })

    //TODO please check if wallet is in the wallet list and add assert
    it("delete wallet", () => {
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
                        changeNetwork('regtest')
                        const funding = await fundWallet(addressOfFirstWallet, doi)
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
                        changeNetwork('regtest')
                        const funding = await fundWallet(addressOfSecondWallet, doi)
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
                            cy.wait(2000)
                            const confirm = parseFloat($el.find("#confirmations").text())
                            expect(confirm).to.eq(1)
                        })
                    })
                })
            })
        })
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
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
        cy.wait(500)
        cy.get("#doiCoinAddress").then(async $li => {
            const addressOfFirstWallet = $li.text().split(" ")[0]
            cy.get("#balance").then(async $span => {
                const balance = parseFloat($span.text())
                // if (balance < 100) {
                    const doi = 10
                    changeNetwork('regtest')
                    const funding = await fundWallet(addressOfFirstWallet, doi)
                    cy.get("#walletIcon").click()
                //     cy.wait(2000)
                // }
                cy.wait(2000)
                cy.get("#phoneIcon").click()
                cy.get("#walletIcon").click() //we need to do this so far because the balance is not yet updated
                cy.get("#detail").click()
                cy.wait(500)
                cy.get("#phoneIcon").click()
                cy.get("#addButton").click()
                cy.get("#toAddress").type("bob@ci-doichain.org")
                cy.get(".MuiButton-label").click()
                cy.get("#standard-adornment-password").type(SEED_PASSWORD)
                cy.get("#unlock").click()
                cy.wait(6000)
                cy.get("#phoneIcon").click() //here the verification must fail because the 2 blocks for soi and doi are not yet mined
                cy.wait(6000)

                cy.task("confirmedLinkInPop3", {
                    hostname: 'localhost',
                    port: 110,
                    username: 'bob@ci-doichain.org',
                    password: 'bob',
                    bobdapp_url: 'http://localhost:4000/'
                }, {
                    timeout: 30000
                }).then(async $link => {
                    cy.wait(5000)
                    // Funding to generate two blocks 
                    changeNetwork('regtest')
                    
                    await fundWallet(addressOfFirstWallet, 1)
                    cy.log($link)
                    cy.wait(10000)
                    //cy.request($link).then(async $data =>{
                    //cy.log($data)
                    cy.exec('curl ' + $link).then(async $response =>{
                        cy.wait(5000)
                        await fundWallet(addressOfFirstWallet, 1)
                        cy.wait(5000)
                        await fundWallet(addressOfFirstWallet, 1)
                        cy.wait(5000)
                        cy.get("#walletIcon").click()
                        cy.get("#detail").click() //now lets create 2 blocks to include our soi and doi
                        cy.get("#doiCoinAddress").then(async $li => {
                            const addressOfFirstWallet = $li.text().split(" ")[0]
                            cy.get("#balance").then(async $span => {
                                const balance = parseFloat($span.text())
                                if (balance < 100) {
                                    const doi = 10
                                    changeNetwork('regtest')
                                    await fundWallet(addressOfFirstWallet, doi)
                                    await fundWallet(addressOfFirstWallet, doi)
                                    cy.get("#phoneIcon").click()
                                    //lets check if our DOI is confirmed
                                }
                            })
                        })
                    })
                })
            })
        })
    })

    it("clicks copy the address to clipbooard and snackbar shows up", () => {
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

    it("restores a wallet then shows recovery phrase", () => {
        restoreWallet()
        cy.get("#settingsIcon").click()
        cy.get("#showSeedPhrase").click()
        cy.get("#enterPassword").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.wait(2000)
        cy.get("#seed").then($p => {
            const seed = $p.text().replace(/ /g, '')
            const seedJoined = "kiwi acquire security left champion peasant royal sheriff absent calm alert letter".replace(/ /g, '')
            expect(seed).to.equal(seedJoined)
        })
    })

    it("creates a new wallet then shows recovery phrase", () => {
        createNewSeedPhrase().then((seed1) => {
            cy.log(seed1)
            // })
            cy.get("#settingsIcon").click()
            cy.get("#selectLang").select("en")
            cy.get("#showSeedPhrase").click()
            cy.get("#enterPassword").click()
            cy.get("#standard-adornment-password").type(SEED_PASSWORD)
            cy.get("#unlock").click()
            cy.wait(2000)
            cy.get("#seed").then(($p) => {
                const seed2 = $p.text().replace(/ /g, "")
                expect(seed1.replace(/ /g, "")).to.equal(seed2)
            })
        })
    })

    it("should create a contact but should not be possible to add twice the same email address", () => {
        restoreWallet()
        cy.get("#phoneIcon").click()
        cy.get("#addButton").click()
        cy.get("#toAddress").type("bob@ci-doichain.org")
        cy.get(".MuiButton-label").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.wait(2000)
        cy.get("#phoneIcon").click()
        cy.wait(2000)
        cy.get("#addButton").click()
        cy.get("#toAddress").type("bob@ci-doichain.org")
        cy.get("#client-snackbar").should(
            "have.text",
            "this email already exist, please use another one"
        )
        cy.get("#requestPermission").should("be.disabled")
        cy.get("#toAddress").clear()
        cy.get("#toAddress").type("alice@ci-doichain.org")
        cy.get(".MuiButton-label").should("be.visible")
        cy.get(".MuiButton-label").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
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

    it("sends: more DOI then it has, 0 DOI and -1 DOI", () => {
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
                        changeNetwork('regtest')
                        const funding = await fundWallet(addressOfFirstWallet, doi)
                        cy.get("#walletIcon").click()
                        cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click first wallet
                    }
                    cy.wait(2000)
                    //2. send 20 DOI to 2nd wallet
                    cy.get("#send").click()
                    cy.get("#toAddress").type(addressOfSecondWallet)
                    const amountToSend = 2000000000
                    cy.get("#amount").type(amountToSend)
                    cy.get("#component-error-text").should(
                        "have.text",
                        "Amount is too big"
                    )
                    cy.get("#amount").clear()
                    cy.get("#amount").type(0)
                    cy.get("#component-error-text").should(
                        "have.text",
                        "Amount should be bigger than 0"
                    )
                    cy.get("#amount").clear()
                    cy.get("#amount").type(-1)
                    cy.get("#component-error-text").should(
                        "have.text",
                        "Amount should be bigger than 0"
                    )
                })
            })
        })
    })

    it.only("sends 5000 SAT, then 0.00005 DOI", () => {
        createNewSeedPhrase()
        cy.get("#settingsIcon").click()
        cy.get("#selectCurrency").select("schw")
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
                        changeNetwork('regtest')
                        const funding = await fundWallet(addressOfFirstWallet, doi)
                        cy.get("#walletIcon").click()
                        cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click first wallet
                    }
                    cy.wait(2000)
                    //2. send 5000 SAT to 2nd wallet
                    cy.get("#send").click()
                    cy.get("#toAddress").type(addressOfSecondWallet)
                    const amountToSend = 5000
                    cy.get("#amount").type(amountToSend)
                    cy.get("#sendAmount").click()
                    cy.get("#standard-adornment-password").type(SEED_PASSWORD)
                    cy.get("#unlock").click()
                    //3. send 0.00005 DOI to 2nd wallet
                    cy.wait(2000)
                    cy.get("#walletIcon").click()
                    cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click first wallet
                    cy.get("#send").click()
                    cy.get("#toAddress").type(addressOfSecondWallet)
                    cy.get("#amount").type(amountToSend)
                    cy.get("#toggleCurrency").click()
                    cy.wait(500)
                    cy.get("#sendAmount").click()
                    cy.get("#standard-adornment-password").type(SEED_PASSWORD)
                    cy.get("#unlock").click()
                })
            })
        })
    })

    it("changes currency", () => {
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
        cy.wait(500)
        cy.get("#settingsIcon").click()
        cy.wait(500)
        cy.get("#selectCurrency").select("schw")
        cy.get("#walletIcon").click()
        cy.get("#detail").click()
        cy.get("#walletCurrency").should(
            "have.text",
            "schw"
        )
        cy.get("#send").click()
        cy.get("#sendCurrency").should(
            "have.text",
            "schw"
        )
        cy.get("#toggleCurrency").should(
            "have.text",
            "schw"
        )
        cy.get("#settingsIcon").click()
        cy.get("#selectCurrency").select("DOI")
        cy.get("#walletIcon").click()
        cy.get("#detail").click()
        cy.get("#walletCurrency").should(
            "have.text",
            "DOI"
        )
        cy.get("#send").click()
        cy.get("#sendCurrency").should(
            "have.text",
            "DOI"
        )
        cy.get("#toggleCurrency").should(
            "have.text",
            "DOI"
        )
        // click on balance to change currency
        cy.get("#walletIcon").click()
        cy.get("#detail").click()
        cy.get("#balance").click()
        cy.wait(500)
        // cy.get("#walletCurrency").should(
        //     "have.text",
        //     "schw"
        // )

    })

    it("checks the background color and button color for each network case", () => {
        createNewSeedPhrase()
        cy.get("body").should("have.css", "background-color").and("be.colored", "#e5e3ff")
        cy.get("#settingsIcon").click()
        cy.get("#changeMode").click()
        cy.get("body").should("have.css", "background-color").and("be.colored", "#303030")
        cy.get("#selectNetwork").select("mainnet")
        cy.get("#showSeedPhrase").should("have.css", "background-color").and("be.colored", "#cd45ff")
        cy.get("#walletIcon").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectNetwork").select("testnet")
        cy.get("#showSeedPhrase").should("have.css", "background-color").and("be.colored", "#e65100")
        cy.get("#walletIcon").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectNetwork").select("regtest")
        cy.get("#showSeedPhrase").should("have.css", "background-color").and("be.colored", "#00bfff")
    })

    it("check the addresses, when sending and receiving transactions", () => {
        createNewSeedPhrase().then((seed1) => {
            cy.get("#walletIcon").click()
            createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
            cy.wait(500)
            cy.get("#walletIcon").click()
            cy.wait(500)
            cy.get("#detail").click()
            cy.get("#receive").click()
            cy.get("#address").then(($span) => {
                const receiveAddress = $span.text()
                changeNetwork("regtest")
                cy.get("#walletIcon").click()
                cy.get("#walletList > li").each(($el, index, $list) =>
                    index === 0 ? cy.wrap($el).click() : ""
                ) //click on the first address

                // we get the change address of the first wallet
                cy.get("#doiCoinAddress option").then(async (options) => {
                    const actual = [...options].map((o) => o.value)
                    cy.log(actual)

                    // const decryptedSeed =
                    //     "kiwi acquire security left champion peasant royal sheriff absent calm alert letter"
                    const hdKey = createHdKeyFromMnemonic(seed1, SEED_PASSWORD)

                    const address0 = bitcoin.payments.p2pkh({
                        pubkey: hdKey.derive("m/0/0/0").publicKey,
                        network: global.DEFAULT_NETWORK,
                    }).address
                    expect(actual[0]).to.equal(address0)
                    expect(actual[0]).to.equal(receiveAddress)

                    const address01 = bitcoin.payments.p2pkh({
                        pubkey: hdKey.derive("m/0/1/0").publicKey,
                        network: global.DEFAULT_NETWORK,
                    }).address
                    expect(actual[1]).to.equal(address01)

                    const doi = 10
                    changeNetwork("regtest")
                    const funding = await fundWallet(address0, doi)
                    cy.wait(500)
                    cy.get("#walletIcon").click()
                    cy.get("#walletList > li").each(($el, index, $list) =>
                        index === 0 ? cy.wrap($el).click() : ""
                    )
                    cy.wait(1000)

                    cy.get("#walletIcon").click()
                    cy.get("#detail").click()
                    cy.get("#receive").click()
                    cy.get("#address").then(($span) => {
                        const receiveAddress = $span.text()

                        cy.get("#walletIcon").click()
                        cy.get("#walletList > li").each(($el, index, $list) =>
                            index === 0 ? cy.wrap($el).click() : ""
                        ) //click on the first address

                        cy.get("#doiCoinAddress option").then(async (options) => {
                            const actual = [...options].map((o) => o.value)
                            cy.log(actual)

                            const address1 = bitcoin.payments.p2pkh({
                                pubkey: hdKey.derive("m/0/0/1").publicKey,
                                network: global.DEFAULT_NETWORK,
                            }).address
                            cy.wait(1000)
                            expect(actual[2]).to.equal(address1)
                            expect(actual[2]).to.equal(receiveAddress)

                            createWallet(
                                "Bob",
                                "bob@ci-doichain.org",
                                "Welcome to Bob's newsletter"
                            )
                            cy.get("#doiCoinAddress").then(($li) => {
                                const addressOfSecondWallet = $li.text().split(" ")[0]
                                cy.get("#walletIcon").click()
                                cy.wait(500)
                                cy.get("#walletList > li").each(($el, index, $list) =>
                                    index === 0 ? cy.wrap($el).click() : ""
                                ) //click on the first wallet and send DOI to the 2nd
                                cy.wait(2000)
                                //2. send 1 DOI to 2nd wallet
                                cy.get("#send").click()
                                cy.get("#toAddress").type(addressOfSecondWallet)
                                const amountToSend = 1
                                cy.get("#amount").type(amountToSend)
                                cy.get("#sendAmount").click()
                                cy.get("#standard-adornment-password").type(SEED_PASSWORD)
                                cy.get("#unlock").click()
                                cy.wait(2000)

                                cy.get("#walletIcon").click()
                                cy.get("#walletList > li").each(($el, index, $list) =>
                                    index === 0 ? cy.wrap($el).click() : ""
                                ) //click on the first address

                                cy.get("#doiCoinAddress option").then(async (options) => {
                                    const actual = [...options].map((o) => o.value)
                                    cy.log(actual)
                                    const address001 = bitcoin.payments.p2pkh({
                                        pubkey: hdKey.derive("m/0/1/1").publicKey,
                                        network: global.DEFAULT_NETWORK,
                                    }).address
                                    expect(actual[3]).to.equal(address001)
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})
