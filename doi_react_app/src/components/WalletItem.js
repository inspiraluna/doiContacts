import React, {setGlobal,useGlobal,useEffect,useRef,useState,setSate } from 'reactn';
import bitcore from "bitcore-doichain";
//import QRCode from 'qrcode'
import {CropFree} from '@material-ui/icons'
import TypoGraphy from "@material-ui/core/Typography/Typography";
import QRCode from 'qrcode-react'

const WalletItem = ({publicKey}) => {
    const [balance, setBalance] = useState(0);
    const [show,setShow] = useState(false);
    bitcore.Networks.defaultNetwork =  bitcore.Networks.get('doichain-testnet')
    const addr = bitcore.getAddressOfPublicKey(publicKey)
        useEffect( () => {
         async function fetchData(){
             try{
                 const response = await bitcore.getUTXOAndBalance(addr.toString())
                // console.log(response)
                 const balanceAllUTXOs = response.balanceAllUTXOs
                 setBalance(balanceAllUTXOs)
             }catch(Exception){
                 console.log("error while fetching utxos from server",publicKey)
             }

         }
        fetchData();
     })
        //pubKey:{publicKey} CropFree <CropFree onClick={() => generateQR("doichain:"+addr.toString()) }/>
    return (
            <li style={{"fontSize":"9px"}} onClick={() => {setShow(!show)}}>
                DoiCoin-Address: {addr.toString()} Balance: {balance} DOI
                    { show
                        ? <div style={{"fontSize":"9px","border":'2px solid lightgrey'}}>
                            <QRCode value={"doicoin:"+addr.toString()} /><br/>

                            <b>PublicKey:{publicKey}</b><br/>

                        </div>
                        : null
                    }
                        </li>
        )
}

const generateQR = async addr => {
    try {
        await QRCode.toCanvas(document.getElementById('doichain-qr'), addr)
    }catch(err){
        console.error(err)
    }

   /* try {
        console.log(await QRCode.toDataURL(text))
    } catch (err) {
        console.error(err)
    } */
}

export default WalletItem
