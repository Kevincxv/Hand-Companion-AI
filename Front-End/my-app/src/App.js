import './App.css';
import WaveSurfer from 'wavesurfer.js';
import Webcam from 'react-webcam';
import React, { useState, useEffect } from 'react';
import soundFile from './deep-volcano-sound-effect.mp3';
const App = () => {
    const videoResize = {
        width: window.innerWidth * 0.5,  // 50% of window width
        height: window.innerHeight * 0.65  // 65% of window height
    };

    const [text, setText] = useState("");
    const [inputPrompt, setInputPrompt] = useState("Your given string or prompt here...");
    const [waveSurfer, setWaveSurfer] = useState(null);

    useEffect(() => {
        const ws = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'blue',
            progressColor: 'lightblue',
            barWidth: 3,
            barRadius: 3,
            cursorWidth: 1,
            height: 150,
            barGap: 3
        });

        ws.load(soundFile); // Replace with your audio file path

        setWaveSurfer(ws);

        return () => ws && ws.destroy();
    }, []);

    useEffect(() => {
        let index = 0;
        let typingSimulation;

        if (waveSurfer) {
            waveSurfer.on('ready', () => {
                const audioDuration = waveSurfer.getDuration();
                const typingInterval = audioDuration * 1000 / inputPrompt.length;

                waveSurfer.on('play', () => {
                    typingSimulation = setInterval(() => {
                        if (index < inputPrompt.length) {
                            setText(inputPrompt.substring(0, index + 1));
                            index++;
                        } else {
                            clearInterval(typingSimulation);
                        }
                    }, typingInterval);
                });
            });
        }

        return () => {
            waveSurfer && waveSurfer.un('play');
            clearInterval(typingSimulation);
        };
    }, [waveSurfer, inputPrompt]);

    return (
        <div className="App">
            {/* Video Capture Section */}
            <div className="videoStyles">
                <Webcam videoConstraints={videoResize} />
            </div>

            {/* Text Box Section */}
            <textarea className="transcriptStyles" value={text} aria-readonly={true}></textarea>
            {/* Play Button */}
            <button className="playButtonStyles" onClick={() => waveSurfer.play()}>Play</button>
            {/* EQ Visualizer */}
            <div id="waveform" style={{ position: 'absolute', bottom: '10px', width: '100%' }}></div>


        </div>
    );
}

export default App;
