import {addCallback} from "reactn";

const initStorage = (cordovaEnabled,global,setGlobal) => {

    if(!cordovaEnabled || (window.device && window.device.platform==='browser')) {
        const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
        const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]
        const initialCurrentTab =  localStorage.getItem('currentTab')?localStorage.getItem('currentTab'):"0"
        const initialModus =  localStorage.getItem('modus')?localStorage.getItem('modus'):'list'
        const initialActiveWallet =  localStorage.getItem('activeWallet')?localStorage.getItem('activeWallet'):0
        console.log('setting global values')
        setGlobal({contacts: initialContacts,
            wallets: initialWallets,
            errors: false,
            currentTab:initialCurrentTab,
            buttonState: '',
            modus: initialModus,
            activeWallet: initialActiveWallet
        })
        console.log('initialized local storage',global)
    }else{
        console.log('initializing native storage')
        window.NativeStorage.getItem("contacts",
            (obj) => {
                console.log("got contacts from native storage",obj);
                let newGlobal = global
                newGlobal.contacts = obj
                setGlobal(newGlobal)
            },
            (obj) => {
                console.log("couldn't get contacts value from native storage",obj);
                let newGlobal = global
                newGlobal.contacts = []
                setGlobal(newGlobal)
            });
        window.NativeStorage.getItem("wallets",(obj) => {
            console.log("got wallets from native storage",obj);
            let newGlobal = global
            newGlobal.wallets = obj
            setGlobal(newGlobal)
        },(obj) => {
            console.log("couldn't get wallets value from native storage",obj);
            let newGlobal = global
            newGlobal.wallets = []
            setGlobal(newGlobal)
        });

       try{
           window.NativeStorage.getItem("currentTab",(obj) => {
               console.log("got currentTab from native storage",obj);
               let newGlobal = global
               newGlobal.currentTab = obj
               setGlobal(newGlobal)
           },(obj) => {
               console.log("couldn't get currentTab from native storage",obj);
               let newGlobal = global
               newGlobal.currentTab = "0"
               setGlobal(newGlobal)
           });
       } catch(ex){
           console.log("caught exception currentTab from native storage",ex);
           let newGlobal = global
           newGlobal.currentTab = "0"
           setGlobal(newGlobal)
       }

        window.NativeStorage.getItem("modus",(obj) => {
            console.log("got modus from native storage",obj);
            let newGlobal = global
            newGlobal.modus = obj
            setGlobal(newGlobal)
        },(obj) => {
            console.log("couldn't get modus from native storage",obj);
            let newGlobal = global
            newGlobal.modus = 'list'
            setGlobal(newGlobal)
        });

        try{
            window.NativeStorage.getItem("activeWallet",(obj) => {
                console.log("got activeWallet from native storage",obj);
                let newGlobal = global
                newGlobal.activeWallet = obj
                setGlobal(newGlobal)
            },(obj) => {
                console.log("couldn't get activeWallet from native storage",obj);
                let newGlobal = global
                newGlobal.activeWallet = 0
                setGlobal(newGlobal)
            });
        } catch(ex){}
    }

    addCallback(global => {
        if((window.device && window.device.platform==='browser') || !window.cordova) {
            localStorage.setItem('contacts',JSON.stringify(global.contacts))
            localStorage.setItem('wallets',JSON.stringify(global.wallets))
            localStorage.setItem('currentTab',global.currentTab)
            localStorage.setItem('modus',global.modus)
            localStorage.setItem('activeWallet',global.activeWallet)
        }else{
            window.NativeStorage.setItem("contacts",global.contacts?global.contacts:[],(obj) => {
                    console.log("set contacts in native storage",obj);},(err) => {console.log('error contacts',err)})

            window.NativeStorage.setItem("wallets",global.wallets?global.wallets:[],(obj) => {
                    console.log("set wallets in native storage",obj);},(err) => {console.log('error wallets',err)})

            if(global.currentTab)
                window.NativeStorage.setItem("currentTab",global.currentTab,(obj) => {
                    console.log("set currentTab in native storage",obj);},(err) => {console.log('error currentTab '+global.currentTab,err)})

            if(global.modus)
                window.NativeStorage.setItem("modus",global.modus,(obj) => {
                    console.log("set modus in native storage",obj);},(err) => {console.log('error modus '+global.modus,err)})

            if(global.activeWallet)
                window.NativeStorage.setItem("activeWallet",global.activeWallet,(obj) => {
                    console.log("set contacts in activeWallet storage",obj);},(err) => {console.log('error activeWallet'+global.activeWallet,err)})
        }

        return null;
    });


}
export default initStorage
