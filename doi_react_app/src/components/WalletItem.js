import React, { useGlobal, useEffect, useState } from "reactn"

import TransactionList from "./TransactionList"
import { CopyToClipboard } from "react-copy-to-clipboard"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import { useTranslation } from "react-i18next"
import {getBalanceOfAddresses} from "doichain"
import NativeSelect from "@material-ui/core/NativeSelect"

const WalletItem = ({ senderName, senderEmail, subject, content, publicKey, contentType, redirectUrl }) => {

    const [address, setAddress] = useState("")
    const [addressOptions, setAddressOptions] = useState([])
    const [balance, setBalance] = useState(0)
    const [unconfirmedBalance, setUnconfirmedBalance] = useState(0)

    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")
    const setOpenSnackbar = useGlobal("errors")[1]
    const [t] = useTranslation()

    useEffect( () => {
        const getBalance = async () => {
            const addressList = []
            setAddressOptions(wallets[activeWallet].addresses.map((addr, i) => {
                addressList.push(addr.address)
                return <option value={addr.address}>{addr.address} DOI:{addr.balance}</option>
            })
            )
            setAddress(addressList[0])
            const newBalance = await getBalanceOfAddresses(addressList)
            if(wallets[activeWallet].balance!==newBalance.balance){
                const tempWallet = wallets[activeWallet]
                tempWallet.balance = newBalance.balance
                const tempWallets = wallets
                tempWallets[activeWallet] = tempWallet
                setWallets(tempWallets)
            }
            setBalance(newBalance.balance)
        }
        getBalance()
    }, [])

    const vibration = () => {
        let time = 500;
        navigator.vibrate(time);
    }

        return (
            <div>
                <li style={{ fontSize: "15px" }}>
                    <b> {t("walletItem.doiCoinAddress")} </b>
                    <NativeSelect
                    id="doiCoinAddress"
                    onChange={e => setAddress(e.target.value)}
                >
                   {addressOptions}
                </NativeSelect>
                    <CopyToClipboard
                        text={address ? address.toString() : ""}
                        onCopy={() => {
                            setOpenSnackbar({
                                open: true,
                                msg: t("walletItem.doiCoinAddressCopied"),
                                type: "success"
                            })
                            vibration()}
                        }
                    >
                        <FileCopyIcon color={"primary"} id="copy"></FileCopyIcon>
                    </CopyToClipboard>
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
                <div><TransactionList /></div>
            </div>
        )
}

export default WalletItem
