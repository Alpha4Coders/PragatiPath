const logoutBtn = document.querySelector(".logout-btn");
const logoutIcon = document.querySelector("#logout-icon");

let userData = null;

logoutBtn.addEventListener('mouseenter', () => {
    logoutIcon.setAttribute('fill', 'red');
});

logoutBtn.addEventListener('mouseleave', () => {
    logoutIcon.setAttribute('fill', '#fefae0');
});

const taskBox = document.getElementById("task-box");
const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("month-label");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const resetBtn = document.getElementById("reset-progress");
const languageInfo = document.getElementById("language-info");
const notesList = document.getElementById('notes-list');
const newNoteInput = document.getElementById('new-note');
const addNoteBtn = document.getElementById('add-note');

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const learningSchedule = {
    1: "📘 Organic Farming Basics",
    2: "💻 Using Smartphones for Agriculture",
    3: "🌱 Seed Selection Techniques",
    4: "🌐 Internet Basics for Farmers",
    5: "📊 Entrepreneurship 101",
    6: "📷 Pest Detection via Mobile",
    7: "🏪 Setting Up Local Farm Stall",
    8: "🛰️ Weather Apps for Farming",
    9: "💼 Govt Schemes & Online Applications",
    10: "🚀 Leadership Training",
    15: "📦 Packaging and Branding",
    20: "🧪 Soil Testing Techniques",
    30: "🎓 Final Quiz & Practice"
};

function getStorageKey(month, year) {
    return `completed-${month + 1}-${year}`;
}

function getCompletedDays() {
    const key = getStorageKey(currentMonth, currentYear);
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveCompletedDays(days) {
    const key = getStorageKey(currentMonth, currentYear);
    localStorage.setItem(key, JSON.stringify(days));
}

function updateMonthLabel() {
    monthLabel.textContent = `${months[currentMonth]} ${currentYear}`;
}

function updateProgress(totalDays, completedDays) {
    const percent = Math.round((completedDays.length / totalDays) * 100);
    progressBar.value = percent;
    progressText.textContent = `${percent}%`;
}

function generateCalendar() {
    const completedDays = getCompletedDays();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    let tableHTML = "<tr>";
    for (let i = 0; i < firstDay; i++) {
        tableHTML += "<td></td>";
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isCompleted = completedDays.includes(day);
        const className = isCompleted ? "calendar-day completed" : "calendar-day";
        tableHTML += `<td class="${className}" data-day="${day}">${day}</td>`;
        if ((day + firstDay) % 7 === 0) tableHTML += "</tr><tr>";
    }

    tableHTML += "</tr>";
    calendar.innerHTML = tableHTML;
    updateMonthLabel();
    updateProgress(daysInMonth, completedDays);

    document.querySelectorAll(".calendar-day").forEach(dayCell => {
        dayCell.addEventListener("click", () => {
            const day = parseInt(dayCell.getAttribute("data-day"));
            const task = learningSchedule[day] || "📝 No specific task. Use this day to review!";
            const isCompleted = completedDays.includes(day);

            taskBox.innerHTML = `
                🎓 <strong>Learning for ${day} ${months[currentMonth]}:</strong><br>${task}
                <br><br>
                <button id="done-btn">${isCompleted ? "✅ Completed" : "✅ Mark as Done"}</button>
            `;

            document.getElementById("done-btn").onclick = () => {
                if (!completedDays.includes(day)) {
                    completedDays.push(day);
                    saveCompletedDays(completedDays);
                    generateCalendar();
                    taskBox.innerHTML = `🎉 Great job! You've completed ${day} ${months[currentMonth]}.`;
                }
            };
        });
    });
}

function detectLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    let message = "";

    if (lang.startsWith("hi")) message = "🌍 आपकी भाषा पहचानी गई: हिंदी";
    else if (lang.startsWith("bn")) message = "🌍 আপনার ভাষা: বাংলা";
    else if (lang.startsWith("ta")) message = "🌍 உங்கள் மொழி: தமிழ்";
    else message = `🌍 Detected Language: ${lang}`;

    languageInfo.textContent = message;
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes')) || [];
    renderNotes(savedNotes);
}

function saveNotes(notes) {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

function renderNotes(notes) {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.innerHTML = `
            <span class="note-text">${note}</span>
            <button class="delete-note" data-index="${index}">×</button>
        `;
        notesList.appendChild(noteElement);
    });

    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteNote(index);
        });
    });
}

function addNote() {
    const noteText = newNoteInput.value.trim();
    if (noteText) {
        const savedNotes = JSON.parse(localStorage.getItem('quickNotes')) || [];
        savedNotes.push(noteText);
        saveNotes(savedNotes);
        renderNotes(savedNotes);
        newNoteInput.value = '';
    }
}

function deleteNote(index) {
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes')) || [];
    savedNotes.splice(index, 1);
    saveNotes(savedNotes);
    renderNotes(savedNotes);
}

