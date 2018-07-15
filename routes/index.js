var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/User");
var async = require("async");
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-transport');
var crypto = require("crypto");
var xoauth2 = require('xoauth2');

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
    async.waterfall([
        function(done) {
            var value = false;
            if(req.body.admincode =='8364'){
                value = true;
            }
            User.register({'username': req.body.username, 'isAdmin' : value, 'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email':req.body.email}, req.body.password, function(err, user){
                if(err){
                    res.render('register', {error: err.message});
                }else{
                    passport.authenticate('local')(req, res, function(err){
                        done(err, user);
                    });
                }
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    type: 'OAuth2',
                    user: 'mehtadhiraj21@gmail.com',
                        clientId: process.env.CLIENT_ID,
                    clientSecret: process.env.CLIENT_SECRET,
                    refreshToken: process.env.REFRESH_TOKEN,
                    accessToken: process.env.ACCESS_TOKEN,
                    expires: 3600000
                    }
            });
            var mailOptions = {
                to: user.email,
                from: 'mehtadhiraj21@gmail.com',
                subject: 'YelpCamp Registration Successfull',
                html: 'Hello, ' +user.firstname+ ' '+user.lastname + '\n\n'+
                '<b><h3>!!! Welcome to the YelpCamp !!!</h3> </b>'+
                '<p>Now you can contribute your campgrounds collections and educate yourself regarding campgrounds all over the world.</p>\n '+
                '<i>Very eager to see your campground </i>:)\n\n<p></p>'+
                '<legend>!!! SEE YOU AT THE CAMPGROUND !!!</legend>'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash('success', 'You are registered successfully');
                return res.redirect('/campgrounds');
            });
        }
   ], function(err) {
        res.redirect('/');
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

//=================================
//Forgot Password Rout
//=================================
router.get('/forgot', function(req, res) {
    res.render('forgot', {
        user: req.user
    });
});

//post route for forgot
router.post('/forgot', function(req, res, next){
    async.waterfall([
        function(done) {
            //Setting up a 20 byte token code using crypto.randomBytes
            crypto.randomBytes(20, function(err, buf){
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function(token, done) {
            //finding user using email id
            User.findOne({'email': req.body.email}, function(err, user){
                if(!user) {
                    req.flash('error', 'No account with that email address exist');
                    return res.redirect('/forgot');
                }
                //asigning token to user data
                user.resetPasswordToken = token;
                //seeting expiry date for token
                user.resetPasswordExpires = Date.now() + 3600000; //1 hour
                
                //Saving the changes to database
                user.save(function(err){
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                        type: 'OAuth2',
                        user: 'mehtadhiraj21@gmail.com',
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN,
                        accessToken: process.env.ACCESS_TOKEN,
                        expires: 3600000
                    }
            });
            var mailOptions = {
                from: 'Dhiraj Mehta <mehtadhiraj21@gmail.com>',
                to: user.email,
                subject: 'YelpCamp password reset',
                text: 'You are receiving this because you (for someone else) have requested for password reset to your YelpCamp account\n'+
                'Please click on the following link to complete the process \n'+
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.'
            };
            smtpTransport.sendMail(mailOptions, function(err){
                req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instruction');
                done(err, 'done');
            });
        }
    ], function(err) {
        if(err) {
            return next(err);
        }
        res.redirect('/forgot');
    });
});

//=================================
//RESET ROUTE
//=================================
router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.params.token
        });
    });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
            }
            if(req.body.password === req.body.confirmPassword) {
                user.setPassword( req.body.password, function(err){
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
    
                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                })    
            }else {
                req.flash('error', 'Password does not match');
                return res.redirect('back');
            }   
        });
    },
    function(user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                user: 'mehtadhiraj21@gmail.com',
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: process.env.ACCESS_TOKEN,
                expires: 3600000
                }
        });
      var mailOptions = {
        to: user.email,
        from: 'mehtadhiraj21@gmail.com',
        subject: 'YelpCamp password changed successfully',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
           req.flash('success', 'Success! Your password has been changed.');
           return res.redirect('/campgrounds');
      });
    }
  ], function(err) {
    res.redirect('/');
  });
});


module.exports = router;