import React, {useGlobal} from "reactn"
import s from "./Welcome.module.css"
import logo from "./logo.jpg"
import Button from "@material-ui/core/Button"
import CreateNewWalletPage from "./CreateNewWalletPage"

const Welcome = () => {
      const [modus, setModus] = useGlobal("modus")

      const createNewWallet = e => {
         setModus("createNewWallet")
 }
      const restoreWallet = e => {
          setModus("restoreWallet")
      }
 
    return (
        <div className={s.welcomePage}>
            <span >
                <div className={s.welcomeImg}>
                    <img src={logo} />
                <span>
                <div className={s.description}>
                <p>Welcome to DoiContacts</p>
                </div>
                <div className={s.createButton}>
                <Button onClick={createNewWallet} color="primary">
                    Create a new wallet
                </Button>
               </div>
               <div className={s.restoreButton}>
                <Button color="primary" onClick={restoreWallet}>
                    Restore a wallet
                </Button>
                </div>
                </span>
                </div>
            </span>
        </div>
    )
}

 export default Welcome
