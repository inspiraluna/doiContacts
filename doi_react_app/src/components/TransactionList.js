import Moment from 'react-moment';
import 'moment-timezone';
import React, {useEffect, useState} from "reactn";
import bitcore from "bitcore-doichain";

const TransactionList = ({address}) => {
    console.log('rendering TransactionList with address: ',address)
    const [txs, setTxs] = useState([])
    useEffect(() => {
        bitcore.listTransactions(address).then((txs) => {
            console.log('got transactions of address ' + address, txs)
            if (txs.status === 'success')
                setTxs(txs.data)
        })
    }, [address])

    const txNode = txs.map((tx, index) => {
        return (
            <table style={{ width: "100%" }}>
                <tr key={index}>
                    <td>
                        <Moment format="YYYY-MM-DD hh-mm-ss">{tx.createdAt}</Moment>
                    </td>
                    <td align={"center"}>{tx.senderAddress}</td>
                    <td align={"right"}>
                        {tx.category} DOI {Number(tx.amount).toFixed(8)}
                    </td>
                </tr>
            </table>
        )
    })

    return txNode
}

export default TransactionList
