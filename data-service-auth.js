const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const userSchema = new Schema({
    userName: { type: String, unique: true },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }]
});
let User;
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection("mongodb+srv://msingh753:manjot@senecaweb.qxvsa1o.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        db.on("error", error => {
            reject(error);
        });

        db.once("open", () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(userData.password, 10)
            .then(hash => {
                const newUser = new User({
                    userName: userData.userName,
                    password: hash,
                    email: userData.email
                });
                newUser.save()
                    .then(() => resolve())
                    .catch(err => reject(`There was an error saving the user to the database: ${err}`));
            })
            .catch(err => reject(`There was an error encrypting the password: ${err}`));
    });
}

module.exports.checkUser = (userData) => {
    return new Promise((resolve, reject) => {
        User.findOne({ userName: userData.userName })
            .exec()
            .then(user => {
                if (!user) {
                    reject(`Unable to find user: ${userData.userName}`);
                } else {
                    bcrypt.compare(userData.password, user.password)
                        .then(result => {
                            if (result) {
                                resolve(user);
                            } else {
                                reject(`Incorrect password for user: ${userData.userName}`);
                            }
                        })
                        .catch(err => reject(`There was an error comparing the passwords: ${err}`));
                }
            })
            .catch(err => reject(`There was an error finding the user: ${err}`));
    });
}