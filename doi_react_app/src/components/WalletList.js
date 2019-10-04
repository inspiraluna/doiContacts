import React from "react";
import WalletItem from "./WalletItem";
import localStorageDB from "localstoragedb";

const WalletList = () => {
    // TODO please update this list as soon as publicKey is created and update again as soon as publicKey got registered
    const  db = new localStorageDB("doiworks", localStorage); //https://nadh.in/code/localstoragedb/
    if(db.tableExists("wallets")) {
        const wallets = db.queryAll("wallets", {})
        const walletNode = wallets.map((item) => {
            return (<WalletItem key={item.ID} publicKey={item.publicKey}/>)
        });
        return (<ul>{walletNode}</ul>);
    } return null

}

export default WalletList