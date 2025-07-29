import {Link, useNavigate} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useEffect, useState} from "react";

function Register() {
    const {theme} = useTheme();
    const {auth, initAuth} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.token != "") {
            navigate("/");
        }
    }, []);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleAuth = async () => {
        try {
            const response = await fetch("https://bwxor.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                setError(true);
            }

            const data = await response.json();

            initAuth(data.token, data.user.email, data.user.displayName);

            navigate("/");
        } catch {
            setError(true);
        }
    }

    return (
        <>
            <div className="center">
                <div className="form">
                    <div className="form-item">
                        <h1>Sign in</h1>
                        <p>Don't have an account? <Link to="/register">Create one</Link>.</p>
                        {
                            error ?
                                <>
                                    <div className="form-item error">
                                        There was an error trying to sign in.
                                    </div>
                                </> :
                                <></>
                        }
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">E-Mail Address</label>
                        <input type="email" placeholder="johndoe@bwxor.com"
                               className={"form-input-area textbox textbox-" + theme}
                               onChange={handleEmailChange}></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Password</label>
                        <input type="password" placeholder="MyPassword"
                               className={"form-input-area textbox textbox-" + theme}
                               onChange={handlePasswordChange}></input>
                    </div>
                    <div className="form-input-group">
                        <button className={"button button-" + theme} onClick={handleAuth}><span
                            className="fa-solid fa-sign-in"></span>Sign In
                        </button>
                        <button className={"button button-" + theme}><span className="fa-solid fa-lock"></span>Forgot my
                            password
                        </button>
                        <button className={"button button-" + theme}><span className="fa-solid fa-life-ring"></span>Contact
                            support
                        </button>
                        <button className={"button button-red"}><span className="fa-solid fa-gear"></span>Login to
                            AdminCP
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;