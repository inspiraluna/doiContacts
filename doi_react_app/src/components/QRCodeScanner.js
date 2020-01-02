import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import CropFreeIcon from '@material-ui/icons/CropFree';
import React, {useGlobal} from "reactn";
import style from './QRCodeScanner.module.css';
import CloseIcon from '@material-ui/icons/Close';


class QRCodeScannerContents extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.scanning)
            return (<QRCodeScannerStopButton/>)
        else {
            return this.props.render
        }
    }
}

export default QRCodeScannerContents


export const QRCodeScannerTextField = ({label, labelWidth, urlPrefix, name, onChange, handleChange, handleBlur, errors, touched}) => {

    if (!handleChange) handleChange = onChange; //if this is not a formik form

    const [scanning, setScanning] = useGlobal("scanning")
    const [qrCode, setQRCode] = useGlobal("qrCode")

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
        window.QRScanner.show();
        scan()
    }

    function scan() {

        window.QRScanner.getStatus(function (status) {
            console.log("QRScanner status:", JSON.stringify(status));
        });

        window.QRScanner.scan(displayContents);

        function displayContents(err, text) {
            if (err) {
                // an error occurred, or the scan was canceled (error code `6`)
                console.log("error during scanning...", err)
                window.QRScanner.getStatus(function (status) {
                    console.log("error QRScanner status: err" + err, JSON.stringify(status));
                });
            } else {
                // The scan completed, display the contents of the QR code:
                window.QRScanner.getStatus(function (status) {
                    console.log("QRScanner success status: text:\n" + JSON.stringify(status), text);

                    const result = (text.result === undefined) ? text : text.result
                    if (urlPrefix.length == 0 || urlPrefix == undefined || result.startsWith(urlPrefix))
                        setQRCode(result.substring(urlPrefix.length))
                    else
                        console.log('stopping scan because qr code incompatible with form, url should start with ', urlPrefix)
                });
            }
            handleCancel(setScanning)
        }
    }

    //console.log('re-rendering QR-Code component with qr-code',qrCode)
    return (
        <div>
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment">{label}</InputLabel>
                <OutlinedInput
                    name={name}
                    type={'text'}
                    margin={'none'}
                    fullWidth={true}
                    defaultValue={qrCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    labelWidth={labelWidth}
                    endAdornment={
                        <InputAdornment position="end" margin={'none'}>
                            <IconButton onClick={() => prepareScan()}>
                                <CropFreeIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
        </div>)
}

const handleCancel = (setScanning) => {
    console.log('cancel scan ')
    if (window.QRScanner) {
        window.QRScanner.hide((status) => {
            console.log("QRScanner.hide", status);
        });

        window.QRScanner.destroy((destroyStatus) => {
            console.log("destroyStatus", destroyStatus);
            setScanning(false)

            if (destroyStatus.scanning || destroyStatus.previewing) window.QRScanner.cancelScan(function (cancelStatus) {
                console.log("cancelStatus", cancelStatus);
                setScanning(false)
            });
        });
    }
}

export const QRCodeScannerStopButton = () => {
    const [scanning, setScanning] = useGlobal("scanning")
    return (
        <div className={style.stopButton} style={{backgroundColor: "transparent"}}>
            <CloseIcon
                color={"primary"}
                variant="contained"
                onClick={() => {handleCancel(setScanning)}}
                className={style.stopButton}
                style={{cursor: "pointer"}}
            ></CloseIcon>
        </div>
    )
}

