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
        fullName: { type: String, required: true },
        enrolledCourses: {
            type: [String], default: []
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
                    userId: req.auth.userId
                });

                if (userDbStore === null) {
                    const userData = await clerk.clerkClient.users.getUser(req.auth.userId);                    
                    const userStore = new UserDB.Users({
                        userId: req.auth.userId,
                        name: userData.username,
                        fullName: userData.first_name + ' ' + userData.last_name,
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

    async endpoint_userInfo(req, res) {
        try {
            const userDbStore = await UserDB.Users.findOne({
                userId: req.auth.userId
            }, { _id: 0, __v: 0, userId: 0 });

            if (userDbStore === null) {
                return res.status(404).send("User not found");
            }

            const uinfo = await clerk.clerkClient.users.getUser(req.auth.userId); // also append profile image URL
            const out = { name: userDbStore.name, fullName: userDbStore.fullName, enrolledCourses: userDbStore.enrolledCourses, completedCourses: userDbStore.completedCourses, imgUrl: uinfo.imageUrl };

            res.json(out);
        } catch (error) {
            console.log("[UserDB Error] endpoint_userInfo failed to fetch user info", error);
            res.json({ error: "Internal server error" });
        }
    }

    async endpoint_addCourse(req, res) {
        try {
            const { courseName } = req.body;

            if (!courseName) {
                res.json({ error: "Course name is required" });
                return;
            }

            const userDbStore = await UserDB.Users.findOneAndUpdate(
                { userId: req.auth.userId },
                { $addToSet: { enrolledCourses: courseName } },
                { new: true }
            );

            if (userDbStore === null) {
                res.json({ error: "User not found" });
                return;
            }

            res.json(userDbStore);
        } catch (error) {
            console.log("[UserDB Error] endpoint_addCourse failed to add course", error);
            res.json({ error: "Internal server error" });
        }
    }

    async endpoint_removeCourse(req, res) {
        try {
            const { courseName } = req.body;

            if (!courseName) {
                res.json({ error: "Course name is required" });
                return;
            }

            const userDbStore = await UserDB.Users.findOneAndUpdate(
                { userId: req.auth.userId },
                { $pull: { enrolledCourses: courseName } },
                { new: true }
            );

            if (userDbStore === null) {
                res.json({ error: "User not found" });
                return;
            }

            res.json(userDbStore);
        } catch (error) {
            console.log("[UserDB Error] endpoint_removeCourse failed to remove course", error);
            res.json({ error: "Internal server error" });
        }
    }

    // async endpoint_updateCourseProgress(req, res) {
    //     try {
    //         const { courseName, progress } = req.body;

    //         if (!courseName || progress === undefined) {
    //             res.json({ error: "Course name and progress are required" });
    //             return;
    //         }

    //         const userDbStore = await UserDB.Users.findOne({ userId: req.auth.userId });

    //         if (userDbStore === null) {
    //             res.json({ error: "User or course not found" });
    //             return;
    //         }

    //         const course = userDbStore.enrolledCourses.find(course => course.name === courseName);
    //         if (!course) {
    //             res.json({ error: "Course not found" });
    //             return;
    //         }

    //         course.progress += progress;

    //         if (course.progress > 100) {
    //             userDbStore.completedCourses.push(courseName);
    //             userDbStore.enrolledCourses = userDbStore.enrolledCourses.filter(course => course.name !== courseName);
    //             await userDbStore.save();
    //             res.json(userDbStore);
    //         }
    //         else {
    //             await userDbStore.save();
    //         }

    //         res.json(userDbStore);
    //     } catch (error) {
    //         console.log("[UserDB Error] endpoint_updateCourseProgress failed to update progress", error);
    //         res.json({ error: "Internal server error" });
    //     }
    // }
}

class CourseDB {
    static courseSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        playlist: { type: String, required: true },
        medium: { type: String, default: "Hindi" }
    });

    static Courses = mongoose.model('courses', CourseDB.courseSchema);

    async endpoint_getCourseList(req, res)
    {
        try {
            const courses = await CourseDB.Courses.find({}, {   __v: 0 });
            res.json(courses);
        } catch (error) {
            console.log("[CourseDB Error] endpoint_getCourseList failed to fetch course list", error);
            res.json({ error: "Internal server error" });
        }
    }

    async endpoint_getCourseByName(req, res) {
        try {
            const { courseName } = req.params;
            
            if (!courseName) {
                res.json({ error: "Course name is required" });
                return;
            }

            const course = await CourseDB.Courses.findOne({ name: courseName }, { _id: 0, __v: 0 });

            if (course === null) {
                res.json({ error: "Course not found" });
                return;
            }

            res.json(course);
        } catch (error) {
            console.log("[CourseDB Error] endpoint_getCourse failed to fetch course", error);
            res.json({ error: "Internal server error" });
        }
    }

    async endpoint_getCourseById(req, res) {
        try {
            const { courseId } = req.params;

            if (!courseId) {
                res.json({ error: "Course name is required" });
                return;
            }

            const course = await CourseDB.Courses.findOne({ _id: courseId }, { _id: 0, __v: 0 });

            if (course === null) {
                res.json({ error: "Course not found" });
                return;
            }

            res.json(course);
        } catch (error) {
            console.log("[CourseDB Error] endpoint_getCourse failed to fetch course", error);
            res.json({ error: "Internal server error" });
        }
    }
}

module.exports = {
    MongooseConnect,
    UserDB,
    CourseDB
};