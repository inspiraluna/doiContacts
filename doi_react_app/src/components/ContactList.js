import React, {setGlobal, useGlobal, useState} from "reactn";
import _ from "lodash"
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete'
import FolderIcon from '@material-ui/icons/Folder'
import CheckIcon from '@material-ui/icons/Check';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import verify from "bitcore-doichain/lib/doichain/verify";
import { green, red } from '@material-ui/core/colors'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const ContactList = () => {

    const [modus, setModus] = useGlobal("modus")
    const [wallets, setWallets] = useGlobal('wallets')
    const [contacts, setContacts] = useGlobal('contacts')
    const [activeContact, setActiveContact] = useGlobal('activeContact')

    const [open, setOpen] = useState(undefined);

    const handleClose = () => {
        setOpen(undefined)
    }

    const handleRemove = () => {
        const index = open
        const currentContacts = contacts
        currentContacts.splice(index, 1)
        setContacts(currentContacts)
        setModus('list')
    }

    const handleDetail = (index) => {
        setModus('detail')
        setActiveContact(index)
    }

    const ourContacts = contacts ? contacts : []
    console.log('contactList rendering', ourContacts)
    const contactNode = ourContacts.map((contact, index) => {

        _.find(wallets, function (wallet) {
            let changed = false
            if (wallet.publicKey === contact.wallet) {
                console.log("checking " + contact.email, contact.confirmed)
                verify(contact.email, wallet.senderEmail, contact.nameId, wallet.publicKey).then((status) => {
                    if (status && status.val === true && !contact.confirmed) {
                        changed = true
                        contact.confirmed = true
                    }
                    if (status && status.val !== true && contact.confirmed) {
                        changed = true
                        contact.confirmed = false
                    }
                    if (changed) {
                        console.log('changed global contacts')
                        setContacts(contacts)
                    }
                })
            }
        })

        return (
            <ListItem key={index} onClick={() => handleDetail(index)}>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={contact.email}
                    secondary={(contact && contact.position && contact.position.address) ? contact.position.address.city + " " + contact.position.address.country : ''}
                />
                <ListItemSecondaryAction>
                    <StatusIcon contact={contact}/>
                    <IconButton edge="end" aria-label="delete" onClick={() =>  setOpen(index)}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)
    });
    return (
        <div>
            <Dialog
                open={open!==undefined}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you really want to delete this contact? this process cannot be undone
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleRemove()} color="primary" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            {contactNode}
        </div>)
}


const StatusIcon = ({contact}) => {
    return (
        <IconButton edge="end" aria-label="edit">
<<<<<<< HEAD
        { contact.confirmed && <CheckIcon style={{ color: green[500] }}/>}
        { !contact.confirmed && <ImportExportIcon style={{ color: red[500] }}/>}
    </IconButton>)
=======
            {contact.confirmed && <CheckIcon/>}
            {!contact.confirmed && <ImportExportIcon/>}
        </IconButton>)
>>>>>>> master
}

export default ContactList
