import React, { useGlobal } from "reactn"
import { useTranslation } from "react-i18next"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles } from "@material-ui/core/styles"
import changeNetwork from './../utils/network';
import useEventListener from '../hooks/useEventListener';



const Settings = () => {

    const { t, i18n } = useTranslation()
    const [network, setNetwork] = useGlobal("network")

    const useStyles = makeStyles(theme => ({
          formControl: {
              margin: theme.spacing(1),
              minWidth: 200
          },
          selectEmpty: {
              marginTop: theme.spacing(2)
          }
    }))

    const changeLanguage = e => {
        i18n.changeLanguage(e.target.value)
    }

    const onChangeNetwork = e => {
        const ourNetwork = e.target.value
        setNetwork(ourNetwork)
        changeNetwork(ourNetwork)
    }

    useEventListener(document, "backbutton", () => console.log("back"));

    const classes = useStyles()


    return (
        <div>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="uncontrolled-native">{t("option.choose")}</InputLabel>
                    <NativeSelect
                        defaultValue={i18n.language}
                        id="selectLang"
                        onChange={changeLanguage}
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
                        onChange={onChangeNetwork}
                    >
                        <option value={"testnet"} id="testnet">
                            Testnet
                        </option>
                        <option value={"mainnet"} id="mainnet">
                            Mainnet
                        </option>
                        <option value={"regtest"} id="regtest">
                            Regtest
                        </option>
                    </NativeSelect>
                </FormControl>
            </div>
        </div>
    )
}
export default Settings
