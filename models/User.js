var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var userSchema = mongoose.Schema({
    username:{
        type: String, 
        unique : true, 
        required: true 
    },
    password: String,
    firstname: String,
    lastname: String,
    email: {
        type: String, 
        unique : true, 
        required: true
    },
    resetPasswordToken : String,
    resetPasswordExpires: Date,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);