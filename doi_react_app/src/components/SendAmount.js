import React, { useGlobal, useState } from "reactn"
import Slide from "@material-ui/core/Slide"
import Button from "@material-ui/core/Button"
import InputLabel from "@material-ui/core/InputLabel"
import FormControl from "@material-ui/core/FormControl"
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner"
import { useTranslation } from "react-i18next"
import UnlockPasswordDialog from "./UnlockPasswordDialog";
import Input from "@material-ui/core/Input"
import FormHelperText from "@material-ui/core/FormHelperText"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import {createAndSendTransaction} from "doichain";

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
            const our_wallet = wallets[activeWallet]
            const sendSchwartz = satoshi ? Number(openUnlock.amount) : Number(openUnlock.amount)*100000000
            await createAndSendTransaction(decryptedSeedPhrase,password,sendSchwartz,openUnlock.toAddress,our_wallet)
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
                            <div>
                                <Button
                                    color={"secondary"}
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
                                        color={"secondary"}
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
