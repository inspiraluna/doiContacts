//external libraries
import React, { useGlobal, useEffect, useState} from "reactn"
import QRCode from "qrcode-react"
import { useTranslation } from "react-i18next"
import { usePosition } from "use-position"

import * as bip32 from 'bip32';
import {
    constants,
    getValidatorPublicKeyOfEmail,
    createAndSendTransaction,
    getAddress,
    createHdKeyFromMnemonic,encryptTemplate,createDoichainEntry,
    network
} from 'doichain'
import find from "lodash.find"

//material-ui
import NativeSelect from "@material-ui/core/NativeSelect"
import InputLabel from "@material-ui/core/InputLabel"
import TextField from "@material-ui/core/TextField"
import makeStyles from "@material-ui/core/styles/makeStyles"
import Button from "@material-ui/core/Button";

//own components
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner"
import UnlockPasswordDialog from "./UnlockPasswordDialog";
import "./ProgressButton.css"
const bitcoin = require('bitcoinjs-lib')
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

    const [modus, setModus] = useGlobal("modus")
    const [wallets] = useGlobal("wallets")
    const [contacts,setContacts] = useGlobal("contacts")
    const setOpenError = useGlobal("errors")[1]
    const [openUnlock, setOpenUnlock] = useGlobal("openUnlock")
    const [test, setTest] = useGlobal("test")
    const [scanning] = useGlobal("scanning")
    const [qrCode, setQRCode] = useGlobal("qrCode")
    const setOpenSnackbar = useGlobal("errors")[1]

    const [email, setEmail] = useState('')
    const [disable, setDisable] = useState(false)
    const [wallet, setWallet] = useState(0)
    const [ownQrCode, setOwnQrCode] = useState(wallets[wallet].senderEmail)

    const [t] = useTranslation()


    const vibration = () => {
        let time = 500;
        navigator.vibrate(time);
     }

    const addContact = async (decryptedSeedPhrase,password) => {

            if (!email || email.length === 0) {
                const err = t("contactForm.noEmail")
                setOpenError({ open: true, msg: err, type: "error" })
                return
            }

            if (!wallets || wallets.length === 0) {
                const err = t("contactForm.noWalletsDefined")
                setOpenError({ open: true, msg: err, type: "info" })
                return
            }

            try {
                    const email = openUnlock.email
                    if(!email) throw "no email"
                    const our_wallet = wallets[wallet]
                    if(!our_wallet.balance===0) throw "balance insufficient - please fund"
                    const validatorPublicKey = await getValidatorPublicKeyOfEmail(email)
                    //TODO if we have no network we cannot request DNS - but adding an address should be still possible
                    if(!validatorPublicKey || !validatorPublicKey.data || !validatorPublicKey.data.key) throw "couldn't find publickey of validator from email - or no network"
                    const pubkey = Buffer.from( validatorPublicKey.data.key, 'hex' );
                    const destAddress = getAddress(pubkey)
                    if(!destAddress) throw "couldn't generate address from publicKey "+pubkey

                    const sendSchwartz = Number(constants.VALIDATOR_FEE.satoshis)+Number(constants.NETWORK_FEE.satoshis)+Number(constants.TRANSACTION_FEE.satoshis)
                    console.log('sending schwartz',sendSchwartz)
                    const status = undefined //TODO was bitcoin.DOI_STATE_WAITING_FOR_CONFIRMATION (put this to constants)

                    //Create a WIF from HDKey inorder to get a keypair which we can create working signatures which are valid
                    const hdKey = createHdKeyFromMnemonic(decryptedSeedPhrase, password)
                    const xpriv = hdKey.privateExtendedKey
                    const node = bip32.fromBase58(xpriv,network.DEFAULT_NETWORK ); //global.DEFAULT_NETWORK
                    const wif = node.toWIF()
                    const keyPair = bitcoin.ECPair.fromWIF(wif)

                    const from = our_wallet.senderEmail
                    const doichainEntry = createDoichainEntry(keyPair, validatorPublicKey.data.key, from, email, undefined)
                    console.log('generated doichainEntry', doichainEntry)
                    const encryptedTemplateData = encryptTemplate(
                        validatorPublicKey.data,
                        email,
                        our_wallet,
                    )

                    console.log('generated encryptedTemplateData', encryptedTemplateData)
                    const txResponse = await createAndSendTransaction(decryptedSeedPhrase,
                        password,
                        sendSchwartz,
                        destAddress,
                        our_wallet,
                        doichainEntry.nameId,
                        doichainEntry.nameValue,
                        encryptedTemplateData)
                    console.log("txResponse", txResponse)

                    const msg = t("contactForm.BroadcastedDoiTx")
                    const contact = {
                        email: email,
                        publicKey: keyPair.publicKey.toString('hex'),
                        txid: txResponse.txRaw.txid,
                        nameId: doichainEntry.nameId,
                        validatorAddress: destAddress,
                        confirmed: false,
                        status: status,
                        position: test,
                        requestedAt: new Date(),
                    }

                    contacts.push(contact)
                    setContacts(contacts)
                    setOpenError({ open: true, msg: msg, type: "success" })
                    vibration()
                    setModus("detail")
            } catch (ex) {
                const err = t("contactForm.broadcastingError")
                console.log(err, ex)
                setOpenError({ open: true, msg: err+": "+ex, type: "error" })
            }
    }

    const calculateOwnQRCode = () => {
        if(wallets.length===0) return
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
                        <QRCodeScannerTextField
                            name="email"
                            label={t("contactForm.EmailPermissionToRequest")}
                            labelWidth={200}
                            urlPrefix={"mailto:"}
                            onChange={(e)=>{
                                const thisEmail =  e.target.value
                                const found = find(contacts, function(o) {return o.email === thisEmail})
                                if(found){
                                    setOpenSnackbar({open: true,msg: t("contactForm.usedEmailError"),type: "error"})
                                    setDisable(true)
                                }else {
                                    setEmail(thisEmail)
                                    setDisable(false)
                                }
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
                        <Button
                            onClick={() => setOpenUnlock({
                                email: email ? email : qrCode,}
                            )}
                            color={"secondary"}
                            id="requestPermission"
                            variant="contained"
                            disabled={disable}
                        >
                            {t("contactForm.requestPermission")}
                        </Button>

                    <UnlockPasswordDialog callback={addContact} />
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
