import React, { useGlobal } from "reactn"
import { Formik } from "formik"
import Slide from "@material-ui/core/Slide"
import Button from "@material-ui/core/Button"
import InputLabel from "@material-ui/core/InputLabel"
import ProgressButton from "react-progress-button"
import OutlinedInput from "@material-ui/core/OutlinedInput"
import FormControl from "@material-ui/core/FormControl"
import bitcore from "bitcore-doichain"
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner"
import { useTranslation } from "react-i18next"

const SendAmount = () => {
    const [activeWallet] = useGlobal("activeWallet")
    const [wallets] = useGlobal("wallets")
    const [utxos, setUTXOs] = useGlobal("utxos")
    const setOpenError = useGlobal("errors")[1]
    const setButtonState = useGlobal("buttonState")[1]
    const [modus, setModus] = useGlobal("modus")
    const [scanning] = useGlobal("scanning")
    const [qrCode] = useGlobal("qrCode")
    const [t] = useTranslation()

    const handleSendTransaction = async (toAddress, amount) => {
        const network = bitcore.Networks.get("doichain") //TODO get this from global state in case we have testnet or regest

        try {
            console.log("sending " + amount + " to ", toAddress)
            const our_wallet = wallets[activeWallet]
            const ourAddress = bitcore
                .getAddressOfPublicKey(our_wallet.publicKey, network)
                .toString()
            const txData = await bitcore.createDoicoinTransaction(
                ourAddress,
                our_wallet.privateKey,
                toAddress,
                amount,
                utxos
            ) //returns only tx and changeAddress
            console.log("txData", txData)
            const utxosResponse = await bitcore.broadcastTransaction(null, txData.tx)
            console.log("utxosResponse", utxosResponse)
            setUTXOs(utxosResponse)
            bitcore.updateWalletBalance(our_wallet, utxosResponse.balance)
            /*let newUTXOS = utxos
            if(!utxos) newUTXOS = []
            newUTXOS.push(utxosResponse)
            setUTXOs(newUTXOS)  //here are only additional new utxos what about potential old utxos?
            bitcore.updateWalletBalance(our_wallet,utxosResponse.balance)*/

            const msg = t("sendAmount.broadcastedDoicoinTx")
            setOpenError({ open: true, msg: msg, type: "success" })
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
                                        handleSendTransaction(
                                            values.toAddress ? values.toAddress : qrCode,
                                            values.amount
                                        )
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
        </div>
    )
}

export default SendAmount
