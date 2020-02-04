import React, { useState, useGlobal, useEffect } from "reactn"
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
            <span>
                <div className={s.firstContent}>
                    <p>
                        Please write your recovery phrase down on paper and keep
                        it in a safe, offline place. Never enter it in any
                        online website or service
                    </p>
                </div>
                <br />
                <br />
                <div className={s.secondContent}>
                    <p>
                        if you lose your recovery phrase, your wallets cannot be
                        recovered
                    </p>
                </div>
                <br />
                <br />
                <div className={s.thirdContent}>
                    <h1>
                        {seed}
                    </h1>
                </div>
            </span>
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
