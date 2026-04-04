import {useTheme} from "../../context/ThemeContext.tsx";
import {Link} from "react-router-dom";

interface Follower {
    fromId: string | undefined;
    fromName: string | undefined;
}

const Follower = (props: Follower) => {
    const {theme} = useTheme();

    return (
        <>
            <Link to={"/profile/" + props.fromId} style={{ textDecoration: 'none' }}>
                <button className={"button button-" + theme}>
                    {props.fromName}
                </button>
            </Link>
        </>
    );
}

export default Follower;