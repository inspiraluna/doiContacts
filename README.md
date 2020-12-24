# DoiContacts - Doichain wallet 

[![GitHub tag](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/inspiraluna/doiContacts/master/package.json&query=$.version&label=Version)](https://github.com/inspiraluna/doiContacts)
## Description
This app is an experimental study around the concept of Doichain. A blockchain forked from  Namecoin (and Bitcoin).
It focuses on atomic email permissions / double-opt-ins (DOI) requested through and stored on a blockchain.

Doichains goal is about to reduce email spam.

Remark: Double-Opt-In permissions are necessary by EU-law.
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

## Further information and sources (as option - yet untested)
- Intents in Cordova
    - https://ourcodeworld.com/articles/read/101/how-to-list-your-cordova-app-in-open-with-menu-in-android-and-handle-the-intent-event
- Geo Coding
- via Cordova
    - cordova geo-coder plugin - https://github.com/sebastianbaar/cordova-plugin-nativegeocoder
    - cordova geo-location plugin - https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/
- directly via react
    - ReactJS component for current position - https://www.npmjs.com/package/use-position
        - https://itnext.io/creating-react-useposition-hook-for-getting-browsers-geolocation-2f27fc1d96de
- Nominatim Geo-REST-API https://nominatim.org/release-docs/develop/api/Overview/
- Terrestris Components https://terrestris.github.io/react-geo-ws/map-integration/index.html

- Content Security
    - Fetch not working Api 28 - https://github.com/facebook/react-native/issues/24627
    - https://developers.google.com/web/fundamentals/security/csp
    - https://medium.com/modus-create-front-end-development/cordova-5-ios-9-security-policy-changes-a1cde99890df
    - https://docs.microsoft.com/en-us/visualstudio/cross-platform/tools-for-cordova/security/whitelists?view=toolsforcordova-2017
- Creating Bitcoin Wallets in JS https://medium.com/blockthought/creating-bitcoin-wallets-in-js-69c0773c2954
- Material-UI in React for Beginners https://reactgo.com/material-ui-react-tutorial/
    - Tabs https://material-ui.com/components/tabs/
    - Icons https://material-ui.com/components/icons/

