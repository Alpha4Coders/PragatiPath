// base modules -------------------
const crypto = require('crypto');
const session = require('cookie-session');

// custom modules ----------------
const { MongooseConnect, UserDB, CourseDB } = require('./DBHandler.js');
const { endpoint_geminiYoutubeSearch } = require('./aiSearch.js');

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

// public server -------------------
app.use('/public', express.static('client/public'));

app.get('/', (req, res) => {
    res.redirect('/public/LandingPage/index.html');
});

// private server ------------------
app.use('/private', clerk.requireAuth({ signInUrl: process.env.CLERK_SIGN_IN_URL, signUpUrl: process.env.CLERK_SIGN_UP_URL }),
    userDBHandler.middleware_userAuth.bind(userDBHandler),
    express.static('client/private'));


app.get('/private/api/userinfo', userDBHandler.endpoint_userInfo.bind(userDBHandler));
app.post('/private/api/updcourseprog', express.json(), userDBHandler.endpoint_updateCourseProgress.bind(userDBHandler));

app.get('/private/api/getcourses', courseDBHandler.endpoint_getCourseList.bind(courseDBHandler));
app.get('/private/api/getcourse/:courseName', courseDBHandler.endpoint_getCourse.bind(courseDBHandler));

app.get('/private/api/gemini', endpoint_geminiYoutubeSearch);

app.listen(+process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});