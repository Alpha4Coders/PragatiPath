const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { LRUCache } = require('lru-cache');
const crypto = require('node:crypto');

const dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function endpoint_geminiYoutubeSearch(req, res) {
    const query = req.params.query;

    if (!query) {
        res.json({ error: "Query parameter is required." });
        return;
    }

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-002' });

    const result = await model.generateContent(`List out the top 5 relevant youtube videos for the query "${query}" in a JSON format. The JSON should contain the title.`);

    console.log(result, result.response);

    res.send(result.response.text());
}

async function endpoint_youtubePlaylistImg(req, res) {
    if (!req.params.playlist) {
        res.json({ error: "Playlist ID is required." });
        return;
    }

    const yres = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${req.params.playlist}&key=${process.env.YOUTUBE_DATA_API_KEY}`);
    const data = await yres.json();

    if (data.items && data.items.length > 0) {
        res.json({
            img: data.items[0].snippet.thumbnails.maxres?.url || data.items[0].snippet.thumbnails.high?.url || data.items[0].snippet.thumbnails.default.url,
            title: data.items[0].snippet.title
        });
    }
    else
    {
        res.json({ error: "Playlist not found." });
    }
}

async function endpoint_openWeatherAPI(req, res) {
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

class GeminiChatBot {
    static botMap = new LRUCache({
        max: 1000,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    constructor() {
        this.model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
        this.chat = this.model.startChat();
    }

    static async endpoint_chatbot(req, res) {
        if (!req.session.botID) {
            req.session.botID = crypto.randomUUID();
        }

        let bot = GeminiChatBot.botMap.get(req.session.botID);
        if (!bot) {
            bot = new GeminiChatBot();
            await bot.chat.sendMessage("You are a helpful assistant answering questions to a farmer requiring help in agriculture in our \"PragatiPath\" farming education site");

            GeminiChatBot.botMap.set(req.session.botID, bot);
        }

        const query = req.body.query;

        if (!query) {
            res.json({ error: "Query parameter is required." });
            return;
        }

        const msg = await bot.chat.sendMessage(query);
        res.json({ response: msg.response.text() });
    }
}

module.exports = {
    endpoint_openWeatherAPI,
    endpoint_geminiYoutubeSearch,
    endpoint_youtubePlaylistImg,
    GeminiChatBot
};