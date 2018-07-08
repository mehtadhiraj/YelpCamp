var express = require("express");
var router = express.Router();
var Campground = require("../models/Campgrounds");
var mogoose = require("mongoose");
var middlewareObject = require("../middleware/index");

//Call to a campgrounds page
router.get('/', function(req,res){
    // Get campgrounds from database
    Campground.find({},function(error, campgrounds){
        if(error){
            req.flash("error", error.message);
            res.redirect("back");
        }else {
            res.render("campgrounds/campground",{campgrounds : campgrounds});
        }
    });
});

router.post("/", middlewareObject.isLoggedIn, function(req,res){
    //Fetching place and image URL from textfield
    var place = req.body.place;
    var image = req.body.image;
    var description = req.body.description;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    if(place === "" || image === "" || description === ""){
        req.flash("error", "Some fileds missing");
        res.redirect('/campgrounds');
    }else{
        //Creating a campground and adding to database.
        Campground.create({place:place,image:image, description:description, user:user}, function(error, campgrounds){
            if(error){
                req.flash("error", "Could not create a campground");
                res.redirect('back');
            }else {
                //Redirecting to campgrounds page
                req.flash('success','Campground added successfully');
                res.redirect('/campgrounds');
            }
        });
    }
});

//Rendering the show on clicking the campground's button
router.get("/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(error, findCampground){
        if(error){
            req.flash('error', 'Campground not available');
            res.redirect('back');
        }else {
            //Rendering a show page
            res.render("campgrounds/show", {campgrounds:findCampground});
        }
    });
});

//Edit campgorund 
router.get('/edit/:id', middlewareObject.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, campground){
           res.render('campgrounds/edit', {campground:campground});
       });
});

//update Campground
router.put('/edit/:id', middlewareObject.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err){
        if(err){
            req.flash('error', 'Something went wrong please try again');
            res.redirect('back');
        }else{
            req.flash('success', 'Changes added successfully');
            res.redirect('/campgrounds/'+req.params.id);
        }
    })
});

//Destroy Campground
router.delete('/delete/:id', middlewareObject.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash('error',"Could not delete campground. Please try again");
            res.redirect('back');
        }else{
            req.flash('success', "Campground deleted successfully");
            res.redirect('/campgrounds');
        }
    });
})

module.exports = router;