const regionDatabase = {
    "bihar": {
        topCrops: {
            "rice": {
                seasons: ["Kharif (July-Nov)"],
                varieties: ["Sona Masuri", "Pusa Basmati"],
                water: "1500-2000mm (needs flooded fields)",
                soil: "Alluvial (ideal), can grow in clayey"
            },
            "wheat": {
                seasons: ["Rabi (Nov-Mar)"],
                varieties: ["HD 2967", "DBW 187"],
                water: "450-650mm (6-8 irrigations)",
                soil: "Well-drained loamy"
            },
            "maize": {
                seasons: ["Kharif (Jun-Sep)", "Summer (Feb-May)"],
                varieties: ["Pioneer", "DKC 9108"],
                water: "500-800mm",
                soil: "All types except waterlogged"
            },
            "litchi": {
                seasons: ["Perennial (Harvest May-Jun)"],
                varieties: ["Shahi", "China"],
                water: "Regular during fruit development",
                soil: "Deep sandy loam (Muzaffarpur famous)"
            }
        },
        challenges: ["Floods in North Bihar", "Drought in South Bihar"]
    },
    "west bengal": {
        subregions: {
            "darjeeling": {
                specialty: "Tea (world famous Darjeeling tea)",
                seasons: "Year-round with dormancy in winter",
                altitude: "600-2000m",
                varieties: ["AV2", "P312", "B157"],
                challenges: ["Soil erosion", "Frost damage"]
            },
            "plains": {
                mainCrops: ["Rice (Aman/Boro)", "Jute", "Potato"],
                seasons: {
                    "Aman Rice": "Jul-Dec",
                    "Boro Rice": "Nov-May",
                    "Jute": "Mar-Aug"
                }
            }
        }
    },
    "maharashtra black soil": {
        characteristic: "Regur soil (high clay, moisture retentive)",
        majorCrops: {
            "cotton": {
                varieties: ["Bunny", "Narma"],
                sowing: "Jun-Jul",
                water: "600-800mm (drip irrigation recommended)"
            },
            "soybean": {
                varieties: ["JS 335", "MAUS 71"],
                sowing: "Jun-Jul",
                water: "450-700mm"
            },
            "sugarcane": {
                varieties: ["Co 86032", "CoM 0265"],
                planting: "Oct-Mar",
                water: "2000-2500mm"
            }
        },
        practices: ["Deep ploughing in summer", "Contour bunding for erosion control"]
    }
};

