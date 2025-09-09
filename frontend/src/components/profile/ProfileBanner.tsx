import {useTheme} from "../../context/ThemeContext.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";

interface ProfileBannerProps {
    displayName: string | undefined;
    email: string | undefined;
    isAdmin: boolean | undefined;
}

function ProfileBanner(props: ProfileBannerProps) {
    const {initAuth} = useAuth();
    const {theme} = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        initAuth("", "", "", "");
        navigate("/");
    }

    return (
        <div className={"profile-banner profile-banner-" + theme}>
            <div className="profile-banner-header">
                <div className="profile-banner-image-section">
                    <div className={"profile-banner-image-placeholder profile-banner-image-placeholder-" + theme}>
                        {props.displayName?.substring(0, 1)}
                    </div>
                </div>
                <div className="profile-banner-user-info-section">
                    <div className="profile-banner-user-info-main-group">
                        <div className="profile-banner-user-info-header">
                            <div className="profile-banner-user-info-header-username">
                                {props.displayName}
                            </div>
                            {props.isAdmin ?
                                <div
                                    className={"tooltip profile-banner-user-info-header-badge profile-banner-user-info-header-badge-" + theme}>
                                    <i className="fa-solid fa-shield-halved"></i>
                                    <span className={"tooltiptext tooltiptext-" + theme}>Admin</span>
                                </div> : ""}
                        </div>
                        <div className="profile-banner-user-info-content">
                            {props.email}
                        </div>
                    </div>
                    <div className="profile-banner-user-info-buttons profile-banner-button-group">
                        <button className={"button button-" + theme}><i className="fa-solid fa-image"></i> Change Avatar</button>
                        <button className={"button button-" + theme}><i className="fa-solid fa-life-ring"></i> Support Center</button>
                        <button className={"button button-" + theme} onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileBanner;