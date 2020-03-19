import React, { useGlobal } from "reactn"

import ContactForm from "../components/ContactForm"
import ContactList from "../components/ContactList"

import List from "@material-ui/core/List"

import Slide from "@material-ui/core/Slide"
import Fab from "@material-ui/core/Fab"
import AddIcon from "@material-ui/icons/Add"
import ContactItem from "../components/ContactItem"
import useEventListener from '../hooks/useEventListener';

const ContactsPage = () => {
    const [modus, setModus] = useGlobal("modus")
    const [activeContact] = useGlobal("activeContact")

    useEventListener(document, "backbutton", () => setModus("list"));

    if (modus === "detail") {
        console.log("rendering contactspage", modus)
        console.log("activeContact", activeContact)
        return (
            <div>
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
        )
    } else if (modus === "edit" || modus === "add") {
        return (
            <Slide
                aria-label="contact-detail"
                direction={"up"}
                in={modus === "edit" || modus === "add"}
                mountOnEnter
                unmountOnExit
            >
                <div style={{ height: 400, overflowY: "scroll" }}>
                    <ContactForm />
                </div>
            </Slide>
        )
    } else {
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
                        <List dense={true}>
                            <ContactList />
                        </List>
                        <div style={{ float: "right" }}>
                            <Fab
                                aria-label={"new contact"}
                                color={"primary"}
                                id={"addButton"}
                                style={{ position: "absolute", right: "7em", bottom: "3em" }}
                                onClick={() => setModus("add")}
                            >
                                <AddIcon />
                            </Fab>
                        </div>
                    </div>
                </Slide>
            </div>
        )
    }
}
export default ContactsPage
