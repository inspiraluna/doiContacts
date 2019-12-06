import React from 'react';

const ContactItem = ({
                         wallet,
                         email,
                         nameId,
                         requestedAt,
                         status,
                         txId,
                         validatorAddress
                     }) => {

    return (
        <div>
            <div style={{"fontSize": "9px", "border": '2px solid lightgrey'}}>

                <label htmlFor={"requestedAt"}>Created: </label>{requestedAt}<br/>
                <label htmlFor={"email"}>Email: </label>{email}<br/>
                <label htmlFor={"nameId"}></label>NameId: {nameId}<br/>
                <label htmlFor={"wallet"}></label>Wallet: {wallet}<br/>
                <label htmlFor={"txId"}></label>txId: {txId}<br/>
                <label htmlFor={"status"}></label>Status: {status}<br/>
                <label htmlFor={"validatorAddress"}></label>ValidatorAddress: {validatorAddress}><br/>

            </div>
        </div>
    )
}


export default ContactItem;
