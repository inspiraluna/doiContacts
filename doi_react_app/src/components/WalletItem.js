import React, { useGlobal, useEffect, useState } from "reactn"
import TransactionList from "./TransactionList"
import { useTranslation } from "react-i18next"
import {getBalanceOfWallet} from "doichain"
import NativeSelect from "@material-ui/core/NativeSelect"
const bitcoin = require('bitcoinjs-lib')

const WalletItem = ({ senderName, senderEmail, subject, content, publicKey, contentType, redirectUrl }) => {

    const setAddress = useState("")[1]
    const [addressOptions, setAddressOptions] = useState([])
    const [balance, setBalance] = useState(0)
    const [unconfirmedBalance] = useState(0)

    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")
    const [t] = useTranslation()

    useEffect( () => {
        const getBalance = async () => {
            const addressList = []
            setAddressOptions(wallets[activeWallet].addresses.map((addr, i) => {

                addressList.push(addr.address)
                return <option key={addr.address} value={addr.address}>{addr.address} {addr.derivationPath}  DOI:{addr.balance}</option>
            })
            )
            setAddress(addressList[0])

            let xPubKey = bitcoin.bip32.fromBase58(wallets[activeWallet].publicExtendedKey);
            const balanceObj = await getBalanceOfWallet(xPubKey,'m/'+activeWallet+'/0/0')

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
            if(wallets[activeWallet].balance!==balanceObj.balance){
                const tempWallet = wallets[activeWallet]
                tempWallet.balance = balanceObj.balance
                const tempWallets = wallets
                tempWallets[activeWallet] = tempWallet
                setWallets(tempWallets)
            }
            setBalance(balanceObj.balance)
        }
        getBalance()
    }, [])

        return (
            <div>
                <li style={{ fontSize: "15px" }}>
                    <b> {t("walletItem.doiCoinAddress")} </b>
                    <NativeSelect id="doiCoinAddress" onChange={e => setAddress(e.target.value)}>
                        {addressOptions}
                    </NativeSelect>
                    <br />
                    <b>{t("walletItem.balance")}</b> <span id="balance">{balance}</span> DOI{""}
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

export default WalletItem
