const btn = document.getElementById('btn');
const statusText = document.getElementById('status');
const transcript = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.innerText = "Browser does not support Speech Recognition. Use Chrome.";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    function speak(message) {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(message);
        synth.speak(utter);
    }

    function toggleListening() {
        recognition.start();
        statusText.innerText = "Listening...";
    }

    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase();
        transcript.innerText = `"${text}"`;
        handleCommand(text);
    };

    recognition.onend = () => {
        statusText.innerText = "Click start to speak";
    };

    function handleCommand(cmd) {
        if (cmd.includes("time")) {
            const time = new Date().toLocaleTimeString();
            speak(`The current time is ${time}`);
        } else if (cmd.includes("open google")) {
            speak("Opening Google");
            window.open("https://www.google.com", "_blank");
        } else if (cmd.includes("open youtube")) {
            speak("Opening YouTube");
            window.open("https://www.youtube.com", "_blank");
        } else if (cmd.includes("hello") || cmd.includes("jarvis")) {
            speak("Hello, Jarvis is online. How can I help you?");
        } else {
            speak("Command not recognized.");
        }
    }
}
