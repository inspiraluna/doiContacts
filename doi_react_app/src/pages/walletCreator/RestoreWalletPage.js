import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./WalletCreator.module.css"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Bip39Password from "./bip39Password"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { useTranslation } from "react-i18next"
import {validateMnemonic} from "doichain/lib/validateMnemonic";

const RestoreWalletPage = props => {
    const setChecked = useGlobal("checked")[1]
    const setSeed = useGlobal("seed")[1]
    const [showPassword, setShowPassword] = useState(false)
    const [password1] = useGlobal("password1")
    const [t] = useTranslation()

    useEffect(() => {
        setChecked(false)
    }, [])

    const handleChange = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className={s.content}>
            <p>{t("restoreRecoveryPhrase.confirm")}</p>
            <br></br>
            <span>
                <TextareaAutosize
                    rows={10}
                    cols="40"
                    id="textarea"
                    aria-label="maximum height"
                    placeholder={t("restoreRecoveryPhrase.enterSeed")}
                    onChange={e => {
                        const mnemonic = e.target.value
                        if (validateMnemonic(mnemonic)) {
                            setSeed(mnemonic)
                            setChecked(true)
                        }
                        else setChecked(false)
                    }}
                />
            </span>
            <div>
                <Bip39Password display={showPassword} />
            </div>
            <FormControlLabel
                control={<Checkbox id="checked" onChange={() => handleChange()} />}
                label={t("restoreRecoveryPhrase.showPassword")}
            />
        </div>
    )
}

export default RestoreWalletPage
