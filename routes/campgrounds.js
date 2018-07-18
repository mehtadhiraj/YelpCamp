var express = require("express");
var router = express.Router();
var Campground = require("../models/Campgrounds");
var mogoose = require("mongoose");
var middlewareObject = require("../middleware/index");
var nodeGeocoder = require("node-geocoder");

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};
var geocoder = nodeGeocoder(options);

//Call to a campgrounds page
router.get('/', function(req,res){
    if(req.query.search){
        // Get campgrounds from database
        Campground.find({'place': { $regex : RegExp(escapeRegExp(req.query.search)), $options: 'i'}},function(error, campgrounds){
            if(error){
                req.flash("error", error.message);
                res.redirect("back");
            }else {
                res.render("campgrounds/campground",{campgrounds : campgrounds});
            }
        });
    }else {
        // Get campgrounds from database
        Campground.find({},function(error, campgrounds){
            if(error){
                req.flash("error", error.message);
                res.redirect("back");
            }else {
                res.render("campgrounds/campground",{campgrounds : campgrounds});
            }
        });   
    }
});

router.post("/", middlewareObject.isLoggedIn, function(req,res){
    //Fetching place and image URL from textfield
    var place = req.body.place;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var user = {
        id: req.user._id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.location, function(err, data){
        if(err || !data.length) {
            req.flash('error',"Invalid address");
            res.redirect('back');
        }
        if(place === "" || image === "" || description === "" || req.body.location == "" || price == ""){
            req.flash("error", "Some fileds missing");
            res.redirect('/campgrounds');
        }else{
            var latitude = data[0].latitude;
            var longitude = data[0].longitude;
            var location = data[0].formattedAddress;
            //Creating a campground and adding to database.
            Campground.create({place:place, image:image, price:price, location:location, latitude:latitude, longitude:longitude, description:description, user:user}, function(error, campgrounds){
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
});

//Rendering the show on clicking the campground's button
router.get("/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(error, findCampground){
        if(error){
            req.flash('error', 'Campground not available');
            return res.redirect('back');
        }else {
            if(!findCampground) {
                req.flash('error', 'Campground is deleted');
                return res.redirect('/campgrounds');
            }else {
                //Rendering a show page
                res.render("campgrounds/show", {campgrounds:findCampground});   
            }
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
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if(err || !data.length){
            req.flash('error', 'Invalid Address');
            return res.redirect('back');
        }
        req.body.campground.latitude = data[0].latitude;
        req.body.campground.longitude = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        
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
});

//Destroy Campground
router.delete('/delete/:id', middlewareObject.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash('error',"Could not delete campground. Please try again");
            res.redirect('back');
        }else{
            req.flash('success', "Campground deleted successfully");
            return res.redirect('/campgrounds');
        }
    });
})

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

module.exports = router;
