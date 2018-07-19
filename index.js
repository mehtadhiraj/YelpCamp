//Importing required packages
var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    mongoose     = require("mongoose"),
    Campground   = require("./models/Campgrounds"),
    seedDB       = require("./seeds");

//Connection to the database
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));


//Calling a seed function from a sedds.js
seedDB();

// Campground.create(
//     {
//         place : "Paris",
//         image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Btdf8ioCX6reMe3XqvoumHouj85oz11I1CIjJl-0cqyr4Ere",
//         description : "This is the best plac in Paris"
//     }, function(error, campground)
//         {
//             if(error){
//             console.log('There is an error\n'+error);
//         }else {
//             console.log(campground);
//         }
//     });

//Call to a Landing page 
app.get('/',function(req,res){
    res.render('landing');
});

//Call to a campgrounds page
app.get('/campgrounds',function(req,res){
    // Get campgrounds from database
    Campground.find({},function(error, campgrounds){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            res.render("campground",{campgrounds : campgrounds});
        }
    });
});

app.post("/campgrounds",function(req,res){
    //Fetching place and image URL from textfield
    var place = req.body.place;
    var image = req.body.image;
    var description = req.body.description;
    //Creating a campground and adding to database.
    Campground.create({place:place,image:image, description:description},function(error, campgrounds){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            //Redirecting to campgrounds page
            res.redirect('/campgrounds');
        }
    });
});

//Rendering the show on clicking the campground's button
app.get("/campgrounds/:id",function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(error, findCampground){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            //Rendering a show page
            res.render("show", {campgrounds:findCampground});
        }
    });
});

//Listening to port and IP addresses of the host
app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Server Started");
} );