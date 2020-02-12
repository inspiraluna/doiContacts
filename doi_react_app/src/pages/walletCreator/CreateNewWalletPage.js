import React, { useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { useTranslation } from "react-i18next"

const CreateNewWalletPage = () => {
    const [checked, setChecked] = useGlobal("checked")
    const [seed, setSeed] = useGlobal("seed")
    const [t] = useTranslation()

    const handleChange = e => {
        setChecked(!checked)
    }

    useEffect(() => {
        // const Mnemonic = require('bitcore-mnemonic');
        // const code = new Mnemonic();
        const bip39 = require("bip39")
        const mnemonic = bip39.generateMnemonic()
        console.log("mnemonic", mnemonic)
        console.log("mnemonic", mnemonic.toString())
        setSeed(mnemonic.toString())
    }, [])

    return (
        <div className={s.content}>
            <span>
                <div className={s.firstContent}>
                    <p>{t("saveRecoveryPhrase.save")}</p>
                </div>
                <br />
                <br />
                <div className={s.secondContent}>
                    <p>{t("saveRecoveryPhrase.alert")}</p>
                </div>
                <br />
                <br />
                <div className={s.thirdContent}>
                    <h1>{seed}</h1>
                </div>
            </span>
            <FormControlLabel
                control={<Checkbox id="checked" onChange={() => handleChange()} />}
                label={t("saveRecoveryPhrase.confirm")}
            />
        </div>
    )
}

export default CreateNewWalletPage
