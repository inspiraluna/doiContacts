import React, { useState, useGlobal, useEffect } from "reactn"
import s from "./CreateNewWalletPage.module.css"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextareaAutosize from '@material-ui/core/TextareaAutosize'

const ConfirmRecoveryPhrase = ({next}) => {
    const [checked, setChecked] = useGlobal("checked")
    const [open, setOpen] = useState(undefined);
    const [seed, setSeed] = useGlobal('seed')

    const handleClose = () => {     
      setOpen(undefined);
    };
  
    useEffect(() => {
        setChecked(false)
    }, [])

    return (
        <div>
            <div className={s.content}>
            <p>Please confirm your recovery phrase</p>
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
                rows={16}  cols="65"
                aria-label="maximum height"
                placeholder="Please entry your seed phrase"
                onChange={(e) => {
                     if(e.target.value === seed) {
                      setChecked(true)
                     } else setChecked(false)
                }}
            />
            </span>
            <div className={s.content}>
            <Button  onClick={() => setOpen(!open)} id="skipButton">Skip</Button>
            </div>
            <Dialog
        open={open !== undefined}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Skipping Verification"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please make sure that your recovery phrase matches the following:<br></br>
            address ancient happy secret appear twist chicken sudden clay page render cherry embrace hint lend march immense champion blur cycle search cram absent regular<br></br>
            It is recommended not to skip verification, so that any misspellings could be deteted
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} id="close" color="primary">
            Cancel
          </Button>
          <Button color="primary" onClick={next} id="skip" autoFocus>
            Skip
          </Button>
        </DialogActions>
      </Dialog>
        </div>
    )
}

export default ConfirmRecoveryPhrase
