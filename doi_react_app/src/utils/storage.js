import {addCallback} from "reactn";
import  stringify from 'json-stringify-safe';

  const writeStorage = global => {
      if ((window.device && window.device.platform === "browser") || !window.cordova || !window.NativeStorage) {
          localStorage.setItem("contacts", global.contacts ? JSON.stringify(global.contacts) : JSON.stringify([]))
          localStorage.setItem("wallets", global.wallets ? stringify(global.wallets) :JSON.stringify([]))
          localStorage.setItem("currentTab", global.currentTab ? global.currentTab : 0)
          if(global.modus)localStorage.setItem("modus", global.modus)
          localStorage.setItem("activeWallet", global.activeWallet ? global.activeWallet : 0)
          localStorage.setItem("network", global.network ? global.network : "mainnet")
          localStorage.setItem("encryptedSeed", global.encryptedSeed ? global.encryptedSeed : undefined)
          localStorage.setItem("darkMode", global.darkMode ? global.darkMode : false)
      } else {
          //TODO only set items in NativeStorgage which changed (don't set all of them all the time)
          //First get the value from NativeStorage and compare it with value in global state - if different store it in Native Storage
              window.NativeStorage.setItem(
                  "contacts",
                  global.contacts ? global.contacts : [],
                  obj => {
                      //console.log("set contacts in native storage",obj);
                  },
                  err => {
                      console.log("error contacts", err)
                  }
              )

              window.NativeStorage.setItem(
                  "wallets",
                  global.wallets ? global.wallets : [],
                  obj => {
                      //console.log("set wallets in native storage",obj);
                  },
                  err => {
                      console.log("error wallets", err)
                  }
              )

              window.NativeStorage.setItem(
                  "currentTab",
                  global.currentTab? global.currentTab:0,
                  obj => {
                      console.log("set currentTab in native storage", obj)
                  },
                  err => {
                      console.log("error currentTab " + global.currentTab, err)
                  }
              )

          if (global.modus)
              window.NativeStorage.setItem(
                  "modus",
                  global.modus,
                  obj => {
                      // console.log("set modus in native storage",obj);
                  },
                  err => {
                      console.log("error modus " + global.modus, err)
                  }
              )

              window.NativeStorage.setItem(
                  "activeWallet",
                  global.activeWallet?global.activeWallet:0,
                  obj => {
                      // console.log("set contacts in activeWallet storage",obj);
                  },
                  err => {
                      console.log("error activeWallet" + global.activeWallet, err)
                  }
              )
          if (global.network)
              window.NativeStorage.setItem(
                  "network",
                  global.network?global.network:"mainnet",
                  obj => {},
                  err => {
                      console.log("error network" + global.network, err)
                  }
              )
          if (global.encryptedSeed)
              window.NativeStorage.setItem(
                  "encryptedSeed",
                  global.encryptedSeed?global.encryptedSeed:undefined,
                  obj => {},
                  err => {
                      console.log("error encryptedSeed" + global.encryptedSeed, err)
                  }
              )
          if (global.darkMode)
              window.NativeStorage.setItem(
                  "darkMode",
                  global.darkMode ? global.darkMode : false,
                  obj => {},
                  err => {
                      console.log("error darkMode" + global.darkMode, err)
                  }
              )
      }
      return null
  }
const initStorage = (cordovaEnabled,global,setGlobal) => {

    if(global.wallets) writeStorage(global)

    console.log('cordova is defined', (window.NativeStorage!==undefined))

    if((!cordovaEnabled || !window.NativeStorage) || (window.device && window.device.platform==='browser')) {
        console.log('using localstorage')
        const initialContacts = localStorage.getItem('contacts')?JSON.parse(localStorage.getItem('contacts')):[]
        const initialWallets = localStorage.getItem('wallets')?JSON.parse(localStorage.getItem('wallets')):undefined
        const initialCurrentTab =  localStorage.getItem('currentTab')?localStorage.getItem('currentTab'):0
        const initialModus =  localStorage.getItem('modus')?localStorage.getItem('modus'):undefined
        const initialActiveWallet =  localStorage.getItem('activeWallet')?localStorage.getItem('activeWallet'):0
        const initialNetwork = localStorage.getItem("network")?localStorage.getItem("network"): "mainnet"
        const initialEncryptedSeed = localStorage.getItem("encryptedSeed")?localStorage.getItem("encryptedSeed"): undefined
        const initialDarkMode = (!localStorage.getItem("darkMode") || localStorage.getItem("darkMode") === "false")?false:true
        setGlobal({
            contacts: initialContacts,
            wallets: initialWallets,
            errors: false,
            currentTab: initialCurrentTab,
            buttonState: "",
            modus: initialModus,
            activeWallet: initialActiveWallet,
            network: initialNetwork,
            encryptedSeed: initialEncryptedSeed,
            darkMode: initialDarkMode
        })
    }else{
        const nObjects = [
            { name: "contacts", defaultValue: [] },
            { name: "wallets", defaultValue: undefined },
            { name: "currentTab", defaultValue: "0" },
            { name: "modus", defaultValue: undefined },
            { name: "activeWallet", defaultValue: "0" },
            { name: "network", defaultValue: "mainnet" },
            { name: "encryptedSeed", defaultValue: undefined },
            { name: "darkMode", defaultValue: false },
        ]

        const loadNativeStorage = (nObjectList) => {

            const newGlobal = {}
            let counter = 0
            nObjectList.forEach( (it) => {
                try{
                    window.NativeStorage.getItem(it.name,
                        (obj) => {
                            newGlobal[it.name] = obj
                            counter++
                            if(counter===nObjectList.length)
                                setGlobal(newGlobal)

                        },(obj) => {
                            newGlobal[it.name] = it.defaultValue
                            counter++
                            if(counter===nObjectList.length)
                                setGlobal(newGlobal)
                    });
                } catch(ex){
                    newGlobal[it.name] = it.defaultValue
                    counter++
                    if(counter===nObjectList.length) {
                        setGlobal(newGlobal)
                    }
                }
            })
        }
        loadNativeStorage(nObjects)
    }

    addCallback(global => {
     writeStorage(global)
    });
}

export default initStorage
