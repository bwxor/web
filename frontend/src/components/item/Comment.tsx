import {Link} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";

interface Comment {
    userId: string | undefined;
    content: string | undefined;
    date: string | undefined;
}

const Comment = (props: Comment) => {
    const {theme} = useTheme();

    const parseDate = () => {
        return props.date?.substring(0, 10) + " " + props.date?.substring(11, 16);
    }

    return (
        <>
            <div className="comment-item">
                <div className="comment-user-date-group">
                    <Link to="/">
                        <div className="comment-user">
                            {props.userId}
                        </div>
                    </Link>
                    <div className={"comment-date comment-date-" + theme}>
                        {props.date != null ? parseDate() : ""}
                    </div>
                </div>
                <div className="comment-content">
                    {props.content}
                </div>
            </div>
        </>
    )
};

export default Comment;