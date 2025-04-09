// const curriculumSections = [
//     {
//         title: "Introduction",
//         lessons: ["Welcome to Organic Farming", "Why Organic? Importance and Benefits"]
//     },
//     {
//         title: "Soil & Fertility Management",
//         lessons: ["Building Healthy Soil", "Natural Fertilizers and Composting Techniques"]
//     },
//     {
//         title: "Crop Management",
//         lessons: ["Crop Rotation Strategies", "Pest and Weed Management without Chemicals"]
//     },
//     {
//         title: "Harvesting and Marketing",
//         lessons: ["Harvesting Techniques", "How to Market Organic Produce"]
//     }
// ];

// // Populate curriculum dynamically
// const curriculumList = document.getElementById('curriculum-list');

// curriculumSections.forEach(section => {
//     const item = document.createElement('div');
//     item.className = 'curriculum-item';

//     const header = document.createElement('div');
//     header.className = 'curriculum-header';
//     header.textContent = section.title;

//     const content = document.createElement('div');
//     content.className = 'curriculum-content';

//     section.lessons.forEach(lesson => {
//         const p = document.createElement('p');
//         p.textContent = lesson;
//         content.appendChild(p);
//     });

//     header.addEventListener('click', () => {
//         content.style.display = content.style.display === 'block' ? 'none' : 'block';
//     });

//     item.appendChild(header);
//     item.appendChild(content);
//     curriculumList.appendChild(item);
// });

async function fetchCourseData() {
    const name = localStorage.getItem('courseName');
    const response = await fetch(window.location.origin + `/api/getcourse/name/${name}`);
    const data = await response.json();

    document.getElementById('course-title').textContent = data.name;
    document.getElementById('course-desc').textContent = data.description;
    document.getElementById('course-lang').textContent = data.medium;

    const container = document.querySelector('.video-preview');
    container.innerHTML = `<iframe class="course-data" src="https://www.youtube.com/embed/videoseries?si=snA55-bnnKld84ew&amp;list=${localStorage.getItem("coursePlaylist")}" title="${data.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;

    const chres = await fetch(window.location.origin + `/api/youtubechannel/${localStorage.getItem("coursePlaylist")}`);
    const chdata = await chres.json();
    document.getElementById('channel-img').src = chdata.channelThumbnail;
    document.getElementById('channel-name').textContent = chdata.channelTitle;
    document.getElementById('channel-desc').textContent = chdata.channelDescription;
    document.getElementById('channel-link').href = `https://www.youtube.com/channel/${chdata.channelId}`;
    document.getElementById('channel-link').target = "_blank";
    document.getElementById('channel-link').rel = "noopener noreferrer";
    document.getElementById('channel-link').textContent = chdata.channelTitle;
}

fetchCourseData();

// Enroll button action
function enrollCourse() {
    alert("Thank you for enrolling! Welcome to AgriLearn.");
}