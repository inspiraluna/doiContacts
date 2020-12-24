# DoiContacts - A Doichain wallet 

[![GitHub tag](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/inspiraluna/doiContacts/master/package.json&query=$.version&label=Version)](https://github.com/inspiraluna/doiContacts)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/license/inspiraluna/doiContacts2.svg)

Doichain Wallet. 
Help us to reduce email spam.
Built with ReactJS, Cordova for Android, iOS and Desktop

[![Appstore](https://raw.githubusercontent.com/inspiraluna/doiContacts/master/doc/images/app-store-badge.svg)](https://apps.apple.com/us/app/doi-contacts/id1484393443)
[![Playstore](https://raw.githubusercontent.com/inspiraluna/doiContacts/master/doc/images/play-store-badge.svg)](https://play.google.com/store/apps/details?id=org.doichain.contacts.app)


Remark: Double-Opt-In permissions are necessary by EU-law, DoiContacts and Doichain solves this issue seamless, anonymous and safe on Doichain blockchain.
For more information about DOI's and Doichain, please visit www.Doichain.org

Doichain stores email permissions in form of signatures but doesn't store ANY encrypted nor unencrypted personal data.
This app doesn't use any cloud storage. All data are only stored on your mobile phone!

For sending signed transactions between mobile phones (and also browsers) we plan to integrate IPFS for that.

## Features
- Contacts
    - add an email address and request an email permission through Doichain transaction
    - store current geo position when requesting the permission, so you can later remember where you meet
    - show contacts status of a requested email permission (confirmed - yes/no)
    - scan email QR-Code from a second doiContact wallet
    - (under development) scan an IPFS-address QR-Code pointing to a IPFS-file with a signed SOI transaction ready to broadcasted (and signed) by a second party (Bob)
- Wallets
    - create multiple Doichain Wallets and associate it with an email address (e.g. private, project a, project b, startup a, startup b))
    - edit subject and email template to be sent from this wallet
    - send/receive DOI-coins to another wallet (scan / create QR-code)
    - (under development) list all transactions of a wallet

## How to start developing on the ReactJS part
- checkout this repository and ```cd doi_react_app```
- install npm and yarn ```npm install -g yarn```
- run ```yarn install```
- Install a Doichain RegTest development environment as described here: https://github.com/Doichain/dapp/blob/master/doc/en/dev-env-regtest.md 
- run ```yarn start```
- open another terminal and edit react components in that directly

## How to test on android / ios emulater
- run ```npm install``` in the root directory of the repository (```cd ../```)
- run ```cordova build```
- run ```cordova run android```


## Orientation
- doi_react_app/ - contains the react app (edit, **yarn start**, **yarn build** from here)
- www/ - cordova directory - do not edit anything here.
- cordova build / cordova run ios/android from the directory of this file
