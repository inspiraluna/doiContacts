import React, { useGlobal, useEffect } from "reactn"
import Welcome from "./Welcome"
import ConfirmRecoveryPhrase from "./ConfirmRecoveryPhrase"
import CreateNewWalletPage from "./CreateNewWalletPage"
import RestoreWalletPage from "./RestoreWalletPage"
import SetPassword from "./SetPassword"
import AppBar from "@material-ui/core/AppBar"
import Button from "@material-ui/core/Button"
import { Toolbar, IconButton, Typography } from "@material-ui/core"
import ArrowLeft from "@material-ui/icons/ArrowLeft"
import { makeStyles } from "@material-ui/core/styles"

const WalletCreator = () => {
    const [modus, setModus] = useGlobal("modus")
    const [checked] = useGlobal("checked")
    const [wallets, setWallets] = useGlobal("wallets")
    const [seed] = useGlobal("seed")
    const [password1] = useGlobal("password1")
    const [hdKey, setHdKey] = useGlobal("hdKey")

    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1
        },
        menuButton: {
            marginRight: theme.spacing(2)
        },
        title: {
            flexGrow: 1
        }
    }))

    const back = e => {
        if (modus === "createNewWallet") setModus(undefined)
        if (modus === "restoreWallet") setModus(undefined)
        if (modus === "confirmRecoveryPhrase") setModus("createNewWallet")
        if (modus === "setPassword") setModus("confirmRecoveryPhrase")
    }
    const next = e => {
        if (modus === "createNewWallet") setModus("confirmRecoveryPhrase")
        if (modus === "confirmRecoveryPhrase") setModus("setPassword")
        if (modus === "setPassword" || modus === "restoreWallet") {
            var Mnemonic = require("bitcore-mnemonic")
            var code = new Mnemonic(seed)
            var hdKey = code.toHDPrivateKey(password1 ? password1 : "mnemonic")
            console.log("privateKey", hdKey.privateKey.toString())
            const wallet = {}
            wallet.senderEmail = "me@example.com"
            wallet.privateKey = hdKey.privateKey.toString()
            wallet.publicKey = hdKey.publicKey.toString()

            let newwallets = wallets
            newwallets.push(wallet)
            setWallets(newwallets)
        }
    }

    const classes = useStyles()
    console.log(modus)
    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    {modus ? (
                        <IconButton
                            onClick={back}
                            id="preview"
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                        >
                            <ArrowLeft />
                        </IconButton>
                    ) : (
                        ""
                    )}
                    <Typography variant="h6" className={classes.title}>
                        DoiContacts
                    </Typography>
                    {modus ? (
                        <Button
                            color="inherit"
                            disabled={!checked}
                            id="next"
                            onClick={next}
                        >
                            Next
                        </Button>
                    ) : (
                        ""
                    )}
                </Toolbar>
            </AppBar>
            {modus === undefined ? <Welcome /> : ""}
            {modus === "createNewWallet" ? <CreateNewWalletPage /> : ""}
            {modus === "confirmRecoveryPhrase" ? (
                <ConfirmRecoveryPhrase next={next} />
            ) : (
                ""
            )}
            {modus === "setPassword" ? <SetPassword /> : ""}
            {modus === "restoreWallet" ? <RestoreWalletPage /> : ""}
        </div>
    )
}
export default WalletCreator
