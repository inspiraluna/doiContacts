import React, { useGlobal, useEffect } from "reactn"
import s from "./WalletCreator.module.css"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import { useTranslation } from "react-i18next"
import { generateMnemonic } from 'doichain/lib/generateMnemonic'

const CreateNewWalletPage = () => {
    const [checked, setChecked] = useGlobal("checked")
    const [seed, setSeed] = useGlobal("seed")
    const [t] = useTranslation()

    const handleChange = e => {
        setChecked(!checked)
    }

    useEffect(() => {
       setSeed(generateMnemonic())
    }, [])
   
    return (
        <div className={s.content}>
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
            <FormControlLabel
                control={<Checkbox id="checked" onChange={() => handleChange()} />}
                label={t("saveRecoveryPhrase.confirm")}
            />
        </div>
    )
}

export default CreateNewWalletPage
