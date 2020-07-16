import React, { useGlobal, useState } from "reactn"
import find from "lodash.find"
import ListItem from "@material-ui/core/ListItem"
import ListItemAvatar from "@material-ui/core/ListItemAvatar"
import Avatar from "@material-ui/core/Avatar"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import IconButton from "@material-ui/core/IconButton"
import DeleteIcon from "@material-ui/icons/Delete"
import FolderIcon from "@material-ui/icons/Folder"
import CheckIcon from "@material-ui/icons/Check"
import ImportExportIcon from "@material-ui/icons/ImportExport"
import {verify} from "doichain"
import { green, orange } from "@material-ui/core/colors"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Button from "@material-ui/core/Button"
import EditIcon from "@material-ui/icons/Edit"
import { useTranslation } from "react-i18next"
import useEventListener from '../hooks/useEventListener';
import { network } from "doichain"
const bitcoin = require("bitcoinjs-lib")

const ContactList = () => {
    const setModus = useGlobal("modus")[1]
    const [wallets] = useGlobal("wallets")
    const [contacts, setContacts] = useGlobal("contacts")
    const setActiveContact = useGlobal("activeContact")[1]

    const [open, setOpen] = useState(undefined)
    const [t] = useTranslation()

    const handleClose = () => {
        setOpen(undefined)
    }

    const handleRemove = () => {
        const index = open
        const currentContacts = contacts
        currentContacts.splice(index, 1)
        setContacts(currentContacts)
        setModus("list")
    }

    const handleEdit = index => {
        setModus("edit")
        const currentContacts = contacts
        setContacts(currentContacts)
        setActiveContact(index)
    }

    const handleDetail = index => {
        setModus("detail")
        setActiveContact(index)
    }

    useEventListener(document, "backbutton", () => console.log("back"));

    const ourContacts = contacts ? contacts : []
    const contactNode = ourContacts.map((contact, index) => {
        find(wallets, function(wallet) {
            let changed = false 

            const childKey = bitcoin.bip32.fromBase58(wallet.publicExtendedKey).derivePath(wallet.derivationPath)

          //  let childKey0FromXpub = bitcoin.bip32.fromBase58(childKey, network.DEFAULT_NETWORK);
            let publicKey = childKey.publicKey.toString('hex')
            
            if (publicKey === contact.publicKey) {  //they are different at the moment. Please check!!

                verify(contact.email, wallet.senderEmail, contact.nameId, contact.publicKey).then(
                    status => {
                        if (status && status.val === true && !contact.confirmed) {
                            changed = true
                            contact.confirmed = true
                        }
                        if (status && status.val !== true && contact.confirmed) {
                            changed = true
                            contact.confirmed = false
                        }
                        if (changed) {
                            console.log("changed global contacts")
                            setContacts(contacts)
                        }
                    }
                ) //TODO enable with js-doichain module
            }
        })
        return (
            <ListItem key={index} onClick={() => handleDetail(index)}>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={contact.email}
                    secondary={
                        contact && contact.position && contact.position.address
                            ? contact.position.address.city + " " + contact.position.address.country
                            : ""
                    }
                />
                <ListItemSecondaryAction>
                    <StatusIcon contact={contact} />
                    <IconButton onClick={() => handleEdit(index)} color="secondary" edge="end" aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton edge="end" color="secondary" aria-label="delete" onClick={() => setOpen(index)}>
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
                <DialogTitle id="alert-dialog-title">{t("deleteContact.alert")}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t("deleteContact.confirm")}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="secondary">
                        {t("button.cancel")}
                    </Button>
                    <Button onClick={() => handleRemove()} color="secondary" autoFocus>
                        {t("button.delete")}
                    </Button>
                </DialogActions>
            </Dialog>
            {contactNode}
        </div>
    )
}

const StatusIcon = ({ contact }) => {
    return (
        <IconButton edge="end" aria-label="edit">
            {contact.confirmed && <CheckIcon style={{ color: green[500] }} />}
            {!contact.confirmed && <ImportExportIcon style={{ color: orange[500] }} />}
        </IconButton>
    )
}

export default ContactList
