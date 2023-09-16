import './App.css';
import Webcam from 'react-webcam';
import React, { useState, useEffect } from 'react';

const App = () => {
    // Define styles for the video capture section
    const videoStyles = {
        position: 'absolute',
        padding: 20,
        width: '100vh', // Adjust as needed
        height: '100vh',
        objectFit: "fill",
        zIndex: 1, // To ensure the video is displayed above other elements
    };
    const transcriptStyles = {
        fontSize: 45,
        borderRadius: 30,
        position: 'absolute',
        right: 20,
        padding: 20,
        width: '30%', // Adjust as needed
        height: '65vh',
        zIndex: 1 // To ensure the video is displayed above other elements
    }
    const [text, setText] = useState(""); // Ensure initial value is an empty string
    const [inputPrompt, setInputPrompt] = useState("Your given string or prompt here...");
    useEffect(() => {
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < inputPrompt.length) {
                setText(inputPrompt.substring(0, index + 1));
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 240); // 240 milliseconds per character

        return () => clearInterval(typingInterval); // Cleanup on component unmount
    }, [inputPrompt]);
    return (
        <div className="App">
            {/* Video Capture Section */}
            <div style={videoStyles}>
                <Webcam />
            </div>

            {/* Text Box Section */}
            <textarea style={transcriptStyles} value={text} aria-readonly={true}></textarea>
            {/* Existing Content */}

        </div>
    );
}

export default App;
