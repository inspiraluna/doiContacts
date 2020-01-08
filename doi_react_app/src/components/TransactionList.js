import Moment from 'react-moment';
import 'moment-timezone';
import React, {useEffect, useState} from "reactn";
import bitcore from "bitcore-doichain";

const TransactionList = ({address}) => {
    console.log('rendering transactinoList with address: ',address)
    const [txs,setTxs] = useState([])
    useEffect(()=>{
        bitcore.listTransactions(address).then((txs)=>{
            console.log('got transactions of address '+address,txs)
            if(txs.status==='success')
                setTxs(txs.data)
        })
    },[address])

    let ourTxs = []
    if(txs) ourTxs=txs

    const txNode = txs.map((tx, index) => {
        return (<li key={index}><Moment format="YYYY-MM-DD hh-mm-ss">{tx.time*1000}</Moment><div align={"right"}> DOI {Number(tx.amount).toFixed(8)} </div></li>)
    })

    return txNode
}

export default TransactionList
