import React, {useEffect, useState, useGlobal, setGlobal, addCallback} from 'reactn';
import bitcore from "bitcore-doichain";
import WalletList from "../components/WalletList";
import ReactSwipe from "react-swipe";

const WalletsPage = () => {

    const [walletItemsChanged, setWalletItemsChanged] = useState(false);
    const [ wallets, setWallets ] = useGlobal("wallets")

    const addWallet = (walletName,senderEmail, subject,content,contentType,redirectUrl,returnPath) => {

        const our_walletName = "Example Wallet"
        const our_senderEmail = "info@doichain.org"
        const our_subject = "Doichain Contacts Request"
        const our_content = "Hello, please give me permission to write you an email.\n\n${confirmation_url}\n\n Yours\n\nNico"
        const our_contentType = "text/plain"
        const our_redirectUrl = "http://www.doichain.org"
        const our_returnPath = "doichain@doichain.org"

        if(!walletName) walletName = our_walletName
        if(!senderEmail) senderEmail = our_senderEmail
        if(!subject) subject = our_subject
        if(!content) content = our_content
        if(!contentType) contentType = our_contentType
        if(!redirectUrl) redirectUrl = our_redirectUrl
        if(!returnPath) returnPath = our_returnPath

        const ourWallet = bitcore.createWallet(walletName)
        const wallet = {}
        wallet.walletName = walletName
        wallet.senderEmail = senderEmail
        wallet.subject = subject
        wallet.content = content
        wallet.contentType = contentType
        wallet.redirectUrl = redirectUrl
        wallet.returnPath = returnPath
        wallet.privateKey = ourWallet.privateKey.toString()
        wallet.publicKey = ourWallet.publicKey.toString()

        let newwallets = wallets
        newwallets.push(wallet)
        console.log("adding wallet",wallet)
        setWallets(wallets)
        setWalletItemsChanged(true);
    }

    useEffect(() => {
        setWalletItemsChanged(false)
    },[walletItemsChanged])

    let reactSwipeEl;

    addCallback(global => {
        if(reactSwipeEl && global.scanSwipe !== undefined){
            if(global.scanSwipe) reactSwipeEl.next()
            else reactSwipeEl.prev()
        }
        return null;
    });

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
                    <h1>DoiCoin Wallets</h1>
                    <WalletList/>
                </div>
                <div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        console.log(e.target.walletName.value)
                        addWallet(e.target.walletName.value,
                            e.target.senderEmail.value,
                            e.target.subject.value,
                            e.target.content.value,
                            e.target.contentType.value,
                            e.target.redirectUrl.value,
                            e.target.returnPath.value)
                    }}>
                        <label htmlFor={"walletName"}>Wallet: </label><input name="walletName" /><br/>
                        <label htmlFor={"senderEmail"}>Email: </label><input name="senderEmail"/><br/>
                        <label htmlFor={"subject"}></label>Subject: <input  name={"subject"} /><br/>
                        <label htmlFor={"content"}></label>Content: <input name={"content"} /><br/>
                        <label htmlFor={"contentType"}></label>Content-Type: <input name={"contentType"} /><br/>
                        <label htmlFor={"redirectUrl"}></label>Redirect-Url<input name={"redirectUrl"} /><br/>
                        <label htmlFor={"returnPath"}></label>Return-Path<input name={"returnPath"} /><br/>
                        <button>Add Wallet </button>
                    </form>
                </div>
            </ReactSwipe>



        </div>
    );
}

export default WalletsPage
