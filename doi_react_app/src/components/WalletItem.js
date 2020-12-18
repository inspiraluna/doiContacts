import NativeSelect from "@material-ui/core/NativeSelect"
import { constants, getBalanceOfWallet } from "doichain"
import { useTranslation } from "react-i18next"
import React, { useEffect, useGlobal, useState } from "reactn"
import TransactionList from "./TransactionList"
const bitcoin = require('bitcoinjs-lib')


const WalletItem = ({ senderName, senderEmail, subject, content, publicKey, contentType, redirectUrl }) => {

    const setAddress = useState("")[1]
    const [addressOptions, setAddressOptions] = useState([])
    const [balance, setBalance] = useGlobal("balance")
    const [unconfirmedBalance] = useState(0)

    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")
    const [t] = useTranslation()
    const [satoshi, setSatoshi] = useGlobal("satoshi")

    useEffect( () => {

        async function fetchData() {
            const addressList = []
            setAddressOptions(
                wallets[activeWallet].addresses.map((addr, i) => {
                    addressList.push(addr.address)
                    return (
                        <option key={addr.address} value={addr.address} id={i}>
                            {addr.address} {addr.derivationPath} DOI:{addr.balance}
                        </option>
                    )
                })
            )
            setAddress(addressList[0])

            const ourWallets = wallets
            const ourActiveWallet = activeWallet
            const balanceObj = await getBalance(ourActiveWallet, ourWallets)
            if (balanceObj && balanceObj.balance !== balance) {
                setWallets(balanceObj.wallets)
                setBalance(balanceObj.balance)
            }
        }
        fetchData()
    }, [])

        return (
            <div>
                <li style={{ fontSize: "15px" }}>
                    <b> {t("walletItem.doiCoinAddress")} </b>
                    <NativeSelect id="doiCoinAddress" onChange={e => setAddress(e.target.value)}>
                       {addressOptions}
                    </NativeSelect>
                    <br />
                    <b>{t("walletItem.balance")}</b>{" "}  
                    <span id="balance" onClick={() => setSatoshi(!satoshi)}>{JSON.parse(satoshi) ? constants.toSchwartz(balance) : Number(balance).toFixed(8)}</span>{" "} 
                    <span onClick={() => setSatoshi(!satoshi)} id="walletCurrency">{JSON.parse(satoshi) ? "schw" : "DOI"}</span>
                    <span id="unconfirmedBalance">
                        {unconfirmedBalance && unconfirmedBalance > 0
                            ? t("walletItem.unconfirmed") + unconfirmedBalance + " DOI)"
                            : ""}
                    </span>
                </li>
                <br />
                <div style={{ fontSize: "15px", border: "2px solid lightgrey" }}>
                    <label htmlFor={"senderName"}></label>
                    <div id="senderName">
                        <b>{t("walletItem.name")}</b> {senderName}
                    </div>
                    <br />
                    <label htmlFor={"senderEmail"}></label>
                    <div id="sentEmail">
                        <b>{t("walletItem.email")}</b> {senderEmail}
                    </div>
                    <br />
                    <label htmlFor={"subject"}></label>
                    <div id="subj">
                        <b>{t("walletItem.subject")}</b> {subject}
                    </div>
                    <br />
                    <label htmlFor={"content"}></label>
                    <div id="content">
                        <b>{t("walletItem.content")}</b> {content}
                    </div>
                    <br />
                    <label htmlFor={"contentType"}></label>
                    <div>
                        <b>{t("walletItem.contentType")}</b> {contentType}
                    </div>
                    <br />
                    <label htmlFor={"redirectUrl"}></label>
                    <div id="redUrl">
                        <b>{t("walletItem.redirectUrl")}</b> {redirectUrl}
                    </div>
                    <br />
                    {/* <label htmlFor={"returnPath"}></label>Return-Path: {returnPath}<br/> */}
                </div>
                <div>
                    <TransactionList addresses={wallets[activeWallet].addresses}/>
                </div>
            </div>
        )
}

export const getBalance = async (activeWallet,wallets) => {

    if(activeWallet===undefined || wallets===undefined || wallets.length===0) return
 
    let xPubKey = bitcoin.bip32.fromBase58(wallets[activeWallet].publicExtendedKey);
    const balanceObj = await getBalanceOfWallet(xPubKey,'m/'+activeWallet+'/0/0')
    console.log(balanceObj)

    //take all addresses from response and sort it into local addresses
    balanceObj.addresses.forEach( addr => {
        let found = false
        for(let i = 0;i<=wallets[activeWallet].addresses.length;i++){
            const thisAddress = wallets[activeWallet].addresses[i]
            if(thisAddress && thisAddress.address===addr.address){
                wallets[activeWallet].addresses[i] =  addr
                found=true
                break
            }
        }
        if(!found){
            wallets[activeWallet].addresses.push(addr)
        }
    })
    const tempWallets = wallets
    if(wallets[activeWallet].balance!==balanceObj.balance){
        const tempWallet = wallets[activeWallet]
        tempWallet.balance = balanceObj.balance
        tempWallets[activeWallet] = tempWallet
    }
    
    return {balance: balanceObj.balance, wallets: tempWallets}
}


export default WalletItem
