import Slide from "@material-ui/core/Slide";
import Button from "@material-ui/core/Button";
import React, {useGlobal} from "reactn";
import {useState} from "react";
import {Formik} from "formik";
import InputLabel from "@material-ui/core/InputLabel";
import ProgressButton from "react-progress-button";
import bitcore from "bitcore-doichain";
import {getUTXOs} from "../utils/doichain-transaction-utils";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormControl from "@material-ui/core/FormControl";

import  QRCodeScannerContents,{QRCodeScannerTextField } from "./QRCodeScanner";

const SendAmount = () => {

    const [activeWallet, setActiveWallet ] = useGlobal("activeWallet")
    const [utxos, setUTXOs ] = useGlobal("utxos")
    const [ openError, setOpenError ] = useGlobal("errors")
    const [global] = useGlobal()
    const [buttonState,setButtonState] = useGlobal("buttonState")
    const [modus, setModus] = useGlobal("modus")
    const [scanning, setScanning] =  useGlobal("scanning")
    const [qrCode, setQRCode] =  useGlobal("qrCode")

    const handleSendTransaction = (toAddress,amount) => {

        try {

            const ourAddress = global.wallets[global.activeWallet].addresses[0].address
            const changeAddress = ourAddress
            const fee = 100000 //TODO please calculate correct fee for transaction
            const privateKey = global.wallets[global.activeWallet].privateKey

            let tx = bitcore.Transaction();
            tx.to(toAddress, Number(amount*100000000));
            tx.change(changeAddress);
            tx.fee(fee);

            bitcore.getUTXOAndBalance(ourAddress, amount).then(function (utxo) {

                if (utxo.utxos.length === 0 && (!global.utxos || global.utxos.length===0)){
                    const err = 'insufficiant funds'
                    setOpenError({open:true,msg:err,type:'info'})
                    setButtonState('error')
                    throw err
                }
                else if(utxo.utxos.length === 0 && global.utxos){
                    utxo.utxos = global.utxos
                }

                tx.from(utxo.utxos);
                tx.sign(privateKey);
                const txSerialized = tx.serialize(true)

                //TODO please create to different methodes broadcastRawDOITransaction broadcastRawTransaction
                bitcore.broadcastTransaction(null,
                    txSerialized,null,null).then((response) => {

                        getUTXOs(changeAddress,response,setUTXOs)
                        const msg = 'broadcasted doichain transaction to Doichain node'
                        setOpenError({open:true,msg:msg,type:'success'})
                        setButtonState('success')

                        return "ok"
                    }).catch((ex)=>{
                        const err = 'error while broadcasting transaction '
                        console.log(err,ex)
                        setOpenError({open:true,msg:err,type:'error'})
                        setButtonState('error')
                        throw err
                    });

            })
        }catch(ex){
            const err = 'error while broadcasting transaction'
            console.log(err,ex)
            setOpenError({open:true,msg:err,type:'error'})
            setButtonState('error')
        }
    }

    const address = global.wallets[global.activeWallet].addresses[0].address;
    const walletName = global.wallets[global.activeWallet].walletName

    return (
        <div>
            <Slide aria-label="wallet-send"
                   direction={"up"}
                   in={activeWallet !== undefined && global.modus === 'send'}
                   mountOnEnter unmountOnExit>
                <div>
                    <QRCodeScannerContents
                        scanning={scanning}
                        walletName={walletName}
                        toAddress={global.toAddress}
                        render={(<div style={{backgroundColor: 'white'}}>
                            <h1>{walletName} </h1>
                            Send DOI from address: {address} <br></br>

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
