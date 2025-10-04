import {useEffect, useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";
import Comment from "../item/Comment.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {Link} from "react-router-dom";
import {Riple} from "react-loading-indicators";

interface CommentsProps {
    slug: string | undefined;
    category: string | undefined;
}

interface CommentModel {
    commentId: string | undefined;
    userId: string | undefined,
    userDisplayName: string | undefined,
    content: string | undefined,
    dateTime: string | undefined
}

const Comments = (props: CommentsProps) => {
    const {theme} = useTheme();
    const {auth} = useAuth();
    const [content, setContent] = useState<string | undefined>("");
    const [error, setError] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [postId, setPostId] = useState<string | null>(null);
    const [createButtonEnabled, setCreateButtonEnabled] = useState(false);
    const [loadingComments, setLoadingComments] = useState(true);

    const handleCreateComment = async () => {
        try {
            setError(false);

            console.log("postId: " + postId + ", content: " + content);

            const createCommentResponse = await fetch("https://bwxor.com/api/comments/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + auth.token
                },
                body: JSON.stringify({
                    postId: postId,
                    content: content
                }),
            });

            if (!createCommentResponse.ok) {
                const errorData = await createCommentResponse.json();
                setError(true);
                setErrorMessage(errorData.message);
            } else {
                setContent("");
                await fetchComments();
            }
        } catch {
            setError(true);
        }
    }

    const handleClearPress = () => {
        setContent("");
    }

    const fetchComments = async () => {
        await fetch("https://bwxor.com/api/pages/" + props.category + "/" + props.slug)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setPostId(data.id);
                console.log(data.id);

                fetch("https://bwxor.com/api/comments/post/" + data.id)
                    .then((response) => response.json())
                    .then((data) => {
                        setLoadingComments(false);
                        setComments(data);
                        setCreateButtonEnabled(true);
                    })
            })
            .catch((error) => {
                console.error(error);
                setCreateButtonEnabled(false);
            });
    }

    useEffect(() => {
        fetchComments();
    }, [])

    const handleCommentInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }

    return (
        <>
            <div className="comments-section">
                <div className="comments-title">
                    Comments
                </div>
                <div className="comments-input-group">
                    <div className="form-item error">
                        {error ? errorMessage : ""}
                    </div>
                    <div className="comments-input-element">
                        {auth.token != "" ?
                            <><textarea placeholder="Add your comment here!"
                                        className={"textarea textarea-" + theme + " textarea-medium"} value={content}
                                        onChange={handleCommentInputChange}></textarea>
                                <div className="form-button-group">
                                    <button className={"button button-" + theme} disabled={!createButtonEnabled}
                                            onClick={handleCreateComment}>Create
                                    </button>
                                    <button onClick={handleClearPress}
                                            className={"button button-red"}><span
                                        className="fa-solid fa-trash-can"></span>Clear
                                    </button>
                                </div>
                            </>
                            :
                            <div>
                                You need to <Link to={"/signin"}>sign in</Link> before commenting.
                            </div>
                        }
                    </div>
                </div>
                {loadingComments ?
                    <div className="center">
                        <div className="center">
                            {theme == "dark" ?
                                <Riple color="#3c4751" size="medium" text="" textColor=""/>
                                :
                                <Riple color="#D1D1D1" size="medium" text="" textColor=""/>
                            }
                        </div>
                    </div> :
                    <div className="comment-list">
                        {comments.map((comment) => <Comment key={comment.commentId} id={comment.commentId}
                                                            userId={comment.userId}
                                                            displayName={comment.userDisplayName}
                                                            content={comment.content}
                                                            date={comment.dateTime}/>)}
                    </div>
                }
            </div>
        </>
    );
};

export default Comments;