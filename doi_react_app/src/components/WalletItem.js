import React, { useGlobal, useEffect, useState } from "reactn"

import TransactionList from "./TransactionList"
import { CopyToClipboard } from "react-copy-to-clipboard"
import FileCopyIcon from "@material-ui/icons/FileCopy"
import { useTranslation } from "react-i18next"

const WalletItem = ({ senderName, senderEmail, subject, content, publicKey, contentType, redirectUrl }) => {
    const [address, setAddress] = useState("")
    const [balance, setBalance] = useState(0)
    const [unconfirmedBalance, setUnconfirmedBalance] = useState(0)

    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")
    const [utxos, setUTXOs] = useGlobal("utxos")
    const setOpenSnackbar = useGlobal("errors")[1]
    const [block, setBlock] = useGlobal("block")
    const [t] = useTranslation()

    useEffect( () => {
        const getBalance = async () => {
            setBalance(wallets[activeWallet].balance)
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
                    <span id="address">{address ? address.toString() : ""}</span>
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
