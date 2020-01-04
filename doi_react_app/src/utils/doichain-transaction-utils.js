import bitcore from "bitcore-doichain";
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey";
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash";

export const DOI_STATE_WAITING_FOR_CONFIRMATION = 0
export const DOI_STATE_SENT_TO_VALIDATOR = 1
export const DOI_STATE_VALIDATOR_SENT_DOI_REQUEST_EMAIL = 2
export const DOI_STATE_VALIDATOR_RECEIVED_CONFIRMATION = 3


export const createDoicoinTransaction = async (our_wallet,toAddress,amount,offChainUTXOSs) => {
    const ourAddress = our_wallet.addresses[0].address
    const changeAddress = ourAddress
    const privateKey = our_wallet.privateKey
    const fee = 100000 //0,00100000 TODO please calculate correct fee for transaction
    const feeInBTC = 0.00100000
    const amountComplete = Number(amount)+feeInBTC
    console.log("amountComplete "+amount,amountComplete)
    let tx = bitcore.Transaction();
        tx.to(toAddress, Number(amount*100000000));
        tx.change(changeAddress);
        tx.fee(fee);

    let our_txSerialized = undefined
    await bitcore.getUTXOAndBalance(ourAddress, amountComplete).then(function (utxosFromNode) {
        console.log('utxosFromNode should be more then 1 here', utxosFromNode)
        const utxos = checkUTXOs(utxosFromNode,offChainUTXOSs,amountComplete)
        tx.from(utxos.utxos);
        tx.sign(privateKey);
        our_txSerialized = tx.serialize(true)
    })
    return {tx:our_txSerialized,changeAddress:changeAddress}
}

const getUTXOs4DoiRequest = async (ourWallet,offChainUTXOSs) => {

    const ourAddress = bitcore.getAddressOfPublicKey(ourWallet.publicKey).toString()
    const amountComplete = Number(bitcore.constants.VALIDATOR_FEE.btc)+
        Number(bitcore.constants.NETWORK_FEE.btc)+
        Number(bitcore.constants.TRANSACTION_FEE.btc)

    let our_utxos = undefined
    await bitcore.getUTXOAndBalance(ourAddress, amountComplete).then(function (utxosFromNode) {
        our_utxos = checkUTXOs(utxosFromNode,offChainUTXOSs,amountComplete)
    })
    return our_utxos
}

export const createDOIRequestTransaction = async (email, ourWallet, offChainUtxos) => {

    const validatorPublicKeyData = await getValidatorPublicKey(email)
    const doichainEntry = await createDoichainEntry(validatorPublicKeyData.key,email,ourWallet)
    const utxos = await getUTXOs4DoiRequest(ourWallet,offChainUtxos)

    const ourAddress = bitcore.getAddressOfPublicKey(ourWallet.publicKey).toString()
    const validatorAddress = bitcore.getAddressOfPublicKey(validatorPublicKeyData.key).toString()
    const changeAddress = ourAddress //just send change back to us for now - could be its better to generate a new address here
    const ourPrivateKey = ourWallet.privateKey

    const txSignedSerialized = await bitcore.createRawDoichainTX(
        doichainEntry.nameId,
        doichainEntry.nameValue,
        validatorAddress,
        changeAddress,
        ourPrivateKey,
        utxos, //here's the necessary utxos and the balance and change included
        bitcore.constants.NETWORK_FEE.btc, //for storing this record
        bitcore.constants.VALIDATOR_FEE.btc //0.01 for DOI storage, 0.01 DOI for reward for validator, 0.01 revokation reserved
    )

    return {
        tx:txSignedSerialized,
        doichainEntry:doichainEntry,
        utxos: utxos,
        validatorPublicKeyData:validatorPublicKeyData,
        changeAddress:changeAddress,
        validatorAddress: validatorAddress
    }
}

