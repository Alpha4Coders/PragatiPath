// script.js
const courses = [
  {
    title: "🌱 Modern Farming",
    description: "Learn sustainable farming techniques, organic methods, and irrigation strategies."
  },
  {
    title: "💻 Digital Literacy",
    description: "Master the use of smartphones, digital apps, internet safety, and online tools."
  },
  {
    title: "📈Entrepreneurship",
    description: "Start and manage rural businesses, understand finance, and market your products."
  },
  {
    title: "🌾 Crop Health",
    description: "Identify and treat common crop diseases, use of AI in crop monitoring."
  },
  {
    title: "📸 Digital Tools in Farming",
    description: "Explore farm management apps, weather forecasts, and agricultural drones."
  },
  {
    title: "🧪 Fertilizers & Soil Health",
    description: "Understand the types of fertilizers, proper usage, and maintaining soil fertility."
  },
  {
    title: "🌦️ Weather & Seasons",
    description: "Learn how seasonal changes and weather patterns affect farming and harvest cycles."
  },
  {
    title: "🥕 Seasonal Crops Guide",
    description: "Know which crops thrive in each season and how to plan your farming calendar."
  }
];

const dashboard = document.getElementById('dashboard');

courses.forEach(course => {
  const card = document.createElement('div');
  card.className = 'course-card';
  card.innerHTML = `
    <div class="course-title">${course.title}</div>
    <div class="course-description">${course.description}</div>
  `;
  dashboard.appendChild(card);
});
