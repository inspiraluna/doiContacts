import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./WalletCreator.module.css"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import { useTranslation } from "react-i18next"
import {shuffle} from "lodash"

const ConfirmRecoveryPhrase = ({ next }) => {
    const setChecked = useGlobal("checked")[1]
    const [open, setOpen] = useState(undefined)
    const [seed] = useGlobal("seed")
    const [t] = useTranslation()
    const [sufflyButtons, setSufflyButtons] = useState([])
    const [newArray, setNewArray] = useState([])

    const handleClose = () => {
        setOpen(undefined)
    }

    useEffect(() => {
        setChecked(false)
    }, [])

    useEffect(() => {
        const tempSufflyButtons = shuffle(seedWords)
        setSufflyButtons(tempSufflyButtons)
    }, [])

    let seedWords = seed.split(" ")

    const seedButtons = sufflyButtons.map((s, i) => {
        return (
            <Button
                style={{ margin: "10px" }}
                key={i}
                color="primary"
                variant="contained"
                onClick={() => {
                    const correctIndex = seedWords.indexOf(s)
                    if (correctIndex === newArray.length) {
                        let tempNewArray = newArray
                        tempNewArray.push(s)
                        setNewArray(tempNewArray)
                        let filterButtons = sufflyButtons.filter(t => t !== s)
                        setSufflyButtons(filterButtons)
                        if (sufflyButtons.length <= 1) setChecked(true)
                    }
                }}
            >
                {s}
            </Button>
        )
    })
    return (
        <div className={s.content}>
            <p>{t("confirmRecoveryPhrase.confirm")}</p>
            <p>{seedButtons}</p>
            <div className={s.content}>
                <Button onClick={() => setOpen(!open)} id="skipButton">
                    {t("button.skip")}
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
