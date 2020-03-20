import React, { useGlobal } from "reactn"
import NativeSelect from "@material-ui/core/NativeSelect"
import InputLabel from "@material-ui/core/InputLabel"
import TextField from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"
import ProgressButton from "react-progress-button"
import "./ProgressButton.css"
import { useEffect, useState } from "react"
import { usePosition } from "use-position"
import QRCode from "qrcode-react"
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner"
import bitcore from "bitcore-doichain"
import { useTranslation } from "react-i18next"
import _ from "lodash"

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    label: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    select: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
        height: 50
    }
}))

const ContactForm = () => {
    const classes = useStyles()
    const [buttonState, setButtonState] = useState()
    const [wallet, setWallet] = useState(0)
    const [submitting, setSubmitting] = useState(true)

    const setModus = useGlobal("modus")[1]
    const [wallets] = useGlobal("wallets")
    const [contacts, setContacts] = useGlobal("contacts")
    const setOpenError = useGlobal("errors")[1]
    const [utxos, setUTXOs] = useGlobal("utxos")
    const [scanning] = useGlobal("scanning")
    const [ownQrCode, setOwnQrCode] = useState(wallets[wallet].senderEmail)
    const [test] = useGlobal("test")
    const [t] = useTranslation()
    const setOpenSnackbar = useGlobal("errors")[1]

    const vibration = () => {
        let time = 500;
        navigator.vibrate(time);
     }

    const addContact = async email => {
        const runAddContact = async email => {
            if (!email || email.length === 0) {
                const err = t("contactForm.noEmail")
                setOpenError({ open: true, msg: err, type: "error" })
                setButtonState("error") //Progress Button should be red
                return
            }

            if (!wallets || wallets.length === 0) {
                const err = t("contactForm.noWalletsDefined")
                setOpenError({ open: true, msg: err, type: "info" })
                setButtonState("error") //Progress Button should be red
                return
            }

            try {
                const our_wallet = wallets[wallet]
                const offChainUtxos = utxos

                const network = bitcore.Networks.get("doichain") //TODO get this from global state in case we have testnet or regest
                const txData = await bitcore.createDOIRequestTransaction(
                    email,
                    our_wallet,
                    offChainUtxos,
                    network
                )
                console.log("txData", txData)
                const encryptedTemplateData = await bitcore.encryptTemplate(
                    txData.validatorPublicKeyData,
                    email,
                    our_wallet
                )

                //TODO handle response and create offchain utxos and update balance
                const utxosResponse = await bitcore.broadcastTransaction(
                    txData.doichainEntry.nameId,
                    txData.tx,
                    encryptedTemplateData,
                    txData.validatorPublicKeyData.key
                )
                console.log('utxosResponse',utxosResponse)
                //setUTXOs(utxosResponse)


                const offChainUTXOs = bitcore.getOffchainUTXOs(txData.changeAddress,utxosResponse.txRaw)
                console.log("utxosResponse", offChainUTXOs)
                let newUTXOS = utxos
                if(!utxos) newUTXOS = []
                newUTXOS.push(offChainUTXOs.utxos)
                setUTXOs(newUTXOS)
                bitcore.updateWalletBalance(our_wallet, offChainUTXOs.balance)

                //bitcore.updateWalletBalance(our_wallet, utxosResponse.balance)

                const msg = t("contactForm.BroadcastedDoiTx")
                const contact = {
                    email: email,
                    wallet: our_wallet.publicKey,
                    txid: utxosResponse.txRaw.txid,
                    nameId: txData.doichainEntry.nameId,
                    validatorAddress: txData.validatorAddress,
                    confirmed: false,
                    status: bitcore.DOI_STATE_WAITING_FOR_CONFIRMATION,
                    position: test,
                    requestedAt: new Date(),
                }

                contacts.push(contact)
                setContacts(contacts)
                setOpenError({ open: true, msg: msg, type: "success" })
                vibration()
            } catch (ex) {
                const err = t("contactForm.broadcastingError")
                console.log(err, ex)
                setOpenError({ open: true, msg: err, type: "error" })
                setButtonState("error")
            }
            return "ok"
        }

        const response = await runAddContact(email)
        return response
    }

    const calculateOwnQRCode = () => {
        const senderEmail = wallets[wallet].senderEmail
        if (senderEmail) {
            const url = "mailto:" + wallets[wallet].senderEmail
            setOwnQrCode(url)
        }
    }

    useEffect(() => {
        calculateOwnQRCode()
    })

    return (
        <QRCodeScannerContents
            scanning={scanning}
            render={
                <div>
                    <form
                        onSubmit={async e => {
                            e.preventDefault()
                            const email = e.target.email.value
                            setButtonState("loading")
                            addContact(email)
                                .then(response => {
                                    setButtonState("success")
                                    setSubmitting(false)
                                    setModus("list")
                                })
                                .catch(response => {
                                    console.log("response was error", response)
                                    setButtonState("error")
                                    setSubmitting(false)
                                })
                        }}
                    >
                        <QRCodeScannerTextField
                            name="email"
                            label={t("contactForm.EmailPermissionToRequest")}
                            labelWidth={200}
                            urlPrefix={"mailto:"}
                            onChange={(e)=>{
                                console.log(e.target.value)
                                const found =  _.find(contacts, function(o) {
                                    return o.email === e.target.value
                                })
                                if(found){
                                     setOpenSnackbar({
                                         open: true,
                                         msg: t("contactForm.usedEmailError"),
                                         type: "error"
                                     })
                                     setSubmitting(false)
                                }else setSubmitting(true)
                            }}

                        />

                        <br />
                        <InputLabel
                            htmlFor="age-customized-native-simple"
                            className={classes.label}
                        >
                            {t("contactForm.walletOrEmail")}
                        </InputLabel>
                        <NativeSelect
                            name="wallet"
                            onChange={e => {
                                setWallet(e.target.value)
                                calculateOwnQRCode()
                            }}
                            className={classes.select}
                        >
                            {" "}
                            {wallets.map((wallet, index) => (
                                <option key={index} value={index}>
                                    {wallet.senderEmail} ({wallet.balance} DOI)
                                </option>
                            ))}
                        </NativeSelect>
                        <br />
                        <RequestAddress className={classes.textField} />
                        <QRCode value={ownQrCode} />
                        <br />
                        {submitting?<ProgressButton
                            type="submit"
                            color={"primary"}
                            id='requestPermissiom'
                            state={buttonState}
                        >
                            {t("contactForm.requestPermission")}
                        </ProgressButton>:''}
                    </form>
                </div>
            }
        />
    )
}

