import React, { useGlobal,useState } from "reactn"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import { useTranslation } from "react-i18next"

const Bip39Password = props => {
    const [password1, setPassword1] = useGlobal("password1")
    const [t] = useTranslation()

    if (props.display === true) {
        return (
            <div>
                <FormControl fullWidth>
                    <InputLabel htmlFor="standard-adornment-password">
                        {t("restoreRecoveryPhrase.password")}
                    </InputLabel>
                    <Input
                        id="standard-adornment-password"
                        fullWidth
                        onChange={e => {
                            setPassword1(e.target.value)
                        }}
                    />
                </FormControl>
            </div>
        )
    } else {
        return <div></div>
    }
}

export default Bip39Password
