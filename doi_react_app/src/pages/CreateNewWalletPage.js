import React, { useState, useGlobal } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

const CreateNewWalletPage = () => {
    const [checked, setChecked] = useGlobal("checked")

    const handleChange = e => {
        setChecked(!checked)
    }

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
                        sea verb useless merit cupboard income rural quantum
                        when hundred useful wreck choice snack decide turn
                        degree guitar naive chronic brand own local approve
                    </h1>
                </div>
            </span>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checked}
                        onChange={() => handleChange()}
                        value="checked"
                    />
                }
                label="I have safely stored my recovery phrase offline"
            />
        </div>
    )
}

export default CreateNewWalletPage
