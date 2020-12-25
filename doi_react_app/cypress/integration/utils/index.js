import {SEED_PASSWORD} from './constants'
/**
 * Creates a new seed phrase
 * returns a promise
 */
export const createNewSeedPhrase = () => {
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

export const restoreWallet = () => {
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

export const createWallet = (senderName, senderEmail, subject) => {
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