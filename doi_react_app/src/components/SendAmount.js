import React, { useGlobal } from "reactn"
import { Formik } from "formik"
import Slide from "@material-ui/core/Slide"
import Button from "@material-ui/core/Button"
import InputLabel from "@material-ui/core/InputLabel"
import ProgressButton from "react-progress-button"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import FormControl from "@material-ui/core/FormControl"
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner"
import { useTranslation } from "react-i18next"
import {createHdKeyFromMnemonic, getUnspents, sendToAddress, updateWalletWithUnconfirmedUtxos} from "doichain";
import UnlockPasswordDialog from "./UnlockPasswordDialog";


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

    const vibration = () => {
        let time = 500;
        navigator.vibrate(time);
     }

    const sendDoiToAddress = async (decryptedSeedPhrase,password) => {

        try {
            const hdKey = createHdKeyFromMnemonic(decryptedSeedPhrase,password)

            const amount = Number(openUnlock.amount)
            const destAddress = openUnlock.toAddress
            console.log("sending " + amount + " to ", destAddress)
            const our_wallet = wallets[activeWallet]
            let selectedInputs = getUnspents(our_wallet)
            console.log('selectedInputs', selectedInputs)
            const changeAddress = our_wallet.addresses[0].address //TODO please implement getNewChangeAddress
            let walletKey = hdKey.derive(our_wallet.derivationPath)
            let txResponse = await sendToAddress(walletKey, destAddress, changeAddress, amount, selectedInputs)     //chai.expect(addressesOfBob[0].address.substring(0,1)).to.not.be.uppercase
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
                                <Formik
                                    initialValues={{ toAddress: "", amount: 0 }}
                                    validate={values => {
                                        let errors = {}
                                        /*     if (!values.email) {
                                        errors.email = 'Required';
                                    } else if (
                                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                    ) {
                                        errors.email = 'Invalid email address';
                                    } */
                                        return errors
                                    }}
                                    onSubmit={async (values, { setSubmitting }) => {
                                        setButtonState("loading")
                                        setSubmitting(true)
                                        console.log("submitting values", values) //here we are just using the global (since the changeHandle do not fire
                                        //TODO toAddress is for some reason never transmitted we are using qrCode here as a fallback
                                        setOpenUnlock({
                                            toAddress: values.toAddress ? values.toAddress : qrCode,
                                            amount: values.amount}
                                            )
                                       /* sendDoiToAddress(
                                            values.toAddress ? values.toAddress : qrCode,
                                            values.amount
                                        ) */
                                    }}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting
                                    }) => (
                                        <form onSubmit={handleSubmit}>
                                            <QRCodeScannerTextField
                                                label={t("sendAmount.doichainAddress")}
                                                urlPrefix={"doicoin:"}
                                                name={"toAddress"}
                                                handleChange={handleChange}
                                                handleBlur={handleBlur}
                                                errors={errors}
                                                touched={touched}
                                            />

                                            <br></br>

                                            <div>
                                                <FormControl fullWidth variant="outlined">
                                                    <InputLabel htmlFor="outlined-adornment">
                                                        {t("sendAmount.amount")}
                                                    </InputLabel>
                                                    <OutlinedInput
                                                        id="amount"
                                                        name="amount"
                                                        type={"text"}
                                                        margin={"none"}
                                                        fullWidth={true}
                                                        labelWidth={110}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                </FormControl>
                                                {errors.position &&
                                                    touched.position &&
                                                    errors.position}
                                            </div>
                                            <br></br>
                                            <ProgressButton
                                                type="submit"
                                                color={"primary"}
                                                id="sendAmount"
                                                state={global.buttonState}
                                                disabled={isSubmitting}
                                            >
                                                {t("sendAmount.sendDoi")}
                                            </ProgressButton>
                                        </form>
                                    )}
                                </Formik>
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
