import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Bip39Password from "./bip39Password"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { useTranslation } from "react-i18next"
const bip39 = require("bip39")

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
        <div>
            <div className={s.content}>
                <p>{t("restoreRecoveryPhrase.confirm")}</p>
            </div>
            <br></br>
            <span>
                <TextareaAutosize
                    rows={10}
                    cols="210"
                    id="textarea"
                    aria-label="maximum height"
                    placeholder={t("restoreRecoveryPhrase.enterSeed")}
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
