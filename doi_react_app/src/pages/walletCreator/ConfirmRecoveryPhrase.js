import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import TextareaAutosize from "@material-ui/core/TextareaAutosize"
import { useTranslation } from "react-i18next"

const ConfirmRecoveryPhrase = ({ next }) => {
    const setChecked = useGlobal("checked")[1]
    const [open, setOpen] = useState(undefined)
    const [seed] = useGlobal("seed")
    const [t] = useTranslation()

    const handleClose = () => {
        setOpen(undefined)
    }

    useEffect(() => {
        setChecked(false)
    }, [])

    return (
        <div>
            <div className={s.content}>
                <p>{t("confirmRecoveryPhrase.confirm")}</p>
            </div>
            <span>
                {/* <Button color="primary">cycle</Button>
                <Button color="primary">search</Button>
                <Button color="primary">lend</Button>
                <Button color="primary">secret</Button>
                <Button color="primary">march</Button>
                <Button color="primary">ancient</Button>
                <Button color="primary">clay</Button>
                <Button color="primary">chicken</Button>
                <Button color="primary">appear</Button>
                <Button color="primary">embrace</Button>
                <Button color="primary">render</Button>
                <Button color="primary">immense</Button>
                <Button color="primary">happy</Button>
                <Button color="primary">champion</Button>
                <Button color="primary">address</Button>
                <Button color="primary">regular</Button>
                <Button color="primary">absent</Button>
                <Button color="primary">cherry</Button>
                <Button color="primary">hint</Button>
                <Button color="primary">sudden</Button>
                <Button color="primary">cram</Button>
                <Button color="primary">blur</Button>
                <Button color="primary">page</Button>
                <Button color="primary">twist</Button> */}
                <TextareaAutosize
                    rows={10}
                    cols="210"
                    aria-label="maximum height"
                    placeholder={t("confirmRecoveryPhrase.enterSeed")}
                    onChange={e => {
                        if (e.target.value === seed) {
                            setChecked(true)
                        } else setChecked(false)
                    }}
                />
            </span>
            <div className={s.content}>
                <Button onClick={() => setOpen(!open)} id="skipButton">
                    {t("confirmRecoveryPhrase.skip")}
                </Button>
            </div>
            <Dialog
                open={open !== undefined}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t("confirmRecoveryPhrase.skippingVerification")}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b>{t("confirmRecoveryPhrase.checkRecoveryPhrase")}</b>
                        <br></br>
                        {seed}
                        <br></br>
                        <b>{t("confirmRecoveryPhrase.alert")}</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} id="close" color="primary">
                        {t("button.cancel")}
                    </Button>
                    <Button color="primary" onClick={next} id="skip" autoFocus>
                        {t("button.skip")}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ConfirmRecoveryPhrase
