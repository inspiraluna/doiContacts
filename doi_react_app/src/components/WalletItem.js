import React, {useEffect, useState, setState} from 'react';
import bitcore from "bitcore-doichain";
import {useGlobal} from "reactn";

const WalletItem = ({
                        walletName,
                        senderEmail,
                        subject,
                        content,
                        publicKey,
                        contentType,
                        redirectUrl,
                        returnPath
                    }) => {

    const [address, setAddress] = useState()
    const [balance, setBalance] = useState(0)
    const [unconfirmedBalance, setUnconfirmedBalance] = useState(0)
    const [wallets, setWallets] = useGlobal("wallets")
    const [utxos, setUTXOs] = useGlobal("utxos")
    const [global] = useGlobal()

    useEffect(() => {
        //TODO this looks like it needs refactoring
        async function fetchData() {
            bitcore.Networks.defaultNetwork = bitcore.Networks.get('doichain-testnet')
            try {
                const address = bitcore.getAddressOfPublicKey(publicKey).toString()
                console.log('fetching from Doichain node...')
                const response = await bitcore.getUTXOAndBalance(address.toString())

                // balance of the change address (could be 0 after tx,
                // could also coutain a number bigger then 0 in case there are other utxos in the wallet!
                let balanceAllUTXOs = response.balanceAllUTXOs
                let unconfirmedUTXOs = 0
                // if we have offchain utxos then add them to the returned balance from Doichain node

                if(utxos && utxos.utxos && utxos.utxos.length>0){
                    utxos.utxos.forEach((utxo) => {
                        if(utxo.address===address && utxo.amount>0){
                            balanceAllUTXOs+=utxo.amount
                            unconfirmedUTXOs+=utxo.amount
                        }
                    })
                }
                setUnconfirmedBalance(Number(unconfirmedUTXOs).toFixed(8))

                const currentWallet = wallets[global.activeWallet]

                let currentWalletBalance = 0
                let currentAddresses = currentWallet.addresses
                let somethingWasUpdated = false
                if (currentAddresses === undefined) currentAddresses = []
                else {
                    let found = false;
                    //go through all adresses of this wallet and set balance from blockchain
                    for (let x = 0; x < currentAddresses.length; x++) {
                        if (currentAddresses[x].address = address) {
                            found = true
                            if (currentAddresses[x].balance !== balanceAllUTXOs) {
                                currentAddresses[x].balance = balanceAllUTXOs
                                somethingWasUpdated = true //so re-render otherwise no!
                            }
                            currentWalletBalance += currentAddresses[x].balance
                        }
                    }
                    if (!found) {
                        console.log('couldnt find address pushing it with new balance', address)
                        currentAddresses.push({address: address, balance: balanceAllUTXOs})
                        somethingWasUpdated = true
                    }
                }

                wallets[global.activeWallet].addresses = currentAddresses
                wallets[global.activeWallet].balance = currentWalletBalance
                setBalance(Number(balanceAllUTXOs).toFixed(8))

                if (somethingWasUpdated) setWallets(wallets) //so re-render
                setAddress(address)
                //console.log(wallets)
            } catch (ex) {
                console.log("error while fetching utxos from server", ex)
            }
        }

        if (publicKey && !balance) fetchData(); //generates a Doichain address */

    }, [balance])

    console.log('rerender WalletItem')

    if (!publicKey) return null
    else
        return (
            <div>
                <li style={{"fontSize": "9px"}}>
                    DoiCoin-Address: <br/>
                    <b>{(address) ? address.toString() : ''}</b><br/>
                    Balance: {balance} DOI {(unconfirmedBalance && unconfirmedBalance>0)?'(unconfirmed:'+unconfirmedBalance+' DOI) ':''}
                </li>
                <br/>
                <div style={{"fontSize": "9px", "border": '2px solid lightgrey'}}>
                    <label htmlFor={"senderEmail"}>Email: </label>{senderEmail}<br/>
                    <label htmlFor={"subject"}></label>Subject: {subject}<br/>
                    <label htmlFor={"content"}></label>Content: {content}<br/>
                    <label htmlFor={"contentType"}></label>Content-Type: {contentType}<br/>
                    <label htmlFor={"redirectUrl"}></label>Redirect-Url: {redirectUrl}><br/>
                    {/* <label htmlFor={"returnPath"}></label>Return-Path: {returnPath}<br/> */}
                    <b>PubKey:<input type={"text"} readOnly={true} defaultValue={publicKey} size={40}/></b><br/>
                </div>
            </div>
        )
}

export default WalletItem
