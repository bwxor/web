import {useTheme} from "../../context/ThemeContext.tsx";

function CreateItem() {
    const {theme} = useTheme();

    return (
        <>
            <div className="center">
                <div className="form form-large">
                    <div className="form-item">
                        <h1>Create new item</h1>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Title</label>
                        <input type="text" placeholder="My Dog Ate My Homework!"
                               className={"form-input-area textbox textbox-" + theme + " textbox-large"}></input>
                    </div>
                    <div className="form-input-group">
                        <label className="form-input-label">Content</label>
                        <textarea className={"textarea textarea-" + theme + " textarea-large"}></textarea>
                    </div>
                    <div className="form-input-group">
                        <button className={"button button-" + theme}><span
                            className="fa-solid fa-plus"></span>Create
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateItem;