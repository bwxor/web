import {useEffect, useState} from "react";
import ItemSummary from "./ItemSummary.tsx";
import {useAuth} from "../../context/AuthenticationContext.tsx";
import {useTheme} from "../../context/ThemeContext.tsx";
import {Link} from "react-router-dom";
import {Riple} from "react-loading-indicators";

interface ItemListProps {
    category: string | undefined;
}

interface ItemInfo {
    id: string | undefined;
    slug: string | undefined;
    title: string | undefined;
    description: string | undefined;
}

interface ProfileType {
    admin: boolean;
    biography: string;
    birthYear: string;
}

function ItemList(props: ItemListProps) {
    const [items, setItems] = useState<ItemInfo[]>([]);
    const [displayedItems, setDisplayedItems] = useState<ItemInfo[]>([]);
    const {auth} = useAuth();
    const {theme} = useTheme();
    const [profile, setProfile] = useState<ProfileType | null>({biography: "", birthYear: "", admin: false});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (auth.token != "") {
            fetch("https://bwxor.com/api/profile/find/" + auth.email)
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
        fetch("https://bwxor.com/api/pages/" + props.category)
            .then((response) => {
                setLoading(false);
                return response.json();
            })
            .then((data) => {
                setItems(data);
                setDisplayedItems(data);
            })
            .catch((error) => console.error(error));

    }, [props.category]);

    const searchItems = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = event.target.value;

        if (key.length != 0) {
            setDisplayedItems(items.filter(
                s => s.title?.toLowerCase().includes(key.toLowerCase()) || s.slug?.toLowerCase()?.includes(key.toLowerCase())
            ));
        } else {
            setDisplayedItems(items);
        }
    }

    return (
        <section className="projects">
            <input type="text" className={"textbox textbox-medium textbox-" + theme} placeholder="Search..."
                   onChange={searchItems}></input>
            {auth.token != "" && profile?.admin ?
                <div className="management-button-group">
                    <Link to={"/new/" + props.category} style={{textDecoration: 'none'}}>
                        <button className={"button button-" + theme + " management-button-group-item"}><span
                            className="fa-solid fa-plus"> </span> Add new
                        </button>
                    </Link>
                    <button className={"button button-red management-button-group-item"}><span
                        className="fa-solid fa-gear"> </span> Manage in AdminCP
                    </button>
                </div>
                : <></>}
            {loading ?
                <div className="center">
                    {theme == "dark" ?
                        <Riple color="#3c4751" size="medium" text="" textColor=""/>
                        :
                        <Riple color="#D1D1D1" size="medium" text="" textColor=""/>
                    }
                </div>
                : <div className="items">
                    {displayedItems.map((item: ItemInfo) => <ItemSummary key={item.id} category={props.category} slug={item.slug}
                                                                title={item.title} description={item.description}/>)}
                </div>
            }
        </section>
    );
}

export default ItemList;
