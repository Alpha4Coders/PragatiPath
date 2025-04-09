let model;

// 1. Load MobileNetV2 model
async function loadModel() {
    model = await tf.loadGraphModel(
        'https://www.kaggle.com/models/rishitdagli/plant-disease/TfJs/default/1',
        { fromTFHub: true }
    );
    console.log("Model loaded successfully!");
}

loadModel();

// --- FETCH WEATHER BASED ON USER LOCATION ---
async function getWeather(lat, lon) {
    const weatherDiv = document.getElementById('weatherResult');
    try {
        const res = await fetch(window.location.origin + `/api/openweather/${lat}/${lon}`);
        const data = await res.json();
        weatherDiv.innerHTML = `
        <p><strong>${data.name}</strong></p>
        <p>Temperature: ${data.temp}°C</p>
        <p>Weather: ${data.weather}</p>
        <p>Humidity: ${data.humidity}%</p>
        <p>Wind Speed: ${data.wind} m/s</p>`;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
    }
}

function initMap(lat, lon) {
    const map = document.getElementById('gmaps');
    map.src = `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`;
}

function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log(`Your location: ${lat}, ${lon}`);
            getWeather(lat, lon);
        }, () => {
            alert("Unable to fetch location. Allow location access.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// map
function getLocationAndMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            console.log(`Your location: ${lat}, ${lon}`);
            initMap(lat, lon);
        }, () => {
            alert("Unable to fetch location. Allow location access.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// map
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

// 2. Handle file upload
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
        
        getLocationAndStart();

        predictionText.innerHTML = `Predicted: ${topIdx}`;
    }
});