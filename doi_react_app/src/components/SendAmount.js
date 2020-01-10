import React, {useGlobal} from "reactn";
import {Formik} from "formik";
import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import ProgressButton from "react-progress-button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";
import {broadcastTransaction, createDoicoinTransaction, updateWalletBalance} from "../utils/doichain-transaction-utils";
import  QRCodeScannerContents,{QRCodeScannerTextField } from "./QRCodeScanner";

const SendAmount = () => {

    const [activeWallet, setActiveWallet ] = useGlobal("activeWallet")
    const [wallets,setWallets] = useGlobal("wallets")
    const [utxos, setUTXOs ] = useGlobal("utxos")
    const [ openError, setOpenError ] = useGlobal("errors")
    const [buttonState,setButtonState] = useGlobal("buttonState")
    const [modus, setModus] = useGlobal("modus")
    const [scanning, setScanning] =  useGlobal("scanning")
    const [qrCode, setQRCode] =  useGlobal("qrCode")

    const handleSendTransaction = async (toAddress,amount) => {

        try {
            const our_wallet  =  wallets[activeWallet]
            const txData = await createDoicoinTransaction(our_wallet,toAddress,amount,utxos) //returns only tx and changeAddress
            const utxosResponse = await broadcastTransaction(txData,null)

            let newUTXOS = utxos
            if(!utxos) newUTXOS = []
            newUTXOS.push(utxosResponse)
            setUTXOs(newUTXOS)  //here are only additional new utxos what about potential old utxos?
            updateWalletBalance(our_wallet,utxosResponse.balance)

            const msg = 'Broadcasted Doicoin tx to Doichain node'
            setOpenError({open:true,msg:msg,type:'success'})
            setButtonState('success')
            setModus("detail")

        }catch(ex){
            const err = 'error while broadcasting Doicoin transaction '+ex
            console.log(err,ex)
            setOpenError({open:true,msg:err,type:'error'})
            setButtonState('error')
        }
    }

    const address = wallets[activeWallet].addresses[0].address;
    const walletName = wallets[activeWallet].walletName
    const balance  =  Number(wallets[activeWallet].balance).toFixed(8)
    return (
        <div>
            <Slide aria-label="wallet-send"
                   direction={"up"}
                   in={activeWallet !== undefined && modus === 'send'}
                   mountOnEnter unmountOnExit>
                <div>
                    <QRCodeScannerContents
                        scanning={scanning}
                        render={(<div style={{backgroundColor: 'white'}}>
                            <h1>{walletName} </h1>
                            Send DOI from address: <br/>
                            <b>{address}</b> <br/>
                            Balance {balance} DOI
                            <Formik
                                initialValues={{toAddress: '', amount: 0}}
                                validate={values => {
                                    let errors = {};
                                    /*     if (!values.email) {
                                        errors.email = 'Required';
                                    } else if (
                                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                                    ) {
                                        errors.email = 'Invalid email address';
                                    } */
                                    return errors;
                                }}
                                onSubmit={async (values, {setSubmitting}) => {
                                    setButtonState('loading')
                                    setSubmitting(true);
                                    console.log('submitting values', values) //here we are just using the global (since the changeHandle do not fire
                                    //TODO toAddress is for some reason never transmitted we are using qrCode here as a fallback
                                    handleSendTransaction(values.toAddress?values.toAddress:qrCode, values.amount)
                                }}
                            >

                                {({
                                      values,
                                      errors,
                                      touched,
                                      handleChange,
                                      handleBlur,
                                      handleSubmit,
                                      isSubmitting,
                                  }) => (
                                    <form onSubmit={handleSubmit}>

                                        <QRCodeScannerTextField label={"to Doichain Address"}
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
                                                <InputLabel htmlFor="outlined-adornment">Amount (DOI)</InputLabel>
                                                <OutlinedInput
                                                    id="amount"
                                                    name="amount"
                                                    type={'text'}
                                                    margin={'none'}
                                                    fullWidth={true}
                                                    labelWidth={110}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </FormControl>
                                            {errors.position && touched.position && errors.position}
                                        </div>

                                        <p>&nbsp;</p>

                                        <Button color={'primary'} variant="contained"
                                                onClick={() => setModus('detail')}>Back</Button>
                                        <ProgressButton type="submit" color={"primary"}
                                                        state={global.buttonState}
                                                        disabled={isSubmitting}>Send DOI</ProgressButton>
                                    </form>
                                )}
                            </Formik>
                        </div>)
                        }
                    />
                </div>
            </Slide>
        </div>
    )
}

export default SendAmount
