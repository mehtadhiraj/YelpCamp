//Importing required packages
var express               = require('express'),
    app                   = express(),
    bodyParser            = require('body-parser'),
    mongoose              = require("mongoose"),
    User                  = require("./models/User"),
    Campground            = require("./models/Campgrounds"),
    Comment               = require("./models/Comment"),
    seedDB                = require("./seeds"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var campgroundRoutes      = require("./routes/campgrounds"),
    commentsRoutes        = require("./routes/comments"),
    authRoutes            = require("./routes/index");
//Connection to the database
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));

//Calling a seed function from a sedds.js
//seedDB();

//Passport configuration
app.use(require("express-session")({
    secret: "YelpCamp is mine",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());;
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

//Listening to port and IP addresses of the host
app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Server Started");
} );