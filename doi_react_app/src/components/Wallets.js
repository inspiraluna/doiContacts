import React, { setGlobal, useEffect,useState } from 'reactn';
import bitcore from "bitcore-doichain";
import WalletList from "./WalletList";

const Wallets = () => {
    const [walletItemsChanged, setWalletItemsChanged] = useState({walletItemsChanged:false});

    const addWallet = () => {
        const name = "some name"
        const wallet = bitcore.createWallet(name)
        const url = bitcore.getUrl()+"/api/v1/importpubkey"
        bitcore.registerPublicKey(url, wallet.publicKey)
        setWalletItemsChanged(true);
    }

    useEffect(() => {
        setWalletItemsChanged(false)
    },[walletItemsChanged])

    return (
        <div>
            <h1>DoiCoin Wallets</h1>
            <button onClick={() => {addWallet()}}>Add Wallet </button>
            <WalletList/>
        </div>
    );
}

export default Wallets
