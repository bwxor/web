import {useEffect, useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";
import Comment from "../item/Comment.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";

interface CommentsProps {
    slug: string | undefined;
    category: string | undefined;
}

interface CommentModel {
    userId: string | undefined,
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
            }
            else {
                setContent("");
            }
        } catch {
            setError(true);
        }
    }

    const fetchComments = async () => {
        await fetch("https://bwxor.com/api/pages/" + props.category + "/" + props.slug)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setPostId(data.id);

                fetch("https://bwxor.com/api/comments/post/" + data.id)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
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
                <textarea placeholder="Add your comment here!"
                          className={"textarea textarea-" + theme} value={content}
                          onChange={handleCommentInputChange}></textarea>
                    </div>
                    <div className="comments-input-element">
                        <button className={"button button-" + theme} disabled={!createButtonEnabled}
                                onClick={handleCreateComment}>Create
                        </button>
                    </div>
                </div>
                <div className="comment-list">
                    {comments.map((comment) => <Comment userId={comment.userId} content={comment.content}
                                                        date={comment.dateTime}/>)}
                </div>
            </div>
        </>
    );
};

export default Comments;