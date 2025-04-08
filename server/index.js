// express ----------------------------
const express = require('express');
const app = express();

// environment variables ----------------
const dotenv = require('dotenv');
dotenv.config();
process.env.PORT = process.env.PORT || '8080';

// clerk ------------------------------
const clerk = require('@clerk/express');
app.use(clerk.clerkMiddleware());

// public server -------------------
app.use('/public', express.static('client/public'));

app.get('/', (req, res) => {
    res.redirect('/public/index.html');
});

// private server ------------------
app.use('/private', clerk.requireAuth({ signInUrl: process.env.CLERK_SIGN_IN_URL, signUpUrl: process.env.CLERK_SIGN_UP_URL }), express.static('client/private'));


app.listen(+process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});