import React, {useEffect, useGlobal, setGlobal, addCallback} from 'reactn'

import ContactForm from "../components/ContactForm"
import ContactList from "../components/ContactList"

import List from "@material-ui/core/List";

import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";



const ContactsPage = () => {

    const [add, setAdd] = useState(false);
    const [ contacts, setContacts ] = useGlobal('contacts')

    useEffect(() => {
    },[contacts])

    const handleRemove = (index) => {
        const currentContacts = contacts
        currentContacts.splice(index, 1);
        setContacts(currentContacts)
    }

    return (
        <div>
            <Slide aria-label="wallet-detail"
                   direction={"up"}
                   in={!add}
                   mountOnEnter unmountOnExit>

                <div>
                    <h1>Doi Contacts</h1>
                    <List dense={true}>
                        <ContactList remove={handleRemove}
                        />
                    </List>
                    <div style={{float:'right'}}>
                        <Fab aria-label={"new contact"}
                             color={"primary"}
                             style={{position: 'absolute',
                                 right: "7em",
                                bottom: "3em"}}
                             onClick={() =>  setAdd(true)}>
                            <AddIcon />
                        </Fab>
                    </div>
                </div>
            </Slide>

            <Slide aria-label="wallet-detail"
                   direction={"up"}
                   in={add}
                   mountOnEnter unmountOnExit>
                <div style={{height: 350, overflowY: 'scroll'}}>
                    <ContactForm />
                </div>
            </Slide>
        </div>
    );
}
export default ContactsPage
