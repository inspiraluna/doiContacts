import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete'
import FolderIcon from '@material-ui/icons/Folder'
import ImportExportIcon from '@material-ui/icons/ImportExport';

const ContactList = ({contacts, remove}) => {

    console.log('rerender ContactList', contacts)
    const contactNode = contacts.map((contact, index) => {
        return (
            <ListItem key={index}>
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
                    <IconButton edge="end" aria-label="edit">
                        <ImportExportIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => remove(index)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
        </ListItem>)
    });
    return contactNode
}

export default ContactList
