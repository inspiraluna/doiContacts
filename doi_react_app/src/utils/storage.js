import {addCallback} from "reactn";

const initStorage = (cordovaEnabled,global,setGlobal) => {

    if(!cordovaEnabled || (window.device && window.device.platform==='browser')) {
        console.log('using localstorage')
        const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
        const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):[]
        const initialCurrentTab =  localStorage.getItem('currentTab')?localStorage.getItem('currentTab'):"0"
        const initialModus =  localStorage.getItem('modus')?localStorage.getItem('modus'):'list'
        const initialActiveWallet =  localStorage.getItem('activeWallet')?localStorage.getItem('activeWallet'):'0'
        setGlobal({contacts: initialContacts,
            wallets: initialWallets,
            errors: false,
            currentTab:initialCurrentTab,
            buttonState: '',
            modus: initialModus,
            activeWallet: initialActiveWallet
        })
    }else{
        console.log('using nativestorage')
        const nObjects = [
            {name:'contacts',defaultValue:[]},
            {name:'wallets',defaultValue:[]},
            {name:'currentTab',defaultValue:"0"},
            {name:'modus',defaultValue:'list'},
            {name:'activeWallet',defaultValue:"0"},
        ]

        const loadNativeStorage = (nObjectList) => {

            const newGlobal = {}
            let counter = 0

            nObjectList.forEach( (it) => {
                console.log(it)
                try{
                    window.NativeStorage.getItem(it.name,
                        (obj) => {
                            console.log('setting '+it.name+' to:',obj)
                            newGlobal[it.name] = obj
                            counter++
                            console.log('counter now:'+counter,newGlobal)
                            if(counter==nObjectList.length) {
                                console.log('setting global state from native storage', newGlobal)
                                setGlobal(newGlobal)
                            }
                        },
                        (obj) => {
                            newGlobal[it.name] = it.defaultValue
                            counter++
                            console.log('counter now:'+counter,newGlobal)
                            if(counter==nObjectList.length) {
                                console.log('setting global state from native storage', newGlobal)
                                setGlobal(newGlobal)
                            }
                    });
                } catch(ex){
                    newGlobal[it.name] = it.defaultValue
                    counter++
                    console.log('counter now:'+counter,newGlobal)
                    if(counter==nObjectList.length) {
                        console.log('setting global state from native storage', newGlobal)
                        setGlobal(newGlobal)
                    }
                }
            })
        }
        loadNativeStorage(nObjects)
    }

    addCallback(global => {
        if((window.device && window.device.platform==='browser') || !window.cordova) {
            localStorage.setItem('contacts',JSON.stringify(global.contacts))
            localStorage.setItem('wallets',JSON.stringify(global.wallets))
            localStorage.setItem('currentTab',global.currentTab)
            localStorage.setItem('modus',global.modus)
            localStorage.setItem('activeWallet',global.activeWallet)
        }else{
            //TODO only set items in NativeStorgage which changed (don't set all of them all the time)
            //First get the value from NativeStorage and compare it with value in global state - if different store it in Native Storage
            window.NativeStorage.setItem("contacts",global.contacts?global.contacts:[],(obj) => {
                    //console.log("set contacts in native storage",obj);
                    },(err) => {console.log('error contacts',err)})

            window.NativeStorage.setItem("wallets",global.wallets?global.wallets:[],(obj) => {
                    //console.log("set wallets in native storage",obj);
                },(err) => {console.log('error wallets',err)})

            //if(global.currentTab)
                window.NativeStorage.setItem("currentTab",global.currentTab,(obj) => {
                    console.log("set currentTab in native storage",obj);
                    },(err) => {console.log('error currentTab '+global.currentTab,err)})

           // if(global.modus)
                window.NativeStorage.setItem("modus",global.modus,(obj) => {
                   // console.log("set modus in native storage",obj);
                    },(err) => {console.log('error modus '+global.modus,err)})

            //if(global.activeWallet)
                window.NativeStorage.setItem("activeWallet",global.activeWallet,(obj) => {
                   // console.log("set contacts in activeWallet storage",obj);
                    },(err) => {console.log('error activeWallet'+global.activeWallet,err)})
        }
        return null;
    });
}
export default initStorage
