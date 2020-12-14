import React, { useGlobal } from "reactn"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import Button from "@material-ui/core/Button"
import { useTranslation } from "react-i18next"

const EditEmailTemplate = () => {
    const setModus = useGlobal("modus")[1]
    const [tempWallet, setTempWallet] = useGlobal("tempWallet")
    const [t] = useTranslation()

    const handleCancel = e => {
        setModus("edit")
    }

    return (
        <div>
            <TextareaAutosize
                rows={16}
                cols="65"
                aria-label="maximum height"
                id="editTemp"
                placeholder=""
                defaultValue={tempWallet ? tempWallet.content : ""}
                onChange={e => {
                    const ourTempWallet = tempWallet ? tempWallet : {}
                    ourTempWallet.content = e.target.value
                    setTempWallet(ourTempWallet)
                }}
            />
            <br />
            Don't forget <pre>confirmation_url</pre>
            <br />
            <Button color={"secondary"} id="back" variant="contained" onClick={() => handleCancel()}>
                {t("button.back")}
            </Button>
        </div>
    )
}

export default EditEmailTemplate