const RequestAddress = ({ className }) => {
    const setTest = useGlobal("test")[1]
    const [position, setPosition] = useState("")
    const [address, setAddress] = useState("")

    const { latitude, longitude } = usePosition({
        enableHighAccuracy: true
    })
    const [t] = useTranslation()

    const queryGeoEncode = async () => {
        if (!latitude || !longitude) return null

        const response = await geoencode(latitude, longitude)
        const currentPosition = {
            latitude: latitude,
            longitude: longitude,
            address: response.features[0].properties.address
        }
        return currentPosition
    }
    const query = () => {
        if (!position)
            queryGeoEncode()
                .then(currentPosition => {
                    if (currentPosition && currentPosition.address) {
                        const our_road = currentPosition.address.road
                            ? currentPosition.address.road + " "
                            : ""
                        const our_house_number = currentPosition.address.house_number
                            ? currentPosition.address.house_number + " "
                            : ""
                        const our_city = currentPosition.address.city
                            ? currentPosition.address.city + " "
                            : ""
                        const our_country = currentPosition.address.country
                            ? currentPosition.address.country + " "
                            : ""
                        const our_address = our_road + our_house_number + our_city + our_country
                        setAddress(our_address)
                        setTest(currentPosition)
                    }
                    setPosition(currentPosition)
                })
                .catch(e => {
                    console.log("error during geocoding", e)
                })
    }
    query()

    if (latitude === undefined || longitude === undefined) {
        const onSuccess = position => {
            //  console.log('sucesss: got position',position)
            query()
        }

        const onError = error => {
            console.log("code: " + error.code + "\nmessage: " + error.message + "\n")
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
            enableHighAccuracy: true
        })
    }
    // console.log('rerender latitude/longitude',latitude+"/"+longitude+" address"+position)

    return (
        <div>
            <input type={"hidden"} name={"position"} value={JSON.stringify(position)} />
            <TextField
                type="text"
                name="address"
                id="address"
                value={address}
                label={t("contactForm.currentAddress")}
                margin="normal"
                className={className}
            />
        </div>
    )
}

const geoencode = async (lat, lng) => {
    // console.log('lat'+lat,'long'+lng)
    const url =
        "https://nominatim.openstreetmap.org/reverse?format=geojson&lat=" +
        lat +
        "&lon=" +
        lng +
        "&zoom=18&addressdetails=2    "
    const response = await fetch(url, { method: "GET" })
    const json = await response.json()
    return json
}

export default ContactForm
