import {fundWallet} from "doichain/lib/fundWallet"
import {createHdKeyFromMnemonic} from "doichain/lib/createHdKeyFromMnemonic"
import {changeNetwork} from "doichain/lib/network"
import chaiColors from 'chai-colors'
chai.use(chaiColors);

const bitcoin = require("bitcoinjs-lib")

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

    /**
     * TODO please check if button, label texts are their value too! 
     */
    it("tests changing language", () => {
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
