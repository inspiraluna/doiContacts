import React, { useGlobal } from "reactn"
import s from "./Welcome.module.css"
import logo from "./logo.jpg"
import Button from "@material-ui/core/Button"
import { appVersion } from "./../../appVersion"
import { useTranslation } from "react-i18next"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles } from "@material-ui/core/styles"

const Welcome = () => {
    const setModus = useGlobal("modus")[1]
    const { t, i18n } = useTranslation()

    const useStyles = makeStyles(theme => ({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 200
        },
        selectEmpty: {
            marginTop: theme.spacing(2)
        }
    }))

    const createNewWallet = e => {
        setModus("createNewWallet")
    }

    const restoreWallet = e => {
        setModus("restoreWallet")
    }

    const changeLanguage = e => {
        i18n.changeLanguage(e.target.value)
    }
    const classes = useStyles()

    //kiwi acquire security left champion peasant royal sheriff absent calm alert letter
    //13456abC
    //moJ98NR1pRCihivY6V9nLKjh18js1unRwV
    //moJ98NR1pRCihivY6V9nLKjh18js1unRwV
    //56e30f99bad1bffed8fe34cc41b3ce09c278e7149e8775205cc6fb65293046ce9c5e0b901d1fb5a5f518e5ca41e8181bd58996593ef82e24953d3ab48596a6a2
    //privateKey 8ad16785c40f0ca75c4b94179d809af3e973ce1f5c7aac9b116db22d3b6fc542
    //privateKe<y 8ad16785c40f0ca75c4b94179d809af3e973ce1f5c7aac9b116db22d3b6fc542
    //publicKey  029a47b9c44fe3575525d1bc221ccf60ea28737eeaad6af0fcac52268bceb8dbbd
    //publicKey  029a47b9c44fe3575525d1bc221ccf60ea28737eeaad6af0fcac52268bceb8dbbd

    return (
        <div className={s.welcomePage}>
            <img className={s.welcomeImg} src={logo} />
            <div>
                <p>{t("welcome.1")}</p>
            </div>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="uncontrolled-native">{t("option.choose")}</InputLabel>
                    <NativeSelect defaultValue={"en"} id="selectLang" onChange={changeLanguage}>
                        <option value={"en"} id="english">
                            English
                        </option>
                        <option value={"ru"} id="russian">
                            Русский
                        </option>
                        <option value={"fr"} id="french">
                            Francais
                        </option>
                    </NativeSelect>
                </FormControl>
            </div>
            <br></br>
            <div>
                <Button
                    onClick={createNewWallet}
                    id="createWallet"
                    variant="contained"
                    color="primary"
                >
                    {t("button.createNewWallet")}
                </Button>
            </div>
            <br></br>
            <div>
                <Button
                    color="primary"
                    onClick={restoreWallet}
                    variant="contained"
                    id="restoreWallet"
                >
                    {t("button.restoreWallet")}
                </Button>
            </div>
            <br></br>
            <div>v{appVersion}</div>
        </div>
    )
}

export default Welcome
