import Moment from 'react-moment';
import 'moment-timezone';
import React, {useEffect, useGlobal, useState} from "reactn";
import {listTransactions} from "doichain"

const TransactionList = () => {
    const [txs, setTxs] = useState([])
    const [wallets, setWallets] = useGlobal("wallets")
    const [activeWallet] = useGlobal("activeWallet")

    useEffect(() => {
        const addresses = wallets[activeWallet].addresses ? wallets[activeWallet].addresses : []
        const txList = []
        addresses.forEach(addr => {
            if(addr.transactions) addr.transactions.forEach(t => txList.push(t))
        })
        setTxs(txList)

        //get all addresses
        const addrList = []
        addresses.forEach(addr => addrList.push(addr.address))
        console.log(addresses)

    }, [])

    const txNode = txs.map((tx, index) => {
        return (

                    <div key={index}>
                            <Moment format="YYYY-MM-DD hh-mm-ss">{tx.createdAt}</Moment>{" "}
                            {tx.senderAddress}{" "}
                            {tx.category} DOI {Number(tx.amount).toFixed(8)}
                    </div>
        )
    })

    const txTable = ( <div style={{ width: "100%", fontSize: "12px" }}>
            {txNode}</div>
    )

    return txTable
}

export default TransactionList
