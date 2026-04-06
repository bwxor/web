import {useEffect, useState} from "react";
import ContactBox from "./ContactBox.tsx";
import {useTheme} from "../../context/ThemeContext.tsx";
import MessageBox from "./MessageBox.tsx";

interface Contact {
    id: string | undefined,
    fullName: string | undefined,
}

function Chat() {
    // ToDo: replace with DB call
    const DUMMY_CONTACTS: Contact[] = [
        {
            id: "alexrivera",
            fullName: "Alex Rivera"
        },
        {
            id: "mayawright",
            fullName: "Maya Wright"
        },
        {
            id: "jordansmith",
            fullName: "Jordan Smith"
        },
        {
            id: "lucasnguyen",
            fullName: "Lucas Nguyen"
        },
        {
            id: "sarahjenkins",
            fullName: "Sarah Jenkins"
        },
        {
            id: "oscarvazquez",
            fullName: "Oscar Vazquez"
        },
        {
            id: "chloebell",
            fullName: "Chloe Bell"
        },
        {
            id: "samuellee",
            fullName: "Samuel Lee"
        },
        {
            id: "isabellacruz",
            fullName: "Isabella Cruz"
        },
        {
            id: "ethanhunt",
            fullName: "Ethan Hunt"
        },
        {
            id: "ninaahmed",
            fullName: "Nina Ahmed"
        },
        {
            id: "marcusreed",
            fullName: "Marcus Reed"
        }
    ];

    const {theme} = useTheme();
    const [contacts, setContacts] = useState<Contact[]>();
    const [selectedContact, setSelectedContact] = useState<Contact>();

    useEffect(() => {
        setContacts(DUMMY_CONTACTS);
    }, []);

    const onContactClick = (contact: Contact) => {
        setSelectedContact(contact);
    }

    return (
        <>
            <div className="chat-container">
                <div className="chat-container-left">
                    <input type="text" placeholder="Search for a contact name..."
                           className={"textbox textbox-" + theme}>
                    </input>
                    <div className={"contact-list"}>
                        {contacts?.map((contact) => <ContactBox key={contact.id} id={contact.id}
                                                                fullName={contact.fullName}
                                                                selected={(contact.id == selectedContact?.id)}
                                                                onClick={() => onContactClick(contact)}/>)}
                    </div>
                </div>
                <div className="chat-container-right">
                    {
                        selectedContact ?
                            <MessageBox id={selectedContact?.id} fullName={selectedContact?.fullName}/>
                            :
                            <div className={"chat-prompt"}>
                                <div className={"chat-prompt-items"}>
                                    <div className={"chat-prompt-item chat-prompt-item-big"}>
                                        <i className={"fa-solid fa-comment-alt"} />
                                    </div>
                                    <div className={"chat-prompt-item"}>
                                        Select a contact and begin texting. It's free!
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Chat;