import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import ProfileComment from "../item/ProfileComment.tsx";
import {Riple} from "react-loading-indicators";
import Follower from "../item/Follower.tsx";
import ProfileImage from "./ProfileImage.tsx";

interface ProfileType {
    displayName: string;
    email: string;
    admin: boolean;
    biography: string;
    birthYear: string;
}

interface CommentModel {
    commentId: string | undefined;
    userId: string | undefined,
    postId: string | undefined,
    content: string | undefined,
    dateTime: string | undefined
}

interface FollowerModel {
    fromId: string | undefined;
    fromName: string | undefined;
}

function Profile() {
    const {key} = useParams();
    const {auth, initAuth} = useAuth();
    const navigate = useNavigate();
    const {theme} = useTheme();
    const [profile, setProfile] = useState<ProfileType | null>({
        displayName: "",
        email: "",
        biography: "",
        birthYear: "",
        admin: false
    });
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [followerCount, setFollowerCount] = useState(0);
    const [followStatus, setFollowStatus] = useState(false);
    const [followers, setFollowers] = useState<FollowerModel[]>([])
    const [editBiography, setEditBiography] = useState(false);
    const [editBirthYear, setEditBirthYear] = useState(false);
    const [newBiography, setNewBiography] = useState("");
    const [newBirthYear, setNewBirthYear] = useState("");
    const [errorBiography, setErrorBiography] = useState(false);
    const [errorBirthYear, setErrorBirthYear] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fetchedFollowerCount, setFetchedFollowerCount] = useState(false);
    const [fetchedComments, setFetchedComments] = useState(false);
    const [fetchedProfile, setFetchedProfile] = useState(false);

    const handleLogout = () => {
        initAuth("", "", "", "");
        navigate("/");
    }

    const handleFollow = async () => {
        try {
            const createFollowResponse = await fetch("https://bwxor.com/api/follows/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    toId: profile?.email
                }),
            });

            if (!createFollowResponse.ok) {
                const errorData = await createFollowResponse.json();
                console.error(errorData);
            } else {
                setFollowStatus(true);
                fetchFollowCount(profile?.email);
                const newFollower : FollowerModel = {
                    fromId: auth?.id,
                    fromName: auth?.displayName
                };
                setFollowers(followers => [...followers, newFollower]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleUnfollow = async () => {
        try {
            const deleteFollowResponse = await fetch("https://bwxor.com/api/follows/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    toId: profile?.email
                }),
            });

            if (!deleteFollowResponse.ok) {
                const errorData = await deleteFollowResponse.json();
                console.error(errorData);
            } else {
                setFollowStatus(false);
                fetchFollowCount(profile?.email);
                setFollowers(followers.filter(f => f.fromId !== auth?.id));
            }
        } catch (error) {
            console.error(error);
        }
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

    const handleBiographyInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewBiography(event.target.value);
    }

    const handleBirthYearInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewBirthYear(event.target.value);
    }

    const handleBiographySavePress = async () => {
        if (newBiography.trim() === "") {
            setErrorBiography(true);
        } else {
            setErrorBiography(false);

            const response = await fetch("https://bwxor.com/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    email: auth.email,
                    displayName: profile?.displayName,
                    birthYear: profile?.birthYear,
                    biography: newBiography,
                    isAdmin: profile?.admin
                }),
            });

            if (!response.ok) {
                setErrorBiography(true);
            } else {
                if (profile != null) {
                    profile.biography = newBiography;
                }
                setEditBiography(false);
            }
        }
    }

    const handleBirthYearSavePress = async () => {
        if (typeof (newBirthYear) == typeof ("") && newBirthYear.trim() === "") {
            setErrorBirthYear(true);
        } else {
            setErrorBirthYear(false);

            const response = await fetch("https://bwxor.com/api/profile/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    email: auth.email,
                    displayName: profile?.displayName,
                    birthYear: newBirthYear,
                    biography: profile?.biography,
                    isAdmin: profile?.admin
                }),
            });

            if (!response.ok) {
                setErrorBirthYear(true);
            } else {
                if (profile != null) {
                    profile.birthYear = newBirthYear;
                }
                setEditBirthYear(false);
            }
        }
    }

    const fetchFollowCount = async (email: string | undefined) => {
        await fetch("https://bwxor.com/api/follows/count/" + email, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth.token
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setFetchedFollowerCount(true);
                console.log(data);
                setFollowerCount(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const fetchFollowStatus = async (profileData: ProfileType) => {
        await fetch("https://bwxor.com/api/follows/status/" + profileData.email, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth.token
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data == true) {
                    setFollowStatus(data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const fetchComments = async (profileData: ProfileType) => {
        console.log(profileData);

        await fetch("https://bwxor.com/api/comments/user/" + profileData.email)
            .then((response) => {
                setFetchedComments(true);
                return response.json();
            })
            .then((data) => {
                setComments(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const fetchFollowers = async (profileData: ProfileType) => {
        await fetch("https://bwxor.com/api/follows/list/" + profileData.email, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + auth.token
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setFollowers(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        let responseStatus: number;

        if (auth.token == "") {
            navigate("/signin");
        } else {
            fetch("https://bwxor.com/api/profile/find/" + key)
                .then((response) => {
                    setFetchedProfile(true);
                    responseStatus = response.status;
                    return response.json();
                })
                .then((data) => {
                    if (responseStatus == 200) {
                        setProfile(data);
                        fetchFollowCount(data.email);
                        fetchComments(data);
                        fetchFollowStatus(data);
                        fetchFollowers(data);
                    } else {
                        navigate('/profile/' + auth.id);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [key])

    useEffect(() => {
        if (fetchedProfile && fetchedComments && fetchedFollowerCount) {
            setLoading(false);
        }
    })

    return (
        <>
            {loading ?
                <div className="center">
                    {theme == "dark" ?
                        <Riple color="#3c4751" size="medium" text="" textColor=""/>
                        :
                        <Riple color="#D1D1D1" size="medium" text="" textColor=""/>
                    }
                </div>

                :
                <div className="account-group">
                    <div className="account-group-item">
                        <div className={"profile-banner profile-banner-" + theme}>
                            <div className="profile-banner-header">
                                <div className="profile-banner-image-section">
                                    <ProfileImage fullName={profile?.displayName} small={false}></ProfileImage>
                                </div>
                                <div className="profile-banner-user-info-section">
                                    <div className="profile-banner-user-info-main-group">
                                        <div className="profile-banner-user-info-header">
                                            <div className="profile-banner-user-info-header-username">
                                                {profile?.displayName}
                                            </div>
                                            {profile?.admin ?
                                                <div
                                                    className={"tooltip profile-banner-user-info-header-badge profile-banner-user-info-header-badge-" + theme}>
                                                    <i className="fa-solid fa-shield-halved"></i>
                                                    <span className={"tooltiptext tooltiptext-" + theme}>Admin</span>
                                                </div> : ""}
                                        </div>
                                        <div className="profile-banner-user-info-content">
                                            {profile?.email}
                                        </div>
                                    </div>
                                    {auth.email == profile?.email ?
                                        <div className="profile-banner-user-info-buttons profile-banner-button-group">
                                            <button className={"button button-" + theme}><i
                                                className="fa-solid fa-image"></i> Change
                                                Avatar
                                            </button>
                                            <button className={"button button-" + theme}><i
                                                className="fa-solid fa-life-ring"></i> Support Center
                                            </button>
                                            <button className={"button button-" + theme} onClick={handleLogout}><i
                                                className="fa-solid fa-right-from-bracket"></i> Logout
                                            </button>
                                        </div>
                                        :
                                        <div className="profile-banner-user-info-buttons profile-banner-button-group">
                                            {!followStatus ?
                                                (<button onClick={handleFollow} className={"button button-" + theme}><i
                                                    className="fa-solid fa-user-plus"></i> Follow
                                                </button>) :
                                                <button onClick={handleUnfollow} className={"button button-red"}><i
                                                    className="fa-solid fa-user-minus"></i> Unfollow
                                                </button>}
                                        </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="account-group-item">
                        <div className="account-group-label">
                            <span className="fa-solid fa-info-circle"></span> <strong>Biography </strong>
                            {auth.email == profile?.email ?
                                editBiography ?
                                    <div className="delimited-links">
                                        <a href="#" onClick={handleCancelEditBiographyPress}>Cancel</a>
                                        <a href="#" onClick={handleBiographySavePress}>Save</a>
                                    </div> :
                                    <>
                                        <a href="#" onClick={handleEditBiographyPress}>Edit</a>
                                    </>
                                :
                                <></>}
                        </div>
                        <div className={"account-group-content account-group-content-" + theme}>
                            {editBiography ?
                                <>
                                <textarea placeholder="Write something interesting here..."
                                          className={"textarea textarea-" + theme + (errorBiography ? " textarea-error" : "")}
                                          onChange={handleBiographyInputChange}>{profile?.biography}</textarea>
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
                                auth.email == profile?.email ?
                                    editBirthYear ?
                                        <div className="delimited-links">
                                            <a href="#" onClick={handleCancelEditBirthYearPress}>Cancel</a>
                                            <a href="#" onClick={handleBirthYearSavePress}>Save</a>
                                        </div> :
                                        <>
                                            <a href="#" onClick={handleEditBirthYearPress}>Edit</a>
                                        </>
                                    : <></>
                            }
                        </div>
                        <div className={"account-group-content account-group-content-" + theme}>
                            {
                                editBirthYear ?
                                    <input type="number"
                                           className={"textbox textbox-" + theme + (errorBirthYear ? " textbox-error" : "")}
                                           min="1900"
                                           max="2025"
                                           defaultValue={profile?.birthYear} onChange={handleBirthYearInputChange}/>
                                    :
                                    profile?.birthYear
                            }
                        </div>
                    </div>
                    <div className="account-group-item">
                        <div className="account-elements">
                            <div className="account-elements-header">
                                Followers <span className="follower-count">{followerCount}</span>
                            </div>
                            <div className="account-elements-content">
                                <div className="follower-container">
                                    {
                                        followers.map((follower) => <>
                                            <Follower fromId={follower.fromId} fromName={follower.fromName}/>
                                        </>)
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="account-group-item">
                        <div className="account-elements">
                            <div className="account-elements-header">
                                Latest Activity
                            </div>
                            <div className="account-elements-content">
                                {comments.length > 0 ?
                                    <div className="profile-comment-list">
                                        {comments.map((comment) => <ProfileComment key={comment.commentId}
                                                                                   id={comment.commentId}
                                                                                   userId={comment.userId}
                                                                                   postId={comment.postId}
                                                                                   content={comment.content}
                                                                                   date={comment.dateTime}/>)
                                        }

                                    </div>
                                    : "No activity found for this user."
                                }

                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
        ;
}

export default Profile;