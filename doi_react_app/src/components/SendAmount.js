import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import React, {useGlobal} from "reactn";
import {useState} from "react";
import {Formik} from "formik";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import ProgressButton from "react-progress-button";
import bitcore from "bitcore-doichain";
import {getUTXOs} from "../utils/doichain-transaction-utils";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CropFreeIcon from '@material-ui/icons/CropFree';
import Box from '@material-ui/core/Box';



const SendAmount = () => {

    const [activeWallet, setActiveWallet ] = useGlobal("activeWallet")
    const [utxos, setUTXOs ] = useGlobal("utxos")
    const [scanning, setScanning] = useState(false) //send amount
    const [amount2Send, setAmount2Send] = useState(0) //send amount
    const [toAddress, setToAddress] =  useGlobal("toAddress")  //useState('') //send amount
    const [ openError, setOpenError ] = useGlobal("errors")
    const [ qrCode, setQrCode ] = useGlobal("qrCode")
    const [global] = useGlobal()
    const [buttonState,setButtonState] = useGlobal("buttonState")

    if(global.qrCode){
        console.log('we re having qr code inside ...',global.qrCode)
        setToAddress(global.qrCode.substring(8))
        setQrCode(undefined)
    }

    const handleCancel = (e) => {

       // document.getElementsByTagName("HTML")[0].setAttribute('style','opacity: 1');
       // document.getElementsByTagName("BODY")[0].setAttribute('style','background-color: transparent');

        window.QRScanner.hide((status) => {
            console.log("QRScanner.hide",status);
        });

        window.QRScanner.destroy((destroyStatus) =>{
            console.log("destroyStatus",destroyStatus);
            setScanning(false)

            if(destroyStatus.scanning || destroyStatus.previewing)window.QRScanner.cancelScan(function(cancelStatus){
                console.log("cancelStatus",cancelStatus);
                setScanning(false)
            });
        });
    };

    const handleSendTransaction = (toAddress,amount) => {
        console.log(toAddress,amount)

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
                    console.log('pushing utxo',global.utxos)
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
            const err = 'error while broadcasting transaction '
            console.log(err,ex)
            setOpenError({open:true,msg:err,type:'error'})
            setButtonState('error')
        }
    }

    function showScanner() {
        console.log('showing scanner - cordova available', window.cordova !== undefined)
        window.QRScanner.show();

        //TODO fix this better
        //iOS transparency issue: https://github.com/bitpay/cordova-plugin-qrscanner/issues/253
       // document.body.style.visibility = 'hidden'
       // setTimeout(() => { document.body.style.visibility = 'visible' }, 1)

        scan()
    }

    function prepareScan() {
        setScanning(true)
        if (window.QRScanner)
            window.QRScanner.prepare(onDone); // show the prompt
    }

    function scan() {
        window.QRScanner.getStatus(function(status){
            console.log("QRScanner status:",JSON.stringify(status));
        });
        console.log('scanning')
        // Start a scan. Scanning will continue until something is detected or
// `QRScanner.cancelScan()` is called.
        window.QRScanner.scan(displayContents);

        function displayContents(err, text) {
            if (err) {
                // an error occurred, or the scan was canceled (error code `6`)
                console.log("error during scanning...", err)
                window.QRScanner.getStatus(function(status){
                    console.log("error QRScanner status: err"+err,JSON.stringify(status));
                });
            } else {
                // The scan completed, display the contents of the QR code:
                window.QRScanner.getStatus(function(status){
                    console.log("QRScanner success status: text"+text,JSON.stringify(status));

                    const result = (text.result===undefined)?text:text.result
                    if (result.startsWith("doicoin:"))
                        setToAddress(result.substring(8))
                    else
                        console.log('different qr code stopping scan')
                });
            }
            handleCancel()
        }
    }

    function onDone(err, status) {
        if (err) {
            // here we can handle errors and clean up any loose ends.
            console.error(err);
        }
        if (status.authorized) {
            // W00t, you have camera access and the scanner is initialized.
            // QRscanner.show() should feel very fast.
            console.log('authorized')
         //   document.getElementsByTagName("HTML")[0].setAttribute('style','opacity: 0');
            showScanner()
        } else if (status.denied) {
            // The video preview will remain black, and scanning is disabled. We can
            // try to ask the user to change their mind, but we'll have to send them
            // to their device settings with `QRScanner.openSettings()`.
            console.log('denied')
        } else {
            // we didn't get permission, but we didn't get permanently denied. (On
            // Android, a denial isn't permanent unless the user checks the "Don't
            // ask again" box.) We can ask again at the next relevant opportunity.
            console.log('denied')
        }
    }

    const handleAmount2Send = (e) => {
        const ourAmount = e.target.value;
        if (isNaN(ourAmount)) return
        setAmount2Send(ourAmount)
    }
    const address = global.wallets[global.activeWallet].addresses[0].address;
    const walletName = global.wallets[global.activeWallet].walletName
    //if(!window.QRScanner) window.QRScanner = require('QRScanner'); //TODO maybe necessary for using in browser only environments, in case cordova run browser is not usable for other integrations
    return (
        <div>
            <Slide aria-label="wallet-send"
                   direction={"up"}
                   in={activeWallet !== undefined && global.modus === 'send'}
                   mountOnEnter unmountOnExit>
                <div>

                    <Contents scanning={scanning}
                              walletName={walletName}
                              address={address}
                              toAddress={global.toAddress}
                              handleAmount2Send={handleAmount2Send}
                              handle2Address={(e) => {setToAddress(e.target.value)}}
                              prepareScan={prepareScan} handleCancel={handleCancel}
                              handleSendTransaction={handleSendTransaction}
                    /></div>

            </Slide>
        </div>
    )
}

