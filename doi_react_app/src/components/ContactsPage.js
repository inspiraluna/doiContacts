import React, { useGlobal,setGlobal } from 'reactn';

import ContactForm from "./ContactForm";
import ContactList from "./ContactList";

import bitcore from "bitcore-doichain";
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey";
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash";
import CustomizedSnackbars from "./MySnackbarContentWrapper";


const ContactsPage = () => {

    const contacts = useGlobal('contacts')[0]
    const wallets = useGlobal("wallets")
    const [ openError, setOpenError ] = useGlobal("errors")

    const addContact = (email,walletIndex) => {

        if(!walletIndex) walletIndex = 0;

        if(!wallets || !wallets[0] || wallets[0].length==0){
            console.log('error no wallets defined')
            const err = 'no wallets defined'
            console.log(err)
            setOpenError({open:true,msg:err,type:'info'})
            return
        }else{
            console.log("wallets of contactPage",wallets)
        }
        const ourWallet = wallets[0][walletIndex]
        console.log("ourWallet",ourWallet)

        const contact = {email: email, confirmed:false}
        contacts.push(contact)
        setGlobal({contacts: contacts})

        const ourPrivateKey = ourWallet.privateKey

        const amountComplete = Number(bitcore.constants.VALIDATOR_FEE.btc)+
            Number(bitcore.constants.NETWORK_FEE.btc)+
            Number(bitcore.constants.TRANSACTION_FEE.btc)

        const ourFrom = ourWallet.senderEmail
        const to = email

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
                        const subject = "hi Irina"
                        const content = "Dear Irina, please give me permission to write you an email.\n${confirmation_url}\n Yours\nNico"
                        const contentType = "text/plain"
                        const redirectUrl = "http://www.le-space.de"
                        const returnPath = "office@le-space.de"

                        const templateData = {
                            "recipient": to,
                            "content": content,
                            "redirect": redirectUrl,
                            "subject": subject,
                            "contentType": (contentType || 'html'),
                            "returnPath": returnPath
                        }

                        if (validatorPublicKeyData.type === 'default' || validatorPublicKeyData.type === 'delegated')  //we store a hash only(!) at the responsible validator - never on a fallback validator
                            templateData.verifyLocalHash = getDataHash({data: (ourFrom + to)}); //verifyLocalHash = verifyLocalHash

                        bitcore.encryptMessage(
                            ourWallet.privateKey,
                            validatorPublicKey.toString(),
                            JSON.stringify(templateData)).then(function (encryptedTemplateData) {
                            console.log("encryptedTemplateData", encryptedTemplateData)

                            bitcore.broadcastTransaction(
                                entry.nameId,
                                txSignedSerialized,
                                encryptedTemplateData,
                                validatorPublicKey.toString()).then(function (txId) {
                                const msg = 'broadcasted doichain transaction to doichain node with txId '+txId
                                console.log(msg)
                                setOpenError({open:true,msg:msg,type:'success'})                            })
                        }).catch(function (ex) {
                            const err = 'error while encrypting message'
                            console.log(err,ex)
                            setOpenError({open:true,msg:err})
                        })
                    }
                }).catch(function (ex) {
                    const err = 'error while getUTXOAndBalance'
                    console.log(err,ex)
                    setOpenError({open:true,msg:err})
                })
            }).catch(function (ex) {
                const err = 'error while creating DoichainEntry'
                console.log(err,ex)
                setOpenError({open:true,msg:err})
            })
        }).catch(function (ex) {
            const err = 'error while fetching public key from dns'
            console.log(err,ex)
            setOpenError({open:true,msg:err})
        })
    }

    const handleRemove = (id) => {
        console.log('not removing',id)
        return;

        const remainder = this.state.data.filter((contact) => {
            if(contact.ID !== id) return contact;
            else return null
        });

        this.setState({data: remainder});
    }

    return(<div> <h1>Doi Contacts</h1>

        <ContactForm addContact={addContact}/>
        <ContactList
            contacts={contacts}
            remove={handleRemove}
        />
        <CustomizedSnackbars/>
    </div>)
}
export default ContactsPage
