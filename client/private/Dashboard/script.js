const logoutBtn = document.querySelector(".logout-btn")
const logoutIcon = document.querySelector("#logout-icon")
logoutBtn.addEventListener('mouseenter', () => {
    logoutIcon.setAttribute('fill', 'red');
})
logoutBtn.addEventListener('mouseleave', () => {
    logoutIcon.setAttribute('fill', '#fefae0');
})
const taskBox = document.getElementById("task-box");
const calendar = document.getElementById("calendar");
const monthLabel = document.getElementById("month-label");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const resetBtn = document.getElementById("reset-progress");
const languageInfo = document.getElementById("language-info");

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

// Navigation
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

// Reset progress
resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset progress for this month?")) {
    localStorage.removeItem(getStorageKey(currentMonth, currentYear));
    generateCalendar();
    taskBox.innerHTML = "🗓️ Calendar progress reset. Click a day to start learning!";
  }
});

// Language Detection
function detectLanguage() {
  const lang = navigator.language || navigator.userLanguage;
  let message = "";

  if (lang.startsWith("hi")) message = "🌍 आपकी भाषा पहचानी गई: हिंदी";
  else if (lang.startsWith("bn")) message = "🌍 আপনার ভাষা: বাংলা";
  else if (lang.startsWith("ta")) message = "🌍 உங்கள் மொழி: தமிழ்";
  else message = `🌍 Detected Language: ${lang}`;

  languageInfo.textContent = message;
}

detectLanguage();
generateCalendar();


// Quick Notes functionality
const notesList = document.getElementById('notes-list');
const newNoteInput = document.getElementById('new-note');
const addNoteBtn = document.getElementById('add-note');

// Load notes from local storage
function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes')) || [];
    renderNotes(savedNotes);
}

// Save notes to local storage
function saveNotes(notes) {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

// Render notes to the DOM
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

    // Add delete event listeners
    document.querySelectorAll('.delete-note').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteNote(index);
        });
    });
}

// Add a new note
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

// Delete a note
function deleteNote(index) {
    const savedNotes = JSON.parse(localStorage.getItem('quickNotes')) || [];
    savedNotes.splice(index, 1);
    saveNotes(savedNotes);
    renderNotes(savedNotes);
}

// Event listeners
addNoteBtn.addEventListener('click', addNote);
newNoteInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNote();
    }
});

// Load notes when page loads
window.addEventListener('load', loadNotes);