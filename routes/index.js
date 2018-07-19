var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");

//Call to a Landing page 
router.get('/',function(req,res){
    res.render('landing');
});

//===================
//Auth Routes
//===================
router.get('/register', function(req, res) {
    res.render('register');
});

router.post("/register", function(req, res) {
    var value = false;
    if(req.body.admincode =='8364'){
        value = true;
    }
    User.register({'username': req.body.username, isAdmin: value}, req.body.password, function(err, user){
        if(err){
            res.render('register', {error: err.message});
        }else{
            req.flash('success', 'You had registered successfully');
            passport.authenticate('local')(req, res, function(){
              res.redirect('/campgrounds');  
            });
        }
    });
});

//Login form
router.get('/login', function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}),function(){
});

//=====================
//Logout route
//=====================
router.get("/logout", function(req, res) {
    req.logout();
    req.flash('error','You are logged out');
    res.redirect('/campgrounds');
});


module.exports = router;