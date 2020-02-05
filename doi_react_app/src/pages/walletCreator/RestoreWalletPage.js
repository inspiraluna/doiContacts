import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Bip39Password from "./bip39Password"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
const bip39 = require('bip39')

const RestoreWalletPage = props => {
    const [checked, setChecked] = useGlobal("checked")
    const [seed, setSeed] = useGlobal("seed")
    const [showPassword, setShowPassword] = useState(false)
    const [password1, setPassword1] = useGlobal("password1")

    useEffect(() => {
        setChecked(false)
    }, [])

    const handleChange = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className={s.content}>
            <p>Please confirm your recovery phrase</p>
            <TextareaAutosize
                rows={10}
                cols="210"
                id="textarea"
                aria-label="maximum height"
                placeholder="Please entry your seed phrase"
                onChange={e => {
                    console.log("checking seedPhrase", e.target.value)
                    console.log("valid without pw", bip39.validateMnemonic(e.target.value))
                    console.log(
                        "valid with pw:" + password1,
                        bip39.validateMnemonic(e.target.value, password1)
                    )
                    if (bip39.validateMnemonic(e.target.value)) {
                        console.log("seedPhrase", e.target.value)
                        setSeed(e.target.value)
                        setChecked(true)
                    } else setChecked(false)
                }}
            />
            <Bip39Password display={showPassword} />
            <FormControlLabel
                control={<Checkbox id="checked" onChange={() => handleChange()} />}
                label="To restore your wallet, please provide the same BIP39 password you used when created the protected recovery phrase."
            />
        </div>
    )
}

export default RestoreWalletPage
