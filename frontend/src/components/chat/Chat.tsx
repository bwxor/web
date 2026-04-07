import {useEffect, useState} from "react";
import ContactBox from "./ContactBox.tsx";
import {useTheme} from "../../context/ThemeContext.tsx";
import MessageBox from "./MessageBox.tsx";
import {Riple} from "react-loading-indicators";
import {useAuth} from "../../context/AuthenticationContext.tsx";

interface Contact {
    email: string | undefined,
    displayName: string | undefined,
    birthYear: number | undefined,
    biography: string | undefined,
    id: string | undefined
}

function Chat() {
    const {theme} = useTheme();
    const {auth} = useAuth();
    const [contacts, setContacts] = useState<Contact[]>();
    const [displayedContacts, setDisplayedContacts] = useState<Contact[]>();
    const [selectedContact, setSelectedContact] = useState<Contact>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/find/`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                const dataItem = data.item.filter((item: Contact) => item.email?.localeCompare(auth.email) != 0);
                setContacts(dataItem);
                setDisplayedContacts(dataItem);
                setLoading(false);
            })
            .catch((error) => console.error(error));
    }, []);

    const onContactClick = (contact: Contact) => {
        setSelectedContact(contact);
    }

    const searchContacts = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = event.target.value;

        if (key.length != 0) {
            setDisplayedContacts(contacts?.filter(
                contact => contact.displayName?.toLowerCase().includes(key.toLowerCase()) || contact.id?.toLowerCase()?.includes(key.toLowerCase())
            ));
        } else {
            setDisplayedContacts(contacts);
        }
    }

    return (
        <>
            {loading ?
                (
                    <div className="center">
                        {theme == "dark" ?
                            <Riple color="#3c4751" size="medium" text="" textColor=""/>
                            :
                            <Riple color="#D1D1D1" size="medium" text="" textColor=""/>
                        }
                    </div>
                )
                :
                (
                    <div className="chat-container">
                        <div className="chat-container-left">
                            <input type="text" placeholder="Search for a contact name..."
                                   className={"textbox textbox-" + theme} onChange={searchContacts}>
                            </input>
                            <div className={"contact-list"}>
                                {displayedContacts?.map((contact) => <ContactBox key={contact.id} id={contact.id}
                                                                        fullName={contact.displayName}
                                                                        selected={(contact.id == selectedContact?.id)}
                                                                        onClick={() => onContactClick(contact)}/>)}
                            </div>
                        </div>
                        <div className="chat-container-right">
                            {
                                selectedContact ?
                                    <MessageBox id={selectedContact?.id} fullName={selectedContact?.displayName}/>
                                    :
                                    <div className={"chat-prompt"}>
                                        <div className={"chat-prompt-items"}>
                                            <div className={"chat-prompt-item chat-prompt-item-big"}>
                                                <i className={"fa-solid fa-comment-alt"}/>
                                            </div>
                                            <div className={"chat-prompt-item"}>
                                                Select a contact and begin texting. It's free!
                                            </div>
                                        </div>
                                    </div>
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default Chat;