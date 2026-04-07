import {useTheme} from "../../context/ThemeContext.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useEffect, useState} from "react";
import ReactMarkdown, {Components} from "react-markdown";
import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import {vs, vscDarkPlus} from "react-syntax-highlighter/dist/esm/styles/prism";

function UpdateItem() {
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

    const {category, oldSlug} = useParams();
    const {theme} = useTheme();
    const {auth} = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [content, setContent] = useState("");
    const [preview, setPreview] = useState(false);
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorSlug, setErrorSlug] = useState(false);
    const [errorDescription, setErrorDescription] = useState(false);
    const [errorContent, setErrorContent] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pages/${category}/${oldSlug}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);

                if (title === "") {
                    setTitle(data.title);
                }

                if (description === "") {
                    setDescription(data.description);
                }

                if (content === "") {
                    setContent(data.content);
                }

                if (slug === "") {
                    setSlug(data.slug);
                }
            })
            .catch(() => navigate("/" + category));
    }, [])

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const title = event.target.value;
        setTitle(title);
        let slug = title.trim().replace(/[^a-z0-9\s]/gi, '').split(/\s+/).join("-").toLowerCase();
        if (slug.endsWith("-")) {
            slug = slug.substring(0, slug.length - 1);
        }
        setSlug(slug);
    }

    const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSlug(event.target.value);
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    }

    const handleContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }

    const handlePreviewPress = () => {
        setPreview(!preview);
    }

    const fetchProfile = async () => {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile/find/` + auth.email)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (!data?.admin) {
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error(error);
                navigate("/");
            });
    }

    function isValidSlug(str: string) {
        let code, i, len;

        let minusPreviously = false;

        if (str.startsWith("-") || str.endsWith("-")) {
            return false;
        }

        for (i = 0, len = str.length; i < len; i++) {
            code = str.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
                !(code > 64 && code < 91) && // upper alpha (A-Z)
                !(code > 96 && code < 123) // lower alpha (a-z)
                && code != 45) {
                return false;
            }

            if (code == 45) {
                if (minusPreviously) {
                    return true;
                }
                minusPreviously = true;
            } else {
                minusPreviously = false;
            }
        }
        return true;
    };

    const handleUpdateClick = async () => {
        setError(false);
        setErrorMessage("");
        setErrorTitle(false);
        setErrorSlug(false);
        setErrorDescription(false);
        setErrorContent(false);

        if (title.trim() == "") {
            setErrorTitle(true);
        } else if (!isValidSlug(slug)) {
            setErrorSlug(true);
        } else if (description.trim() == "") {
            setErrorDescription(true);
        } else if (content.trim() == "") {
            setErrorContent(true);
        } else {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/pages/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    title: title,
                    newSlug: slug,
                    oldSlug: oldSlug,
                    content: content,
                    description: description,
                    category: category
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(true);
                setErrorMessage(errorData.message);
            } else {
                alert("Page was updated successfully.");
                navigate("/" + category + "/" + slug);
            }
        }
    }

    useEffect(
        () => {
            console.log(category);

            if (auth.token == "") {
                navigate("/signin");
            } else {
                fetchProfile();
            }
        }, []
    );

    return (
        <>
            <div className="center">
                <div className="form form-large">
                    <div className="form-item">
                        <h1>Update Item</h1>
                        {error ?
                            <>
                                <div className="form-item error">
                                    {errorMessage}
                                </div>
                            </> :
                            <></>
                        }
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Title</label>
                        <input value={title} type="text" placeholder="My Dog Ate My Homework!"
                               className={"form-input-area textbox textbox-" + theme + " textbox-large" + (errorTitle ? " textbox-error" : "")}
                               onChange={handleTitleChange} required></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Slug (Title in URL)</label>
                        <input value={slug} type="text" placeholder="my-dog-ate-my-homework"
                               className={"form-input-area textbox textbox-" + theme + " textbox-large" + (errorSlug ? " textbox-error" : "")}
                               onChange={handleSlugChange} required></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Description</label>
                        <input value={description} type="text" placeholder="This is how my dog ate my homework"
                               className={"form-input-area textbox textbox-" + theme + " textbox-large" + (errorDescription ? " textbox-error" : "")}
                               onChange={handleDescriptionChange} required></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Content</label>
                        {
                            preview ?
                                <ReactMarkdown components={components}>
                                    {content}
                                </ReactMarkdown>
                                :
                                <textarea value={content}
                                          className={"textarea textarea-" + theme + " textarea-large" + (errorContent ? " textarea-error" : "")}
                                          onChange={handleContentChange}
                                          placeholder="Make sure you write something creative... please :)"
                                          required></textarea>
                        }

                    </div>
                    <div className="form-input-group">
                        <div className="form-button-group">
                            <button onClick={handleUpdateClick}
                                    className={"form-button-group-item button button-" + theme}><span
                                className="fa-solid fa-pen"></span>Update
                            </button>
                            {preview ?
                                <button onClick={handlePreviewPress}
                                        className={"form-button-group-item button button-" + theme}><span
                                    className="fa-solid fa-code"></span>Code
                                </button>
                                :
                                <button onClick={handlePreviewPress}
                                        className={"form-button-group-item button button-" + theme}><span
                                    className="fa-solid fa-eye"></span>Preview
                                </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UpdateItem;