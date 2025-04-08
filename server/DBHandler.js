const mongoose = require('mongoose');
const clerk = require('@clerk/express');

class MongooseConnect {
    static isConnected = false;

    static async connect(URI, force = false) {
        if (force) {
            MongooseConnect.isConnected = false;
        }

        if (!MongooseConnect.isConnected) {
            await mongoose.connect(URI);
            MongooseConnect.isConnected = true;
            console.log("[MongooseConnect INFO] Successfully connected to MongoDB!");
        }
    }
}

class UserDB {
    static userSchema = new mongoose.Schema({
        userId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        enrolledCourses: {
            type: [
                {
                    name: { type: String, required: true },
                    progress: { type: Number, required: true, default: 0 }
                }
            ], default: []
        },
        completedCourses: {
            type: [String],
            default: []
        }
    });

    static Users = mongoose.model('users', UserDB.userSchema);

    async middleware_userAuth(req, res, next) {
        if (!req.session.accountedFor) {
            req.session.accountedFor = true;

            try {
                const userDbStore = await UserDB.Users.findOne({
                    userID: req.auth.userId
                });

                if (userDbStore === null) {
                    const userData = await clerk.clerkClient.users.getUser(req.auth.userId);
                    const userStore = new UserDB.Users({
                        userId: req.auth.userId,
                        name: userData.username,
                        enrolledCourses: [],
                        completedCourses: []
                    });

                    await userStore.save();
                }
            } catch (error) {
                console.log("[UserDB Error] userAuthMiddleWare failed to authenticate user", error);
            }
        }

        next();
    }
}

module.exports = {
    MongooseConnect,
    UserDB
};