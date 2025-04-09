// base modules -------------------
const crypto = require('crypto');
const session = require('cookie-session');

// custom modules ----------------
const { MongooseConnect, UserDB } = require('./DBHandler.js');

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
app.get('/private/api/updcourseprog', userDBHandler.endpoint_updateCourseProgress.bind(userDBHandler));

app.listen(+process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});