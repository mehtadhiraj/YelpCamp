//Importing dotenv package
require("dotenv").config();

//Importing required packages
var express               = require('express'),
    app                   = express(),
    bodyParser            = require('body-parser'),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    User                  = require("./models/User"),
    Campground            = require("./models/Campgrounds"),
    Comment               = require("./models/Comment"),
    seedDB                = require("./seeds"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    methodOverride        = require("method-override");
var campgroundRoutes      = require("./routes/campgrounds"),
    commentsRoutes        = require("./routes/comments"),
    authRoutes            = require("./routes/index");
//Connection to the database
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://devstar:dev789@ds243931.mlab.com:43931/camp");


app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});
app.locals.moment = require('moment');

app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

//Listening to port and IP addresses of the host
app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Server Started");
} );