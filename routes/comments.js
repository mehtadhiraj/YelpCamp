var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/Campgrounds");
var Comment = require("../models/Comment");
var middlewareObject = require("../middleware/index");

//==============================================
//COMMENT ROUTES
//==============================================
//Route for a new comments
router.get("/new",middlewareObject.isLoggedIn, function(req, res){
   Campground.findById(req.params.id,function(error, foundId){
       if(error){
           req.flash('error','Comment not found');
           res.redirect('back');
       }else{
            res.render("comments/new",{campground:foundId}); 
       }
   });
});

router.post("/", middlewareObject.isLoggedIn, function(req, res){
    var text = req.body.text;
    Campground.findById(req.params.id,function(error, foundCampground) {
        if(error){
            req.flash("error", "Something went wrong !!");
            res.redirect('back');
        }else{
            Comment.create({text:text},function(error,comment){
                if(error){
                    req.flash('error','Comment not added please try again');
                    res.redirect('back');
                }else{
                    //add user to the comment
                    comment.name.id = req.user._id;
                    comment.name.username = req.user.username;
                    //save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    req.flash('success', "Thank you for your feedback");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

//Edit comment route
router.get('/edit/:comment_id', middlewareObject.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            req.flash('error', err.message);
            res.redirect('back');
        }else{
            res.render('comments/edit', {campground_id: req.params.id, comment:comment});
        }
    });
});

//Updating a comment
router.put('/edit/:comment_id', middlewareObject.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if(err){
            req.flash('error', "Could not update comment");
            res.redirect('back');
        }else{
            req.flash('success', 'Comment updated successfully');
            res.redirect('/campgrounds/'+req.params.id);
        }     
    });
});

///Deleting the comments route
router.delete('/delete/:comment_id', middlewareObject.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash('error',"Could not delete comment");
            res.redirect('back');
        }else {
            req.flash('success','Comment deleted successfully');
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

module.exports = router;