function setupChat() {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatBox = document.getElementById('chat-box');
    const typingIndicator = document.getElementById('typing-indicator');

    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = message;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showTypingIndicator() {
        typingIndicator.classList.remove('hidden');
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideTypingIndicator() {
        typingIndicator.classList.add('hidden');
    }

    function formatCropInfo(cropData, cropName) {
        let response = `${cropName.toUpperCase()}:\n`;
        for (const key in cropData) {
            if (Array.isArray(cropData[key])) {
                response += `• ${key}: ${cropData[key].join(", ")}\n`;
            } else {
                response += `• ${key}: ${cropData[key]}\n`;
            }
        }
        return response;
    }

    function analyzeQuestion(question) {
        question = question.toLowerCase();
        
        if (question.includes("bihar")) {
            return handleBiharQuery(question);
        } else if (question.includes("darjeeling") || (question.includes("west bengal") && question.includes("tea"))) {
            return handleDarjeelingQuery(question);
        } else if (question.includes("maharashtra") || question.includes("black soil")) {
            return handleMaharashtraQuery(question);
        }
        
        const commonCrops = ["rice", "wheat", "maize", "cotton", "sugarcane", "litchi", "tea", "jute"];
        for (const crop of commonCrops) {
            if (question.includes(crop)) {
                return handleCropQuery(crop, question);
            }
        }
        
        if (question.includes("season") || question.includes("when to plant")) {
            return "Main crop seasons:\n• Kharif (Jun-Oct): Rice, maize, cotton\n• Rabi (Oct-Mar): Wheat, barley\n• Zaid (Mar-Jun): Seasonal fruits\n\nSpecify region for precise dates";
        }
        
        if (question.includes("water") || question.includes("irrigation")) {
            return "Water needs vary by region:\n• Bihar plains: Flood irrigation common\n• Maharashtra: Drip irrigation recommended\n• Darjeeling: Rain-fed with sprinklers\n\nAsk about specific crops";
        }
        
        return "I specialize in:\n• Bihar agriculture (rice, wheat, litchi)\n• West Bengal/Darjeeling (tea, jute)\n• Maharashtra black soil (cotton, soybean)\n\nAsk me anything about these regions!";
    }

    function handleBiharQuery(question) {
        if (question.includes("rice")) {
            return formatCropInfo(regionDatabase.bihar.topCrops.rice, "Bihar Rice") + 
                   "\nTip: Sowing time varies between North (early July) and South Bihar (late July)";
        } else if (question.includes("litchi")) {
            return formatCropInfo(regionDatabase.bihar.topCrops.litchi, "Bihar Litchi") +
                   "\nNote: Muzaffarpur is India's litchi hub with GI tag";
        } else if (question.includes("challenge")) {
            return "Bihar's agricultural challenges:\n• " + regionDatabase.bihar.challenges.join("\n• ");
        }
        return "Bihar's main crops:\n• Rice (Kharif)\n• Wheat (Rabi)\n• Maize (Kharif/Summer)\n• Litchi (Perennial)\n\nAsk about specific crops for details";
    }

    function handleDarjeelingQuery(question) {
        if (question.includes("tea")) {
            const teaInfo = regionDatabase["west bengal"].subregions.darjeeling;
            return `DARJEELING TEA:\n• Altitude: ${teaInfo.altitude}\n• Varieties: ${teaInfo.varieties.join(", ")}\n• Challenges: ${teaInfo.challenges.join(", ")}\n\nFirst flush (Mar-Apr) is most premium`;
        }
        return "Darjeeling region specializes in:\n• Tea plantations (world famous)\n• Some potato/orange cultivation\n\nAsk about tea growing practices";
    }

    function handleMaharashtraQuery(question) {
        if (question.includes("cotton")) {
            return formatCropInfo(regionDatabase["maharashtra black soil"].majorCrops.cotton, "Black Soil Cotton") +
                   "\nPractice: Intercropping with pigeon pea common";
        } else if (question.includes("soil")) {
            return "Black Soil (Regur) Characteristics:\n• High clay content\n• Excellent moisture retention\n• Cracks in summer\n• Rich in calcium/magnesium";
        }
        return "Maharashtra Black Soil crops:\n• Cotton (Main cash crop)\n• Soybean\n• Sugarcane\n\nAsk about specific crops or soil management";
    }

    function handleCropQuery(crop, question) {
        if (crop === "litchi") return handleBiharQuery("bihar litchi");
        if (crop === "tea") return handleDarjeelingQuery("darjeeling tea");
        
        let response = `${crop.toUpperCase()} GROWING INFO:\n`;
        
        if (["rice", "wheat", "maize"].includes(crop)) {
            response += `Bihar:\n${formatCropInfo(regionDatabase.bihar.topCrops[crop], crop)}`;
        }
        
        if (crop === "cotton" || crop === "soybean") {
            response += `Maharashtra Black Soil:\n${formatCropInfo(regionDatabase["maharashtra black soil"].majorCrops[crop], crop)}`;
        }
        
        if (question.includes("water") || question.includes("irrigation")) {
            response += `\nWater Management Tip: ${getWaterTip(crop)}`;
        }
        
        return response || `I have limited data on ${crop}. Ask about major crops of Bihar, West Bengal, or Maharashtra.`;
    }

    function getWaterTip(crop) {
        const tips = {
            "rice": "In Bihar, practice intermittent flooding to save water",
            "wheat": "Critical irrigation needed at crown root and flowering stages",
            "cotton": "In black soil, use drip irrigation to prevent waterlogging",
            "tea": "In Darjeeling, mulch plants to retain moisture on slopes"
        };
        return tips[crop] || "Water needs vary by region - specify location for precise advice";
    }

    function processMessage() {
        const message = chatInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        chatInput.value = '';

        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();
            const response = analyzeQuestion(message);
            addMessage(response, false);
        }, 1500);
    }

    setTimeout(() => {
        addMessage("Namaskar! I'm your regional agriculture assistant specialized in:", false);
        addMessage("• Bihar (Rice, Wheat, Litchi)\n• West Bengal/Darjeeling (Tea, Jute)\n• Maharashtra Black Soil (Cotton, Soybean)", false);
        addMessage("Ask me about crops, seasons, or regional practices!", false);
    }, 500);

    sendButton.addEventListener('click', processMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processMessage();
        }
    });
}

// Initialize everything when the page loads
window.addEventListener('load', async () => {
    try {
        const req = await fetch('/api/userinfo');
        const res = await req.json();
        userData = res;
        document.getElementById("username").innerText = userData.name;
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }

    // Setup event listeners
    document.getElementById("prev-month").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar();
    });

    document.getElementById("next-month").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar();
    });

    resetBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to reset progress for this month?")) {
            localStorage.removeItem(getStorageKey(currentMonth, currentYear));
            generateCalendar();
            taskBox.innerHTML = "🗓️ Calendar progress reset. Click a day to start learning!";
        }
    });

    addNoteBtn.addEventListener('click', addNote);
    newNoteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addNote();
        }
    });

    // Initialize components
    detectLanguage();
    generateCalendar();
    loadNotes();
    setupChat();
});

function showSection(targetId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(targetId).style.display = 'block';
}

const navLinks = document.querySelectorAll('.nav-anchor');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        showSection(targetId);
    });
});