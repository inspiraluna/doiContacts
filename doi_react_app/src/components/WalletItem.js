import React, {useEffect,useState,setState } from 'react';
import bitcore from "bitcore-doichain";
import {useGlobal} from "reactn";

const WalletItem = ({   walletName,
                        senderEmail,
                        subject,
                        content,
                        publicKey,
                        contentType,
                        redirectUrl,
                        returnPath}) => {

    const [address, setAddress] = useState()
    const [balance, setBalance] = useState()

    const [wallets, setWallets] = useGlobal("wallets")
    const [global] = useGlobal()

    useEffect( () => {
        async function fetchData(){
             bitcore.Networks.defaultNetwork =  bitcore.Networks.get('doichain-testnet')
             try{
                 const address = bitcore.getAddressOfPublicKey(publicKey).toString()
                 if(address && !balance){
                     console.log('fetching...')
                     const response = await bitcore.getUTXOAndBalance(address.toString())
                     const balanceAllUTXOs = response.balanceAllUTXOs
                     const currentWallet = wallets[global.activeWallet]

                     let currentWalletBalance = 0
                     //currentWallet.balance=balanceAllUTXOs
                     let currentAddresses = currentWallet.addresses
                     let somethingWasUpdated = false
                     if(currentAddresses === undefined) currentAddresses = []
                     else{
                         let found = false;
                         for(let x=0;x<currentAddresses.length;x++){
                             if(currentAddresses[x].address = address){
                                 found=true
                                 if(currentAddresses[x].balance!==balanceAllUTXOs){
                                     currentAddresses[x].balance=balanceAllUTXOs
                                     somethingWasUpdated=true //so re-render otherwise no!
                                 }
                                 currentWalletBalance+=currentAddresses[x].balance
                                 //break;
                             }
                         }
                         if(!found){
                             console.log('couldnt find address pushing it with new balance',address)
                             currentAddresses.push({address:address, balance:balanceAllUTXOs})
                             somethingWasUpdated=true
                         }
                     }
                     wallets[global.activeWallet].addresses = currentAddresses
                     wallets[global.activeWallet].balance = currentWalletBalance
                     setBalance(balanceAllUTXOs)

                     if(somethingWasUpdated) setWallets(wallets) //so re-render
                     setAddress(address)
                     //console.log(wallets)
                 }
             }catch(ex){
                 console.log("error while fetching utxos from server",ex)
             }
         }
        if(publicKey && !balance) fetchData(); //generates a Doichain address */

     },[balance])

    console.log('rerender WalletItem')

    if(!publicKey) return null
    else
    return (

        <div>
            <li style={{"fontSize":"9px"}}>
                <b>{walletName}</b> <br/>
                DoiCoin-Address: <b>{(address)?address.toString():''}</b><br/>
                Balance: {balance} DOI
            </li>
            <div style={{"fontSize":"9px","border":'2px solid lightgrey'}}>

                                    <label htmlFor={"walletName"}>Wallet: </label>{walletName}<br/>
                                    <label htmlFor={"senderEmail"}>Email: </label>{senderEmail}<br/>
                                    <label htmlFor={"subject"}></label>Subject: {subject}<br/>
                                    <label htmlFor={"content"}></label>Content: {content}<br/>
                                    <label htmlFor={"contentType"}></label>Content-Type: {contentType}<br/>
                                    <label htmlFor={"redirectUrl"}></label>Redirect-Url: {redirectUrl}><br/>
                                    <label htmlFor={"returnPath"}></label>Return-Path: {returnPath}<br/>

                   <b>PubKey:<input type={"text"} readOnly={true} defaultValue={publicKey} size={40}/></b><br/>
            </div>
        </div>
        )
}

export default WalletItem
