import {useEffect} from "react";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useNavigate} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";

function Account() {
    const {auth} = useAuth();
    const navigate = useNavigate();
    const {theme} = useTheme();

    useEffect(() => {
        if (auth.token == "") {
            navigate("/login");
        }
    }, [])

    return (
        <>
            <div className="account-group">
                <div className="account-group-item">
                    <h1>{auth.displayName}</h1>
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
                        Member
                    </div>
                </div>
                <div className="account-group-item">
                    <div className="account-group-label">
                        <span className="fa-solid fa-info-circle"></span> <strong>Biography</strong> <a href="#">Edit</a>
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        Write something about yourself...
                    </div>
                </div>
                <div className="account-group-item">
                    <div className="account-group-label">
                        <span className="fa-solid fa-calendar"></span> <strong>Birth year</strong> <a href="#">Edit</a>
                    </div>
                    <div className={"account-group-content account-group-content-" + theme}>
                        Hidden
                    </div>
                </div>
            </div>

        </>
    )
        ;
}

export default Account;