import React, { useGlobal } from "reactn"
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
import { useTranslation } from "react-i18next"
import { useEffect } from 'react';
import useEventListener from '../../hooks/useEventListener';

const WalletCreator = () => {
    const [modus, setModus] = useGlobal("modus")
    const [checked] = useGlobal("checked")
    const [wallets, setWallets] = useGlobal("wallets")
    const [seed] = useGlobal("seed")
    const [password1] = useGlobal("password1")
    const [t] = useTranslation()
    const [email, setEmail] = useGlobal("email")

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
            const bip39 = require("bip39")
            const HDKey = require("hdkey")
            const masterSeed = bip39
                .mnemonicToSeedSync(seed, password1 ? password1 : "mnemonic")
                .toString("hex")
            const hdkey = HDKey.fromMasterSeed(Buffer.from(masterSeed, "hex"))
            const childkey0 = hdkey.derive("m/0/0/1")
            const childkey1 = hdkey.derive("m/0/0/1")
            const wallet = {}
            wallet.senderEmail = email
            wallet.privateKey = childkey0.privateKey.toString("hex")
            wallet.publicKey = childkey0.publicKey.toString("hex")

            let newwallets = wallets
            newwallets.push(wallet)
            setWallets(newwallets)
        }
    }

    useEventListener(document, "backbutton", () => back());

    const classes = useStyles()
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
                        <Button color="inherit" disabled={!checked} id="next" onClick={next}>
                            {t("button.next")}
                        </Button>
                    ) : (
                        ""
                    )}
                </Toolbar>
            </AppBar>
            {modus === undefined ? <Welcome /> : ""}
            {modus === "createNewWallet" ? <CreateNewWalletPage /> : ""}
            {modus === "confirmRecoveryPhrase" ? <ConfirmRecoveryPhrase next={next} /> : ""}
            {modus === "setPassword" ? <SetPassword /> : ""}
            {modus === "restoreWallet" ? <RestoreWalletPage /> : ""}
        </div>
    )
}
export default WalletCreator
