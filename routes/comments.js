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
    Campground.findById(req.params.id,function(error, foundCampground) {
        if(error){
            console.log(error);
        }else{
            Comment.create({text:text},function(error,comment){
                if(error){
                    console.log(error);
                }else{
                    //add user to the comment
                    comment.name.id = req.user._id;
                    comment.name.username = req.user.username;
                    //save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

//Edit comment route
router.get('/edit/:comment_id')

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;