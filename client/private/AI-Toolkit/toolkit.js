let model;

// Load MobileNetV2 model
async function loadModel() {
  model = await tf.loadGraphModel(
    'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1',
    { fromTFHub: true }
  );
  console.log("Model loaded successfully!");
}

loadModel();

// Handle file upload
const upload = document.getElementById('upload');
const img = document.getElementById('image');
const predictionText = document.getElementById('prediction');

upload.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  img.src = URL.createObjectURL(file);

  img.onload = async () => {
    const tensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .expandDims();

    const predictions = await model.predict(tensor).data();
    const topIdx = predictions.indexOf(Math.max(...predictions));
    
   // --- FETCH WEATHER BASED ON USER LOCATION ---
   function getWeather(lat, lon) {
    const apiKey = OPENWEATHER_API_KEY;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const weatherDiv = document.getElementById('weatherResult');
        if (data.cod === 200) {
          weatherDiv.innerHTML = `
            <p><strong>${data.name}</strong></p>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
          `;
        } else {
          weatherDiv.innerHTML = '<p>Weather data not available!</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching weather:', error);
        const weatherDiv = document.getElementById('weatherResult');
        weatherDiv.innerHTML = '<p>Failed to load weather data.</p>';
    });
   }
   function initMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 10);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(map);
  
    L.marker([lat, lon]).addTo(map)
      .bindPopup('You are here!')
      .openPopup();
  }
  //map
    function getLocationAndStart() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        console.log(`Your location: ${lat}, ${lon}`);
        initMap(lat, lon);
        getWeather(lat, lon);
      }, () => {
        alert("Unable to fetch location. Allow location access.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
   getLocationAndStart();
  predictionText.innerHTML = `Predicted: ${topIdx}`;
}
});