var express = require("express");
var router = express.Router();
var Campground = require("../models/Campgrounds");
//Call to a campgrounds page
router.get('/', function(req,res){
    // Get campgrounds from database
    Campground.find({},function(error, campgrounds){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            res.render("campgrounds/campground",{campgrounds : campgrounds});
        }
    });
});

router.post("/", isLoggedIn, function(req,res){
    //Fetching place and image URL from textfield
    var place = req.body.place;
    var image = req.body.image;
    var description = req.body.description;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    //Creating a campground and adding to database.
    Campground.create({place:place,image:image, description:description, user:user}, function(error, campgrounds){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            //Redirecting to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

//Rendering the show on clicking the campground's button
router.get("/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(error, findCampground){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            //Rendering a show page
            res.render("campgrounds/show", {campgrounds:findCampground});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


module.exports = router;
