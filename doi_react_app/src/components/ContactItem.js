import React,  { useGlobal, setGlobal } from "reactn";

const ContactItem = () => {
  const [contacts, setContacts] = useGlobal("contacts");
  const [activeContact, setActiveContact] = useGlobal("activeContact");

  return (
    <div>
      Created: {contacts[activeContact].requestedAt}
      <br />
      Email: {contacts[activeContact].email}
      <br />
      NameId: {contacts[activeContact].nameId}
      <br />
      txId: {contacts[activeContact].txid}
      <br />
      Status: {contacts[activeContact].status}
      <br />
      ValidatorAddress: {contacts[activeContact].validatorAddress}<br />
    </div>
  );
};

export default ContactItem;
