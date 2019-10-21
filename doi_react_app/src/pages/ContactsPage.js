import React, {useEffect, useGlobal, setGlobal, addCallback} from 'reactn'

import ContactForm from "../components/ContactForm"
import ContactList from "../components/ContactList"

import bitcore from "bitcore-doichain"
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey"
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash"
import List from "@material-ui/core/List";

import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import {useState} from "react";

const ContactsPage = () => {

   // const contacts = useGlobal('contacts')[0]
    const [add, setAdd] = useState(false);
    const wallets = useGlobal("wallets")
    const [ contacts, setContacts ] = useGlobal('contacts')
    const [ openError, setOpenError ] = useGlobal("errors")

    useEffect(() => {
    },[contacts])

    const handleRemove = (id) => {
        console.log('not removing',id)
        return;
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
                        <ContactList
                            contacts={contacts}
                            remove={handleRemove}
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
