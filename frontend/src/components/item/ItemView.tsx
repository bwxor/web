import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vs, vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";
import {useTheme} from "../../context/ThemeContext.tsx";
import {Components} from "react-markdown";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import Comments from "./Comments.tsx";
import {Riple} from "react-loading-indicators";

interface ItemViewProps {
    category: string | undefined;
}

interface ProfileType {
    admin: boolean;
    biography: string;
    birthYear: string;
}

function ItemView(props: ItemViewProps) {
    const {slug} = useParams();
    const [markdown, setMarkdown] = useState("");
    const {theme} = useTheme();
    const {auth} = useAuth();
    const [profile, setProfile] = useState<ProfileType | null>({biography: "", birthYear: "", admin: false});
    const navigate = useNavigate();
    const [loadingMarkdown, setLoadingMarkdown] = useState(true);


    const handleEditPress = () => {
        navigate("/update/" + props.category + "/" + slug)
    }

    const handleDeletePress = async () => {
        const confirmed = window.confirm("Are you sure you want to delete the page?");
        if (confirmed) {
            try {
                const registerResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pages/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + auth.token
                    },
                    body: JSON.stringify({
                        slug: slug,
                        category: props.category
                    }),
                });

                if (!registerResponse.ok) {
                    const errorData = await registerResponse.json();
                    alert(errorData.message);
                } else {
                    alert("Page deleted successfully");
                    navigate(`/${props.category}`)
                }
            } catch {
                alert("There was an unexpected error while trying to delete the page.");
            }
        } else {
            // Ignore deletion attempt
        }
    }

    useEffect(() => {
        if (auth.token != "") {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/find/` + auth.email)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setProfile(data);
                })
                .catch((error) => console.error(error));
        }
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pages/${props.category}/${slug}`)
            .then((response) => response.json())
            .then((data) => {
                setLoadingMarkdown(false);
                setMarkdown(data.content);
            })
            .catch(() => setMarkdown("Page with given info not found."));
    }, [props.category, slug]);

    const components: Components = {
        code({inline, className, children, ...props}: {
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
        }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <SyntaxHighlighter
                    style={theme === "light" ? vs : vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    return (
        <>
            {loadingMarkdown ?
                <div className="center">
                    <div className="center">
                        {theme == "dark" ?
                            <Riple color="#3c4751" size="medium" text="" textColor=""/>
                            :
                            <Riple color="#D1D1D1" size="medium" text="" textColor=""/>
                        }
                    </div>
                </div> :

                <>
                    {auth.token != "" && profile?.admin ?
                        <div className="management-button-group">
                            <button className={"button button-" + theme + " management-button-group-item"}
                                    onClick={handleEditPress}><span
                                className="fa-solid fa-pen"> </span> Edit
                            </button>
                            <button className={"button button-red management-button-group-item"}
                                    onClick={handleDeletePress}><span
                                className="fa-solid fa-trash"> </span> Delete
                            </button>
                        </div>
                        : <></>}
                    <ReactMarkdown components={components}>
                        {markdown}
                    </ReactMarkdown><Comments
                    slug={slug}
                    category={props.category}/>
                </>
            }
        </>
    )
}

export default ItemView;
