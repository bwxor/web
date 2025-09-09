import {Link, useNavigate} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useEffect, useState} from "react";
import {useAuth} from "../../context/AuthenticationContext.tsx";

function Register() {
    const {theme} = useTheme();
    const {auth, initAuth} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (auth.token != "") {
            navigate("/");
        }
    }, []);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(event.target.value);
    }


    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    }

    const handleRegister = async () => {
        try {
            const registerResponse = await fetch("https://bwxor.com/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    displayName,
                    password,
                    confirmPassword
                }),
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                setError(true);
                setErrorMessage(errorData.message);
            } else {
                const loginResponse = await fetch("https://bwxor.com/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password
                    }),
                });

                if (!registerResponse.ok) {
                    setError(true);
                } else {
                    const loginData = await loginResponse.json();
                    initAuth(loginData.token, loginData.user.id, loginData.user.email, loginData.user.displayName);
                    navigate("/");
                }
            }
        } catch {
            setError(true);
        }
    }

    return (
        <>
            <div className="center">
                <div className="form">
                    <div className="form-item">
                        <h1>Create an account</h1>
                        <p>Already have an account? <Link to="/signin">Sign in</Link>.</p>
                        {
                            error ?
                                <>
                                    <div className="form-item error">
                                        {errorMessage}
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
                        <label className="form-input-label">Display Name</label>
                        <input type="text" placeholder="John Doe"
                               className={"form-input-area textbox textbox-" + theme}
                               onChange={handleDisplayNameChange}></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Password</label>
                        <input type="password" placeholder="PickASecurePassword"
                               className={"form-input-area textbox textbox-" + theme}
                               onChange={handlePasswordChange}></input>
                        <div className="form-tip">
                            Your password should consist of:
                            <ul>
                                <li>minimum 16 characters;</li>
                                <li>at least one lowercase letter;</li>
                                <li>at least one uppercase letter;</li>
                                <li>at least one digit;</li>
                                <li>at least a character from the list: <a href="#">!?@#$%^&*</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Confirm Password</label>
                        <input type="password" placeholder="PickASecurePassword"
                               className={"form-input-area textbox textbox-" + theme}
                               onChange={handleConfirmPasswordChange}></input>
                    </div>
                    <div className="form-input-group">
                        <button className={"button button-" + theme} onClick={handleRegister}><span
                            className="fa-solid fa-user-plus"></span>Register
                        </button>
                        <button className={"button button-" + theme}><span className="fa-solid fa-life-ring"></span>Contact
                            support
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register;