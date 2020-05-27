import React, { useGlobal, useState } from "reactn"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import FolderIcon from "@material-ui/core/SvgIcon/SvgIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import List from "@material-ui/core/List"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import EditIcon from "@material-ui/icons/Edit"
import { useTranslation } from "react-i18next"
import useEventListener from '../hooks/useEventListener';
import { constants } from "doichain";

const WalletList = () => {
    const [wallets, setWallets] = useGlobal("wallets")
    const [open, setOpen] = useState(undefined)
    const setModus = useGlobal("modus")[1]
    const setActiveWallet = useGlobal("activeWallet")[1]
    const setTempWallet = useGlobal("tempWallet")[1]
    const [t] = useTranslation()
    const [satoshi, setSatoshi] = useGlobal("satoshi")

    const handleClose = () => {
        setOpen(undefined)
    }

    const handleDetail = index => {
        setModus("detail")
        setActiveWallet(index)
    }

    const handleEdit = index => {
        setModus("edit")
        setActiveWallet(index)
        setTempWallet(wallets[index])
    }

    const handleRemove = () => {
        const index = open
        const currentWallets = wallets
        currentWallets.splice(index, 1)
        setWallets(currentWallets)
        setModus("list")
    }

    useEventListener(document, "backbutton", () => console.log("back"));

    const ourWallets = wallets ? wallets : []
    const walletNode = ourWallets.map((item, index) => {
        return (
            <ListItem key={index} id="detail" onClick={() => handleDetail(index)}>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={item.senderEmail}
                    secondary={
                        t("walletItem.balance") +
                        " " +
                        (JSON.parse(satoshi) ? "schw" : "DOI") +
                        " " +
                        (JSON.parse(satoshi) ? constants.toSchwartz(item.balance) : Number(item.balance).toFixed(8)) +
                        " " +
                        (item.unconfirmedBalance !== undefined && item.unconfirmedBalance > 0
                            ? t("walletItem.unconfirmed") + "DOI " + item.unconfirmedBalance + ") "
                            : "")
                    }
                />
                <ListItemSecondaryAction>
                    <IconButton
                        onClick={() => handleEdit(index)}
                        color="secondary"
                        edge="end"
                        id="editWallet"
                        aria-label="edit"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        edge="end"
                        aria-label="delete"
                        id="deleteWallet"
                        onClick={() => setOpen(index)}
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        )
    })

    return (
        <div>
            <Dialog
                open={open !== undefined}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{t("deleteWallet.alert")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("deleteWallet.confirm")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} id="closeAlert" color="secondary">
                        {t("button.cancel")}
                    </Button>
                    <Button
                        onClick={() => handleRemove()}
                        id="removeWallet"
                        color="secondary"
                        autoFocus
                    >
                        {t("button.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
            <List id="walletList" dense={true}>{walletNode}</List>
        </div>
    )
}

export default WalletList
