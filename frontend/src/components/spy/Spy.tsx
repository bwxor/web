import {useEffect, useState} from "react";
import '../../assets/css/spy/styles.css'
import click from "../../assets/audio/spy/click.mp3"

function Spy() {
    const [started, setStarted] = useState(false);
    const [noPlayers, setNoPlayers] = useState(2)
    const [revealed, setRevealed] = useState(false);
    const [revealedWord, setRevealedWord] = useState("");
    const [spyIndex, setSpyIndex] = useState(0);
    const [currPlayerIndex, setCurrPlayerIndex] = useState(0);
    const [selectedWord, setSelectedWord] = useState("");
    const [timerStarted, setTimerStarted] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [totalTime, setTotalTime] = useState(2);
    const [words, setWords] = useState<string>("")
    const [error, setError] = useState(false);

    const placeholder = "Write a list of possible words.\nDelimit them by a new line.";

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const handleTotalTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTotalTime(parseInt(event.target.value));
    }

    const handleNoPlayers = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNoPlayers(parseInt(event.target.value));
    }

    const handleGameStarted = () => {
        setError(false);

        let processedWords = words != null ? words.split('\n') : ["None"];
        processedWords = processedWords.map(word => word.trim());

        if (processedWords.length == 0 || processedWords.some((el: string) => el.length == 0)) {
            setError(true);
            return;
        }
        else {
            const audio = new Audio(click);
            audio.play();

            setSeconds(totalTime * 60);
            setStarted(true);
            setSpyIndex(getRandomInt(0, noPlayers - 1));
            setCurrPlayerIndex(0);

            const selectedWordIndex = getRandomInt(0, processedWords.length - 1);
            setSelectedWord(processedWords[selectedWordIndex]);
        }
    }

    const handleRevealCard = () => {
        const audio = new Audio(click);
        audio.play();

        if (currPlayerIndex == spyIndex) {
            setRevealedWord("Spy");
        } else {
            setRevealedWord(selectedWord);
        }

        setRevealed(true);
    }

    const handleWords = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setError(false);
        setWords(event.target.value);
    }

    const handleNextPlayer = () => {
        const audio = new Audio(click);
        audio.play();

        setCurrPlayerIndex(currPlayerIndex + 1);
        setRevealed(false);

        if (currPlayerIndex == noPlayers - 1) {
            setTimerStarted(true);
        }
    }

    const handleRestart = () => {
        const audio = new Audio(click);
        audio.play();

        setStarted(false);
        setRevealed(false);
        setTimerStarted(false);
    }

    useEffect(() => {
        let interval: number | undefined;

        if (timerStarted) {
            interval = setInterval(() => {
                setSeconds((prevTime) => {
                    return prevTime > 0 ? prevTime - 1 : 0
                });
            }, 1000);
        } else {
            setSeconds(totalTime * 60);
        }
        return () => {
            clearInterval(interval);
        };
    }, [timerStarted]);

    return (
        <>
            <div className="spy-app-box">
                {
                    timerStarted ?
                        <>
                            <div className="spy-timer">
                                <div className="spy-timer-seconds">
                                    {seconds}
                                </div>
                                <div className="spy-timer-item">
                                    Try to find the spy.
                                </div>
                                <div className="spy-timer-item">
                                    <button className="spy-button button-full-width"
                                            onClick={handleRestart}>Restart
                                    </button>
                                </div>
                            </div>
                        </>
                        :
                        started ?
                            <>
                                {
                                    revealed ?
                                        <>
                                            <div className="spy-player-card">
                                                <div className="spy-player-card-item">
                                                    <h2>Player {currPlayerIndex}</h2>
                                                </div>
                                                <div className="spy-player-card-item">
                                                    <div className="spy-word">
                                                        <span className={revealedWord == "Spy" ? "spy-red" : ""}>{revealedWord}</span>
                                                    </div>
                                                </div>
                                                <div className="spy-player-card-item">
                                                    <button className="spy-button button-full-width "
                                                            onClick={handleNextPlayer}>Next player
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="spy-player-card">
                                                <div className="spy-player-card-item">
                                                    <h2>Player {currPlayerIndex}</h2>
                                                </div>
                                                <div className="spy-player-card-item">
                                                    <div className="spy-player-card-icon">
                                                        <span className="fa-solid fa-question"></span>
                                                    </div>
                                                </div>
                                                <div className="spy-player-card-item">
                                                    <button className="spy-button button-full-width"
                                                            onClick={handleRevealCard}>Reveal card
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                }
                            </>
                            :
                            <>
                                <div className="spy-input-group">
                                    <div className="spy-input-group-items">
                                        <div className="spy-input-group-item">
                                            <div className="spy-title-group">
                                                <div className="spy-title-group-item fa-solid fa-user-secret"></div>
                                                <div className="spy-title-group-item spy-title">Spy</div>
                                            </div>
                                        </div>
                                        <div className="spy-input-group-item">
                                            <textarea id="words" className={error ? "spy-textarea spy-textarea-error" : "spy-textarea"}
                                                      placeholder={placeholder} onChange={handleWords}>{words}</textarea>
                                        </div>
                                        <div className="spy-input-group-item">
                                            <div className="spy-slider-group">
                                                <div className="spy-slider-group-item">
                                                    <h4>Players: {noPlayers}</h4>
                                                    <input type="range" value={noPlayers} min="2" max="9"
                                                           className="spy-slider"
                                                           onChange={handleNoPlayers}/>
                                                </div>
                                                <div className="spy-slider-group-item">
                                                    <h4>Time: {totalTime} minutes</h4>
                                                    <input type="range" value={totalTime} min="2" max="9"
                                                           className="spy-slider"
                                                           onChange={handleTotalTime}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="spy-input-group-buttons">
                                        <button className="spy-button button-full-width"
                                                onClick={handleGameStarted}>Start
                                        </button>
                                    </div>
                                </div>
                            </>
                }

            </div>
        </>
    );
}

export default Spy;