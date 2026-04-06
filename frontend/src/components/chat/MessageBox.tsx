import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useEffect, useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";

interface ChatBoxProps {
    id: string | undefined;
    fullName: string | undefined;
}

interface Message {
    id: string | undefined;
    senderId: string | undefined;
    receiverId: string | undefined;
    content: string | undefined;
}

function MessageBox(props: ChatBoxProps) {
    const {auth} = useAuth();
    const {theme} = useTheme();

    const DUMMY_MESSAGES: Message[] = [
        { id: "m1", senderId: auth.id, receiverId: props.id, content: "Hello!" },
        { id: "m2", senderId: props.id, receiverId: auth.id, content: "Hi there. What's up?" },
        { id: "m3", senderId: auth.id, receiverId: props.id, content: "Nothing much. How about you?" },
        { id: "m4", senderId: props.id, receiverId: auth.id, content: "I'm fine. See you soon :)" },
        { id: "m5", senderId: auth.id, receiverId: props.id, content: "Hey! Did you finish that report yet?" },
        { id: "m6", senderId: props.id, receiverId: auth.id, content: "Just about. I'm just double-checking the charts." },
        { id: "m7", senderId: auth.id, receiverId: props.id, content: "Great, no rush. I was just curious." },
        { id: "m8", senderId: props.id, receiverId: auth.id, content: "Actually, can you take a look at the third page?" },
        { id: "m9", senderId: auth.id, receiverId: props.id, content: "Sure thing, send it over whenever you're ready." },
        { id: "m10", senderId: props.id, receiverId: auth.id, content: "Sent! Check your email." },
        { id: "m11", senderId: auth.id, receiverId: props.id, content: "Got it. Looks solid at first glance." },
        { id: "m12", senderId: props.id, receiverId: auth.id, content: "Awesome. Do we need to meet with the design team?" },
        { id: "m13", senderId: auth.id, receiverId: props.id, content: "Probably tomorrow morning. Does 10 AM work?" },
        { id: "m14", senderId: props.id, receiverId: auth.id, content: "10 AM is perfect. See you then!" },
        { id: "m15", senderId: auth.id, receiverId: props.id, content: "Perfect. Have a good evening!" },
        { id: "m16", senderId: props.id, receiverId: auth.id, content: "You too! 🌙" },
        { id: "m17", senderId: auth.id, receiverId: props.id, content: "Wait, one more thing." },
        { id: "m18", senderId: props.id, receiverId: auth.id, content: "Yeah? What's up?" },
        { id: "m19", senderId: auth.id, receiverId: props.id, content: "Did you see the latest update on the Jira ticket?" },
        { id: "m20", senderId: props.id, receiverId: auth.id, content: "Not yet, I've been offline for an hour." },
        { id: "m21", senderId: auth.id, receiverId: props.id, content: "The client wants the logo to be slightly larger." },
        { id: "m22", senderId: props.id, receiverId: auth.id, content: "Again? We just changed it yesterday lol." },
        { id: "m23", senderId: auth.id, receiverId: props.id, content: "I know, I know. Just standard stuff." },
        { id: "m24", senderId: props.id, receiverId: auth.id, content: "I'll handle it after lunch." },
        { id: "m25", senderId: auth.id, receiverId: props.id, content: "Speaking of lunch, are you heading out?" },
        { id: "m26", senderId: props.id, receiverId: auth.id, content: "Thinking about the deli down the street." },
        { id: "m27", senderId: auth.id, receiverId: props.id, content: "The one with the great pastrami?" },
        { id: "m28", senderId: props.id, receiverId: auth.id, content: "That's the one. Want anything?" },
        { id: "m29", senderId: auth.id, receiverId: props.id, content: "A turkey club would be amazing." },
        { id: "m30", senderId: props.id, receiverId: auth.id, content: "You got it. Be back in 20." },
        { id: "m31", senderId: auth.id, receiverId: props.id, content: "Thanks! I'll Venmo you." },
        { id: "m32", senderId: props.id, receiverId: auth.id, content: "Don't worry about it, you got me last time." },
        { id: "m33", senderId: auth.id, receiverId: props.id, content: "Fair enough. See ya." },
        { id: "m34", senderId: props.id, receiverId: auth.id, content: "Back now. Your sandwich is on your desk." },
        { id: "m35", senderId: auth.id, receiverId: props.id, content: "Legend! This looks delicious." },
        { id: "m36", senderId: props.id, receiverId: auth.id, content: "Enjoy! Anyway, back to that logo." },
        { id: "m37", senderId: auth.id, receiverId: props.id, content: "Right. How much bigger do they want it?" },
        { id: "m38", senderId: props.id, receiverId: auth.id, content: "They said 'make it pop'. So... 10%?" },
        { id: "m39", senderId: auth.id, receiverId: props.id, content: "The classic 'make it pop' feedback. Classic." },
        { id: "m40", senderId: props.id, receiverId: auth.id, content: "I'll try 15% and see if they notice." },
        { id: "m41", senderId: auth.id, receiverId: props.id, content: "Sounds like a plan." },
        { id: "m42", senderId: props.id, receiverId: auth.id, content: "Hey, are you seeing that bug in the footer?" },
        { id: "m43", senderId: auth.id, receiverId: props.id, content: "Which one? The overlapping text?" },
        { id: "m44", senderId: props.id, receiverId: auth.id, content: "Yeah, only on mobile Safari though." },
        { id: "m45", senderId: auth.id, receiverId: props.id, content: "Ugh, Safari is the new IE." },
        { id: "m46", senderId: props.id, receiverId: auth.id, content: "Truly. I'll try to find a workaround." },
        { id: "m47", senderId: auth.id, receiverId: props.id, content: "Check the z-index, might be that." },
        { id: "m48", senderId: props.id, receiverId: auth.id, content: "Good call. I'll check." },
        { id: "m49", senderId: auth.id, receiverId: props.id, content: "By the way, are you coming to the party Friday?" },
        { id: "m50", senderId: props.id, receiverId: auth.id, content: "I'm still 50/50 on it." },
        { id: "m51", senderId: auth.id, receiverId: props.id, content: "Why's that? It's going to be fun." },
        { id: "m52", senderId: props.id, receiverId: auth.id, content: "Just a long week. Might just want to sleep." },
        { id: "m53", senderId: auth.id, receiverId: props.id, content: "I feel that. But there will be free pizza." },
        { id: "m54", senderId: props.id, receiverId: auth.id, content: "Okay, you convinced me at 'free pizza'." },
        { id: "m55", senderId: auth.id, receiverId: props.id, content: "I knew that would work." },
        { id: "m56", senderId: props.id, receiverId: auth.id, content: "What time does it start?" },
        { id: "m57", senderId: auth.id, receiverId: props.id, content: "Around 7 PM at the main hall." },
        { id: "m58", senderId: props.id, receiverId: auth.id, content: "Cool. I'll be there." },
        { id: "m59", senderId: auth.id, receiverId: props.id, content: "Don't forget the HDMI adapter this time." },
        { id: "m60", senderId: props.id, receiverId: auth.id, content: "I have it in my bag already! Lesson learned." },
        { id: "m61", senderId: auth.id, receiverId: props.id, content: "Haha, nice. Preparation is key." },
        { id: "m62", senderId: props.id, receiverId: auth.id, content: "Did you finish the sprint planning notes?" },
        { id: "m63", senderId: auth.id, receiverId: props.id, content: "Drafted them. Need to polish the action items." },
        { id: "m64", senderId: props.id, receiverId: auth.id, content: "Send them my way when you can." },
        { id: "m65", senderId: auth.id, receiverId: props.id, content: "Will do. Just adding the deadline dates." },
        { id: "m66", senderId: props.id, receiverId: auth.id, content: "Perfect. We need to be clear on those." },
        { id: "m67", senderId: auth.id, receiverId: props.id, content: "Agreed. Stakeholders are watching closely." },
        { id: "m68", senderId: props.id, receiverId: auth.id, content: "They always are." },
        { id: "m69", senderId: auth.id, receiverId: props.id, content: "Alright, coffee break?" },
        { id: "m70", senderId: props.id, receiverId: auth.id, content: "Desperately needed. Meet you at the machine?" },
        { id: "m71", senderId: auth.id, receiverId: props.id, content: "Give me 2 minutes." },
        { id: "m72", senderId: props.id, receiverId: auth.id, content: "No rush. See ya." }
    ];

    const [messages, setMessages] = useState<Message[]>();

    useEffect(() => {
        setMessages(DUMMY_MESSAGES);
    }, [props.id]);

    return (
        <>
            <div className={"message-container"}>
                <div className={"message-container-top"}>
                    {
                        messages?.map((message) => {
                            return <div key={message.id}
                                        className={"message-row message-row-" + (message.senderId == auth.id ? "sender" : "receiver")}>
                                <div className={"message message-" + theme}>
                                    <div className={"message-name message-name-" + theme}>
                                        {message.senderId == auth.id ? "You" : props.fullName}
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
                              className={"textarea textarea-" + theme + " chat-textarea"}/>
                </div>
            </div>
        </>
    );
}

export default MessageBox;