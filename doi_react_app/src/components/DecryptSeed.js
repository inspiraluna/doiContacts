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
import {decryptAES} from "doichain";

const DecryptSeed = () => {

    const [t] = useTranslation()
    const [encryptedSeed, setEncryptedSeed] = useGlobal("encryptedSeed")
    const [showPassword, setShowPassword] = useState(false)
    const [encrypted, setEncrypted] = useState(true)
    const [decryptedSeed, setDecryptedSeed] = useState("")
    const [password, setPassword] = useState("")
    if (encrypted) {
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
                            onChange={e => {
                                setPassword(e.target.value)
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
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
                        onClick={() => {
                            const decrypt = decryptAES(encryptedSeed, password)
                            setDecryptedSeed(decrypt)
                            setEncrypted(false)
                        }
                    }
                        id="unlock"
                    >
                        {t("button.unlock")}
                    </Button>
                </form>
            </div>
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

export default DecryptSeed
