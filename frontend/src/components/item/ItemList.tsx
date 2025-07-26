import {useEffect, useState} from "react";
import ItemSummary from "./ItemSummary.tsx";

interface ItemListProps {
    category: string | undefined;
}

interface ItemInfo {
    id : string | undefined;
    slug: string | undefined;
    title: string | undefined;
    description: string | undefined;
}

function ItemList(props: ItemListProps) {
    const [items, setItems] = useState<ItemInfo[]>([]);

    useEffect(() => {
        fetch("https://bwxor.com/api/pages/" + props.category)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setItems(data);
            })
            .catch((error) => console.error(error));
    }, [props.category]);

    return (
        <section className="projects">
            {items.map((item: ItemInfo) => <ItemSummary key={item.id} category={props.category} slug={item.slug}
                                                        title={item.title} description={item.description}/>)}
        </section>
    );
}

export default ItemList;
