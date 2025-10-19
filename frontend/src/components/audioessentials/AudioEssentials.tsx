import {useRef, useState} from "react";
import {FFmpeg} from "@ffmpeg/ffmpeg";
import {fetchFile, toBlobURL} from "@ffmpeg/util";
import '../../assets/css/audioessentials/styles.css'

function AudioEssentials() {
    const [file, setFile] = useState<File | null>(null);
    const [from, setFrom] = useState("mp3");
    const [to, setTo] = useState("mp3");
    const [tempoMultiplier, setTempoMultiplier] = useState("1");
    const [pitchMultiplier, setPitchMultiplier] = useState("1");
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState(false);
    const ffmpegRef = useRef(new FFmpeg());

    const handleChangeTempo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempoMultiplier(event.target.value);
    }

    const handleChangePitch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPitchMultiplier(event.target.value);
    }

    const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files != null) {
            setFile(event.target.files[0]);

            if (file != null) {
                const extensionIndex = file.name.lastIndexOf(".") + 1;
                const extension = file.name.substring(extensionIndex);
                setFrom(extension);
            }
        }
    }

    const handleChangeTo = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTo(event.target.value);
    }

    const transcode = async (from: string, to: string) => {
        const ffmpeg = ffmpegRef.current;
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm'
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });

        const inputFile = "input." + from;
        const outputFile = "output." + to;

        if (!file) {
            setLoading(false);
            setError(true);
            return;
        }

        try {
            await ffmpeg.writeFile(inputFile, await fetchFile(file));
            await ffmpeg.exec([
                `-i`, inputFile,
                `-filter:a`, `atempo=${tempoMultiplier},asetrate=44100*${pitchMultiplier},aresample=44100`,
                outputFile
            ]);
            const data = await ffmpeg.readFile(outputFile) as Uint8Array;

            // Create a Blob from the Uint8Array returned by ffmpeg
            const blob = new Blob([data.buffer], {type: 'application/octet-stream'});

            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create a temporary <a> element to trigger the download
            const a = document.createElement('a');
            a.href = url;
            a.download = outputFile; // Set the filename for download
            document.body.appendChild(a);
            a.click();

            // Clean up
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            setError(true);
        }
    }

    const handleProcess = () => {
        setDone(false);
        setLoading(true);
        setError(false);
        transcode(from, to).then(() => {
            setLoading(false);
            setDone(true);
        });
    }

    return (
        <>
            <div className="ae-body">
                <div className="ae-box">
                    <div className="ae-input-group">
                        <div className="ae-input-group-item">
                            <h2 className="ae-text-title">AudioEssentials</h2>
                            <div className="ae-input-file-group">
                                <div className="ae-input-file-group-item">
                                    <div className="ae-input-file-name">
                                        {file != null ? file.name : "No file selected."}
                                    </div>
                                </div>
                                <div className="ae-input-file-group-item">
                                    <input id="file-input" className="ae-input-file" type="file"
                                           accept=".mp3,.mp4,.wav,.aac,.m4a,.ogg,.flac,.wma,.mkv"
                                           onChange={handleChangeFile}/>
                                    <label className="ae-button" htmlFor="file-input">
                                        <span className={"fa-solid fa-upload"}></span> &nbsp; Upload
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="ae-input-group-item">
                            <div>
                                Speed: {tempoMultiplier}x
                            </div>
                            <div>
                                <input className="ae-slider" type="range" min="0.5" step="0.05" max="5"
                                       value={tempoMultiplier}
                                       onChange={handleChangeTempo}/>
                            </div>
                            <div>
                                Pitch: {pitchMultiplier}x
                            </div>
                            <div>
                                <input className="ae-slider" type="range" min="0.5" step="0.05" max="5"
                                       value={pitchMultiplier}
                                       onChange={handleChangePitch}/>
                            </div>
                        </div>

                        <div className="ae-input-group-item">
                                <select className="ae-select" id="to" onChange={handleChangeTo}>
                                    <option value="mp3">mp3</option>
                                    <option value="mp4">mp4</option>
                                    <option value="wav">wav</option>
                                    <option value="aac">aac</option>
                                    <option value="m4a">m4a</option>
                                    <option value="ogg">ogg</option>
                                    <option value="flac">flac</option>
                                    <option value="wma">wma</option>
                                    <option value="mkv">mkv</option>
                                </select>
                            </div>
                    </div>
                    <div className="ae-input-group">
                        <button className="ae-button" onClick={handleProcess}>Process
                        </button>
                    </div>
                    {loading ?
                        <>
                            Processing...
                        </>
                        :
                        error ?
                            <>
                                There was an error trying to process your audio file.
                            </>
                            :
                            done ?
                                <>
                                    Your file has been processed successfully.
                                </>
                                :
                                <>
                                </>}
                </div>
            </div>
        </>
    )
        ;
}

export default AudioEssentials;