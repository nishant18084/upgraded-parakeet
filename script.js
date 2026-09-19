const statusText = document.getElementById('status');
const transcript = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.innerText = "Browser audio support nahi kar raha. Google Chrome use karein.";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN';

    function speak(text) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'hi-IN';
        utter.rate = 1.0;
        utter.pitch = 1.0;
        window.speechSynthesis.speak(utter);
    }

    window.toggleListening = function() {
        try {
            window.speechSynthesis.speak(new SpeechSynthesisUtterance('')); // Mobile audio unblocker
            recognition.start();
            statusText.innerText = "Listening...";
        } catch (e) {
            recognition.stop();
        }
    };

    recognition.onresult = async (event) => {
        const userInput = event.results[0][0].transcript;
        transcript.innerText = `"${userInput}"`;
        statusText.innerText = "Thinking...";

        // Brain se async jawab mangwana
        const answer = await Brain.process(userInput);

        speak(answer);
        statusText.innerText = "Ready";
    };

    recognition.onerror = () => {
        statusText.innerText = "Aawaz nahi aayi, dobara click karein.";
    };

    recognition.onend = () => {
        statusText.innerText = "Click start to speak";
    };
}
