import Moment from 'react-moment';
import 'moment-timezone';
import React, {useEffect, useState} from "reactn";
import {listTransactions} from "doichain"

const TransactionList = ({address}) => {
    const [txs, setTxs] = useState([])
    useEffect(() => {
            listTransactions(address).then((txs) => {
            if (txs.status === 'success')
                setTxs(txs.data)
        })
    }, [address])

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
