import React, { useGlobal, useEffect, useState } from "reactn"
import bitcore from "bitcore-doichain"

import TransactionList from "./TransactionList"
import { CopyToClipboard } from "react-copy-to-clipboard"
import FileCopyIcon from "@material-ui/icons/FileCopy"

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
    const [address, setAddress] = useState("")
    const [balance, setBalance] = useState(0)

    const [unconfirmedBalance, setUnconfirmedBalance] = useState(0)
    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")
    const [utxos] = useGlobal("utxos")
    const setOpenSnackbar = useGlobal("errors")[1]

    /**
     * - connects to a Doichain node and requests utxos (and balances)
     * - it sums up "offchain" (unconfirmed) utxos and puts it to the wallets balance.
     * - it sets the balance of each address
     *
     * TODO this looks like it needs refactoring(!)
     *
     * @returns {Promise<void>}
     */
    const fetchBalanceData = async address => {
        try {
            const currentWallet = wallets[activeWallet]
            const response = await bitcore.getUTXOAndBalance(
                address.toString(),
                0
            )
            console.log("getUTXOAndBalance response", response)
            let balanceAllUTXOs = response.balanceAllUTXOs //contains all other existing utoxs from blockchain plus unconfirmed utxos
            let unconfirmedUTXOs = 0
            // if we have offchain utxos then add them to the returned balance from Doichain node
            if (utxos && utxos.utxos && utxos.utxos.length > 0) {
                utxos.utxos.forEach(utxo => {
                    if (utxo.address === address && utxo.amount > 0)
                        unconfirmedUTXOs += utxo.amount
                })
            }
            let currentWalletBalance = 0
            if (
                currentWallet.addresses === undefined ||
                currentWallet.addresses.length === 0
            )
                currentWallet.addresses = [{ address: address }]

            let currentAddresses = currentWallet.addresses
            for (let x = 0; x < currentAddresses.length; x++) {
                if (currentAddresses[x].address === address) {
                    currentAddresses[x].balance = balanceAllUTXOs
                    currentWalletBalance += currentAddresses[x].balance
                }
            }
            wallets[activeWallet].addresses = currentAddresses
            wallets[activeWallet].balance = currentWalletBalance
            wallets[activeWallet].unconfirmedBalance = unconfirmedBalance

            return {
                wallets: wallets,
                balance: Number(balanceAllUTXOs).toFixed(8),
                unconfirmedBalance: Number(unconfirmedUTXOs).toFixed(8)
            }
            //}
        } catch (ex) {
            console.log("error while fetching utxos from server", ex)
            return undefined
        }
    }

    useEffect(() => {
        if (publicKey && !balance) {
            const generatedAddress = bitcore
                .getAddressOfPublicKey(publicKey)
                .toString()
            setAddress(generatedAddress)
            console.log(
                "fetching balance for wallet from node",
                generatedAddress
            )
            fetchBalanceData(generatedAddress).then(retBalanceData => {
                if (retBalanceData) {
                    setWallets(retBalanceData.wallets)
                    setBalance(retBalanceData.balance)
                    if (retBalanceData.balance === balance)
                        setUnconfirmedBalance(0)
                    //reset unconfirmedBalance in case balance from Node is the same as here
                    else
                        setUnconfirmedBalance(retBalanceData.unconfirmedBalance)
                }
            })
        }
    }, [address]) //only recalculate when address changes.

    if (!publicKey) return null
    else
        return (
            <div>
                <li style={{ fontSize: "9px" }}>
                    DoiCoin-Address: <br />
                    <b>
                        {address ? address.toString() : ""}{" "}
                        <CopyToClipboard
                            text={address ? address.toString() : ""}
                            onCopy={() =>
                                setOpenSnackbar({
                                    open: true,
                                    msg: "copied",
                                    type: "success"
                                })
                            }
                        >
                            <FileCopyIcon color={"primary"}></FileCopyIcon>
                        </CopyToClipboard>
                    </b>
                    <br />
                    Balance: {balance} DOI{" "}
                    {unconfirmedBalance && unconfirmedBalance > 0
                        ? "(unconfirmed:" + unconfirmedBalance + " DOI) "
                        : ""}
                </li>
                <br />
                <div style={{ fontSize: "9px", border: "2px solid lightgrey" }}>
                    <label htmlFor={"senderEmail"}>Email: </label>
                    {senderEmail}
                    <br />
                    <label htmlFor={"subject"}></label>Subject: {subject}
                    <br />
                    <label htmlFor={"content"}></label>Content: {content}
                    <br />
                    <label htmlFor={"contentType"}></label>Content-Type:{" "}
                    {contentType}
                    <br />
                    <label htmlFor={"redirectUrl"}></label>Redirect-Url:{" "}
                    {redirectUrl}>
                    <br />
                    {/* <label htmlFor={"returnPath"}></label>Return-Path: {returnPath}<br/> */}
                    <b>
                        PubKey:
                        <input
                            type={"text"}
                            readOnly={true}
                            defaultValue={publicKey}
                            size={40}
                        />
                    </b>
                    <br />
                </div>
                <div>
                    <TransactionList address={address} />
                </div>
            </div>
        )
}

export default WalletItem