const Contents = ({scanning,walletName,address,toAddress,handleAmount2Send, prepareScan, handleSendTransaction}) => {

    const global = useGlobal()
    const [buttonState,setButtonState] = useGlobal("buttonState")
    const [modus, setModus] = useGlobal("modus")
    if(scanning){
        return(<div style={{backgroundColor: 'transparent'}}></div>)
    }
    else{

return (
    <div style={{backgroundColor: 'white'}}>
        <h1>{walletName} </h1>
        Send DOI from address: {address} <br></br>

        <Formik
            initialValues={{ toAddress: '', amount: 0 }}
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
            onSubmit={async (values, { setSubmitting }) => {
                setButtonState('loading')
                setSubmitting(true);
                console.log('submitting values',values) //here we are just using the global (since the changeHandle do not fire
                handleSendTransaction(values.toAddress,values.amount)
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
                  /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <div >
                        <FormControl fullWidth   variant="outlined" >
                        <InputLabel htmlFor="outlined-adornment">to Doichain Address</InputLabel>
          <OutlinedInput
           id="toAddress"
           name="toAddress"
           type={'text'}
           margin={'none'}
           fullWidth={true}
           defaultValue={toAddress}
           onChange={handleChange}
           onBlur={handleBlur}
            endAdornment={
              <InputAdornment position="end" margin={'none'}>
                <IconButton onClick={() => prepareScan()}>
                  <CropFreeIcon />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}

          />
        </FormControl>{errors.toAddress && touched.toAddress && errors.toAddress}
             </div>
                    <br></br> <div>  <FormControl fullWidth  variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-passworoutlined-adornment-amount">Amount (DOI)</InputLabel>
          <OutlinedInput
           id="amount"
           name="amount"
           type={'text'}
           margin="normal"
           fullWidth={true}
           onChange={handleChange}
           onBlur={handleBlur}
           />
                    </FormControl>


                    {errors.position && touched.position && errors.position}
                    </div>
                    <p>&nbsp;</p>
                    {/* <Button color={'primary'} variant="contained" onClick={() => document.location.href='scan.html'}>Scanner Page</Button> */}
                    <Button color={'primary'} variant="contained" onClick={() => prepareScan()}>Scan</Button>
                    <Button color={'primary'} variant="contained"  onClick={() => setModus('detail')}>Back</Button>
                    <ProgressButton type="submit" color={"primary"}
                                    state={global.buttonState}
                                    disabled={isSubmitting}>Send DOI</ProgressButton>
                </form>
            )}
        </Formik>
    </div>
    )
    }
}

export default SendAmount
