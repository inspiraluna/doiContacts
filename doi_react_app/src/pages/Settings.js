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
import DecriptSeed from '../components/DecryptSeed';
import useEventListener from '../hooks/useEventListener';


const Settings = () => {

    const { t, i18n } = useTranslation()
    const [globalNetwork, setGlobalNetwork] = useGlobal("network")
    const [open, setOpen] = useState(undefined)
    const [modus, setModus] = useGlobal("modus")

    const handleClose = () => {
        setOpen(undefined)
    }

    const enterPassword = e => {
        setModus("enterPassword")
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

    if (modus === "enterPassword") {
        return <DecriptSeed />
    }else{
    return (
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
                        defaultValue={network}
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
                        variant="outlined"
                        id="showSeedPhrase"
                        color="primary"
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
                            <Button onClick={() => handleClose()} id="closeAlert" color="primary">
                                {t("button.cancel")}
                            </Button>
                            <Button
                                onClick={() => enterPassword()}
                                id="enterPassword"
                                color="primary"
                                autoFocus
                            >
                                {t("button.iUnderstand")}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </FormControl>
            </div>
        </div>
    )
    }
}
export default Settings
