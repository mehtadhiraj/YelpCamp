var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/Campgrounds");
var Comment = require("../models/Comment");
//==============================================
//COMMENT ROUTES
//==============================================
//Route for a new comments
router.get("/new",isLoggedIn, function(req, res){
   Campground.findById(req.params.id,function(error, foundId){
       if(error){
           console.log("===============================\n"+error);
       }else{
              res.render("comments/new",{campground:foundId}); 
       }
   });
});

router.post("/", isLoggedIn, function(req, res){
    var text = req.body.text;
    var name = req.body.name;
    Comment.create({text:text, name:name},function(error,comment){
        console.log(comment);
       Campground.findById(req.params.id,function(error, foundCampground) {
           console.log(foundCampground);
           foundCampground.comments.push(comment);
           foundCampground.save();
           res.redirect("/campgrounds/"+req.params.id);
       });
       
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;