const statusText = document.getElementById('status');
const transcript = document.getElementById('transcript');
const btn = document.getElementById('btn');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.innerText = "Chrome browser use karein.";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN';

    let isListening = false;

    function speak(text) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'hi-IN';
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
    }

    window.toggleListening = function() {
        // Mobile audio permission unlock
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));

        if (isListening) {
            recognition.stop();
            return;
        }

        try {
            recognition.start();
        } catch (e) {
            recognition.stop();
            setTimeout(() => recognition.start(), 300);
        }
    };

    recognition.onstart = () => {
        isListening = true;
        statusText.innerText = "Sun raha hoon... Boliye!";
        btn.innerText = "Listening...";
        btn.style.background = "#e5534b"; // Red highlight jab sun raha ho
    };

    recognition.onresult = async (event) => {
        const userInput = event.results[0][0].transcript;
        transcript.innerText = `"${userInput}"`;
        statusText.innerText = "Thinking...";

        try {
            const answer = await Brain.process(userInput);
            speak(answer);
            statusText.innerText = "Ready";
        } catch (err) {
            speak("Maine result screen par open kar diya hai.");
            window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank");
            statusText.innerText = "Ready";
        }
    };

    recognition.onerror = (event) => {
        console.log("Mic error details:", event.error);
        if (event.error === 'no-speech') {
            statusText.innerText = "Boliye sir, main sun raha hoon.";
        } else if (event.error === 'not-allowed') {
            statusText.innerText = "Browser settings me Mic Allow karein.";
        } else {
            statusText.innerText = "Tap karke fir se boliye.";
        }
    };

    recognition.onend = () => {
        isListening = false;
        btn.innerText = "Start Jarvis";
        btn.style.background = ""; // Original color wapas
        if (statusText.innerText.includes("Sun raha hoon")) {
            statusText.innerText = "Click start to speak";
        }
    };
}
