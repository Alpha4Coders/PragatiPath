let model = null;
let classList = null;

//plant disease model
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
            .div(tf.scalar(255))
            .expandDims();

        const prediction = await model.predict(tensor).data();
        const maxIdx = prediction.indexOf(Math.max(...prediction));
        predictionText.innerText = `Prediction: ${classList[maxIdx] || 'Unknown'}`;
    };
});

function getWeather() {
    const weatherDiv = document.getElementById('weatherResult');
    weatherDiv.innerText = "Fetching weather...";
}

//farming suggestions function
function getFarmingSuggestions() {
    const suggestionsDiv = document.getElementById('suggestions');
    suggestionsDiv.innerText = "Rotate crops, water early morning, and monitor soil nutrients.";
}
