import { createNewSeedPhrase, createWallet, restoreWallet} from './utils/index'
import { SEED_PASSWORD} from './utils/constants'
import chaiColors from 'chai-colors'
chai.use(chaiColors);

describe("Settings E2E Tests", () => {


    beforeEach(() => {
        cy.visit("http://localhost:3001")
    })

    it("checks the background color and button color for each network case", () => {

        cy.get("body").should("have.css", "background-color").and("be.colored", "#e5e3ff")
        cy.get("#changeMode").click()
        cy.get("body").should("have.css", "background-color").and("be.colored", "#303030")

        cy.get("#selectNetwork").select("mainnet")
        cy.get("#createWallet").should("have.css", "background-color").and("be.colored", "#cd45ff")
        cy.get("#restoreWallet").should("have.css", "background-color").and("be.colored", "#cd45ff")

        cy.get("#selectNetwork").select("testnet")
        cy.get("#createWallet").should("have.css", "background-color").and("be.colored", "#e65100")
        cy.get("#restoreWallet").should("have.css", "background-color").and("be.colored", "#e65100")
 
        cy.get("#selectNetwork").select("regtest")
        cy.get("#createWallet").should("have.css", "background-color").and("be.colored", "#00bfff")
        cy.get("#restoreWallet").should("have.css", "background-color").and("be.colored", "#00bfff")
    })
})