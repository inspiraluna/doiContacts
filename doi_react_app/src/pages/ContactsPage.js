import React, { useEffect, useGlobal, setGlobal, addCallback } from "reactn";

import ContactForm from "../components/ContactForm";
import ContactList from "../components/ContactList";

import List from "@material-ui/core/List";

import Slide from "@material-ui/core/Slide";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { useState } from "react";
import ContactItem from "../components/ContactItem";

const ContactsPage = () => {
  const global = useGlobal()
  const [contacts, setContacts] = useGlobal("contacts")
  const [modus, setModus] = useGlobal("modus")
  const [activeContact, setActiveContact] = useGlobal("activeContact")

  const updateContact = (
    wallet,
    email,
    nameId,
    requestedAt,
    status,
    txId,
    validatorAddress
  ) => {
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
    //setContactItemsChanged(true);
    setModus("detail")
  }

  if (modus === "detail") {
    console.log("rendering contactspage", modus)
    console.log("activeContact", activeContact)
    return (
      <div>
        <h1>Doi Contacts</h1>
        <Slide
          aria-label="contact-detail"
          direction={"up"}
          in={activeContact !== undefined && modus === "detail"}
          mountOnEnter
          unmountOnExit
        >
          <div>
             <ContactItem />
          </div>
        </Slide>
      </div>
    );
  } else if (modus === "edit" || modus === "add") {
    return (
      <Slide
        aria-label="wallet-detail"
        direction={"up"}
        in={modus === "edit" || modus === "add"}
        mountOnEnter
        unmountOnExit
      >
        <div style={{ height: 400, overflowY: "scroll" }}>
          <ContactForm />
        </div>
      </Slide>
    );
  } else {
    console.log("rendering contactspage", modus);
    return (
      <div>
        <Slide
          aria-label="contact-detail"
          direction={"up"}
          in={modus === "list"}
          mountOnEnter
          unmountOnExit
        >
          <div>
            <h1>Doi Contacts</h1>
            <List dense={true}>
              <ContactList />
            </List>
            <div style={{ float: "right" }}>
              <Fab
                aria-label={"new contact"}
                color={"primary"}
                style={{ position: "absolute", right: "7em", bottom: "3em" }}
                onClick={() => setModus('add')}
              >
                <AddIcon />
              </Fab>
            </div>
          </div>
        </Slide>
      </div>
    );
  }
};
export default ContactsPage;
