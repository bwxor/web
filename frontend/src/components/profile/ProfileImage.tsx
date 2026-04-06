import {useTheme} from "../../context/ThemeContext.tsx";

interface ProfileImageProps {
    fullName: string | undefined;
    small: boolean | undefined;
}

function ProfileImage(props: ProfileImageProps) {
    const {theme} = useTheme();

    return (
        <div
            className={"profile-banner-image-placeholder" + (props.small ? "-small" : "") + " profile-banner-image-placeholder-" + theme}>
            {props.fullName?.substring(0, 1)}
        </div>
    );
}

export default ProfileImage;