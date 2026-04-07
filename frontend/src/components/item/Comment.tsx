import {Link} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useState} from "react";

interface Comment {
    id: string | undefined;
    userId: string | undefined;
    displayName: string | undefined;
    content: string | undefined;
    date: string | undefined;
}

const Comment = (props: Comment) => {
    const {theme} = useTheme();
    const {auth} = useAuth();
    const [deleted, setDeleted] = useState<boolean>(false);

    const parseDate = (time: boolean) => {
        return props.date?.substring(0, 10) + (time ? (" " + props.date?.substring(11, 16)) : "");
    }

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete the comment?");
        if (confirmed) {
            try {
                const registerResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/comments/delete`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + auth.token
                    },
                    body: JSON.stringify({
                        commentId: props.id
                    }),
                });

                if (!registerResponse.ok) {
                    const errorData = await registerResponse.json();
                    alert(errorData.message);
                } else {
                    setDeleted(true);
                }
            } catch {
                alert("There was an unexpected error while trying to delete the comment.");
            }
        } else {
            // Ignore deletion attempt
        }
    }

    return (
        <>
            {!deleted ?
                <div className="comment-item">
                    <div className="comment-user-date-group">
                        <Link to={"/profile/" + props.userId}>
                            <div className="comment-user">
                                {props.displayName}
                            </div>
                        </Link>
                        {auth.id == props.userId ?
                            <button onClick={handleDelete}
                                    className={"button button-small red button-" + theme}>Delete
                            </button>
                            : ""}
                        <div className={"comment-date comment-date-" + theme}>
                            {props.date != null ? parseDate(false) : ""}
                        </div>
                    </div>
                    <div className="comment-content">
                        {props.content}
                    </div>
                </div>
                : ""}
        </>
    )
};

export default Comment;