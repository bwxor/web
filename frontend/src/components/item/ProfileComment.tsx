import {Link} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";
import {useEffect, useState} from "react";

interface ProfileComment {
    id: string | undefined;
    userId: string | undefined;
    postId: string | undefined;
    content: string | undefined;
    date: string | undefined;
}

const ProfileComment = (props: ProfileComment) => {
    const {theme} = useTheme();
    const [category, setCategory] = useState("");
    const [slug, setSlug] = useState("");

    const parseDate = (time: boolean) => {
        return props.date?.substring(0, 10) + (time ? (" " + props.date?.substring(11, 16)) : "");
    }

    const fetchPageInfo = async () => {
        fetch("https://bwxor.com/api/pages/find/" + props.postId)
            .then((res) => res.json())
            .then((data) => {
                setCategory(data?.category);
                setSlug(data?.slug);
            })
    }

    useEffect(() => {
        fetchPageInfo();
    }, [])

    return (
        <>
            <div className="comment-item">
                <div className="profile-comment-post-info">
                    Commented on <Link to={"/" + category + "/" + slug}>
                    {"/" + category + "/" + slug}
                    </Link>
                    <div className={"comment-date comment-date-" + theme}>
                        {props.date != null ? parseDate(false) : ""}
                    </div>
                </div>
                <div className="profile-comment-content">
                    {props.content != null ? props.content?.length > 50 ? props.content.substring(0, 50) + "..." : props.content : ""}
                </div>
            </div>
        </>
    )
};

export default ProfileComment;