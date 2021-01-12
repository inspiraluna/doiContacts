import {
    SEED_PASSWORD
} from './constants'
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

export const createWallet = (senderName, senderEmail, emailSubject, emailBody,redirectUrl) => {
    cy.get("#walletIcon").click()
    cy.wait(500)
    cy.get("#add").click()
    cy.get("#senderName").type(senderName)
    cy.get("#senderEmail").type(senderEmail)
    cy.get("#subject").type(emailSubject)
    cy.get("#editEmailTemplate").click()
    let our_body = "Hello, please give me permission to write you an email. ${confirmation_url} Yours"
    if(emailBody!==undefined)our_body=emailBody
    cy.get("#editTemp").type(our_body,{parseSpecialCharSequences: false})
    cy.get("#back").click()

    let our_redirectUrl = "https://www.doichain.org"
    if(redirectUrl!==undefined) our_redirectUrl = redirectUrl
    cy.get("#redirectUrl").type(our_redirectUrl)
    cy.get("#saveWallet").click()

    cy.get("#standard-adornment-password").type(SEED_PASSWORD)
    cy.get("#unlock").click()
    cy.wait(500)
    cy.get("#senderName").should("have.text", "Name: "+senderName)
    cy.get("#sentEmail").should("have.text", "Email: "+senderEmail)
    cy.get("#subj").should("have.text", "Subject: "+emailSubject)
    cy.get("#content").should("have.text","Content: "+our_body)
    cy.get("#redUrl").should("have.text", "Redirect-Url: "+our_redirectUrl)
}

/**
 * 
 * Deletes a wallet from the wallet list by index
 * 
 * @param {*} walletDeleteIndex the index of the wallet
 * @param {*} cancelDeleteDialog set to true in case you want to cancel the delete dialog and close dialog
 */
export const deleteWalletByIndex = (walletDeleteIndex, cancelDeleteDialog) => {
    return new Cypress.Promise((resolve, reject) => {
    cy.get("#walletList > li").then(walletList=>{
        const walletLength = Cypress.$(walletList).length
        cy.log(walletLength)
        cy.get("#walletList > li").each(($el, index, $list) => (index === walletDeleteIndex) ? cy.wrap($el).get("#deleteWallet").click() : "")
        if (cancelDeleteDialog){
            cy.get("#cancelDelete").click()
            resolve(walletLength)
        } 
        else {
            cy.get("#delete").click()
            if (walletLength > 1) {
                cy.get("#walletList > li").then((walletList2) => {
                    const walletLength2 = Cypress.$(walletList2).length
                    cy.log(walletLength2)
                    expect(walletLength).to.equal(walletLength2+1)
                    resolve(walletLength)
                })
            } else {
                cy.get("#walletList > li").should("not.exist")
                resolve(walletLength)
            }
        }
    })
})

}

export const getAddressOfWalletByIndex = (indexOfWallet,dontNavigate) => {
    
    if (dontNavigate===undefined|| dontNavigate===false){
        cy.get("#walletIcon").click()
        cy.get("#walletList > li").each(($el, index, $list) => index === indexOfWallet ? cy.wrap($el).click() : "")
    }
    
    return new Cypress.Promise((resolve, reject) => {
        cy.get("#doiCoinAddress").then(async ($li2) => {
            const addressOfWallet = $li2.text().split(" ")[0]
            resolve(addressOfWallet)
        })
    })

}

export const getBalanceOfWalletByIndex = (indexOfWallet,dontNavigate) => {
    
    if (dontNavigate===undefined|| dontNavigate===false){
        cy.get("#walletIcon").click()
        cy.get("#walletList > li").each(($el, index, $list) => index === indexOfWallet ? cy.wrap($el).click() : "")
    }

    return new Cypress.Promise((resolve, reject) => {
        cy.get("#balance").then(async ($span) => {
            const balance = parseFloat($span.text())
            resolve(balance)
        })
    })

}

export const getAddressAndBalanceOfWalletByIndex = (indexOfWallet,dontNavigate) => {
    return new Cypress.Promise((resolve, reject) => {
    getAddressOfWalletByIndex(indexOfWallet,dontNavigate).then(address => {
        getBalanceOfWalletByIndex(indexOfWallet,true).then(balance => 
            resolve({address:address,balance:balance}))
    })
})
}

export const sendDoiToAddress = (indexOfWallet,address,amountToSend) => {
        cy.get("#walletIcon").click()
        cy.get("#walletList > li").each(($el, index, $list) => (index === indexOfWallet) ? cy.wrap($el).click() : "")
        cy.wait(2000)
        //2. send DOI to wallet
        cy.get("#send").click()
        cy.get("#toAddress").type(address)
        cy.get("#amount").type(amountToSend)
        cy.get("#sendAmount").click()
        cy.get("#standard-adornment-password").type(SEED_PASSWORD)
        cy.get("#unlock").click()
        cy.log("sendDoi:"+address,amountToSend)
        cy.wait(2000)
}

export const checkTransactionByIndex = (indexOfTransaction,amount,confirmNum,txLength) => {
    cy.get("#txList > div").each(($el, index, $list) => {
        if (index === indexOfTransaction) {
            const Tx = parseFloat($el.find("#txAmount").text())
            expect(Tx).to.eq(amount)
            // check confirmations
            const confirm = parseFloat($el.find("#confirmations").text())
            expect(confirm).to.eq(confirmNum)
        }
        // check transactions history length
        expect($list.length).to.eq(txLength)
    })
}
export const updateWallet = (upatedSenderName,updatedEmail,updatedSubject,updatedEmailBody,updatedRedirectUrl) => {
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
}