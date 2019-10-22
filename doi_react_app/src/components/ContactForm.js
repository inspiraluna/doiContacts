import React, { useGlobal,setGlobal } from 'reactn';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Formik } from 'formik';
import ProgressButton from "react-progress-button";
import './ProgressButton.css'
import {useState} from "react";
import bitcore from "bitcore-doichain";
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey";
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash";
import { usePosition } from 'use-position';
//import Geolookup from 'react-geolookup';

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
    const [wallets] = useGlobal("wallets")
    const [buttonState,setButtonState] = useState()
    const [ contacts, setContacts ] = useGlobal('contacts');
    const [ openError, setOpenError ] = useGlobal("errors")
    const { latitude, longitude, timestamp, accuracy, geoerror } = usePosition();

    const addContact = async (to,walletIndex) => {

        const runAddContact =  (to,walletIndex) => new Promise(resolve => {
            if(!walletIndex) walletIndex = 0;

            if(!wallets || wallets.length==0){
                const err = 'no wallets defined'
                setOpenError({open:true,msg:err,type:'info'})
                return
            }else{
                console.log("wallets of contactPage",wallets)
            }
            const ourWallet = wallets[walletIndex]
            const ourPrivateKey = ourWallet.privateKey

            const amountComplete = Number(bitcore.constants.VALIDATOR_FEE.btc)+
                Number(bitcore.constants.NETWORK_FEE.btc)+
                Number(bitcore.constants.TRANSACTION_FEE.btc)

            const ourFrom = ourWallet.senderEmail

            const parts = to.split("@"); //TODO check if this is an email
            const domain = parts[parts.length-1];

            getPublicKey(domain).then((validatorPublicKeyData) => {
                console.log('validatorPublicKeyData',validatorPublicKeyData.key)
                const validatorPublicKey = bitcore.PublicKey(validatorPublicKeyData.key)
                const validatorAddress = bitcore.getAddressOfPublicKey(validatorPublicKey).toString()
                bitcore.createDoichainEntry(ourPrivateKey, validatorPublicKey.toString(), ourFrom, to).then(function (entry) {
                    const ourAddress = bitcore.getAddressOfPublicKey(ourWallet.publicKey).toString()
                    const changeAddrress = ourAddress //just send change back to us for now - could be its better to generate a new address here

                    bitcore.getUTXOAndBalance(ourAddress, amountComplete).then(function (utxo) {
                        if (utxo.utxos.length === 0){
                            const err = 'insufficiant funds'
                            console.log(err)
                            setOpenError({open:true,msg:err,type:'info'})
                            throw err
                        }
                        else {
                            console.log(`using utxos for ${amountComplete} DOI`, utxo)
                            const txSignedSerialized = bitcore.createRawDoichainTX(
                                entry.nameId,
                                entry.nameValue,
                                validatorAddress,
                                changeAddrress,
                                ourPrivateKey,
                                utxo, //here's the necessary utxos and the balance and change included
                                bitcore.constants.NETWORK_FEE.btc, //for storing this record
                                bitcore.constants.VALIDATOR_FEE.btc //0.01 for DOI storage, 0.01 DOI for reward for validator, 0.01 revokation reserved
                            )

                            const templateData = {
                                "recipient": to,
                                "content": ourWallet.content,
                                "redirect": ourWallet.redirectUrl,
                                "subject": ourWallet.subject,
                                "contentType": (ourWallet.contentType || 'html'),
                                "returnPath": ourWallet.returnPath
                            }

                            console.log('templateData',templateData)

                            if (validatorPublicKeyData.type === 'default' || validatorPublicKeyData.type === 'delegated')  //we store a hash only(!) at the responsible validator - never on a fallback validator
                                templateData.verifyLocalHash = getDataHash({data: (ourFrom + to)}); //verifyLocalHash = verifyLocalHash

                            bitcore.encryptMessage(
                                ourWallet.privateKey,
                                validatorPublicKey.toString(),
                                JSON.stringify(templateData)).then(async function (encryptedTemplateData) {
                                console.log("encryptedTemplateData", encryptedTemplateData)

                                const response = await bitcore.broadcastTransaction(
                                    entry.nameId,
                                    txSignedSerialized,
                                    encryptedTemplateData,
                                    validatorPublicKey.toString()).then((response) => {
                                        const txId = response.data
                                        const msg = 'broadcasted doichain transaction to doichain node with  <br/> txId: '+txId

                                        const contact = {
                                            email: to,
                                            confirmed:false,
                                            txId:txId,
                                            nameId:entry.nameId,
                                            validatorAddress:validatorAddress,
                                            status: DOI_STATE_WAITING_FOR_CONFIRMATION
                                        }

                                        contacts.push(contact)
                                        setContacts(contacts)

                                        setOpenError({open:true,msg:msg,type:'success'})
                                        return "ok"
                                    }).catch((ex)=>{

                                    const err = 'error while broadcasting transaction '
                                    console.log(err,ex)
                                    setOpenError({open:true,msg:err,type:'error'})
                                    throw err
                                });
                            }).catch(function (ex) {
                                const err = 'error while encrypting message'
                                console.log(err,ex)
                                setOpenError({open:true,msg:err,type:'error'})
                                throw err
                            })
                        }
                    }).catch(function (ex) {
                        const err = 'error while getUTXOAndBalance'
                        console.log(err,ex)
                        setOpenError({open:true,msg:err,type:'error'})
                        throw err
                    })
                }).catch(function (ex) {
                    const err = 'error while creating DoichainEntry'
                    console.log(err,ex)
                    setOpenError({open:true,msg:err,type:'error'})
                    throw err
                })
            }).catch(function (ex) {
                const err = 'error while fetching public key from dns'
                console.log(err,ex)
                setOpenError({open:true,msg:err})
                throw err
            })

            return "ok"
        })

        const response =  await runAddContact(to,walletIndex)
        return response
    }

  return (
    <div>
        <Formik
            initialValues={{ email: '', wallet: 0 }}
            validate={values => {
                let errors = {};
                if (!values.email) {
                    errors.email = 'Required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
                    setButtonState('loading')
                    setSubmitting(true);
                                addContact(values.email,values.wallet).then((response)=>{
                                        console.log('response was ok ',response)
                                        setButtonState({buttonState: 'success'})
                                        setSubmitting(false);
                                }).then((response)=>{
                                        console.log('response was error',response)
                                        setButtonState({buttonState: 'error'})
                                        setSubmitting(false);
                                })
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

                    <TextField
                        type="email"
                        name="email"
                        id="email"

                        label="Request Email Permission"
                        className={classes.textField}
                        margin="normal"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    {errors.email && touched.email && errors.email}

                    <p>&nbsp;</p>

                    <InputLabel htmlFor="age-customized-native-simple" className={classes.label}>Wallet / Email</InputLabel>
                    <NativeSelect
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="wallet"
                        className={classes.select}
                    > {
                        wallets.map((wallet,index) => <option key={index} value={index} >{wallet.walletName} {wallet.senderEmail}</option>)
                      }
                    </NativeSelect>
                    <Demo/>
                    <TextField
                        type="text"
                        name="position"
                        id="position"
                        defaultValue={(latitude&&longitude)?(latitude+"/"+longitude):'error'+geoerror}
                        label="Current Position (lat/long)"
                        className={classes.textField}
                        margin="normal"
                        value={values.position}
                    />
                    {errors.position && touched.position && errors.position}
                    <p>&nbsp;</p>
                    <ProgressButton type="submit" color={"primary"} state={buttonState} disabled={isSubmitting}> Request Email Permission</ProgressButton>
                </form>
            )}
        </Formik>
    </div>
  );
}

