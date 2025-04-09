const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function endpoint_geminiYoutubeSearch(req, res) {
    const query = req.params.query;

    if (!query) {
        res.json({ error: "Query parameter is required." });
        return;
    }

    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(`List out the top 5 relevant youtube videos for the query "${query}" in a JSON format. The JSON should contain the title.`);

    console.log(result, result.response);
    

    res.send(result.response.text());
}

async function endpoint_openWeatherAPI(req, res)
{
    const { lat, lon } = req.params;
    const wres = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
    const data = await wres.json();
    res.json({
        name: data.name,
        weather: data.weather[0].description,
        temp: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed
    });
}

class GeminiChatBot
{    
    constructor() {
        this.model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
        this.chat = this.model.startChat();
        this.chat.sendMessage("You are a helpful assistant answering questions to a farmer requiring help in agriculture in our \"PragatiPath\" farming education site");
    }

    async endpoint_chatbot(req, res)
    {        
        const query = req.body.query;
        
        if (!query) {
            res.json({ error: "Query parameter is required." });
            return;
        }
        
        const msg = await this.chat.sendMessage(query);
        res.json({ response: msg.response.text() });
    }
}

module.exports = {
    endpoint_openWeatherAPI,
    endpoint_geminiYoutubeSearch,
    GeminiChatBot
};