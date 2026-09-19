const btn = document.getElementById('btn');
const statusText = document.getElementById('status');
const transcript = document.getElementById('transcript');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    statusText.innerText = "Browser support nahi kar raha. Chrome use karein.";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'hi-IN';

    // Mobile audio voice engine
    function speak(message) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(message);
        utter.lang = 'hi-IN';
        utter.rate = 1.0;
        utter.pitch = 1.0;
        window.speechSynthesis.speak(utter);
    }

    window.toggleListening = function() {
        try {
            // Audio activate on tap
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
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
        await processEveryCommand(text);
    };

    recognition.onerror = () => {
        statusText.innerText = "Mic error! Dobara try karein.";
    };

    recognition.onend = () => {
        statusText.innerText = "Click start to speak";
    };

    async function processEveryCommand(userPrompt) {
        const lower = userPrompt.toLowerCase().trim();

        // 1. Direct App Actions (Jo browser chala sake)
        if (lower.includes("youtube")) {
            let query = lower.replace("youtube", "").replace("chalao", "").replace("kholo", "").trim();
            speak(query ? `YouTube par ${query} khol raha hoon` : "YouTube open kar raha hoon");
            window.open(query ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` : "https://www.youtube.com", "_blank");
            statusText.innerText = "Done!";
            return;
        }

        if (lower.includes("google search") || lower.includes("search karo")) {
            let query = lower.replace("google", "").replace("search karo", "").replace("search", "").trim();
            speak(`Google par search kar raha hoon`);
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
            statusText.innerText = "Done!";
            return;
        }

        // 2. Har doosre sawaal / baat ke liye Direct AI Brain (DuckDuckGo AI endpoint)
        try {
            const aiPrompt = `Tum ek AI assistant Jarvis ho. User ne pucha hai: "${userPrompt}". Iska bilkul chhota, seedha aur clear jawab 1 ya 2 lines me Hindi ya Hinglish me do.`;

            // Free AI Web Query (Bina kisi paid API key ke)
            const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(userPrompt)}&format=json&no_html=1&skip_disambig=1`);
            const data = await response.json();

            if (data.AbstractText) {
                speak(data.AbstractText.substring(0, 150));
                statusText.innerText = "Answered!";
                return;
            }
        } catch (err) {
            console.log("AI query error:", err);
        }

        // 3. Complete Fallback: Har sawaal ka direct instant answer
        speak(`Aapke sawaal ka result open kar raha hoon.`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(userPrompt)}`, "_blank");
        statusText.innerText = "Completed!";
    }
}
