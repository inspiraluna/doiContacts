import {addCallback, setGlobal, useGlobal} from "reactn";


const initStorage = (cordovaEnabled) => {
    console.log('1. platform',window.device?window.device.platform:'browser device not available')

    console.log('2. props cordova',cordovaEnabled)

    console.log('3. window.cordova',window.cordova)
    console.log('3.5 window.device',window.device)

    if(cordovaEnabled || (window.device && window.device.platform==='browser')) {
        console.log('4. this is ',window.device.platform)
    }
    if((window.device && window.device.platform==='browser'))
        console.log('5. this really is ',window.device.platform)

    if(!cordovaEnabled || (window.device && window.device.platform==='browser')) {
        const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
        const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]
        const initialCurrentTab =  localStorage.getItem('currentTab')?localStorage.getItem('currentTab'):0
        const initialModus =  localStorage.getItem('modus')?localStorage.getItem('modus'):'list'
        const initialActiveWallet =  localStorage.getItem('activeWallet')?localStorage.getItem('activeWallet'):0
        setGlobal({contacts: initialContacts,
            wallets: initialWallets,
            errors: false,
            currentTab:initialCurrentTab,
            buttonState: '',
            modus: initialModus,
            activeWallet: initialActiveWallet
        })
        console.log('initialized local storage')
    }else{
        const initialContacts = window.NativeStorage.getItem("contacts",(obj) => {
            console.log("got contacts from native storage",obj);},() => {});

        setGlobal({contacts: initialContacts
        })
        /*
         const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
         const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]
         const initialCurrentTab =  localStorage.getItem('currentTab')?localStorage.getItem('currentTab'):0
         const initialModus =  localStorage.getItem('modus')?localStorage.getItem('modus'):'list'
         const initialActiveWallet =  localStorage.getItem('activeWallet')?localStorage.getItem('activeWallet'):0

         setGlobal({contacts: initialContacts,
             wallets: initialWallets,
             errors: false,
             currentTab:initialCurrentTab,
             buttonState: '',
             modus: initialModus,
             activeWallet: initialActiveWallet,
         }) */
    }

    addCallback(global => {
        if((window.device && window.device.platform==='browser') || !window.cordova) {
            localStorage.setItem('contacts',JSON.stringify(global.contacts))
            localStorage.setItem('wallets',JSON.stringify(global.wallets))
            localStorage.setItem('currentTab',global.currentTab)
            localStorage.setItem('modus',global.modus)
            localStorage.setItem('activeWallet',global.activeWallet)
        }else{
            window.NativeStorage.setItem("contacts",JSON.stringify(global.contacts))
        }

        return null;
    });


}
export default initStorage
