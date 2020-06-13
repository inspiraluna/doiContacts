import Moment from 'react-moment';
import 'moment-timezone';
import React, { useGlobal } from "reactn";
import { constants } from "doichain"

const TransactionList = ({addresses}) => {
    const [satoshi, setSatoshi] = useGlobal("satoshi")
    let txList = []
    addresses.forEach(addr => {
        if (addr.transactions) addr.transactions.forEach(t => txList.push(t))
    })
    txList = txList.sort((a, b) => {
        return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()
    })

    const txNode = txList.map((tx, index) => {
        //TODO checkout if this is a change address and mark it special
        //TODO if we send a transaction, corresponding inputs and output should be marked and sent amount should be visible as a
        return (
            <div key={index}>
                <div style={{textAlign: "left", verticalAlign: "top"}}><Moment
                    format="YYYY-MM-DD HH-mm-ss">{tx.createdAt}</Moment>{" "}
                    {tx.address}{" "} (<span id="confirmations">{tx.confirmations}</span>)</div>
                <div style={{
                    textAlign: "right",
                    verticalAlign: "top"
                }}> {tx.category} <br/> <span onClick={() => setSatoshi(!satoshi)}>{JSON.parse(satoshi) ? "schw" : "DOI"}</span>{" "}
                    <span id="txAmount" onClick={() => setSatoshi(!satoshi)}
                          style={{ textDecoration: tx.spent?"line-through":''}}>{(JSON.parse(satoshi))?(constants.toSchwartz(tx.amount)):Number(tx.amount).toFixed(8) }</span>
                </div>
            </div>
        )
    })

    const txTable = (<div id="txList" style={{width: "100%", fontSize: "12px"}}>
            {txNode}</div>
    )

    return txTable
}

export default TransactionList