const RequestAddress =  (props) => {
    console.log('RequestAddress lat'+props.lat,'long'+JSON.stringify(props.lng))

    const queryGeoEncode = async (lat,lng) => {
        const response = await geoencode(lat,lng)
        console.log(response)
        return response
    }
    //const = queryGeoEncode()

    return (<div>some address</div>)
}
/*
const RequestAddress = async ({lat,lng}) => {
//    const response = await geoencode({lat,lng})
    console.log(response)
    return (<div>some address</div>)
}*/

const geoencode = async (lat,lng) => {
    console.log('lat'+lat,'long'+lng)
    const url = "https://nominatim.openstreetmap.org/reverse?format=geojson&lat=-34.9125563&lon=-56.178610899999995&zoom=18&addressdetails=1";
    const response = await fetch(url, {method: 'GET'})
    const json = await response.json();
    return json
}



export const Demo = () => {
    const { latitude, longitude, timestamp, accuracy, error } = usePosition(false,{enableHighAccuracy: true});

    return ( // lat={latitude} long={longitude}
        <code>
            <RequestAddress lat={latitude} lng={longitude}/>
            latitude: {latitude}<br/>
            longitude: {longitude}<br/>
            timestamp: {timestamp}<br/>
            accuracy: {accuracy && `${accuracy}m`}<br/>
            error: {error}
        </code>
    );
};

export default ContactForm
