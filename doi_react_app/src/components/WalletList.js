import React, { useGlobal,setGlobal } from 'reactn';
import WalletItem from "./WalletItem";

const WalletList = () => {
    const wallets = useGlobal('wallets')[0]
    const walletNode = wallets.map((item,index) => {
        return (<WalletItem key={index}
                            walletName={item.walletName}
                            senderEmail={item.senderEmail}
                            subject={item.subject}
                            content={item.content}
                            publicKey={item.publicKey}
                            contentType={item.contentType}
                            redirectUrl={item.redirectUrl}
                            returnPath={item.returnPath}/>)
    });
    return (<ul>{walletNode}</ul>);
}

export default WalletList
