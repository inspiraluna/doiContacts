import Moment from 'react-moment';
import 'moment-timezone';
import React, {useEffect, useState} from "reactn";
import bitcore from "bitcore-doichain";

const TransactionList = ({address}) => {
    console.log('rendering TransactionList with address: ',address)
    const [txs,setTxs] = useState([])
    useEffect(()=>{
      //  if(txs.length>0){
            bitcore.listTransactions(address).then((txs)=>{
                console.log('got transactions of address '+address,txs)
                if(txs.status==='success')
                    setTxs(txs.data)
            })
       // }
    },[address!==''])

    const txNode = txs.map((tx, index) => {
        return (<li key={index}>
            <Moment format="YYYY-MM-DD hh-mm-ss">{tx.time*1000}</Moment>
            <div align={"right"}>{tx.category} DOI {Number(tx.amount).toFixed(8)}</div>
        </li>)
    })

    return txNode
}

export default TransactionList