const checkUTXOs = (utxosFromNode,offChainUTXOSs,amount) => {
    console.log('checkingUTXOs: utxosFromNode'+JSON.stringify(utxosFromNode)+' offChainUTXOSs:'+offChainUTXOSs+' amount'+amount)
    if ((utxosFromNode.utxos.length === 0 || utxosFromNode.balanceAllUTXOs<amount) //in case blockchain doesn't have enough funds yet and no offchain utxos are stored
        && (!offChainUTXOSs || !offChainUTXOSs.utxos || offChainUTXOSs.utxos.length===0)){
        const err = 'insufficient funds - no utxos from node or utxos balance less then amount'
        console.log(err)
        throw err
    }
    //we spent all outputs but have a offchain balance left when adding amounts of change addresses
    else if(utxosFromNode.utxos.length === 0 && offChainUTXOSs.utxos.length>0){
        if(offChainUTXOSs.balance < amount) { //if the offchain utxos balance is also not sufficient
            const err = 'insufficient funds - no utxos from node and no utxos in change'
            console.log(err)
            throw err
        }
        //utxoObject cointains txid,utxos,balance
        if(!utxosFromNode.utxos) utxosFromNode.utxos=[]

        offChainUTXOSs.utxos.forEach((utxoObject)=>{
            utxosFromNode.utxos.push(utxoObject.utxos)
        }) //this is our new base for new transactions
        utxosFromNode.change = offChainUTXOSs.balance-amount //subtract the amount we want to transfer to receive the new change
    }
    if(utxosFromNode.change < 0) { //if the offchain utxos balance is also not sufficient
        const err = 'insufficient funds - offchain utxos available but insufficient'
        console.log(err)
        throw err
    }
    console.log('returning utxos',utxosFromNode)
    return utxosFromNode
}

export const getValidatorPublicKey = async (email) => {
    const parts = email.split("@");
    const domain = parts[parts.length-1];
    let our_validatorPublicKeyData = undefined
    await getPublicKey(domain).then((validatorPublicKeyData) => {
        our_validatorPublicKeyData = validatorPublicKeyData
    })
    return our_validatorPublicKeyData
}

export const createDoichainEntry = async (validatorPublicKey,email,ourWallet) => {
    const ourPrivateKey = ourWallet.privateKey
    const ourFrom = ourWallet.senderEmail

    let our_doichainEntry = undefined
    await bitcore.createDoichainEntry(ourPrivateKey, validatorPublicKey.toString(), ourFrom, email).then(function (entry) {
        our_doichainEntry = entry
    })

    return our_doichainEntry
}

export const broadcastTransaction = async (txData,encryptedTemplateData) => {

    const validatorPublicKey = txData && txData.validatorPublicKeyData?txData.validatorPublicKeyData.key:null
    const nameId = txData && txData.doichainEntry?txData.doichainEntry.nameId:null
    const tx = txData?txData.tx:null
    const changeAddress = txData.changeAddress

    let our_response = undefined

    await bitcore.broadcastTransaction(nameId,tx,encryptedTemplateData,validatorPublicKey).then((response) => {
        if(response.status==='fail'){
            const err = response.error
          throw err
        }
        const utxosResponse = getOffchainUTXOs(changeAddress,response)
        our_response = utxosResponse
    })

    return our_response
}

export const updateWalletBalance = (our_wallet, balance) => {
    our_wallet.balance = balance
}

export const encryptTemplate = async (validatorPublicKeyData, email,ourWallet) => {

    const ourFrom = ourWallet.senderEmail

    const templateData = {
        "sender": ourFrom, //TODO the sender of this email shouldn't be necessary to transmit (we only need this for the Doichain footer to tell the recipient whom he grants the permission) Unfortunately, we don't want to trust either the transmitting node nor the sending validator to know such data
        "recipient": email,
        "content": ourWallet.content,
        "redirect": ourWallet.redirectUrl,
        "subject": ourWallet.subject,
        "contentType": (ourWallet.contentType || 'html'),
        "returnPath": ourWallet.returnPath
    }

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


/**
 *
 * Creates the unspent transactions object from the response of a Doichain node.
 * in order to create a new transaction before the next block is confirmed.
 *
 * @param changeAddress
 * @param response
 *
 * @returns {
 *  txid: the transaction
 *  utxos: unspent transaction object array
 *  balance: the new balance of the address based on the values of the owned addresses.
 *  //TODO if the address is a new address but belongs to the publicKey of our wallet this needs still handled as soon as every transaction uses a new address as change address
 * }
 */
export const getOffchainUTXOs = (changeAddress, response) => {
    const txRaw = response.txRaw
    const txid = txRaw.txid
    const vout = txRaw.vout
    const ourUTXOs = []
    let balance = 0 //balance of address

    vout.forEach((out)=>{
        const n = out.n
        const value = out.value
        const scriptPubKey = out.scriptPubKey
        const address = scriptPubKey.addresses[0]
        const hex = scriptPubKey.hex

        if(address===changeAddress){
            const new_utxo = {
                "address": address,
                "amount": value,
                "scriptPubKey": hex,
                "txid": txid,
                "vout": n
            }
            ourUTXOs.push(new_utxo)
            balance+=value
        }
    })
    return {txid:txid,utxos:ourUTXOs,balance:balance}
}
