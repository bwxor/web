import {Link, useNavigate} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useEffect, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {useSecurity} from "../../context/SecurityContext.tsx";

function Register() {
    const {theme} = useTheme();
    const {auth, initAuth} = useAuth();
    const {security, initSecurity} = useSecurity();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [capVal, setCapVal] = useState<string | null>(null);

    useEffect(() => {
        if (auth.token != "") {
            navigate("/");
        }

        if (security.invalidLoginCount == undefined) {
            initSecurity(0);
        }
    }, []);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleAuth = async () => {
        setError(false);

        if (capVal == null && security.invalidLoginCount >= 3) {
            setError(true);
            setErrorMessage("ReCAPTCHA challenge response is invalid.")
            return;
        }

        try {
            const userResponse = await fetch("https://bwxor.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                setError(true);
                setErrorMessage(errorData.message);
                initSecurity(security.invalidLoginCount + 1);
            }
            else {
                const userData = await userResponse.json();
                initSecurity(0);

                const profileResponse = await fetch("https://bwxor.com/api/profile/find/" + userData.user.id);
                const profileData = await profileResponse.json();

                initAuth(userData.token, userData.user.id, userData.user.email, profileData.displayName);

                navigate("/profile/" + userData.user.id);
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
                        <h1>Sign in</h1>
                        <p>Don't have an account? <Link to="/register">Create one</Link>.</p>
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
                        <label className="form-input-label">Password</label>
                        <input type="password" placeholder="MyPassword"
                               className={"form-input-area textbox textbox-" + theme}
                               onChange={handlePasswordChange}></input>
                    </div>
                    {security.invalidLoginCount >= 3 ?
                        <div className="form-input-group">
                            <div className="recaptcha">
                                <ReCAPTCHA sitekey="6LcgPuYrAAAAAHfk3Jdu6eg_xyDXOyJuyR2t3LtN"
                                           onChange={(val: string | null) => setCapVal(val)}/>
                            </div>
                        </div>
                        : <></>}
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