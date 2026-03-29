import {Link, Outlet} from "react-router-dom";
import {useTheme} from "../context/ThemeContext.tsx";
import {useState} from "react";
import {useAuth} from "../context/AuthenticationContext.tsx";

interface AuthType {
    id: string;
    token: string;
    email: string;
    displayName: string;
}

interface PopupMenuProps {
    theme: string
    auth: AuthType
}

function PopupMenu(props: PopupMenuProps) {
    const theme = props["theme"];
    const auth = props["auth"];

    return (
        <div className={"menu-items-small menu-items-small-" + theme}>
            <Link to="/" style={{color: 'inherit'}} className={"menu-item-small-" + theme}>
                Home
            </Link>
            <Link to="/projects" style={{color: 'inherit'}} className={"menu-item-small-" + theme}>
                Projects
            </Link>
            <Link to="/docu" style={{color: 'inherit'}} className={"menu-item-small-" + theme}>
                Documentation
            </Link>
            {auth.token == "" ?
                <Link to="/signin" style={{color: 'inherit'}} className={"menu-item-small-" + theme}>
                    Sign in
                </Link>
                :
                <Link to={"/profile/" + auth.id} style={{color: 'inherit'}} className={"menu-item-small-" + theme}>
                    {auth.displayName}
                </Link>
            }
        </div>
    );
}


function Menu() {
    const [popupMenu, setPopupMenu] = useState(false);
    const {theme, toggleTheme} = useTheme();
    const {auth} = useAuth();

    function burgerClickHandler() {
        setPopupMenu(!popupMenu);
    }

    return (
        <>
            <div className={"body-padded body-padded-" + theme}>
                <nav className={"menu menu-" + theme}>
                    <div className="menu-branding">
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <span className={"menu-branding-text-" + theme}>bwxor</span>
                        </Link>
                    </div>
                    <div className="menu-small-buttons">
                        <button className="menu-item-burger" onClick={toggleTheme}>
                            <span
                                className={"fa-solid fa-" + (theme == "light" ? "moon" : "sun") + " menu-item-burger-" + theme}></span>
                        </button>
                        <button className="menu-item-burger" onClick={() => burgerClickHandler()}>
                            <span className={"fa-solid fa-bars menu-item-burger-" + theme}></span>
                        </button>
                    </div>
                    <div className="menu-items">

                        <div className="menu-items-main">
                            <Link to="/">
                                <span className={"menu-item menu-item-" + theme}>Home</span>
                            </Link>
                            <Link to="/projects">
                                <span className={"menu-item menu-item-" + theme}>Projects</span>
                            </Link>
                            <Link to="/docu">
                                <span className={"menu-item menu-item-" + theme}>Documentation</span>
                            </Link>
                            {auth.token == "" ?
                                <Link to="/signin">
                                    <span className={"menu-item menu-item-" + theme}>Sign&nbsp;In</span>
                                </Link>
                                :
                                <Link to={"/profile/" + auth.id}>
                                    <span className={"menu-item menu-item-" + theme}>{auth.displayName}</span>
                                </Link>
                            }

                        </div>
                        <div className="menu-items-secondary">
                            <div className={"menu-item menu-item-" + theme} onClick={toggleTheme}>
                                <span
                                    className={"fa-solid fa-" + (theme == "light" ? "moon" : "sun") + " menu-item-burger-" + theme}></span>
                            </div>
                        </div>
                    </div>
                </nav>
                {
                    popupMenu ? <PopupMenu theme={theme} auth={auth}/> : null
                }

                <main className={"body-content body-content-" + theme}>
                    <Outlet/>
                </main>
            </div>
        </>
    );
}

export default Menu;