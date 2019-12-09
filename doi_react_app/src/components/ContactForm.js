import React, { useGlobal,setGlobal } from 'reactn';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ProgressButton from "react-progress-button";
import './ProgressButton.css'
import {useEffect, useState} from "react";
import bitcore from "bitcore-doichain";
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey";
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash";
import { usePosition } from 'use-position';
import QRCode from "qrcode-react";
import QRCodeScannerContents, {QRCodeScannerTextField} from "./QRCodeScanner";

const DOI_STATE_WAITING_FOR_CONFIRMATION = 0
const DOI_STATE_SENT_TO_VALIDATOR = 1
const DOI_STATE_VALIDATOR_SENT_DOI_REQUEST_EMAIL = 2
const DOI_STATE_VALIDATOR_RECEIVED_CONFIRMATION = 3

const useStyles = makeStyles(theme => ({
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    label: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
    },
    select: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 300,
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
    const [tx, setTx] = useState()
    const [address, setAddress] = useState('')
    const [position, setPosition] = useState('')
    const [submitting, setSubmitting] = useState()

    const [global] = useGlobal()
    const [wallets] = useGlobal("wallets")
    const [ownQrCode, setOwnQrCode] = useState(wallets[wallet].senderEmail)
    const [qrCode, setQrCode] = useState('')

    const [ contacts, setContacts ] = useGlobal('contacts')
    const [ openError, setOpenError ] = useGlobal("errors")
    const [utxos, setUTXOs ] = useGlobal("utxos")
    const [scanning, setScanning] =  useGlobal("scanning")
   // const [email, setEmail] = useGlobal('email')

    const addContact = async (email) => {
        const runAddContact =  async (email) => {

            console.log('submittedEmail',email)
            console.log('email',email)
            console.log('qrCode',qrCode)

            if(!email || email.length==0){
                const err = 'no email '
                setOpenError({open:true,msg:err,type:'error'})
                setButtonState('error') //Progress Button should be red
                return
            }


            if(!wallets || wallets.length==0){
                const err = 'no wallets defined'
                setOpenError({open:true,msg:err,type:'info'})
                setButtonState('error') //Progress Button should be red
                return
            }else
                console.log("wallets of contactPage",wallets)
                const txData = await createTransaction(email)

                console.log('txData are consistent for broadcast? ',txData)
                const encryptedTemplateData = await encryptMessage(txData.validatorPublicKeyData,email)
                await broadcastTransaction(email,txData.doichainEntry,txData.tx,encryptedTemplateData,txData.validatorPublicKeyData.key)

            return "ok"
        }

        const response =  await runAddContact(email)
        return response
    }

    const broadcastTransaction = async (email,doichainEntry,tx,encryptedTemplateData,validatorPublicKey,changeAddress) => {

        bitcore.broadcastTransaction(
            doichainEntry.nameId,
            tx,
            encryptedTemplateData,
            validatorPublicKey.toString()).then((response) => {

            const txid = getUTXOs(changeAddress,response,setUTXOs)
            const ourWallet = wallets[wallet]
            const validatorAddress = bitcore.getAddressOfPublicKey(validatorPublicKey).toString()
            const msg = 'broadcasted doichain transaction to doichain node '

            const contact = {
                requestedAt: new Date(),
                email: email,
                wallet: ourWallet.publicKey,
                txId:txid,
                nameId:doichainEntry.nameId,
                validatorAddress:validatorAddress,
                confirmed:false,
                status: DOI_STATE_WAITING_FOR_CONFIRMATION,
                tx: tx,
                position: global.test
            }

            contacts.push(contact)
            setContacts(contacts)

            setOpenError({open:true,msg:msg,type:'success'})
            return "ok"
        }).catch((ex)=>{

            const err = 'error while broadcasting transaction '
            console.log(err,ex)
            setOpenError({open:true,msg:err,type:'error'})
            setButtonState('error')
            throw err
        });

    }

    const encryptMessage = async (validatorPublicKeyData,email) => {

        const ourWallet = wallets[wallet]
        const ourFrom = wallets[wallet].senderEmail

        const templateData = {
            "recipient": email,
            "content": ourWallet.content,
            "redirect": ourWallet.redirectUrl,
            "subject": ourWallet.subject,
            "contentType": (ourWallet.contentType || 'html'),
            "returnPath": ourWallet.returnPath
        }

        console.log('templateData',templateData)

        if (validatorPublicKeyData.type === 'default' || validatorPublicKeyData.type === 'delegated')  //we store a hash only(!) at the responsible validator - never on a fallback validator
            templateData.verifyLocalHash = getDataHash({data: (ourFrom + email)}); //verifyLocalHash = verifyLocalHash

        let our_encryptedTemplateData = undefined

        await bitcore.encryptMessage(
            ourWallet.privateKey,
            validatorPublicKeyData.key.toString(),
            JSON.stringify(templateData))
            .then(async function (encryptedTemplateData) {
                console.log("encryptedTemplateData", encryptedTemplateData)
                our_encryptedTemplateData = encryptedTemplateData
            })
        return our_encryptedTemplateData

    }

    const createTransaction = async (email) => {
        console.log('creating transaction')
        const validatorPublicKeyData = await getValidatorPublicKey(email)
        console.log('got '+validatorPublicKeyData.type+' validatorPubliyKey',validatorPublicKeyData.key)

        const doichainEntry = await createDoichainEntry(validatorPublicKeyData.key,email)
        console.log('got doichainEntry',doichainEntry)

        const utxos = await getUTXOs()
        console.log('got utxos',utxos)

        const ourWallet = wallets[wallet]
        const ourAddress = bitcore.getAddressOfPublicKey(ourWallet.publicKey).toString()
        const validatorAddress = bitcore.getAddressOfPublicKey(validatorPublicKeyData.key).toString()
        const changeAddress = ourAddress //just send change back to us for now - could be its better to generate a new address here
        const ourPrivateKey = ourWallet.privateKey

        const txSignedSerialized = bitcore.createRawDoichainTX(
            doichainEntry.nameId,
            doichainEntry.nameValue,
            validatorAddress,
            changeAddress,
            ourPrivateKey,
            utxos, //here's the necessary utxos and the balance and change included
            bitcore.constants.NETWORK_FEE.btc, //for storing this record
            bitcore.constants.VALIDATOR_FEE.btc //0.01 for DOI storage, 0.01 DOI for reward for validator, 0.01 revokation reserved
        )
        setTx(txSignedSerialized)
        console.log('finished creating transaction',txSignedSerialized)
        return {
            tx:txSignedSerialized,
            doichainEntry:doichainEntry,
            utxos: utxos,
            validatorPublicKeyData:validatorPublicKeyData,
            changeAddress:changeAddress
        }
    }

    const getValidatorPublicKey = async (email) => {
        console.log('getValidatorPublicKey of email',email)
        const parts = email.split("@");
        const domain = parts[parts.length-1];
        let our_validatorPublicKeyData = undefined
        await getPublicKey(domain).then((validatorPublicKeyData) => {
            our_validatorPublicKeyData = validatorPublicKeyData
        })
        return our_validatorPublicKeyData
    }

    const createDoichainEntry = async (validatorPublicKey,email) => {

        const ourWallet = wallets[wallet]
        const ourPrivateKey = ourWallet.privateKey
        const ourFrom = wallets[wallet].senderEmail
        const to = email
        let our_doichainEntry = undefined

        await bitcore.createDoichainEntry(ourPrivateKey, validatorPublicKey.toString(), ourFrom, to).then(function (entry) {
            our_doichainEntry = entry
        })

        return our_doichainEntry
    }

    const getUTXOs = async () => {
        const ourWallet = wallets[wallet]
        const ourAddress = bitcore.getAddressOfPublicKey(ourWallet.publicKey).toString()
        const changeAddress = ourAddress //just send change back to us for now - could be its better to generate a new address here

        const amountComplete = Number(bitcore.constants.VALIDATOR_FEE.btc)+
            Number(bitcore.constants.NETWORK_FEE.btc)+
            Number(bitcore.constants.TRANSACTION_FEE.btc)

        let our_utxos = undefined

        await bitcore.getUTXOAndBalance(ourAddress, amountComplete).then(function (utxo) {

            console.log("querried utxo",utxo)
            console.log("global utxo",global.utxos)
            if (utxo.utxos.length === 0 && (!global.utxos || global.utxos.length===0)){
                const err = 'insufficiant funds'
                setOpenError({open:true,msg:err,type:'info'})
                setButtonState('error')
            }
            else if(utxo.utxos.length === 0 && global.utxos){
                console.log('pushing utxo',global.utxos)
                utxo.utxos = global.utxos
            }
            our_utxos = utxo
        })
        console.log('got utxos',our_utxos)
        return our_utxos
    }

    const calculateOwnQRCode = () => {
        //const senderEmail = wallets[wallet].senderEmail
       // let url = "doiContact:00710000016f674a22f021434dfb276ba2db2addb4e9f95b16e10dcca5725bdd2c5a460406010000006a473044022065f2e76ff15eb384d2d3e122fc27fd3ec461b51e621ae4b94661aac858540f1e022034f38e606ee084786389921b767ec236916dd5a080ce4a16af873578c559c3f5012102e7f6565fd619cd097bfa78e82c06a5bf544da2560e93c6caf7b7f3c97ec3e816ffffffff0340420f0000000000fd39015a42652f353042344244364442303331414437364545443030393035454646323231414630363138354335333338374139384235303742353845333131463136323346324cd87b227369676e6174757265223a224877395051534f3149366c4664556577597552614356672b584a464f34682f77455431324a556b474f644f656649494a415255324c6259565243462b6c3232454957397864305732355534683156687775796e737154453d222c226461746148617368223a22222c2266726f6d223a22553246736447566b5831396871342b574c474272754843504d4256536565527756356d70416b4d3976355668792b4d4f596b57684a3979796e374753412b3449636b6439734d7a65554c2f63712f306f556772366a673d3d227d6d7576a91494e8dc927a7c2e2799cb11a5df57d0651167f13f88acc0c62d00000000001976a91494e8dc927a7c2e2799cb11a5df57d0651167f13f88ac7d1a0600000000001976a914a6a795d59ad7de3234a99410e2fa19cbaed1189d88ac00000000"
       // if(tx) url+=tx
      /*  let url  =  "doiContact:"+senderEmail
        if(email) url+="?recipient="+email
        console.log('qr Code url,',url)

        if(tx){
          url+="&tx="+tx
        } */
        const url="mailto:"+wallets[wallet].senderEmail
        console.log('setting qr code',url)
        setOwnQrCode(url)
    }

    useEffect( () => {
        const senderEmail = wallets[wallet].senderEmail
       // if(senderEmail && email) createTransaction()
        if(senderEmail) calculateOwnQRCode()

    },[wallets[wallet].senderEmail])

     //always try to create tbe doichain tx, if data are not ready yet, it will not produce the tx
    console.log('re-render contactform')
  return (
      <QRCodeScannerContents
          scanning={scanning}
          render={(
              <div>
                  <form onSubmit={async (e) => {
                      e.preventDefault()
                      const email = e.target.email.value
                     // setEmail(submittedEmail)
                      console.log('submitting...email',email)
                      setButtonState('loading')
                      addContact(email).then((response)=>{
                          console.log('response was ',response)
                          setButtonState('success')
                          setSubmitting(false);

                      }).catch((response)=>{
                          console.log('response was error',response)
                          setButtonState('error')
                          setSubmitting(false);
                      })
                  }}>

                      <QRCodeScannerTextField name="email" label={"Email permssion to request"}
                                              labelWidth={200} urlPrefix={""} />

                      <br/>
                      <InputLabel htmlFor="age-customized-native-simple" className={classes.label}>Wallet / Email</InputLabel>
                      <NativeSelect
                          name="wallet"
                          onChange={(e) => {setWallet(e.target.value); calculateOwnQRCode();}}
                          className={classes.select}
                      > {
                          wallets.map((wallet,index) => <option key={index} value={index} >{wallet.walletName} {wallet.senderEmail}</option>)
                      }
                      </NativeSelect><br/>
                      <RequestAddress className={classes.textField}/>
                      <QRCode value={ownQrCode} /><br/>
                      <ProgressButton type="submit" color={"primary"} state={buttonState} disabled={submitting}>Request Permission</ProgressButton>
                  </form>
              </div>

          )} />


  );
}

const RequestAddress = ({className}) => {

    const [ test, setTest ] = useGlobal("test")
    const [position,setPosition ] = useState('')
    const [address,setAddress] = useState('')
    const { latitude, longitude, timestamp, accuracy, error } = usePosition({enableHighAccuracy: true}); //false,{enableHighAccuracy: true}

    const queryGeoEncode = async () => {
        if(!latitude || !longitude) return null

        const response = await geoencode(latitude,longitude)
        const currentPosition = {
            latitude: latitude,
            longitude: longitude,
            address:response.features[0].properties.address
        }
       return currentPosition
    }
    const query  = () => {

        if (!position)
            queryGeoEncode().then((currentPosition) => {
                if (currentPosition && currentPosition.address) {
                    const our_road = currentPosition.address.road?currentPosition.address.road+" " :""
                    const our_house_number = currentPosition.address.house_number?currentPosition.address.house_number +" ":""
                    const our_city = currentPosition.address.city?currentPosition.address.city + " ":""
                    const our_country =  currentPosition.address.country?currentPosition.address.country+" ":""
                    const our_address = our_road + our_house_number + our_city + our_country
                    setAddress(our_address)
                    console.log('address', address)
                    setTest(currentPosition)
                }
                setPosition(currentPosition)
            }).catch((e) => {
                console.log('error during geocoding', e)
            })
    }
    query()

    if(latitude===undefined || longitude===undefined){
        const onSuccess = (position) => {
           console.log('sucesss: got position',position)
            query()
        };

        const onError = (error) => {
            console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError,{enableHighAccuracy: true });
    }
    console.log('rerender latitude/longitude',latitude+"/"+longitude+" address"+position)

    return (
        <div>
            <input type={"hidden"} name={'position'} value={JSON.stringify(position)}/>
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
       )
}

const geoencode = async (lat,lng) => {
    console.log('lat'+lat,'long'+lng)
    const url = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat="+lat+"&lon="+lng+"&zoom=18&addressdetails=2    ";
    const response = await fetch(url, {method: 'GET'})
    const json = await response.json();
    return json
}

export default ContactForm
