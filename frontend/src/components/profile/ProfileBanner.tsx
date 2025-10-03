import {useTheme} from "../../context/ThemeContext.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

interface ProfileBannerProps {
    displayName: string | undefined;
    email: string | undefined;
    isAdmin: boolean | undefined;
    followStatus: boolean | undefined;
}

function ProfileBanner(props: ProfileBannerProps) {
    const {auth, initAuth} = useAuth();
    const {theme} = useTheme();


    return (

    );
}

export default ProfileBanner;