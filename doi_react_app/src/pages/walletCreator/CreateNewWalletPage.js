import React, {  useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const CreateNewWalletPage = () => {
    const [checked, setChecked] = useGlobal("checked")
    const [seed, setSeed] = useGlobal('seed')

    const handleChange = e => {
        setChecked(!checked)
    }
    
    useEffect(() => {
       // const Mnemonic = require('bitcore-mnemonic');
       // const code = new Mnemonic();
        const bip39 = require('bip39')
        const mnemonic = bip39.generateMnemonic()
        console.log("mnemonic",mnemonic)
        console.log("mnemonic",mnemonic.toString())
        setSeed(mnemonic.toString())
    },[])
  
    return (
        <div className={s.content}>
                <div>
                    <p>
                        Please write your recovery phrase down on paper and keep
                        it in a safe, offline place. Never enter it in any
                        online website or service
                    </p>
                </div>
                <br />
                <br />
                <div>
                    <p>
                        if you lose your recovery phrase, your wallets cannot be
                        recovered
                    </p>
                </div>
                <br />
                <br />
                <div>
                    <h1>
                        {seed}
                    </h1>
                </div>
            <FormControlLabel
                control={
                    <Checkbox id="checked"
                        onChange={() => handleChange()}
                    />
                }
                label="I have safely stored my recovery phrase offline"
            />
        </div>
    )
}

export default CreateNewWalletPage
