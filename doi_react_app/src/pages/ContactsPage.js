import React, {useEffect, useGlobal, setGlobal, addCallback} from 'reactn'

import ContactForm from "../components/ContactForm"
import ContactList from "../components/ContactList"

import List from "@material-ui/core/List";

import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";
import ContactItem from "../components/ContactItem";

const ContactsPage = () => {

    const [add, setAdd] = useState(false);
    const [contactItemsChanged, setContactItemsChanged] = useState(false)
    const [ contacts, setContacts ] = useGlobal('contacts')
    const [modus, setModus] = useGlobal("modus")
    const [activeContact, setActiveContact ] = useGlobal("activeContact")

    useEffect(() => {
    },[contacts])

    const handleRemove = (index) => {
        const currentContacts = contacts
        currentContacts.splice(index, 1);
        setContacts(currentContacts)
    }

    const updateContact = (wallet,email,nameId,requestedAt,status,txId,validatorAddress) => {

        const contact = contacts[activeContact]
        contact.wallet = wallet
        contact.email = email
        contact.nameId = nameId
        contact.requestedAt = requestedAt
        contact.status = status
        contact.txId = txId
        contact.validatorAddress = validatorAddress

        contacts[activeContact] = contact
        setContacts(contacts)
        setContactItemsChanged(true);
        setModus('detail')
    }

    useEffect(() => {
        setContactItemsChanged(false)
    },[contactItemsChanged])

    if(global.modus==='detail') {
        return (
            <div>
                <h1>Doi Contacts</h1>
                <Slide aria-label="contact-detail"
                               direction={"up"}
                               in={activeContact !== undefined && modus === 'detail'}
                               mountOnEnter unmountOnExit>
                            <div>
                                <ContactItem
                                    wallet={contacts[activeContact].wallet}
                                    email={contacts[activeContact].email}
                                    nameId={contacts[activeContact].nameId}
                                    requestedAt={contacts[activeContact].requestedAt}
                                    status={contacts[activeContact].status}
                                    txId={contacts[activeContact].txId}
                            validatorAddress={contacts[activeContact].validatorAddress}
                            />
                    </div>
                </Slide>
            </div>)
    }
    else{
        return (
            <div>
                <Slide aria-label="contact-detail"
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
                    <div style={{height: 400, overflowY: 'scroll'}}>
                        <ContactForm />
                    </div>
                </Slide>
            </div>
        );
    }
}
export default ContactsPage
