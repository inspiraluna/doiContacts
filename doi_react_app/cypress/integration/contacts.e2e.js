import { fundWallet } from "doichain/lib/fundWallet" 
import { changeNetwork } from "doichain/lib/network"
import { createNewSeedPhrase, createWallet, restoreWallet} from './utils/index'
import { SEED_PASSWORD} from './utils/constants'

describe("Contacts E2E Tests", () => {
    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })

    //TODO for this and the next test add contact should be a function not implemented twice!
    it("perfroms the 'simple email permission protocol' (add contact, send email permission request, confirm and verify) ", () => {
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
                //TODO this can be removed now! because balances are now updated in walletlist and contactlist
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

})
