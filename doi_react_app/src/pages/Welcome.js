import React, {useGlobal} from "reactn"
import s from "./Welcome.module.css"
import logo from "./logo.jpg"
import Button from "@material-ui/core/Button"


const Welcome = () => {
      const setModus = useGlobal("modus")[1]

      const createNewWallet = e => {
         setModus("createNewWallet")
 }
      const restoreWallet = e => {
          setModus("restoreWallet")
      }
//https://github.com/bitcoinjs/bip39
//https://github.com/cryptocoinjs/hdkey

      //sadness faculty elephant wish polar useless service exhaust century catalog move spin
//Bla12345
/*
const bip39 = require('bip39')
const seed = bip39.mnemonicToSeedSync('sadness faculty elephant wish polar useless service exhaust century catalog move spin', 'Bla12345').toString('hex')
console.log('seed',seed)
//console.log("seeb",'5cf2d4a8b0355e90295bdfc565a022a409af063d5365bb57bf74d9528f494bfa4400f53d8349b80fdae44082d7f9541e1dba2b003bcfec9d0d53781ca676651f')

var HDKey = require('hdkey')
//var seed = 'a0c42a9c3ac6abf2ba6a9946ae83af18f51bf1c9fa7dacc4c92513cc4dd015834341c775dcd4c0fac73547c5662d81a9e9361a0aac604a73a321bd9103bce8af'
var hdkey = HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
console.log(hdkey.privateKey.toString('hex'))
console.log(hdkey.publicKey.toString('hex')) */
 
    return (
        <div className={s.welcomePage}>
            <span >
                <div className={s.welcomeImg}>
                    <img src={logo} />
                <span>
                <div className={s.description}>
                <p>Welcome to DoiContacts</p>
                </div>
                <div className={s.createButton}>
                <Button onClick={createNewWallet} id="createWallet" color="primary">
                    Create a new wallet
                </Button>
               </div>
               <div className={s.restoreButton}>
                <Button color="primary" onClick={restoreWallet} id="restoreWallet">
                    Restore a wallet
                </Button>
                </div>
                </span>
                </div>
            </span>
        </div>
    )
}

 export default Welcome
