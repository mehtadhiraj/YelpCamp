var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var userSchema = mongoose.Schema({
    User: String,
    Password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);