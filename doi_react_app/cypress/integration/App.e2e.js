import chaiColors from 'chai-colors'
chai.use(chaiColors);
import { createNewSeedPhrase, createWallet} from './utils/index'

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

    it("creates new seed and a wallet", () => {
        createNewSeedPhrase()
        createWallet("Peter", "peter@ci-doichain.org", "Welcome to Peter's newsletter")
    })

    //TODO put this into a new walletcreator.e2e.js file 
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

})
