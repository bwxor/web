import {Link} from "react-router-dom";
import '../../assets/css/kerwei/styles.css'

function KerweiMenu() {

    return (
        <>
            <div className="kerwei-body">
                <div className="kerwei-menu">
                    <div className="kerwei-menu-section">
                        <Link to={"/kerwei"} style={{color: 'inherit'}}>
                            <div className="kerwei-menu-item kerwei-menu-item-title">
                                Lowriner Kerwei
                            </div>
                        </Link>
                    </div>
                    <div className="kerwei-menu-section">
                        <Link to={"/kerwei/programmbuch"} style={{color: 'inherit'}}>
                            <div className="kerwei-menu-item">
                                Program
                            </div>
                        </Link>
                        <Link to={"/kerwei/mass-media"} style={{color: 'inherit'}}>
                            <div className="kerwei-menu-item">
                                Mass-Media
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default KerweiMenu;
