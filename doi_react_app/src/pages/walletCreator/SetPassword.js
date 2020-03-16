import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./WalletCreator.module.css"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"
import InputLabel from "@material-ui/core/InputLabel"
import Input from "@material-ui/core/Input"
import InputAdornment from "@material-ui/core/InputAdornment"
import IconButton from "@material-ui/core/IconButton"
import FormControl from "@material-ui/core/FormControl"
import FormHelperText from "@material-ui/core/FormHelperText"
import { useTranslation } from "react-i18next"
const SetPassword = () => {
    const [password1, setPassword1] = useGlobal("password1")
    const [password2, setPassword2] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const setChecked = useGlobal("checked")[1]
    const [error, setError] = useState()
    const [t] = useTranslation()
    const setEmail = useGlobal("email")[1]

    useEffect(() => {
        // const comparePasswords = () => {
        const passwordValidator = require("password-validator")

        // Create a schema
        const schema = new passwordValidator()

        // Add properties to it
        schema
            .is()
            .min(8) // Minimum length 8
            .is()
            .max(32) // Maximum length 100
            .has()
            .uppercase() // Must have uppercase letters
            .has()
            .lowercase() // Must have lowercase letters
            .has()
            .digits() // Must have digits
            .has()
            .not()
            .spaces() // Should not have spaces
            .is()
            .not()
            .oneOf(["Passw0rd", "Password123"]) // Blacklist these values

        if (password1 === password2) {
            const validationResult = schema.validate(password1, { list: true })
            console.log(validationResult)
            setError(undefined)
            if (validationResult.length === 0) setChecked(true)
            else if (validationResult[0] === "min") {
                     setChecked(false)
                     setError(t("setPassword.shortPassword"))
                 }
            else if (validationResult[0] === "uppercase") {
                     setChecked(false)
                     setError(t("setPassword.uppercase"))
                 }
            else if (validationResult[0] === "digits") {
                     setChecked(false)
                     setError(t("setPassword.digits"))
                 }
            else if (validationResult[0] === "lowercase") {
                     setChecked(false)
                     setError(t("setPassword.lowercase"))
                 }
            else if (validationResult[0] === "spaces") {
                     setChecked(false)
                     setError(t("setPassword.spaces"))
                 }
            else if (validationResult[0] === "max") {
                     setChecked(false)
                     setError(t("setPassword.max"))
                 }
            else if (validationResult[0] === "oneOf") {
                     setChecked(false)
                     setError(t("setPassword.blackList"))
                 }
        } else {
            setChecked(false)
            setError(t("setPassword.errorAlert"))
        }
    }, [password1, password2])

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className={s.content}>
            <p>{t("setPassword.setPassword")}</p>
            <br></br>
            <FormControl fullWidth>
                <InputLabel htmlFor="standard-adornment-email">
                    {t("setPassword.email")}
                </InputLabel>
                <Input
                    id="standard-adornment-email"
                    fullWidth
                    onChange={e => {
                        setEmail(e.target.value)
                    }}
                />
            </FormControl>
            <br></br>
            <FormControl fullWidth error={error ? true : false}>
                <InputLabel htmlFor="standard-adornment-password">
                    {t("setPassword.password")}
                </InputLabel>
                <Input
                    id="standard-adornment-password"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    onChange={e => {
                        setPassword1(e.target.value)
                    }}
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
            <br></br>
            <FormControl fullWidth error={error ? true : false}>
                <InputLabel htmlFor="standard-adornment-password">
                    {t("setPassword.reTypePassword")}
                </InputLabel>
                <Input
                    id="standard-adornment-password2"
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    onChange={e => {
                        setPassword2(e.target.value)
                    }}
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
        </div>
    )
}

export default SetPassword
