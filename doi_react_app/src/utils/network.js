import bitcore from "bitcore-doichain"

 const settingsRegTest = {
     //RegTest
     testnet: true,
     from: "alice@ci-doichain.org",
     port: 3000,
     host: "localhost"
 }

 const settingsMainnet = {
     //testnet 2
     testnet: false,
     from: "doichain@le-space.de",
     ssl: true,
     port: 443,
     host: "doichain.le-space.de"
 }

 const settingsTestnet = {
     //testnet 2
     testnet: true,
     from: "newsletter@doichain.org",
     port: 443,
     ssl: true,
     host: "doichain-testnet.le-space.de"
 }
const changeNetwork = network => {
    console.log('changing network to',network)
    if (network === "testnet") {
        bitcore.settings.setSettings(settingsTestnet)
        bitcore.Networks.defaultNetwork = bitcore.Networks.get("doichain-testnet")}
    if (network === "mainnet") {
        bitcore.settings.setSettings(settingsMainnet)
        bitcore.Networks.defaultNetwork = bitcore.Networks.get("doichain")
    }
    if (network === "regtest") {
        bitcore.settings.setSettings(settingsRegTest)
        bitcore.Networks.defaultNetwork = bitcore.Networks.get("doichain-testnet")
    }
}
export default changeNetwork

export const getDoichainNetwork = network => {
    return network === "mainnet"?bitcore.Networks.get("doichain"): bitcore.Networks.get("doichain-testnet")
}
