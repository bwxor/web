import TranslatedItem from "./TranslatedItem.tsx";
import '../../assets/css/kerwei/styles.css'

const hour = new Date().getHours();
const min = new Date().getMinutes();
const day = new Date().getDate();
const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

const eventDate = {
    day: 9,
    month: 8,
    year: 2025
}

const translatedItems = [
    {
        hour: "07", min: "30", romanian: "Primirea oaspeților", german: "Empfang der Gäste"
    },
    {
        hour: "09", min: "00", romanian: "Plecare de la căminul cultural", german: "Abmarsch"
    },
    {
        hour: "11", min: "00", romanian: "Sfânta Liturghie", german: "Heilige Messe"
    },
    {
        hour: "12", min: "30", romanian: "Licitarea pomului de Kirchweih", german: "Versteigerung des Kerweistraußes"
    },
    {
        hour: "13", min: "30", romanian: "Pauza de prânz", german: "Mittagessen"
    },
    {
        hour: "19", min: "00", romanian: "Seara balului", german: "Abendball"
    }
]

function getIndexOfCurrentEvent() {
    if (year > eventDate.year ||
        (year == eventDate.year && month > eventDate.month) ||
        (year == eventDate.year && month == eventDate.month && day > eventDate.day)) {
        return translatedItems.length;
    }

    if (day == eventDate.day && month == eventDate.month && year == eventDate.year) {
        // Do nothing
    }
    else {
        return -1;
    }

    for (let i = 0; i < translatedItems.length; i++) {
        if (Number(translatedItems[i].hour) < hour ||
            (Number(translatedItems[i].hour) == hour && Number(translatedItems[i].min) < min)) {
            // Do nothing
        }
        else {
            return i-1;
        }
    }

    return -1;
}

function Kerwei() {
    const indexOfCurrentEvent = getIndexOfCurrentEvent();

    return (
        <>
            <div className="body-content">
                <h1>Lowriner Kerwei</h1>
                <TranslatedItem romanian="Sâmbătă, 9 august 2025" german= "Samstag, 9. August 2025" />

                <h2>Program / Programmbuch</h2>
                <div className="translated-item-list">
                    {translatedItems.map((item, i) => (
                        <TranslatedItem key={i}
                                        status= {i < indexOfCurrentEvent ? "✅" : (
                                            i == indexOfCurrentEvent ? "⌛" : "❌"
                                        )}
                                        title={item.hour + ":" + item.min}
                                        romanian={item.romanian}
                                        german={item.german}></TranslatedItem>
                    ))}
                </div>

                <br/>

                <h2>Fotografii / Fotos</h2>
                <div className="photo-button-row">
                <button className="button button-light"><a href="https://drive.google.com/drive/folders/1wBQ5JKakvrjCHrKM4eKV4wQm0qvGa4Q3?usp=drive_link" style={{color: 'inherit'}}><span className="fa-solid fa-camera"> </span> &nbsp;Luci Oprea</a></button>
                <button className="button button-light"><a href="https://borozoiuciprian.smugmug.com/Zilele-Lovrinului/Kerwei/n-gStmbD" style={{color: 'inherit'}}><span className="fa-solid fa-camera"> </span> &nbsp;Ciprian Borozoiu</a></button>
                <button className="button button-light"><a href="https://drive.google.com/drive/folders/1o0BTlptIrmxgpFWlgJPEAQNG0vTUPdKv?usp=sharing" style={{color: 'inherit'}}><span className="fa-solid fa-camera"> </span> &nbsp;Dragos Chirita</a></button>
               <button className="button button-light"><a href="https://s.go.ro/6j2mttz1" style={{color: 'inherit'}}><span className="fa-solid fa-camera"> </span> &nbsp;Razvan Hodorog</a></button>
            
                </div>
            </div>
        </>
    );
}

export default Kerwei;
