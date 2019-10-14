import React, { useEffect,useGlobal,setGlobal } from 'reactn'

import ContactForm from "./ContactForm"
import ContactList from "./ContactList"

import bitcore from "bitcore-doichain"
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey"
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash"
import CustomizedSnackbars from "./MySnackbarContentWrapper"
import List from "@material-ui/core/List";
import ReactSwipe from 'react-swipe';

const ContactsPage = () => {

    const contacts = useGlobal('contacts')[0]
    const wallets = useGlobal("wallets")
    const [ openError, setOpenError ] = useGlobal("errors")

    useEffect(() => {
       console.log('rendering...')
    },[contacts])

    const addContact = (to,walletIndex) => {

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

        const contact = {email: to, confirmed:false}
        contacts.push(contact)
        setGlobal({contacts: contacts})

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
                            setOpenError({open:true,msg:err,type:'error'})
                        })
                    }
                }).catch(function (ex) {
                    const err = 'error while getUTXOAndBalance'
                    console.log(err,ex)
                    setOpenError({open:true,msg:err,type:'error'})
                })
            }).catch(function (ex) {
                const err = 'error while creating DoichainEntry'
                console.log(err,ex)
                setOpenError({open:true,msg:err,type:'error'})
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

    }

    let reactSwipeEl;

    return (
        <div>
            <ReactSwipe
                className="carousel"
                swipeOptions={{ continuous: false }}
                ref={el => (reactSwipeEl = el)}
                styles={{
                    container: {
                    overflow: 'hidden',
                    visibility: 'hidden',
                    position: 'relative'
                },
                    wrapper: {
                    overflow: 'hidden',
                    position: 'relative'
                },
                child: {
                    float: 'left',
                    width: '100%',
                    position: 'relative',
                    transitionProperty: 'transform'
                }}
                }
            >
                <div>
                    <h1>Doi Contacts</h1>
                    <ContactForm addContact={addContact}/>
                </div>
                <div style={{height: 350, overflowY: 'scroll'}}>
                    <List dense={true}>
                        <ContactList
                            contacts={contacts}
                            remove={handleRemove}
                        />
                    </List>
                </div>
            </ReactSwipe>

            {/*<button onClick={() => reactSwipeEl.next()}>Next</button>
            <button onClick={() => reactSwipeEl.prev()}>Previous</button> */}
            <CustomizedSnackbars/>
        </div>
    );

   /* return(
        <div>
            <h1>Doi Contacts</h1>
            <SwipeableViews>
                <ContactForm addContact={addContact}/>
                <List dense={true}>
                    <ContactList
                        contacts={contacts}
                        remove={handleRemove}
                    />
                </List>
            </SwipeableViews>

        </div>
    ) */
}
export default ContactsPage
