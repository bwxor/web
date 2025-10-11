import '../../assets/css/kerwei/styles.css'
import KerweiMenu from "./KerweiMenu.tsx";

function KerweiHome() {
    return (
        <>
            <div className="kerwei-body">
                <KerweiMenu/>
                <div className="kerwei-carousel">
                    <div className="kerwei-carousel-box">
                        <div className="kerwei-carousel-box-header">
                            <div className="kerwei-page-title">Willkomen zur Lowriner Kerwei!</div>
                            <div className="kerwei-page-subtitle">Bine ați venit la Kirchweih-ul din Lovrin!</div>
                        </div>
                        <div className="kerwei-carousel-box-body">
                            <p className="kerwei-carousel-box-body-text">Pe pagina noastră puteți urmări atât programul evenimentului nostru, cât și fotografii de la
                                evenimente anterioare. Mai multe detalii pe <a href="https://www.facebook.com/deutschesforumlovrin">pagina noastră de Facebook</a>.</p>

                            <br />

                            <iframe width="100%" height="400"
                                    src="https://www.youtube.com/embed/ebs2wc1RZuw">
                            </iframe>
                        </div>
                    </div>
                </div>
                <div className="kerwei-body-content">
                    <div className="kerwei-photo-section">
                    <div className="kerwei-page-subtitle">
                            Fotografii / Fotos
                        </div>
                        <div className="photo-button-row">
                            <button className="button button-light"><a
                                href="https://drive.google.com/drive/folders/12aUktI3wpbpvOjyQY8W_1WmlLdkgRJrc?usp=sharing"
                                style={{color: 'inherit'}}><span className="fa-solid fa-camera"> </span> &nbsp;Luci
                                Oprea</a>
                            </button>
                            <button className="button button-light"><a
                                href="https://drive.google.com/drive/folders/179JxMapDJgh5vxnedEmHg2n6M1ezvQYu?usp=sharing"
                                style={{color: 'inherit'}}><span
                                className="fa-solid fa-camera"> </span> &nbsp;Ciprian
                                Borozoiu</a>
                            </button>
                            <button className="button button-light"><a
                                href="https://drive.google.com/drive/folders/1E30FpGugPI2lKoaHcVn4MMk6NhgwCu5E?usp=sharing"
                                style={{color: 'inherit'}}><span
                                className="fa-solid fa-camera"> </span> &nbsp;Dragos
                                Chirita</a></button>
                            <button className="button button-light"><a href="https://s.go.ro/6j2mttz1"
                                                                       style={{color: 'inherit'}}><span
                                className="fa-solid fa-camera"> </span> &nbsp;Razvan Hodorog</a></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default KerweiHome;