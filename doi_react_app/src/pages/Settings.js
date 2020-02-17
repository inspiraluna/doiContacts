import React, { useGlobal } from "reactn"
import { useTranslation } from "react-i18next"
import FormControl from "@material-ui/core/FormControl"
import InputLabel from "@material-ui/core/InputLabel"
import NativeSelect from "@material-ui/core/NativeSelect"
import { makeStyles } from "@material-ui/core/styles"



const Settings = () => {
    const { t, i18n } = useTranslation()

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

         const classes = useStyles()


    return (
        <div>
            <div>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="uncontrolled-native">{t("option.choose")}</InputLabel>
                    <NativeSelect defaultValue={"en"} id="selectLang" onChange={changeLanguage}>
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
            </div>
        </div>
    )
}
export default Settings
