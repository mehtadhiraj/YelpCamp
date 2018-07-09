var Campground = require("../models/Campgrounds"),
    Comment    = require("../models/Comment"),
    User       = require("../models/User");

//All the middlewares goes here

var middlewareObject = {};

middlewareObject.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
           if(err){
               req.flash("error", err.message);
               res.redirect("back");
           }else{
                //If loged in does user own campground
                if(campground.user.id.equals(req.user._id) || req.user.isAdmin){
                   next(); 
                }else{
                    req.flash("error", "You dont have a permission to that");
                    res.redirect('back');    
                }
           }
       });
    }else{
        req.flash("error","You need to be logged in to that");
        res.redirect('back');
    }   
}

middlewareObject.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err){
                req.flash("error", err.message);
                res.redirect('back');
            }else {
                if(comment.name.id.equals(req.user._id) || req.user.isAdmin){
                    next();   
                }else{
                    req.flash("error", "You dont have a permission to that");
                    res.redirect('back');
                }
            }
        })
    }else{
        req.flash("error","You need to be logged in to that");
        res.redirect('back');
    }
}
    
middlewareObject.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be Loged in to that :)");
    res.redirect('/login');
}

module.exports = middlewareObject;