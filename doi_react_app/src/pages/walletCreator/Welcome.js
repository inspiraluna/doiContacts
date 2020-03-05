import React, { useGlobal } from "reactn"
import s from "./Welcome.module.css"
import logo from "./logo.jpg"
import Button from "@material-ui/core/Button"
import { appVersion } from "./../../appVersion"
import { useTranslation } from "react-i18next"
const Welcome = () => {
    const setModus = useGlobal("modus")[1]
     const { t } = useTranslation()

    const createNewWallet = e => {
        setModus("createNewWallet")
    }

    const restoreWallet = e => {
        setModus("restoreWallet")
    }

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
