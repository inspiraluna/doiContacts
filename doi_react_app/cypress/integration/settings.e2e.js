import { createNewSeedPhrase, createWallet, restoreWallet} from './utils/index'
import { SEED_PASSWORD} from './utils/constants'
import chaiColors from 'chai-colors'
chai.use(chaiColors);

describe("Settings E2E Tests", () => {


    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })

    it("tests changing language", () => {
        restoreWallet()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
        cy.get("#english").should(
            "have.text",
            "English"
        )
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#cancel").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("ru")
        cy.get("#russian").should(
            "have.text",
            "Русский"
        )
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#cancel").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("fr")
        cy.get("#french").should(
            "have.text",
            "Francais"
        )
        cy.get("#walletIcon").click()
        cy.get("#add").click()
        cy.get("#cancel").click()
        cy.get("#settingsIcon").click()
        cy.get("#selectLang").select("en")
    })

    it("check if status shows current network", () => {
        restoreWallet()
        cy.get("#settingsIcon").click()
        cy.get("#selectNetwork").select("mainnet")
        cy.get("#mainnet").should(
            "have.text",
            "Mainnet"
        )
        cy.get("#selectNetwork").select("testnet")
        cy.get("#testnet").should(
            "have.text",
            "Testnet"
        )
        cy.get("#selectNetwork").select("regtest")
        cy.get("#regtest").should(
            "have.text",
            "Regtest"
        )
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
})
