console.log('starting ipfs...')
const IPFS = require('ipfs')

async function main () {
    const node = await IPFS.create()
    const version = await node.version()
    console.log('Version:', version.version)

    const filesAdded = await node.add({
        path: './hello.txt',
        content: 'Hello World 101'
    })

    //if(filesAdded.length>0)
        console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
    //else console.log('no files added')
}

main()
