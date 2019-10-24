# Doi Contacts Cordova App with React.JS
## Description
This app is a study around the concept of Doichain. A blockchain based on Namecoin (and Bitcoin) which focuses
on email permissions stored on a blockchain on the one side and on the other hand it is able to create an atomic proof for 
an so called Double-Opt-In (DOI) email permission. This means the email permission was acquired from the right person and was not just invented by some email marketing company.
Doichain will allow white listing of of email recipients and will reduce spam.

Remark: Double-Opt-In permissions are legally necessary in the EU by law. This means as a business needs the permission from a customer to send an email.
For more information about DOI's and Doichain, please visit Doichain.org

This app doesn't use any cloud storage. All data are only stored on your mobile phone! 

## Features
- Contacts
    - Add an email and request a email permission from that email address through a Doichain transaction
    - store current geo position where when entering the email, so you can later automatically see which people you meet on which place
    - (under development) show contacts status of a requested email permission (confirmed - yes/no)
    - (under development) scan QR-Code (scan email address or an already signed SOI-Transaction of a second Doi Contacts App)
    - (under development) create a QR-Code with containing an address / containing an signed SOI transaction ready to be scanned (and signed) by a second party
- Wallets
    - Create multiple Doichain Wallets (so far one wallet per email address (or project e.g. private, project a, project b))
    - Edit subject and email template to be sent to the entered recipient email address
    - (under development) show status of all request email permissions from a wallet
    - (under development) send/receive DOI-coins to another wallet (scan / create QR-code) 
    - (under development) list all transactions of a wallet 
    
## How to start developing òn the reactJS part
- checkout this repository and ```cd doi_react_app``
- run ```yarn install```
- run ```yarn start```
- open another terminal and edit react components in that directly

## How to test on android / ios emulater
- run npm install in the root directory of the repository
- run cordova build
- run cordova run android

## Orientation
- doi_react_app/ - contains the react app (edit, **yarn start**, **yarn build** from here)
- www/ - cordova directory - do not edit anything here.
- cordova build / cordova run ios/android from the directory of this file

## Logic
## QR-Code creation / scan
- Modell a) 
    - create a QR-Code with doichain transaction containing a SOI
        - signed by the creator of the QR-Code (alice) (Alice requests permission from Bob) 
        - URL form: doichain:signeddoichaintx?from=alice@email.com&to=bobs@email.com
        - listens on mempool transaction (needs live websocket to validator)
        - displays confirmed DOI 
    - bob scans a QR-Code (a DOI-permission request) from Alice
        - decodes and shows from and to from after scan provides confirm button
        - broadcasts transaction to validator
        - stores given DOI under contacts with flag permission granted  
        

## Further information and sources (as option - yet untested)
### via Cordova
- cordova geo-coder plugin - https://github.com/sebastianbaar/cordova-plugin-nativegeocoder
- cordova geo-location plugin - https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/
### directly via react
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
    
