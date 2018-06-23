//Importing required packages
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),    
    mongoose = require("mongoose");
    
//Connection to the database
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

//Database Schema

var campgroundSchema = new mongoose.Schema({
   place : String,
   image : String,
   description : String
});

//Making model of database
var Campground = mongoose.model('Campground',campgroundSchema);

/*Campground.create(
    {
        place : "Paris",
        image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Btdf8ioCX6reMe3XqvoumHouj85oz11I1CIjJl-0cqyr4Ere",
        description : "This is the best plac in Paris"
    }, function(error, campground)
        {
            if(error){
            console.log('There is an error\n'+error);
        }else {
            console.log(campground);
        }
    });*/
    
/*var campgrounds = [
        {
           place:'India', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1jAOQfOEB_eaPmoZyNa1G6Xr8JtCD4ceM6K_nmNy9UNW70bbK'
        },
        {
            place:'Paris', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Btdf8ioCX6reMe3XqvoumHouj85oz11I1CIjJl-0cqyr4Ere'
        },
        {
            place:'Europe', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqgJhyWXEr1RphMlL6CMpLm7nbOVg1fe1wcCZ6k_mNBeUI3rVSbQ'
        },
        {
            place:'America', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1jAOQfOEB_eaPmoZyNa1G6Xr8JtCD4ceM6K_nmNy9UNW70bbK'
        },
        {
            place:'Australia', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGCLIx3_HV6iOi_aE57hE_TEqsEggGFcHkdaQOS0h6_p51vImc'
        },
        {
            place:'Europe', image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqgJhyWXEr1RphMlL6CMpLm7nbOVg1fe1wcCZ6k_mNBeUI3rVSbQ'
        }
    ];*/

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
    Campground.findById(req.params.id, function(error, findCampground){
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