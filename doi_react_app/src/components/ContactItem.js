import React, { useGlobal } from "reactn"
import { useTranslation } from "react-i18next"
import Moment from 'react-moment';
import 'moment-timezone';

const ContactItem = () => {
    const [contacts] = useGlobal("contacts")
    const [activeContact] = useGlobal("activeContact")
    const [t] = useTranslation()

    return (
        <div>
            {t("contactItem.created")}:
            <Moment format="YYYY-MM-DD hh-mm-ss">{contacts[activeContact].requestedAt}</Moment>
            <br />
            {t("contactItem.email")}: {contacts[activeContact].email}
            <br />
            {t("contactItem.nameId")}: {contacts[activeContact].nameId}
            <br />
            {t("contactItem.txId")}: {contacts[activeContact].txid}
            <br />
            {t("contactItem.status")}: {contacts[activeContact].status}
            <br />
            {t("contactItem.validatorAddress")}: {contacts[activeContact].validatorAddress}
            <br />
        </div>
    )
}

export default ContactItem
