import React from "react";
import Contact from "./Contact";

const ContactList = ({contacts, remove}) => {
    const contactNode = contacts.map((contact, index) => {
        return (<Contact contact={contact} key={index} remove={remove}/>)
    });
    return (<ul>{contactNode}</ul>);
}

export default ContactList
