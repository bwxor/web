import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useEffect, useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import {Riple} from "react-loading-indicators";

interface MessageBoxProps {
    email: string | undefined;
    fullName: string | undefined;
}

interface Message {
    senderId: string | undefined;
    receiverId: string | undefined;
    content: string | undefined;
}

function MessageBox(props: MessageBoxProps) {
    const {auth} = useAuth();
    const {theme} = useTheme();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = new SockJS(`${import.meta.env.VITE_BACKEND_URL}/chat`);
        const stompClient = Stomp.over(socket);

        const headers = {
            "Authorization": "Bearer " + auth.token
        }

        stompClient?.connect(headers, () => {
            setLoading(false);
            stompClient.subscribe('/user/topic/private', function (message: Stomp.Message) {
                const body = JSON.parse(message.body);
                console.log(body);

                setMessages(m => [...m, body]);
            })
        }, (err) => {
            console.error(err);
        });

        setStompClient(stompClient);

        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                });
            }
        };
    }, [props.email]);

    // todo: replace with db call
    const DUMMY_MESSAGES: Message[] = [
        {id: "m1", senderId: auth.email, receiverId: props.email, content: "These are just demo messages."},
        {id: "m2", senderId: props.email, receiverId: auth.email, content: "They will get replaced with actual DB calls."},
    ];

    const [messages, setMessages] = useState<Message[]>([]);
    const [messageToSend, setMessageToSend] = useState<string>();
    const [stompClient, setStompClient] = useState<Stomp.Client>();

    useEffect(() => {
        setMessages(DUMMY_MESSAGES);
    }, [props.email]);

    const sendMessage = () => {
        if (messageToSend?.trim()) {
            const chatMessage = {
                senderId: auth.email,
                receiverId: props.email,
                content: messageToSend?.trim()
            }
            stompClient?.send("/controller/sendMessage", {}, JSON.stringify(chatMessage));

            setMessages((m) => [...m, chatMessage]);
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageToSend(event.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
            setMessageToSend("");
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
                ) :
                (
                    <div className={"message-container"}>
                        <div className={"message-container-top"}>
                            {
                                messages?.map((message) => {
                                    return <div key={message.id}
                                                className={"message-row message-row-" + (message.senderId == auth.email ? "sender" : "receiver")}>
                                        <div className={"message message-" + theme}>
                                            <div className={"message-name message-name-" + theme}>
                                                {message.senderId == auth.email ? "You" : props.fullName}
                                            </div>
                                            <div className={"message-content"}>
                                                {message.content}
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <div className={"message-container-bottom"}>
                    <textarea placeholder="Type in a message..."
                              className={"textarea textarea-" + theme + " chat-textarea"} onKeyDown={handleKeyDown}
                              onChange={handleChange} value={messageToSend}/>
                        </div>
                    </div>
                )
            }
        </>
    );
}

export default MessageBox;