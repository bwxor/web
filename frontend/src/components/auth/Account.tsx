import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";

interface ProfileType {
    isAdmin: boolean;
    biography: string;
    birthYear: string;
}

function Account() {
    const {auth, initAuth} = useAuth();
    const navigate = useNavigate();
    const {theme} = useTheme();
    const [profile, setProfile] = useState<ProfileType | null>({biography: "", birthYear: "", isAdmin: false});

    const [editBiography, setEditBiography] = useState(false);
    const [editBirthYear, setEditBirthYear] = useState(false);

    const handleLogoutPress = () => {
        initAuth("", "", "");
        navigate("/");
    }

    const handleEditBiographyPress = () => {
        setEditBirthYear(false);
        setEditBiography(true);
    }

    const handleEditBirthYearPress = () => {
        setEditBiography(false);
        setEditBirthYear(true);
    }

    const handleCancelEditBiographyPress = () => {
        setEditBiography(false);
    }

    const handleCancelEditBirthYearPress = () => {
        setEditBirthYear(false);
    }

    useEffect(() => {
        if (auth.token == "") {
            navigate("/signin");
        } else {
            fetch("https://bwxor.com/api/profile/" + auth.id)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setProfile(data);
                })
                .catch((error) => console.error(error));
        }
    }, [])

    return (
        <>
            <div className="account-group">
                <div className="account-group-item">
                    <div className="account-group-header">
                        <div className="account-group-header-title">
                            {auth.displayName}
                        </div>
                        <div className="account-group-header-logout">
                            <a href="#" onClick={handleLogoutPress}>Logout</a>
                        </div>
                    </div>
                </div>
                <div className="account-group-item">
                    <div className="account-group-label">
                        <span className="fa-solid fa-envelope"></span> <strong>E-Mail Address</strong>
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        {auth.email}
                    </div>
                </div>
                <div className="account-group-item">
                    <div className="account-group-label">
                        <span className="fa-solid fa-ranking-star"></span> <strong>Rank</strong>
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        {profile != null && profile.isAdmin ?
                            "Admin" : "Member"
                        }
                    </div>
                </div>
                <div className="account-group-item">
                    <div className="account-group-label">
                        <span className="fa-solid fa-info-circle"></span> <strong>Biography </strong>
                        {editBiography ?
                            <div className="delimited-links">
                                <a href="#" onClick={handleCancelEditBiographyPress}>Cancel</a>
                                <a href="#" onClick={handleEditBiographyPress}>Save</a>
                            </div> :
                            <>
                                <a href="#" onClick={handleEditBiographyPress}>Edit</a>
                            </>
                        }
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        {editBiography ?
                            <>
                                <textarea placeholder="Write something interesting here..."
                                          className={"textarea textarea-" + theme}>{profile?.biography}</textarea>
                            </>
                            :
                            profile?.biography
                        }
                    </div>
                </div>
                <div className="account-group-item">
                    <div className="account-group-label">
                        <span className="fa-solid fa-calendar"></span> <strong>Birth year </strong>
                        {
                            editBirthYear ?
                                <div className="delimited-links">
                                    <a href="#" onClick={handleCancelEditBirthYearPress}>Cancel</a>
                                    <a href="#" onClick={handleEditBirthYearPress}>Save</a>
                                </div> :
                                <>
                                    <a href="#" onClick={handleEditBirthYearPress}>Edit</a>
                                </>
                        }
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        {
                            editBirthYear ?
                                <input type="number" className={"textbox textbox-" + theme}
                                       min="1900"
                                       max="2025"
                                       defaultValue={profile?.birthYear}/>
                                :
                                profile?.birthYear
                        }
                    </div>
                </div>
            </div>

        </>
    )
        ;
}

export default Account;