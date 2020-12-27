import { createNewSeedPhrase, createWallet, restoreWallet} from './utils/index'
import { SEED_PASSWORD} from './utils/constants'

describe("Settings E2E Tests", () => {


    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })

    //TODO please add test to check if status shows current network 

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
    
})
