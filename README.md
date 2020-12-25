# DoiContacts - A Doichain wallet 

[![GitHub tag](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/inspiraluna/doiContacts/master/package.json&query=$.version&label=Version)](https://github.com/inspiraluna/doiContacts)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![MIT](https://img.shields.io/github/license/inspiraluna/doiContacts.svg)

Doichain Wallet. 
Help us to reduce email spam.
Built with ReactJS, Cordova for Android, iOS and Desktop

[![Appstore](https://raw.githubusercontent.com/inspiraluna/doiContacts/master/doc/images/app-store-badge.svg)](https://apps.apple.com/us/app/doi-contacts/id1484393443)
[![Playstore](https://raw.githubusercontent.com/inspiraluna/doiContacts/master/doc/images/play-store-badge.svg)](https://play.google.com/store/apps/details?id=org.doichain.contacts.app)


Remark: Double-Opt-In email permissions are necessary by EU-law, DoiContacts and Doichain solve this issue self-decentralizing, open, permissionless and anonymous on Doichain blockchain. For more information about DOI's and Doichain, please visit https://github.com/doichain/dapp or https://www.doichain.org

Doichain stores email permissions in form of signatures but doesn't store ANY encrypted nor unencrypted personal data.
This app doesn't use any cloud storage. All private keys and personal data are stored only on your device!

## Features
- Wallets
    - create multiple Doichain Wallets and associate it offchain with an email address (e.g. private, project a, project b, ... ))
    - edit subject and email template used by the wallet
    - send/receive DOI to another wallet
    - list all transactions
- Contacts
    - add an email address and request an email permission through Doichain transaction with a personalized email text
    - enter a current geo position when requesting the permission (you can remember where you meet)
    - show contacts status of a requested email permission (confirmed - yes/no)
    - scan email QR-Code from a second doiContact wallet
    - (under development) scan an IPFS-address QR-Code pointing to a IPFS-file with a signed SOI transaction ready to broadcasted (and signed) by a second party (Bob)

## Want to contribute?

### Orientation
- doi_react_app/ - contains the react app (edit, **yarn start**, **yarn build** to deploy to ../www (cordova) from here)
- doi_react_app/cypress/integration/App.e2e.js Cypress Tests
- www/ - cordova directory - do not edit anything here.
- cordova build / cordova run ios/android from the directory of this file

### checkout this repository and ```cd doi_react_app```
- install npm and yarn ```npm install -g yarn```
- run ```yarn install```
- Install a Doichain RegTest development environment as described here: https://github.com/Doichain/dapp/blob/master/doc/en/dev-env-regtest.md 
- run ```yarn start``` (starts doiContact web app on port 3001 as Alice' dApp runs on port 3000 and Bob's on 4000)

### Run Cyress browser tests
- Run ```npm run cypress ``` in another terminal

### How to test on android / ios emulater
- run ```npm install``` in the root directory of the repository (```cd ../``` from doi_react_app)
- run ```cordova build```
- run ```cordova run android``` or
- run ```cordova run ios```

## License
MIT

## RESPONSIBLE DISCLOSURE
Found critical bugs/vulnerabilities? Please email them doiContacts@doi.works Thanks!
