const btn = document.getElementById('btn');
const statusText = document.getElementById('status');
const transcript = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.innerText = "Browser does not support Speech Recognition. Chrome use karein.";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    // Hindi + Indian English dono samajhne ke liye
    recognition.lang = 'hi-IN';

    function speak(message) {
        window.speechSynthesis.cancel(); // Purani aawaz ko clear karein
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(message);
        utter.rate = 1.0;
        utter.pitch = 1.0;
        synth.speak(utter);
    }

    window.toggleListening = function() {
        try {
            recognition.start();
            statusText.innerText = "Listening...";
        } catch (e) {
            recognition.stop();
        }
    };

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript;
        transcript.innerText = `"${text}"`;
        statusText.innerText = "Thinking...";
        await handleCommand(text);
    };

    recognition.onend = () => {
        statusText.innerText = "Click start to speak";
    };

    async function handleCommand(cmd) {
        const lowerCmd = cmd.toLowerCase();

        // 1. Time Command
        if (lowerCmd.includes("time") || lowerCmd.includes("samay") || lowerCmd.includes("kitne baje")) {
            const time = new Date().toLocaleTimeString();
            speak(`Abhi ka samay hai ${time}`);
            return;
        }

        // 2. Open Google
        if (lowerCmd.includes("google kholo") || lowerCmd.includes("open google")) {
            speak("Google khol raha hoon");
            window.open("https://www.google.com", "_blank");
            return;
        }

        // 3. Open YouTube
        if (lowerCmd.includes("youtube kholo") || lowerCmd.includes("open youtube")) {
            speak("YouTube khol raha hoon");
            window.open("https://www.youtube.com", "_blank");
            return;
        }

        // 4. General Questions (Wikipedia API se direct jawab dhoondna)
        try {
            // Sawaal me se extra words hatakar topic nikalna
            let cleanQuery = lowerCmd
                .replace("kaun hai", "")
                .replace("kya hai", "")
                .replace("who is", "")
                .replace("what is", "")
                .trim();

            if (cleanQuery.length > 2) {
                // Hindi Wikipedia search
                let wikiUrl = `https://hi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
                let response = await fetch(wikiUrl);

                // Agar Hindi me na mile toh English Wikipedia me search
                if (!response.ok) {
                    wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`;
                    response = await fetch(wikiUrl);
                }

                if (response.ok) {
                    const data = await response.json();
                    if (data.extract) {
                        // Jawab bol kar bataye
                        speak(data.extract.substring(0, 150));
                        return;
                    }
                }
            }
        } catch (err) {
            console.log("Wiki fetch error:", err);
        }

        // 5. Agar koi direct answer na mile toh seedhe Google Search khol dega
        speak(`Iska jawab main dhoondh raha hoon: ${cmd}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cmd)}`, "_blank");
    }
}
