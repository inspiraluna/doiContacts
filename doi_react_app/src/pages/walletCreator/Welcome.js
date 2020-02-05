import React, {useGlobal} from "reactn"
import s from "./Welcome.module.css"
import logo from "./logo.jpg"
import Button from "@material-ui/core/Button"
import { appVersion } from './../../appVersion';


const Welcome = () => {
    const setModus = useGlobal("modus")[1]

    const createNewWallet = e => {
        setModus("createNewWallet")
    }
    const restoreWallet = e => {
        setModus("restoreWallet")
    }

    return (
        <div className={s.welcomePage}>
            <img className={s.welcomeImg} src={logo} />
            <div>
                <p>Welcome to DoiContacts</p>
            </div>
            <div>
                <Button onClick={createNewWallet} id="createWallet" color="primary">
                    Create a new wallet
                </Button>
            </div>
            <div>
                <Button color="primary" onClick={restoreWallet} id="restoreWallet">
                    Restore a wallet
                </Button>
            </div>
            <br></br>
            <div>v{appVersion}</div>
        </div>
    )
}

 export default Welcome
