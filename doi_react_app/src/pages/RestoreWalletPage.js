import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Bip39Password from "./bip39Password"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const RestoreWalletPage = props => {
    const [checked, setChecked] = useGlobal("checked")
    const [seed, setSeed] = useState(
        "balance blanket camp festival party robot social stairs noodle piano copy drastic"
    )
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        setChecked(false)
    }, [])

    const handleChange = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div>
            <div className={s.content}>
                <p>Please confirm your recovery phrase</p>
            </div>
            <br></br>
            <span>
                <TextareaAutosize
                    rows={10}
                    cols="210"
                    id="textarea"
                    aria-label="maximum height"
                    placeholder="Please entry your seed phrase"
                    onChange={e => {
                        if (e.target.value === seed) {
                            setChecked(true)
                        } else setChecked(false)
                    }}
                />
            </span>
            <div>
                <Bip39Password display={showPassword} />
            </div>
            <FormControlLabel
                control={
                    <Checkbox id="checked" onChange={() => handleChange()} />
                }
                label="To restore your wallet, please provide the same BIP39 password you used when created the protected recovery phrase."
            />
        </div>
    )
}

export default RestoreWalletPage
