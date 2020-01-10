import React,  { useGlobal } from "reactn";

const ContactItem = () => {
  const [contacts] = useGlobal("contacts");
  const [activeContact] = useGlobal("activeContact");

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
