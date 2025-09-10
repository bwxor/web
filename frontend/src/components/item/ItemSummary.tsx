import {Link} from "react-router-dom";
import {useTheme} from "../../context/ThemeContext.tsx";

interface ItemSummaryProps {
    category: string | undefined;
    slug: string | undefined;
    title: string | undefined;
    description: string | undefined;
}

function ItemSummary(props: ItemSummaryProps) {
    const {theme} = useTheme();

    return (
        <Link to={"/" + props.category + "/" + props.slug} style={{ textDecoration: 'none' }}>
            <article id={props.slug} className={"item-summary item-summary-" + theme}>
                <div className={"item-summary-title item-summary-title-" + theme}>
                    {props.title ? props.title : "No item"}
                </div>
                <div className="item-summary-description">
                    {props.description}
                </div>
            </article>
        </Link>
    );
}

export default ItemSummary;