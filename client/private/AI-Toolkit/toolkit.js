let model = null;
let classList = null;

// Load rishit-dagli plant disease model
async function loadModel() {
    classList = await fetch(window.location.origin + '/public/assets/plant-disease-tfjs-default-v1/class_indices.json');
    classList = await classList.json();

    model = await tf.loadLayersModel(
        window.location.origin + '/public/assets/plant-disease-tfjs-default-v1/model.json',
        { fromTFHub: true }
    );
    console.log("Model loaded successfully!");
}

loadModel();

// Handle file upload
const upload = document.getElementById('upload');
const img = document.getElementById('image');
const predictionText = document.getElementById('prediction');

const weatherDiv = document.getElementById('weatherResult');

upload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
        if (model == null) {
            alert("Model not loaded yet, please wait a while and resend image");
            img.src = "";
            return;
        }

        const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .div(tf.scalar(255.0))
            .expandDims();

        const predictions = await model.predict(tensor).data();
        const topIdx = predictions.indexOf(Math.max(...predictions));
        const topPred = classList[topIdx].split('___');
        predictionText.innerHTML = `<p>Predicted crop: ${topPred[0]}<br><br>Predicted disease: ${topPred[1]}</p>`;
    };
});

// Weather by coordinates (for location-based fetch)
async function getWeatherByCoords(lat, lon) {
    try {
        const wres = await fetch(window.location.origin + `/api/openweather/${lat}/${lon}`);
        const data = await wres.json();
        weatherDiv.innerHTML = 
           `<p><strong>${data.name}</strong></p>
            <p>Temperature: ${data.temp}°C</p>
            <p>Weather: ${data.weather}</p>
            <p>Humidity: ${data.humidity}%</p>
            <p>Wind Speed: ${data.wind} m/s</p>`;
        //Farming Suggestions
        const farmingSuggestion = getFarmingSuggestion(data);
        weatherDiv.innerHTML += `<p style="color: green;"><strong>Farming Tip:</strong> ${farmingSuggestion}</p>`;

    } catch (error) {
        console.log(error);
        weatherDiv.innerHTML = '<p>Weather data not available!</p>';
    }
}

function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Your location: ${lat}, ${lon}`);
            getWeatherByCoords(lat, lon);
        }, () => {
            alert("Unable to fetch location. Allow location access.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Map Initialization
function initMap(lat, lon) {
    const map = L.map('map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup('You are here!')
        .openPopup();
}

// Get Location and Start Map + Weather
function getLocationAndStart() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Your location: ${lat}, ${lon}`);
            initMap(lat, lon);
            getWeatherByCoords(lat, lon);
        }, () => {
            alert("Unable to fetch location. Allow location access.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
function getFarmingSuggestion(weatherData) {
    const temp = weatherData.temp;
    const humidity = weatherData.humidity;
    const mainWeather = weatherData.weather.toLowerCase();

    if (temp > 32 && humidity < 40) {
        return "Consider drought-resistant crops like millet, sorghum, or chickpeas.";
    }
    if (humidity > 75) {
        return "High humidity detected. Monitor for fungal infections and use proper fungicides.";
    }
    if (mainWeather.includes("rain")) {
        return "Heavy rains expected. Ensure proper water drainage in fields.";
    }
    if (temp >= 20 && temp <= 25) {
        return "Ideal conditions for planting vegetables like tomatoes, peppers, and lettuce.";
    }
    return "Weather looks normal. Continue regular farming practices.";
}
getLocationAndStart();