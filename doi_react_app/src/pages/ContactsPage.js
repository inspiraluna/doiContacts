import React, {useEffect, useGlobal, setGlobal, addCallback} from 'reactn'

import ContactForm from "../components/ContactForm"
import ContactList from "../components/ContactList"

import List from "@material-ui/core/List";

import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";
import WalletItem from "../components/WalletItem";
import Button from "@material-ui/core/Button";
import {ComponentHead} from "./WalletsPage";
import ContactItem from "../components/ContactItem";

const ContactsPage = () => {

    const [add, setAdd] = useState(false);
    const [contactItemsChanged, setContactItemsChanged] = useState(false)
    const [ contacts, setContacts ] = useGlobal('contacts')
    const [modus, setModus] = useGlobal("modus")
    const [activeContact, setActiveContact ] = useGlobal("activeContact")
    const [global] = useGlobal()

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
                               in={activeContact !== undefined && global.modus === 'detail'}
                               mountOnEnter unmountOnExit>
                            <div>
                                <ContactItem
                                    wallet={global.contacts[global.activeContact].wallet}
                                    email={global.contacts[global.activeContact].email}
                                    nameId={global.contacts[global.activeContact].nameId}
                                    requestedAt={global.contacts[global.activeContact].requestedAt}
                                    status={global.contacts[global.activeContact].status}
                                    txId={global.contacts[global.activeContact].txId}
                            validatorAddress={global.contacts[global.activeContact].validatorAddress}
                            />
                    </div>
                </Slide>
            </div>)
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
