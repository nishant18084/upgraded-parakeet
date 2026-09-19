// Local Instant Knowledge Base (Common Indian & Global GK)
const localKnowledge = {
    // Politics & India
    "pradhan mantri": "Bharat ke Pradhan Mantri Shri Narendra Modi hain.",
    "pm of india": "The Prime Minister of India is Narendra Modi.",
    "rashtrapati": "Bharat ki Rashtrapati Shrimati Droupadi Murmu hain.",
    "president of india": "The President of India is Droupadi Murmu.",
    "rajdhani": "Bharat ki rajdhani New Delhi hai.",
    "capital of india": "The capital of India is New Delhi.",
    "up ka mukhyamantri": "Uttar Pradesh ke mukhyamantri Yogi Adityanath hain.",
    "bihar ka mukhyamantri": "Bihar ke mukhyamantri Nitish Kumar hain.",

    // Science & Tech
    "suraj kya hai": "Suraj hamare saur mandal ka mukhya tara hai jo hydrogen aur helium se bana hai.",
    "chandrama kya hai": "Chandrama prithvi ka ekmatra prakritik upgrah ya satellite hai.",
    "computer kya hai": "Computer ek electronic yantra hai jo data ko process aur store karta hai.",
    "ai kya hai": "AI ka matlab Artificial Intelligence hota hai, yaani manav jaisi sochne samajhne wali machine.",

    // Jarvis Identity
    "tum kaun ho": "Main Jarvis hoon, aapka personal intelligent virtual assistant.",
    "who are you": "I am Jarvis, your personal web-based voice assistant.",
    "tumhe kisne banaya": "Mujhe aapne code aur logic ke jariye banaya hai.",
    "tum kya kar sakte ho": "Main sawalon ke jawab de sakta hoon, hisab kar sakta hoon, YouTube par gaane chala sakta hoon aur time bata sakta hoon."
};

const Brain = {
    async process(text) {
        const query = text.toLowerCase().trim();

        // 1. Calculations / Ganit Solver (e.g. "45 + 15 kitna hoga" ya "100 divided by 4")
        const mathCheck = this.solveMath(query);
        if (mathCheck) return mathCheck;

        // 2. Direct Web / App Launchers
        if (query.includes("youtube")) {
            let item = query.replace("youtube", "").replace("chalao", "").replace("kholo", "").replace("play", "").replace("par", "").trim();
            if (item.length > 0) {
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(item)}`, "_blank");
                return `YouTube par ${item} chala raha hoon.`;
            }
            window.open("https://www.youtube.com", "_blank");
            return "YouTube open kar diya hai.";
        }

        if (query.includes("google") || query.includes("search karo")) {
            let item = query.replace("google", "").replace("search karo", "").replace("search", "").replace("kholo", "").trim();
            window.open(`https://www.google.com/search?q=${encodeURIComponent(item || query)}`, "_blank");
            return `${item || 'Iska'} search page Google par khol diya hai.`;
        }

        // 3. Time & Date
        if (query.includes("time") || query.includes("samay") || query.includes("kitne baje")) {
            return `Abhi samay hai ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
        if (query.includes("tarikh") || query.includes("date") || query.includes("din")) {
            return `Aaj hai ${new Date().toLocaleDateString('hi-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;
        }

        // 4. Greetings
        if (query.includes("kaise ho") || query.includes("how are you")) {
            return "Main bilkul badiya hoon sir, batayein main kya seva karu?";
        }
        if (query.includes("hello") || query.includes("hi") || query.includes("namaste")) {
            return "Namaste sir! Main aapki aawaz sun raha hoon, puchiye kya puchna hai.";
        }

        // 5. Local Memory Match
        for (let key in localKnowledge) {
            if (query.includes(key)) {
                return localKnowledge[key];
            }
        }

        // 6. Deep Live Encyclopedia Search (Online Wikipedia Knowledge Fetcher)
        const onlineAnswer = await this.fetchLiveSummary(query);
        if (onlineAnswer) {
            return onlineAnswer;
        }

        // 7. Universal Fallback: Kisi bhi baaki sawal par directly search open karega
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
        return `Aapke is sawal ka jawab screen par load kar diya gaya hai.`;
    },

    solveMath(query) {
        let clean = query.replace(/plus/g, "+")
                         .replace(/minus/g, "-")
                         .replace(/guna/g, "*")
                         .replace(/multiply/g, "*")
                         .replace(/bhag/g, "/")
                         .replace(/divide/g, "/");

        const match = clean.match(/(\d+(\.\d+)?)\s*([\+\-\*\/])\s*(\d+(\.\d+)?)/);
        if (match) {
            const n1 = parseFloat(match[1]);
            const op = match[3];
            const n2 = parseFloat(match[4]);
            let ans = 0;
            if (op === '+') ans = n1 + n2;
            if (op === '-') ans = n1 - n2;
            if (op === '*') ans = n1 * n2;
            if (op === '/') ans = n2 !== 0 ? (n1 / n2) : "anant";
            return `Is hisab ka jawab hai ${ans}`;
        }
        return null;
    },

    async fetchLiveSummary(query) {
        try {
            // Unwanted fillers hatana
            let term = query.replace("kaun hai", "")
                            .replace("kya hai", "")
                            .replace("kahan hai", "")
                            .replace("who is", "")
                            .replace("what is", "")
                            .replace("batao", "")
                            .trim();

            if (term.length < 2) return null;

            // Hindi Wikipedia try karein
            let res = await fetch(`https://hi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
            if (!res.ok) {
                // Agar Hindi me na mile toh English Wikipedia
                res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
            }

            if (res.ok) {
                const data = await res.json();
                if (data.extract) {
                    // Maximum 180 characters ka clear spoken answer
                    return data.extract.split('.')[0] + ".";
                }
            }
        } catch (e) {
            console.log("Encyclopedia lookup error:", e);
        }
        return null;
    }
};
