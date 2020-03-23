import React, { useGlobal, useState,useEffect } from "reactn"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import FormControl from "@material-ui/core/FormControl"
import { useTranslation } from "react-i18next"
import Button from "@material-ui/core/Button"

const DecryptSeed = () => {
    const [t] = useTranslation()
    const [showPassword, setShowPassword] = useState(false)
    const [seed] = useGlobal("seed")
    const [encrypted, setEncrypted] = useState(true)

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const decryptSeedPhrase = () => {
        setEncrypted(false)
    }
    
    if(encrypted === true){
    return (
        <div>
        <p>{t("setPassword.passwordToUnlock")}</p>
        <form>
        <FormControl fullWidth>
        <InputLabel htmlFor="standard-adornment-password">
            {t("setPassword.password")}
        </InputLabel>
        <Input
            id="standard-adornment-password"
            fullWidth
            type={showPassword ? "text" : "password"}
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
    </FormControl>
    <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => decryptSeedPhrase()}
            id="unlock"
          >
          {t("button.unlock")}
          </Button>
    </form>   
        </div>
    )}else{
        if(encrypted === false){
            return<p id="seed">{seed}</p>
    }}
}

export default DecryptSeed
