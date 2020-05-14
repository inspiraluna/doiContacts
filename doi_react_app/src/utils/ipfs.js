console.log('starting ipfs...')
const IPFS = require('ipfs')
const { globSource } = IPFS
const CID = require('cids')
//const all = require('it-all')

async function main () {
    const node = await IPFS.create()
    const version = await node.version()

   console.log('Version:', version.version)

    let lastCID
    for await (const file of node.add(globSource('./build/', { recursive: true }))) {
        lastCID = file.cid
        console.log(file)
    }

    // The address of your files.
    const addr = '/ipfs/'+lastCID.toString() //Qmb3QrU3xgx3H3F3BgqLCQRwkohuseTFjNLYZmdV2Tq37H'
    console.log("addr",addr)
    const res = await node.name.publish(addr)
// You now have a res which contains two fields:
//   - name: the name under which the content was published.
//   - value: the "real" address to which Name points.
    console.log(res)
    console.log(`https://gateway.ipfs.io/ipns/${res.name}`)


}

main()
