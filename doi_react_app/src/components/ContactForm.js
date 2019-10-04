import React from "react";

const ContactForm = ({addContact}) => {
  let input;

  const handleAddContact = () => {
        addContact(input.value);
        input.value = '';
  }

  const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            addContact(input.value)
            input.value = '';
        }
  }

  return (
    <div>
      <input onKeyPress={handleKeyPress} ref={node => {
        input = node;
      }} />
      <button  onClick={handleAddContact}> + </button>
    </div>
  );
};

export default ContactForm
