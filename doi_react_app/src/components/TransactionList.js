import Moment from 'react-moment';
import 'moment-timezone';
import React from "reactn";
import find from 'lodash.find'
const TransactionList = ({addresses}) => {
    let txList = []
    addresses.forEach(addr => {
        if (addr.transactions) addr.transactions.forEach(t => txList.push(t))
    })
    txList = txList.sort((a, b) => a.date - b.date)

    const txNode = txList.map((tx, index) => {
        //TODO checkout if this is a change address and mark it special
        //TODO when sending transactions please use change Address
        console.log(find(addresses, {address: tx.address}).derivationPath)
        const isChangeAddress =  find(addresses, {address: tx.address}).derivationPath.split("/")[2]===1
        console.log(isChangeAddress)
        return (
            <div key={index}>
                <div style={{textAlign: "left", verticalAlign: "top"}}><Moment
                    format="YYYY-MM-DD HH-mm-ss">{tx.createdAt}</Moment>{" "}
                    {tx.address}{" "} </div>
                <div style={{
                    textAlign: "right",
                    verticalAlign: "top"
                }}> {tx.category} <br/> DOI
                    { tx.spent?'<u>'+(Number(tx.amount).toFixed(8))+'</u>':Number(tx.amount).toFixed(8) }
                </div>
            </div>
        )
    })

    const txTable = (<div style={{width: "100%", fontSize: "12px"}}>
            {txNode}</div>
    )

    return txTable
}

export default TransactionList
