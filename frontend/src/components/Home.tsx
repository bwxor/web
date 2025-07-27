import architectureLight from "../assets/img/architecture-light.png"
import architectureDark from "../assets/img/architecture-dark.png"
import githubDark from "../assets/img/social/github-dark.png"
import githubLight from "../assets/img/social/github-light.png"
import linkedin from "../assets/img/social/linkedin.png"
import ieee from "../assets/img/social/ieee.png"
import instagram from "../assets/img/social/instagram.png"
import facebook from "../assets/img/social/facebook.png"
import youtube from "../assets/img/social/youtube.png"
import mail from "../assets/img/social/mail.png"
import {Link} from "react-router-dom";
import AppBox from "./app/AppBox.tsx";
import {useTheme} from "../context/ThemeContext.tsx";

const applications = [
    {
        "title": "PDF Editor",
        "description": "Provides options to split, merge, or convert images into PDF files.",
        "url": "/apps/pdf",
        "category": "Utility"
    },
    {
        "title": "Spy",
        "description": "Spy game with custom words.",
        "url": "/apps/spy",
        "category": "Game"
    },
    {
        "title": "Randomizer",
        "description": "Various ways to get random output based on your input.",
        "url": "/apps/randomizer",
        "category": "Utility",
    },
    {
        "title": "YouTubeToMP3",
        "description": "Extract audio from any YouTube video.",
        "url": "/apps/yt2mp3",
        "category": "Utility"
    },
    {
        "title": "AudioEssentials",
        "description": "Tools for audio conversion.",
        "url": "/apps/ae",
        "category": "Utility"
    }
]

function Home() {
    const {theme} = useTheme();

    return (
        <>
            <div className="home-items">
                <div className={"banner banner-" + theme}>
                    <div className="banner-content">
                        <h1>Hi there.</h1>
                        <p>I am a computer engineer from Romania and this is my website dedicated to knowledge sharing,
                            built on React and Spring Boot. I plan to make it more dynamic as days go by, but
                            unfortunately I don't have enough time to
                            do it in a single attempt.<br/>
                            The website also resembles my journey through learning frontend development, as I was always
                            focusing on the backend part. Feel free to take a look over my blog posts and personal
                            projects. Some might be really
                            helpful! You can contact me through the social buttons below.
                        </p>
                    </div>
                    <div className="banner-buttons">
                        <div className="button-group button-group-banner">
                            <Link to="/projects" style={{ textDecoration: 'none' }}>
                                <button className={"button button-" + theme + " full-width"}>View my personal projects</button>
                            </Link>
                            <Link to="/docu" style={{ textDecoration: 'none' }}>
                                <button className={"button button-" + theme + " full-width"}>See my technical blog posts</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="split">
                    <div className="split-left">
                        <h2>General Architecture of my Website</h2>
                        <div className="center">
                            <img src={theme == "light" ? architectureLight : architectureDark}/>
                        </div>
                    </div>
                    <div className="split-right">
                        <h2 className="hidden-for-mobile">Social Media</h2>
                        <div className="button-group button-group-social">
                                <a href="https://github.com/mateasmario/" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={(theme == "light") ? githubLight : githubDark}
                                                                                                    width="24"
                                                                                                    height="24"/>
                                        <span
                                            className="hidden-for-mobile">Follow on GitHub</span>
                                    </button>
                                </a>
                            <div className="button-group-item">
                                <a href="https://www.linkedin.com/in/mario-matea%C8%99-b31628209/" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={linkedin}
                                                                                                    width="24"
                                                                                                    height="24"/><span
                                        className="hidden-for-mobile">Connect on LinkedIn</span>
                                    </button>
                                </a>
                            </div>
                            <div className="button-group-item">
                                <a href="https://ieeexplore.ieee.org/author/523355528908544" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={ieee}
                                                                                                    width="24"
                                                                                                    height="24"/><span
                                        className="hidden-for-mobile">View my publications</span>
                                    </button>
                                </a>
                            </div>
                            <div className="button-group-item">
                                <a href="https://www.instagram.com/mario.mateas/" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={instagram}
                                                                                                    width="24"
                                                                                                    height="24"/><span
                                        className="hidden-for-mobile">Follow on Instagram</span>
                                    </button>
                                </a>
                            </div>
                            <div className="button-group-item">
                                <a href="https://www.facebook.com/mateasmario" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={facebook}
                                                                                                    width="24"
                                                                                                    height="24"/><span
                                        className="hidden-for-mobile">Befriend on Facebook</span>
                                    </button>
                                </a>
                            </div>
                            <div className="button-group-item">
                                <a href="https://www.youtube.com/@mmateas" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={youtube}
                                                                                                    width="24"
                                                                                                    height="24"/><span
                                        className="hidden-for-mobile">Subscribe on YouTube</span>
                                    </button>
                                </a>
                            </div>
                            <div className="button-group-item">
                                <a href="mailto:mario@bwxor.com" style={{textDecoration: 'none'}}>
                                    <button className={"button button-" + theme + " full-width button-social"}><img src={mail}
                                                                                                    width="24"
                                                                                                    height="24"/><span
                                        className="hidden-for-mobile">Contact me via E-Mail</span>
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2>Applications</h2>
                    <div className="apps">
                        {applications.map((application) => <AppBox title={application.title} url={application.url}
                                                                   description={application.description}
                                                                   category={application.category}/>)}
                    </div>
                </div>
            </div>
        </>
    )
        ;
}

export default Home;
