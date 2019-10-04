import React from "react";

const Contact = ({contact, remove}) => {
    return (<li onClick={() => { remove(contact.id)}}>{contact.email}
    <input readOnly={true} type={"checkbox"}
           checked={contact.confirmed}/></li> );
}

export default Contact