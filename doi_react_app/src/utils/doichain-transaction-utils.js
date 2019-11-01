
export const getUTXOs = (changeAddress, response,setUTXOs) => {

    console.log("response from broadcast",response)

    const txRaw = response.txRaw
    const txid = txRaw.txid
    const vout = txRaw.vout
    const ourUTXOs = []
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
        }
    })
    console.log('setting global.utxo',ourUTXOs)
    setUTXOs(ourUTXOs)
    return txid
}
