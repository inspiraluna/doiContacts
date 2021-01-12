import { fundWallet } from "doichain/lib/fundWallet" 
import { createNewSeedPhrase, 
    createWallet, 
    deleteWalletByIndex,
    getAddressOfWalletByIndex,
    getBalanceOfWalletByIndex,
    checkTransactionByIndex,
    sendDoiToAddress,
    updateWallet} from './utils/index'
import { SEED_PASSWORD} from './utils/constants'
const bitcoin = require("bitcoinjs-lib")

describe("Wallet E2E Tests", () => {

    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })
    
    //TODO please create a function for updating a wallet including checking the details via asserts
    it.only("adds a new wallet and updates details of it", () => {
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

        updateWallet(upatedSenderName,updatedEmail,updatedSubject,updatedEmailBody,updatedRedirectUrl)

        // cy.log("udpate data in wallet")
        // cy.get("#walletIcon").click()
        // cy.get("#editWallet").click()
        // cy.get("#senderName").clear()
        // cy.get("#senderName").type(upatedSenderName)
        // cy.get("#senderEmail").clear()
        // cy.get("#senderEmail").type(updatedEmail)
        // cy.get("#subject").clear()
        // cy.get("#subject").type(updatedSubject)
        // cy.get("#editEmailTemplate").click()
        // cy.get("#editTemp").clear()
        // cy.get("#editTemp").type(updatedEmailBody,{parseSpecialCharSequences: false})
        // cy.get("#back").click()
        // cy.get("#redirectUrl").clear()
        // cy.get("#redirectUrl").type(updatedRedirectUrl)
        // cy.get("#saveWallet").click()

        // cy.log('checking updated details in wallet')

        // cy.get("#senderName").should("have.text", "Name: "+upatedSenderName)
        // cy.get("#sentEmail").should("have.text", "Email: "+updatedEmail)
        // cy.get("#subj").should("have.text", "Subject: "+updatedSubject)
        // cy.get("#content").should("have.text","Content: "+updatedEmailBody)
        // cy.get("#redUrl").should("have.text", "Redirect-Url: "+updatedRedirectUrl)
    })

    it("deletes a wallet", () => {
        createNewSeedPhrase()
        const senderName = "Peter"
        const email = "peter@ci-doichain.org"
        const subject = "Welcome to Peters newsletter!"
        const emailBody = "Hello, please give me permission to write you an email. ${confirmation_url} Yours" 
        createWallet(senderName,email,subject,emailBody)
        cy.get("#walletIcon").click()
        cy.wait(500)
        const walletDeleteIndex = 0
        deleteWalletByIndex(walletDeleteIndex,true)
        deleteWalletByIndex(walletDeleteIndex)     
    })

    it("creates new seed with 2 wallets, funds the first and send coins to the second", () => {
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
        cy.wait(500)
        createWallet("Bob", "bob@ci-doichain.org", "Welcome to Bob's newsletter")
        getAddressOfWalletByIndex(0).then(address => {
            cy.log("address first wallet",address)
            const url = "http://localhost:3000/"
            cy.log('calling server for funding',url)
            const doi = 10
            cy.request(url+"/api/v1/funding?address="+address+"&amount="+doi)
            cy.log("before secondWallet")
            getAddressOfWalletByIndex(1).then(address => {
                cy.log("address",address)
                cy.log("after secondWallet")
                const amountToSend = 0.00005
                sendDoiToAddress(0,address,amountToSend)

                // needed for now
                getBalanceOfWalletByIndex(1).then(updatedSecondWallet => {
                    cy.log("checkBalanceOfsecondWallet2",updatedSecondWallet)
                })

            // check balance and transaction of the second wallet
                getBalanceOfWalletByIndex(1).then(updatedSecondWallet => {
                    expect(updatedSecondWallet).to.eq(amountToSend)
                })
            // check if the last transaction is inside the transaction history with the rigth amount
                checkTransactionByIndex(0,amountToSend,0,1)
                // fund the first wallet again to check if the transaction now has a confirmation
                cy.request(url+"/api/v1/funding?address="+address+"&amount="+doi)
                getAddressOfWalletByIndex(1).then(address => {
                    cy.log("address",address)
                    cy.wait(2000)
                    checkTransactionByIndex(0,amountToSend,1,2)
            })

            // check balance and transaction of the first wallet
            getBalanceOfWalletByIndex(0).then(balanceFirstWal => {
                expect(balanceFirstWal).to.eq(10.00005)
                cy.log("checkBalanceOffirstWallet",balanceFirstWal)
                checkTransactionByIndex(2,-10,1,3)
            })
          })
        })
    })
    
    //TODO here this tests is looking for some refactoring since it is very hard to read 
    //funding a certain wallet by index should go into a function
    //get the address from a wallet by index should go into a function
    //send money from wallet index to a wallet by index should go into two different functions
    it("creates 2 wallets, funds 1 wallet and sends money to the second. Checks balance, transaction history and confirmation", () => {
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
        cy.wait(500)
        createWallet("Bob", "bob@ci-doichain.org", "Welcome to Bob's newsletter")
        //1. fund first wallet
        cy.get("#doiCoinAddress").then($li => {
            const addressOfSecondWallet = $li.text().split(" ")[0]
            
            cy.log('getting addresss of wallet')
            cy.get("#walletIcon").click()
            cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click on the first wallet and send DOI to the 2nd
            cy.get("#doiCoinAddress").then(async $li2 => {
                const addressOfFirstWallet = $li2.text().split(" ")[0]

                cy.log('getting balance of wallet')
                cy.get("#balance").then(async $span => {
                    const balance = parseFloat($span.text())
                    if (balance < 100) {
                        const doi = 10
                        cy.log('funding first wallet')
                        changeNetwork('regtest')
                        await fundWallet(addressOfFirstWallet, doi)
                        cy.wait(2000)
                        cy.get("#walletIcon").click()

                    }
                    
                    //this goes into a function sendFromWalletIndexToAddress (index, address, amount) including the test below!
                    cy.get("#walletList > li").each(($el, index, $list) => (index === 0) ? cy.wrap($el).click() : "") //click first wallet
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
                        //TODO put this into a function including the check for confirmations if possible
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

    it("sends 5000 SAT, then 0.00005 DOI", () => {
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
})