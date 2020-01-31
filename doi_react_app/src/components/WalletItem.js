import React, { useGlobal, useEffect, useState } from "reactn"
import bitcore from "bitcore-doichain"

import TransactionList from "./TransactionList"
import { CopyToClipboard } from "react-copy-to-clipboard"
import FileCopyIcon from "@material-ui/icons/FileCopy"

const WalletItem = ({
                        senderEmail,
                        subject,
                        content,
                        publicKey,
                        contentType,
                        redirectUrl
                    }) => {

    const [address, setAddress] = useState('')
    const [balance, setBalance] = useState(0)

    const [unconfirmedBalance, setUnconfirmedBalance] = useState(0)
    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")
    const [utxos,setUTXOs] = useGlobal("utxos")
    const setOpenSnackbar = useGlobal("errors")[1]
    const [block, setBlock] = useGlobal("block")

    useEffect(() => {

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
                const response = await bitcore.getUTXOAndBalance(address.toString(),0)
                console.log("getUTXOAndBalance response block:"+ response.block,response)
                const block = response.block
                let balanceAllUTXOs = response.balanceAllUTXOs //contains all other existing utoxs from blockchain plus unconfirmed utxos
                let unconfirmedUTXOsBalance = 0
                // if we have offchain utxos then add them to the returned balance from Doichain node
                console.log('working with current offchain utxos',utxos)
                const utxoRounds = utxos
                if(utxoRounds && utxoRounds.length>0){
                    utxoRounds.forEach((utxoRound) => {
                        console.log('utxoRound',utxoRound)
                        utxoRound.utxos.forEach((utxo) => {
                            console.log('adding utxo.amount to unconfirmedUTXOsBalance'+unconfirmedUTXOsBalance,utxo.amount)
                            if(utxo.address===address && utxo.amount>0)
                                unconfirmedUTXOsBalance+=utxo.amount
                        })
                    })
                    setUnconfirmedBalance(unconfirmedUTXOsBalance)
                }

                let currentWalletBalance = 0
                if (currentWallet.addresses === undefined ||  currentWallet.addresses.length===0)
                    currentWallet.addresses = [{address:address}]

                let currentAddresses = currentWallet.addresses
                for (let x = 0; x < currentAddresses.length; x++) {
                    if (currentAddresses[x].address === address) {
                        currentAddresses[x].balance = balanceAllUTXOs
                        currentWalletBalance += currentAddresses[x].balance
                    }
                }

                wallets[activeWallet].block = block
                wallets[activeWallet].addresses = currentAddresses
                wallets[activeWallet].balance = currentWalletBalance
                wallets[activeWallet].unconfirmedBalance = unconfirmedUTXOsBalance
                console.log('unconfirmedBalance now',unconfirmedUTXOsBalance)
                return {
                    block: block,
                    wallets: wallets,
                    balance: Number(balanceAllUTXOs).toFixed(8),
                    unconfirmedBalance: Number(unconfirmedUTXOsBalance).toFixed(8),
                }
                //}
            } catch (ex) {
                console.log("error while fetching utxos from server", ex)
                return undefined
            }
        }

        if (publicKey && !balance) {
            const network = bitcore.Networks.get('doichain') //TODO get this from global state in case we have testnet or regest
            const generatedAddress = bitcore
                .getAddressOfPublicKey(publicKey,network)
                .toString()
            setAddress(generatedAddress)
            console.log('fetching balance for wallet from node',generatedAddress)
            fetchBalanceData(generatedAddress).then((retBalanceData)=>{
                console.log("retBalanceData",retBalanceData)
                if(retBalanceData){
                    setWallets(retBalanceData.wallets)
                    console.log('retBalanceData.balance ',retBalanceData.balance)
                    console.log('retBalanceData.unconfirmedBalance ',retBalanceData.unconfirmedBalance)
                    //if(retBalanceData.balance==balance)
                      //  setUnconfirmedBalance(0) //reset unconfirmedBalance in case balance from Node is the same as here
                    setUnconfirmedBalance(retBalanceData.unconfirmedBalance)
                    setBalance(retBalanceData.balance)

                    if(block !== retBalanceData.block) setUTXOs(undefined) //reset utxos for new block
                    setBlock(retBalanceData.block)

                }else {
                    console.log('no retBalanceData for ',generatedAddress)
                   // setUnconfirmedBalance(retBalanceData.unconfirmedBalance)
                }
            })
        }
    }, [publicKey, balance, setWallets, block, setUTXOs, setBlock, activeWallet, utxos, wallets]) //[address] only recalculate when address changes.

    if (!publicKey) return null
    else
        return (
            <div>
                <li style={{"fontSize": "9px"}}>
                    DoiCoin-Address: <br/>
                    <b>{address ? address.toString() : ""}{" "}
                        <CopyToClipboard
                            text={address ? address.toString() : ""}
                            onCopy={() =>
                                setOpenSnackbar({
                                    open: true,
                                    msg: "Doichain address copied to clipboard",
                                    type: "success"
                                })
                            }
                        ><FileCopyIcon color={"primary"}></FileCopyIcon></CopyToClipboard>
                    </b>
                    <br />
                    <b>Balance: {balance} DOI {(unconfirmedBalance && unconfirmedBalance>0)?'(unconfirmed:'+unconfirmedBalance+' DOI) ':''}</b><br/>
                    <b>Block: {wallets[0].block}</b>
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
                <div>{address?<TransactionList address={address}/>:''}</div>
            </div>
        )
}

export default WalletItem
