import React, {useEffect, useGlobal, setGlobal, addCallback} from 'reactn'

import ContactForm from "../components/ContactForm"
import ContactList from "../components/ContactList"

import bitcore from "bitcore-doichain"
import getPublicKey from "bitcore-doichain/lib/doichain/getPublicKey"
import getDataHash from "bitcore-doichain/lib/doichain/getDataHash"
import List from "@material-ui/core/List";
import ReactSwipe from 'react-swipe';

const ContactsPage = () => {

   // const contacts = useGlobal('contacts')[0]
    const wallets = useGlobal("wallets")
    const [ contacts, setContacts ] = useGlobal('contacts');
    const [ openError, setOpenError ] = useGlobal("errors")
    const [ scanSwipe, setScanSwipe ] = useGlobal('scanSwipe');

    useEffect(() => {
    },[contacts])

    const handleRemove = (id) => {
        console.log('not removing',id)
        return;

    }
    let reactSwipeEl;

    addCallback(global => {
        if(reactSwipeEl && global.scanSwipe !== undefined){
            if(global.scanSwipe) reactSwipeEl.next()
            else reactSwipeEl.prev()
        }
        return null;
    });

    return (
        <div>
            <ReactSwipe
                className="carousel"
                swipeOptions={{ continuous: false }}
                ref={el => (reactSwipeEl = el)}
                styles={
                    {
                    container: {
                    overflow: 'hidden',
                    visibility: 'hidden',
                    position: 'relative'
                    },
                    wrapper: {
                        overflow: 'hidden',
                        position: 'relative'
                    },
                    child: {
                        float: 'left',
                        width: '100%',
                        position: 'relative',
                        transitionProperty: 'transform'
                    }}
                }
            >
                <div>
                    <h1>Doi Contacts</h1>
                    <List dense={true}>
                        <ContactList
                            contacts={contacts}
                            remove={handleRemove}
                        />
                    </List>
                </div>

                <div style={{height: 350, overflowY: 'scroll'}}>
                    <ContactForm />
                </div>

            </ReactSwipe>
        </div>
    );
}
export default ContactsPage
