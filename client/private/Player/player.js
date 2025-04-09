
const curriculumSections = [
    {
      title: "Introduction",
      lessons: ["Welcome to Organic Farming", "Why Organic? Importance and Benefits"]
    },
    {
      title: "Soil & Fertility Management",
      lessons: ["Building Healthy Soil", "Natural Fertilizers and Composting Techniques"]
    },
    {
      title: "Crop Management",
      lessons: ["Crop Rotation Strategies", "Pest and Weed Management without Chemicals"]
    },
    {
      title: "Harvesting and Marketing",
      lessons: ["Harvesting Techniques", "How to Market Organic Produce"]
    }
  ];
  
  // Populate curriculum dynamically
  const curriculumList = document.getElementById('curriculum-list');
  
  curriculumSections.forEach(section => {
    const item = document.createElement('div');
    item.className = 'curriculum-item';
  
    const header = document.createElement('div');
    header.className = 'curriculum-header';
    header.textContent = section.title;
  
    const content = document.createElement('div');
    content.className = 'curriculum-content';
  
    section.lessons.forEach(lesson => {
      const p = document.createElement('p');
      p.textContent = lesson;
      content.appendChild(p);
    });
  
    header.addEventListener('click', () => {
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  
    item.appendChild(header);
    item.appendChild(content);
    curriculumList.appendChild(item);
  });
  
  // Enroll button action
  function enrollCourse() {
    alert("Thank you for enrolling! Welcome to PragatiPath.");
  }