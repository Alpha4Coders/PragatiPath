// base modules -------------------
const crypto = require('crypto');
const session = require('cookie-session');

// custom modules ----------------
const { MongooseConnect, UserDB, CourseDB } = require('./DBHandler.js');
const { endpoint_openWeatherAPI, endpoint_geminiYoutubeSearch, GeminiChatBot } = require('./aiSearch.js');

// express ----------------------------
const express = require('express');
const app = express();

// environment variables ----------------
const dotenv = require('dotenv');
dotenv.config();
process.env.PORT = process.env.PORT || '8080';

// session handler ----------------
app.use(session({
    secret: crypto.randomBytes(32),
    maxAge: 24 * 60 * 60 * 1000     // 24 hour expiry
}));

// clerk ------------------------------
const clerk = require('@clerk/express');
app.use(clerk.clerkMiddleware());

// database connection --------------
MongooseConnect.connect(process.env.MONGO_URI);

const userDBHandler = new UserDB();
const courseDBHandler = new CourseDB();

// chatbots --------------------------
const geminiChatBot = new GeminiChatBot();

// public server -------------------
app.use('/public', express.static('client/public'));

app.get('/', (req, res) => {
    res.redirect('/public/LandingPage/index.html');
});

// private server ------------------
app.use('/private', clerk.requireAuth({ signInUrl: process.env.CLERK_SIGN_IN_URL, signUpUrl: process.env.CLERK_SIGN_UP_URL }),
    userDBHandler.middleware_userAuth.bind(userDBHandler),
    express.static('client/private'));


app.get('/api/userinfo', clerk.requireAuth(), userDBHandler.endpoint_userInfo.bind(userDBHandler));
app.post('/api/updcourseprog', clerk.requireAuth(), express.json(), userDBHandler.endpoint_updateCourseProgress.bind(userDBHandler));

app.get('/api/getcourses', clerk.requireAuth(), courseDBHandler.endpoint_getCourseList.bind(courseDBHandler));
app.get('/api/getcourse/:courseName', clerk.requireAuth(), courseDBHandler.endpoint_getCourse.bind(courseDBHandler));

app.get('/api/gemini/youtube', endpoint_geminiYoutubeSearch);
app.post('/api/gemini/chat', express.json(), geminiChatBot.endpoint_chatbot.bind(geminiChatBot));

app.get('/api/openweather/:lat/:lon', endpoint_openWeatherAPI);

app.listen(+process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});