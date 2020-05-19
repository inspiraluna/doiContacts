import React, { useGlobal, useState } from "reactn"
import {network} from "doichain";
import { useTranslation } from "react-i18next"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import useEventListener from '../hooks/useEventListener';
import UnlockPasswordDialog from "../components/UnlockPasswordDialog"
import { Switch, CssBaseline } from "@material-ui/core"
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const Settings = () => {

    const { t, i18n } = useTranslation()
    const [globalNetwork, setGlobalNetwork] = useGlobal("network")
    const [open, setOpen] = useState(undefined)
    const setOpenUnlock = useGlobal("openUnlock")[1]
    const [encrypted, setEncrypted] = useState(true)
    const [decryptedSeed, setDecryptedSeed] = useState("")
    const [darkMode, setDarkMode] = useGlobal("darkMode")

    const handleClose = () => {
        setOpen(undefined)
    }

    const enterPassword = e => {
        setOpenUnlock(true)
    }

    const decryptCallback = (decryptedSeedPhrase) => {
        setEncrypted(false)
        setDecryptedSeed(decryptedSeedPhrase)
    }

    const useStyles = makeStyles(theme => ({
          formControl: {
              margin: theme.spacing(1),
              minWidth: 200
          },
          selectEmpty: {
              marginTop: theme.spacing(2)
          }
    }))
    const classes = useStyles()

    useEventListener(document, "backbutton", () => console.log("back"));

if (encrypted) {
    return (
        <ThemeProvider >
        <CssBaseline />
        <div>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="uncontrolled-native">{t("option.choose")}</InputLabel>
                    <NativeSelect
                        defaultValue={i18n.language}
                        id="selectLang"
                        onChange={e => i18n.changeLanguage(e.target.value)}
                    >
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
                <br></br>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="uncontrolled-native">testnet/mainnet/regtest</InputLabel>
                    <NativeSelect
                        defaultValue={globalNetwork}
                        id="selectNetwork"
                        onChange={e => {
                            const ourNetwork = e.target.value
                            setGlobalNetwork(ourNetwork)
                            network.changeNetwork(ourNetwork)
                        }}
                    >
                        <option value={"mainnet"} id="mainnet">
                            Mainnet
                        </option>
                        <option value={"testnet"} id="testnet">
                            Testnet
                        </option>
                        <option value={"regtest"} id="regtest">
                            Regtest
                        </option>
                    </NativeSelect>
                    <br></br>
                    <Button
                        variant="contained"
                        id="showSeedPhrase"
                        color="secondary"
                        onClick={() => setOpen(true)}
                    >
                        {t("option.showRecoveryPhrase")}
                    </Button>
                    <Dialog
                        open={open !== undefined}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{t("option.dialogTitle")}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {t("option.dialogDescription")}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleClose()} id="closeAlert" color="secondary">
                                {t("button.cancel")}
                            </Button>
                            <Button
                                onClick={() => enterPassword()}
                                id="enterPassword"
                                color="secondary"
                                autoFocus
                            >
                                {t("button.iUnderstand")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </FormControl>
            </div>
            <UnlockPasswordDialog callback={decryptCallback}/>
            <span className={classes.formControl}>Toggle light/dark theme</span><Switch checked={darkMode} onChange={() => {
                const ourMode = darkMode
                setDarkMode(!ourMode)
            }} />
        </div>
        </ThemeProvider>
    )
} else {
    let seedWords = decryptedSeed.split(" ")
    let oneLine = []
    const modulosSeed = seedWords.map((seed, i) => { 
        if (i % 3 === 0 && i !== 0) oneLine = []
        oneLine.push(seed)
        if ((i + 1) % 3 === 0) return <li key={i}>{oneLine.toString().replace(/,/g, ' ')}</li>
    })
    return <p id="seed">{modulosSeed}</p>
}
}

export default Settings
