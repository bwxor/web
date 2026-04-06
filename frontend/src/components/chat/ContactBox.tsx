import {useTheme} from "../../context/ThemeContext.tsx";
import ProfileImage from "../profile/ProfileImage.tsx";

interface ContactProps {
    id: string | undefined;
    fullName: string | undefined;
    selected: boolean | undefined;
    onClick: () => void;
}

function ContactBox(props: ContactProps) {
    const {theme} = useTheme();

    return (
        <div className={"contact-box contact-box-" + theme + (props.selected ? " contact-box-selected-" + theme : "")}
             onClick={props.onClick}>
            <div className={"contact-box-left"}>
                <ProfileImage fullName={props.fullName} small={true}></ProfileImage>
            </div>
            <div className={"contact-box-right"}>
                <div className={"contact-box-name"}>
                    {props.fullName}
                </div>
                <div className={"contact-box-id contact-box-id-" + theme}>
                    {props.id}
                </div>
            </div>
        </div>
    );
}

export default ContactBox;