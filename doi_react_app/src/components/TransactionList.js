import Moment from 'react-moment';
import 'moment-timezone';
import React, {useEffect, useGlobal, useState} from "reactn";
import {listTransactions} from "doichain"

const TransactionList = () => {
    const [txs, setTxs] = useState([])
    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")

    useEffect(() => {
        const addresses = wallets[activeWallet].addresses

            //get all transactions
            const txList = []
            addresses.forEach( addr => addr.transactions.forEach(t => txList.push(t)))
            setTxs(txList)

            //get all addresses
            const addrList = []
            addresses.forEach( addr => addrList.push(addr.address))
            console.log(addresses)

    }, [])

    const txNode = txs.map((tx, index) => {
        return (

                    <tr key={index}>
                        <td align={"left"}>
                            <Moment format="YYYY-MM-DD hh-mm-ss">{tx.createdAt}</Moment>
                        </td>
                        <td align={"left"}>{tx.senderAddress}</td>
                        <td align={"right"}>
                            {tx.category} DOI {Number(tx.amount).toFixed(8)}
                        </td>
                    </tr>
        )
    })

    const txTable = ( <table style={{ width: "100%" }}>
            <tbody>{txNode}</tbody></table>
    )

    return txTable
}

export default TransactionList
