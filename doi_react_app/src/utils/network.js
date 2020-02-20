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
     testnet: true,
     from: "newsletter@doichain.org",
     port: 4010,
     host: "5.9.154.231"
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

    return network === "mainnet"
        ? // ? bitcore.Networks.get("doichain") //TODO please fix bitcore-doichain lib
          bitcore.Networks.get("doichain")
        : bitcore.Networks.get("doichain-testnet")
}
