import React, { useGlobal } from "reactn";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ProgressButton from "react-progress-button";
import "./ProgressButton.css";
import { useEffect, useState } from "react";
import { usePosition } from "use-position";
import QRCode from "qrcode-react";
import QRCodeScannerContents, { QRCodeScannerTextField } from "./QRCodeScanner";
import {
  createDOIRequestTransaction,
  encryptTemplate,
  broadcastTransaction,
  DOI_STATE_WAITING_FOR_CONFIRMATION,
  updateWalletBalance
} from "../utils/doichain-transaction-utils";

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
}));

const ContactForm = () => {

    const classes = useStyles();
    const [buttonState, setButtonState] = useState()
    const [wallet, setWallet] = useState(0)
    const [submitting, setSubmitting] = useState()

    const setModus = useGlobal("modus")[1]
    const [wallets] = useGlobal("wallets")
    const [ contacts, setContacts ] = useGlobal('contacts')
    const setOpenError = useGlobal("errors")[1]
    const [utxos, setUTXOs ] = useGlobal("utxos")
    const [scanning] =  useGlobal("scanning")[1]
    const [ownQrCode, setOwnQrCode] = useState(wallets[wallet].senderEmail)
    const [ test ] = useGlobal("test")

    const addContact = async (email) => {
        const runAddContact =  async (email) => {

            if(!email || email.length===0){
                const err = 'no email '
                setOpenError({open:true,msg:err,type:'error'})
                setButtonState('error') //Progress Button should be red
                return
            }

            if(!wallets || wallets.length===0){
                const err = 'no wallets defined'
                setOpenError({open:true,msg:err,type:'info'})
                setButtonState('error') //Progress Button should be red
                return
            }
            try {
                const our_wallet = wallets[wallet]
                const offChainUtxos = utxos
                const txData =  await createDOIRequestTransaction(email,our_wallet,offChainUtxos)
                const encryptedTemplateData = await encryptTemplate(txData.validatorPublicKeyData,email,our_wallet)

                //TODO handle response and create offchain utxos and update balance
                const utxosResponse = await broadcastTransaction(txData,encryptedTemplateData)
                setUTXOs(utxosResponse)
                updateWalletBalance(our_wallet,utxosResponse.balance)

                const msg = 'Broadcasted DOI permission transaction to Doichain node...'
                const contact = {
                    requestedAt: new Date(),
                    email: email,
                    wallet: our_wallet.publicKey,
                    txid: utxosResponse.txid,
                    tx: txData.tx,
                    nameId:txData.doichainEntry.nameId,
                    validatorAddress:txData.validatorAddress,
                    confirmed: false,
                    status: DOI_STATE_WAITING_FOR_CONFIRMATION,
                    position: test
                }

                contacts.push(contact)
                setContacts(contacts)
                setOpenError({open:true,msg:msg,type:'success'})
            }catch(ex){
                const err = 'error while broadcasting transaction '
                console.log(err,ex)
                setOpenError({open:true,msg:err,type:'error'})
                setButtonState('error')
            }
            return "ok"
        }

        const response =  await runAddContact(email)
        return response
    }

    const calculateOwnQRCode = () => {
        const url="mailto:"+wallets[wallet].senderEmail
        setOwnQrCode(url)
    }

    useEffect( () => {
        const senderEmail = wallets[wallet].senderEmail
        if(senderEmail) calculateOwnQRCode()
    },[wallets[wallet].senderEmail])

  return (
      <QRCodeScannerContents
          scanning={scanning}
          render={(
              <div>
                  <form onSubmit={async (e) => {
                      e.preventDefault()
                      const email = e.target.email.value
                      setButtonState('loading')
                      addContact(email).then((response)=>{

                          setButtonState('success')
                          setSubmitting(false)
                          setModus('list');

                      }).catch((response)=>{
                          console.log('response was error',response)
                          setButtonState('error')
                          setSubmitting(false);
                      })
                  }}>

                      <QRCodeScannerTextField name="email" label={"Email permssion to request"}
                                              labelWidth={200} urlPrefix={"mailto:"} />

                      <br/>
                      <InputLabel htmlFor="age-customized-native-simple" className={classes.label}>Wallet / Email</InputLabel>
                      <NativeSelect
                          name="wallet"
                          onChange={(e) => {setWallet(e.target.value); calculateOwnQRCode();}}
                          className={classes.select}
                      > {
                          wallets.map((wallet,index) => <option key={index} value={index} >{wallet.email} ({wallet.balance} DOI)</option>)
                      }
                      </NativeSelect><br/>
                      <RequestAddress className={classes.textField}/>
                      <QRCode value={ownQrCode} /><br/>
                      <ProgressButton type="submit" color={"primary"} state={buttonState} disabled={submitting}>Request Permission</ProgressButton>
                  </form>
              </div>

          )} />
  );
};

const RequestAddress = ({ className }) => {
  const setTest = useGlobal("test")[1];
  const [position, setPosition] = useState("");
  const [address, setAddress] = useState("");
  const { latitude, longitude } = usePosition({
    enableHighAccuracy: true
  }); //false,{enableHighAccuracy: true}

  const queryGeoEncode = async () => {
    if (!latitude || !longitude) return null;

    const response = await geoencode(latitude, longitude);
    const currentPosition = {
      latitude: latitude,
      longitude: longitude,
      address: response.features[0].properties.address
    };
    return currentPosition;
  };
  const query = () => {
    if (!position)
      queryGeoEncode()
        .then(currentPosition => {
          if (currentPosition && currentPosition.address) {
            const our_road = currentPosition.address.road
              ? currentPosition.address.road + " "
              : "";
            const our_house_number = currentPosition.address.house_number
              ? currentPosition.address.house_number + " "
              : "";
            const our_city = currentPosition.address.city
              ? currentPosition.address.city + " "
              : "";
            const our_country = currentPosition.address.country
              ? currentPosition.address.country + " "
              : "";
            const our_address =
              our_road + our_house_number + our_city + our_country;
            setAddress(our_address);
            setTest(currentPosition);
          }
          setPosition(currentPosition);
        })
        .catch(e => {
          console.log("error during geocoding", e);
        });
  };
  query();

  if (latitude === undefined || longitude === undefined) {
    const onSuccess = position => {
      //  console.log('sucesss: got position',position)
      query();
    };

    const onError = error => {
      console.log(
        "code: " + error.code + "\nmessage: " + error.message + "\n"
      );
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true
    });
  }
  // console.log('rerender latitude/longitude',latitude+"/"+longitude+" address"+position)

  return (
    <div>
      <input
        type={"hidden"}
        name={"position"}
        value={JSON.stringify(position)}
      />
      <TextField
        type="text"
        name="address"
        id="address"
        value={address}
        label="Current Address"
        margin="normal"
        className={className}
      />
    </div>
  );
};

const geoencode = async (lat, lng) => {
  // console.log('lat'+lat,'long'+lng)
  const url =
    "https://nominatim.openstreetmap.org/reverse?format=geojson&lat=" +
    lat +
    "&lon=" +
    lng +
    "&zoom=18&addressdetails=2    ";
  const response = await fetch(url, { method: "GET" });
  const json = await response.json();
  return json;
};

export default ContactForm;
