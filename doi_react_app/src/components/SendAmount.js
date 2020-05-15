import React, { useGlobal, useState } from "reactn"
import Slide from "@material-ui/core/Slide"
import Button from "@material-ui/core/Button"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner"
import { useTranslation } from "react-i18next"
import {createHdKeyFromMnemonic, getUnspents, sendToAddress, updateWalletWithUnconfirmedUtxos} from "doichain";
import UnlockPasswordDialog from "./UnlockPasswordDialog";
import Input from "@material-ui/core/Input"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import {network} from "doichain";
const bitcoin = require('bitcoinjs-lib')
var GLOBAL = global || window;

const SendAmount = () => {

    const [activeWallet] = useGlobal("activeWallet")
    const [wallets] = useGlobal("wallets")
    const setOpenError = useGlobal("errors")[1]
    const setButtonState = useGlobal("buttonState")[1]
    const [modus, setModus] = useGlobal("modus")
    const [scanning] = useGlobal("scanning")
    const [qrCode] = useGlobal("qrCode")
    const [t] = useTranslation()
    const [openUnlock, setOpenUnlock] = useGlobal("openUnlock")
    const [error, setError] = useState()
    const [amount, setAmount] = useState()
    const [toAddress, setToAddress] = useState()
    const [disable, setDisable] = useState(false)
    const [satoshi, setSatoshi] = useState(true)


    const vibration = () => {
        let time = 500;
        navigator.vibrate(time);
     }

    const sendDoiToAddress = async (decryptedSeedPhrase,password) => {

        try {
            const hdKey = createHdKeyFromMnemonic(decryptedSeedPhrase,password)

            const sendSatoshis = satoshi ? Number(openUnlock.amount) : Number(openUnlock.amount)*100000000
            const destAddress = openUnlock.toAddress
            console.log("sending " + sendSatoshis + " to ", destAddress)
            const our_wallet = wallets[activeWallet]
            let selectedInputs = getUnspents(our_wallet) //TODO don't take all unspents - only as much you need
            if(selectedInputs.length===0){
                const err = t("sendAmount.broadcastingError")
                setOpenError({ open: true, msg: err, type: "error" })
                setButtonState("error")
            }

            //Collect addressKeys (privateKeys) from currently used inputs (to prepare signing the transaction)
            let addressKeys = []
            selectedInputs.forEach((ourUTXO) => {
                for (let i = 0; i < our_wallet.addresses.length; i++){
                    if(our_wallet.addresses[i].address===ourUTXO.address){
                        const addressDerivationPath = our_wallet.addresses[i].derivationPath
                        const addressKey = hdKey.derive(addressDerivationPath)
                        addressKeys.push(addressKey)
                        break
                    }
                }
            })

            console.log("addressKeys",addressKeys)
            let changeAddress //= our_wallet.addresses[0].address //TODO please implement getNewChangeAddress

            //1. get last change addresses from wallet and check if it has transactions
            let lastAddressIndex = 0
            for(let i = 0;i<our_wallet.addresses.length;i++){

                const addr = our_wallet.addresses[i]
                console.log('checking change addresses for transactions',addr)

                if(addr.derivationPath.split('/')[2] === 1 && addr.transactions.length>0)
                    lastAddressIndex = addr.derivationPath.split('/')[3]

                if(addr.derivationPath.split('/')[2] === 1 && addr.transactions.length===0){
                    changeAddress = addr.address
                    console.log('found change address in wallet without transactions',changeAddress)
                    break;
                }
            }
            //2. if there was no changeAddress found derive a new one
            if(!changeAddress){
                const nextAdddressIndex = Number(lastAddressIndex)+1
                console.log("couldn't find unused change address in wallet derivating next one with index",nextAdddressIndex)
                const addressDerivationPath = 'm/'+activeWallet+'/1/'+nextAdddressIndex
                const xpub = our_wallet.publicExtendedKey
                let childKey0FromXpub = bitcoin.bip32.fromBase58(xpub);
                changeAddress = bitcoin.payments.p2pkh(
                    { pubkey: childKey0FromXpub.derivePath(addressDerivationPath).publicKey,
                        network: GLOBAL.DEFAULT_NETWORK}).address
                console.log('derivated change address',changeAddress)
            }


            // getAddress(our_wallet.publicKey) (derivationElements.length!==2)?xpub.derivePath(newDerivationPath).publicKey:xpub.publicKey,network


            let txResponse = await sendToAddress(addressKeys, destAddress, changeAddress, sendSatoshis, selectedInputs)     //chai.expect(addressesOfBob[0].address.substring(0,1)).to.not.be.uppercase
            updateWalletWithUnconfirmedUtxos(txResponse,our_wallet)
            console.log('new wallet data please update global state!',our_wallet)

            const msg = t("sendAmount.broadcastedDoicoinTx")
            setOpenError({ open: true, msg: msg, type: "success" })
            vibration()
            setButtonState("success")
            setModus("detail")
        } catch (ex) {
            const err = t("sendAmount.broadcastingError") + ex
            console.log(err, ex)
            setOpenError({ open: true, msg: err, type: "error" })
            setButtonState("error")
        }
    }

    const address = wallets[activeWallet].addresses[0].address
    const walletName = wallets[activeWallet].walletName
    const balance = Number(wallets[activeWallet].balance).toFixed(8)
    return (
        <div>
            <Slide
                aria-label="wallet-send"
                direction={"up"}
                in={activeWallet !== undefined && modus === "send"}
                mountOnEnter
                unmountOnExit
            >
                <div>
                    <QRCodeScannerContents
                        scanning={scanning}
                        render={
                            <div style={{ backgroundColor: "white" }}>
                                <Button
                                    color={"primary"}
                                    variant="contained"
                                    id="back"
                                    onClick={() => setModus("detail")}
                                >
                                    {t("button.back")}
                                </Button>
                                <br />
                                <br />
                                <h1>{walletName} </h1>
                                <span id="sendDoi">{t("sendAmount.sendFromAddress")}</span> <br />
                                <b>{address}</b> <br />
                                {t("sendAmount.balance")} {balance} DOI
                                <br></br>
                                <br />
                                    <QRCodeScannerTextField
                                        label={t("sendAmount.doichainAddress")}
                                        urlPrefix={"doicoin:"}
                                        name={"toAddress"}
                                        onChange={(e) => {
                                            const ourAddress = e.target.value
                                            setToAddress(ourAddress)
                                            if (!ourAddress) {
                                                setError(t("sendAmount.addressMissing"))
                                                setDisable(true)
                                            } else {
                                                setError(undefined)
                                                setDisable(false)
                                            }
                                        }}
                                    />
                                    <br></br>
                                    <FormControl fullWidth error={error ? true : false}>
                                        <InputLabel htmlFor="standard-adornment-password">
                                            {t("sendAmount.amount")}
                                        </InputLabel>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            value={amount || ''}
                                            fullWidth
                                            autoFocus={true}
                                            onChange={(e) => {
                                                const doiAmount = satoshi?(Number(e.target.value)/100000000):e.target.value
                                                const ourAmount = e.target.value
                                                setAmount(ourAmount)
                                                if(doiAmount > balance){
                                                    setError(t("sendAmount.amountTooBig"))
                                                    setDisable(true)
                                                }
                                                else if(doiAmount <= 0){
                                                    setError(t("sendAmount.amountBiggerThan0"))
                                                    setDisable(true)
                                                }
                                                else {
                                                    setError(undefined)
                                                    setDisable(false)
                                                }
                                            }
                                        }
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    id="toggleCurrency"
                                                    onClick={() => {
                                                        const ourAmount = amount
                                                        setAmount(ourAmount)
                                                        setSatoshi(!satoshi)
                                                    if(satoshi){
                                                        const toDOI = ourAmount / 100000000
                                                        setAmount(toDOI.toFixed(8))
                                                    }
                                                    else {
                                                        const toSatoshi = ourAmount * 100000000
                                                        setAmount(toSatoshi.toFixed(0))
                                                    }
                                                    }}
                                                >
                                                    {satoshi ? "schw" : "DOI"}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        />
                                        <FormHelperText id="component-error-text">
                                            {error}
                                        </FormHelperText>
                                    </FormControl>
                                    <p></p>
                                    <Button
                                        onClick={() => setOpenUnlock({
                                                        toAddress: toAddress ? toAddress : qrCode,
                                                        amount: amount}
                                                        )}
                                        color={"primary"}
                                        id="sendAmount"
                                        variant="contained"
                                        disabled={disable}
                                    >
                                        {t("sendAmount.sendDoi")}
                                    </Button>
                            </div>
                        }
                    />
                </div>
            </Slide>
            <UnlockPasswordDialog callback={sendDoiToAddress} />
        </div>
    )
}

export default SendAmount
