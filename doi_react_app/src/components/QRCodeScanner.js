import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CropFreeIcon from '@material-ui/icons/CropFree';
import React, {useGlobal} from "reactn";
import Button from "@material-ui/core/Button";


class QRCodeScannerContents extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if(this.props.scanning)
            return(<QRCodeScannerStopButton/>)
        else{
             return this.props.render
        }
    }
}
export default QRCodeScannerContents


export const QRCodeScannerTextField = ({label, labelWidth, defaultValue, handleChange, handleBlur, errors, touched}) => {

    const [toAddress, setToAddress] =  useGlobal("toAddress")
    const [scanning, setScanning] =  useGlobal("scanning")
    function prepareScan() {
        setScanning(true)
        if (window.QRScanner)
            window.QRScanner.prepare(onDone); // show the prompt
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

    function showScanner() {
        console.log('showing scanner - cordova available', window.cordova !== undefined)
        window.QRScanner.show();
        scan()
    }

    function scan() {

        window.QRScanner.getStatus(function(status){
            console.log("QRScanner status:",JSON.stringify(status));
        });

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
            handleCancel(setScanning)
        }
    }

    return (
        <div>
            <FormControl fullWidth variant="outlined" >
                <InputLabel htmlFor="outlined-adornment">{label}</InputLabel>
                <OutlinedInput
                    id="toAddress"
                    name="toAddress"
                    type={'text'}
                    margin={'dense'}
                    fullWidth={true}
                    defaultValue={toAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    labelWidth={labelWidth}
                    endAdornment={
                        <InputAdornment position="end" margin={'none'}>
                            <IconButton onClick={() => prepareScan()}>
                                <CropFreeIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

    </div>)
}

const handleCancel = (setScanning) => {
    console.log('cancel scan ',window.QRScanner)
    if(window.QRScanner){
        window.QRScanner.hide((status) => {
            console.log("QRScanner.hide",status);
        });

        window.QRScanner.destroy((destroyStatus) =>{
            console.log("destroyStatus",destroyStatus);
            setScanning(false)

            if(destroyStatus.scanning || destroyStatus.previewing) window.QRScanner.cancelScan(function(cancelStatus){
                console.log("cancelStatus",cancelStatus);
                setScanning(false)
            });
        });
    }
}

export const QRCodeScannerStopButton = () => {
    const [scanning, setScanning] =  useGlobal("scanning")
    return (<div style={{backgroundColor: 'transparent'}}><Button color={'primary'}
                                                                  variant="contained"
                                                                  onClick={() => {
                                                                      handleCancel(setScanning)}
                                                                  }>Stop Scan</Button></div>)
}

