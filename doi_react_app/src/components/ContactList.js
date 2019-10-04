import React from "react";
import Contact from "./Contact";


const ContactList = ({contacts, remove}) => {
    const contactNode = contacts.map((contact) => {
        return (<Contact contact={contact} key={contact.ID} remove={remove}/>)
    });
    return (<ul>{contactNode}</ul>);
}

export default ContactList