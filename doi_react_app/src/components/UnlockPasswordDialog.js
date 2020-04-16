import React, { useState, useGlobal } from "reactn"
import {decryptAES} from "doichain/lib/decryptAES";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from "@material-ui/core/FormHelperText"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import FormControl from "@material-ui/core/FormControl"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"

const UnlockPasswordDialog = (props) => {

    const [openUnlock, setOpenUnlock] = useGlobal("openUnlock")
    const [error, setError] = useState()
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useGlobal("password")
    const [encryptedSeed] = useGlobal("encryptedSeed")
    const [t] = useTranslation()

    const handleClose = () => {
        setOpenUnlock(false);
      };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div>
            <Dialog open={openUnlock?true:false} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Wallet locked</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To unlock your wallet, please enter your password
                    </DialogContentText>
                    <FormControl fullWidth error={error ? true : false}>
                        <InputLabel htmlFor="standard-adornment-password">
                            {t("setPassword.password")}
                        </InputLabel>
                        <Input
                            id="standard-adornment-password"
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            onChange={e => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText id="component-error-text">{error}</FormHelperText>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            const decryptedSeedPhrase = decryptAES(encryptedSeed, password)
                            if (decryptedSeedPhrase !== "") {
                                props.callback(decryptedSeedPhrase, password) //we give the password to the callback in case we need it. e.g. for wallet creation
                                setOpenUnlock(false)
                            }else setError("wrong password")
                        }}
                        color="primary"
                        id="unlock"
                    >
                        Unlock
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default UnlockPasswordDialog
