import React from "react";
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
import {setGlobal, useGlobal} from "reactn";
import { green, red } from '@material-ui/core/colors'

const ContactList = ({remove}) => {

    const global = useGlobal()
    const [ wallets, setWallets ] = useGlobal('wallets')
    const [ contacts, setContacts ] = useGlobal('contacts')

    const handleDetail = (index) => {
        const currentGlobal = global;
        currentGlobal.activeContact = index
        currentGlobal.modus = 'detail'
        setGlobal(currentGlobal)
        console.log('activeContact now in global', global.activeContact + "/" + global.modus)
    }

    const ourContacts = contacts?contacts:[]
    const contactNode = ourContacts.map((contact, index) => {

        _.find(wallets, function(wallet) {
            let changed = false
            if(wallet.publicKey === contact.wallet){
                console.log("checking "+contact.email,contact.confirmed)
                verify(contact.email,wallet.senderEmail,contact.nameId,wallet.publicKey).then((status)=>{
                    if(status && status.val===true && !contact.confirmed){

                        changed=true
                        contact.confirmed=true
                      //  console.log('changed contact to be confirmed '+changed,contact.email)
                    }
                    if(status && status.val!==true && contact.confirmed){
                        changed=true
                        contact.confirmed=false
                    }
                 //   console.log("checking "+contact.email,contact.confirmed)
                    if(changed) {
                      //  console.log('changed global contacts')
                        setContacts(contacts)
                    }
                })
            }
        })

        return (
            <ListItem key={index}  onClick={() => handleDetail(index)}>
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={contact.email}
                    secondary={(contact && contact.position && contact.position.address)?contact.position.address.city+" "+contact.position.address.country:''}
                />
                <ListItemSecondaryAction>
                    <StatusIcon contact={contact}/>
                    <IconButton edge="end" aria-label="delete" onClick={() => remove(index)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
        </ListItem>)
    });
    return contactNode
}


const StatusIcon = ({contact}) => {
    const [global] = useGlobal()
    return (
        <IconButton edge="end" aria-label="edit">
        { contact.confirmed && <CheckIcon style={{ color: green[500] }}/>}
        { !contact.confirmed && <ImportExportIcon style={{ color: red[500] }}/>}
    </IconButton>)
}

export default ContactList
