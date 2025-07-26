import { Link, useNavigate } from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useEffect, useState} from "react";

function Register() {
    const {theme} = useTheme();
    const {auth} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (auth) {
            navigate("/");
        }
    }, []);

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    }

    const  handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    }

    const handleAuth = () => {
        const login = async (email: string, password: string) => {
            try {
                const response = await fetch("https://bwxor.com/api/login", {
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
                    throw new Error("Login failed");
                }

                const data = await response.json();
                console.log("Login successful:", data);

                // Example: store auth token or user info
                // sessionStorage.setItem("token", data.token);

            } catch (error) {
                console.error("Error during login:", error);
            }
        };
    }

    return (
        <>
            <div className="center">
                <form className="form">
                    <div className="form-item">
                        <h1>Sign in</h1>
                        <p>Don't have an account? <Link to="/register">Create one</Link>.</p>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">E-Mail Address</label>
                        <input type="email" placeholder="johndoe@bwxor.com"
                               className={"form-input-area textbox textbox-" + theme} onChange={handleEmailChange}></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Password</label>
                        <input type="password" placeholder="MyPassword"
                               className={"form-input-area textbox textbox-" + theme} onChange={handlePasswordChange}></input>
                    </div>
                    <div className="form-input-group">
                        <button className={"button button-" + theme}><span className="fa-solid fa-sign-in" onClick={handleAuth}></span>Sign In</button>
                        <button className={"button button-" + theme}><span className="fa-solid fa-lock"></span>Forgot my password</button>
                        <button className={"button button-" + theme}><span className="fa-solid fa-life-ring"></span>Contact support</button>
                        <button className={"button button-red"}><span className="fa-solid fa-gear"></span>Login to AdminCP</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Register;