import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";

interface ProfileType {
    admin: boolean;
    biography: string;
    birthYear: string;
}

function Account() {
    const {auth, initAuth} = useAuth();
    const navigate = useNavigate();
    const {theme} = useTheme();
    const [profile, setProfile] = useState<ProfileType | null>({biography: "", birthYear: "", admin: false});

    const [editBiography, setEditBiography] = useState(false);
    const [editBirthYear, setEditBirthYear] = useState(false);
    const [newBiography, setNewBiography] = useState("");
    const [newBirthYear, setNewBirthYear] = useState("");
    const [errorBiography, setErrorBiography] = useState(false);
    const [errorBirthYear, setErrorBirthYear] = useState(false);

    const handleLogoutPress = () => {
        initAuth("", "", "");
        navigate("/");
    }

    const handleEditBiographyPress = () => {
        setNewBiography(profile?.biography ?? "");
        setEditBirthYear(false);
        setEditBiography(true);
    }

    const handleEditBirthYearPress = () => {
        setNewBirthYear(profile?.birthYear ?? "");
        setEditBiography(false);
        setEditBirthYear(true);
    }

    const handleCancelEditBiographyPress = () => {
        setErrorBiography(false);
        setEditBiography(false);
    }

    const handleCancelEditBirthYearPress = () => {
        setErrorBirthYear(false);
        setEditBirthYear(false);
    }

    const handleBiographyInputChange = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewBiography(event.target.value);
    }

    const handleBirthYearInputChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setNewBirthYear(event.target.value);
    }

    const handleBiographySavePress = async () => {
        if (newBiography.trim() === "") {
            setErrorBiography(true);
        }
        else {
            setErrorBiography(false);

            const response = await fetch("https://bwxor.com/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    email: auth.email,
                    birthYear: profile?.birthYear,
                    biography: newBiography,
                    admin: profile?.admin
                }),
            });

            if (!response.ok) {
                setErrorBiography(true);
            }
            else {
                if (profile != null) {
                    profile.biography = newBiography;
                }
                setEditBiography(false);
            }
        }
    }

    const handleBirthYearSavePress = async () => {
        if (typeof(newBirthYear) == typeof("") && newBirthYear.trim() === "") {
            setErrorBirthYear(true);
        }
        else {
            setErrorBirthYear(false);

            const response = await fetch("https://bwxor.com/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    email: auth.email,
                    birthYear: newBirthYear,
                    biography: profile?.biography,
                    admin: profile?.admin
                }),
            });

            if (!response.ok) {
                setErrorBirthYear(true);
            }
            else {
                if (profile != null) {
                    profile.birthYear = newBirthYear;
                }
                setEditBirthYear(false);
            }
        }
    }

    useEffect(() => {
        if (auth.token == "") {
            navigate("/signin");
        } else {
            fetch("https://bwxor.com/api/profile/find/" + auth.email)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
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
                        {profile != null && profile.admin ?
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
                                <a href="#" onClick={handleBiographySavePress}>Save</a>
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
                                          className={"textarea textarea-" + theme + (errorBiography ? " textarea-error" : "")} onChange={handleBiographyInputChange}>{profile?.biography}</textarea>
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
                                    <a href="#" onClick={handleBirthYearSavePress}>Save</a>
                                </div> :
                                <>
                                    <a href="#" onClick={handleEditBirthYearPress}>Edit</a>
                                </>
                        }
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        {
                            editBirthYear ?
                                <input type="number" className={"textbox textbox-" + theme + (errorBirthYear ? " textbox-error" : "")}
                                       min="1900"
                                       max="2025"
                                       defaultValue={profile?.birthYear} onChange={handleBirthYearInputChange}/>
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