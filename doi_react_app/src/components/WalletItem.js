import React, {useEffect,useState,setState } from 'react';
import bitcore from "bitcore-doichain";
import QRCode from 'qrcode-react'

const WalletItem = ({   walletName,
                        senderEmail,
                        subject,
                        content,
                        publicKey,
                        contentType,
                        redirectUrl,
                        returnPath}) => {

    const [balance, setBalance] = useState(0)
    const [address, setAddress] = useState()

    let fetched = false

    useEffect( () => {
         async function fetchData(){
             bitcore.Networks.defaultNetwork =  bitcore.Networks.get('doichain-testnet')
             const address = bitcore.getAddressOfPublicKey(publicKey).toString()

             try{
                 if(address){
                     console.log('fetching data for address',address)
                     const response = await bitcore.getUTXOAndBalance(address.toString())
                     console.log("response",response)
                     const balanceAllUTXOs = response.balanceAllUTXOs
                     setBalance(balanceAllUTXOs)
                     fetched=true
                 }
             }catch(Exception){
                 console.log("error while fetching utxos from server",publicKey)
             }
             setAddress(address)
         }
         if(publicKey) fetchData(); //generates a Doichain address
     },[fetched])

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
                    <table>
                        <tbody>
                            <tr>
                                <td><QRCode value={"doicoin:"+((address)?address.toString():'')} /><br/></td>
                                <td>
                                    <label htmlFor={"walletName"}>Wallet: </label>{walletName}<br/>
                                    <label htmlFor={"senderEmail"}>Email: </label>{senderEmail}<br/>
                                    <label htmlFor={"subject"}></label>Subject: {subject}<br/>
                                    <label htmlFor={"content"}></label>Content: {content}<br/>
                                    <label htmlFor={"contentType"}></label>Content-Type: {contentType}<br/>
                                    <label htmlFor={"redirectUrl"}></label>Redirect-Url: {redirectUrl}><br/>
                                    <label htmlFor={"returnPath"}></label>Return-Path: {returnPath}<br/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                   <b>PubKey:<input type={"text"} readOnly={true} defaultValue={publicKey} size={40}/></b><br/>
            </div>
        </div>
        )
}

export default WalletItem
