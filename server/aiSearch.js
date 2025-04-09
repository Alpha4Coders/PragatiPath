const axios = require('axios');
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

        const msg = this.chat.sendMessage(query);
        res.json({ response: msg.response.text() });
    }
}

module.exports = {
    endpoint_geminiYoutubeSearch,
    GeminiChatBot
};