var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),    
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

//Database Schema

var campgroundSchema = new mongoose.Schema({
   place : String,
   image : String
});

var Campground = mongoose.model('Campground',campgroundSchema);

/*Campground.create(
    {
        place : "Paris",
        image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8Btdf8ioCX6reMe3XqvoumHouj85oz11I1CIjJl-0cqyr4Ere"
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

app.get('/',function(req,res){
    res.render('landing');
});


app.get('/campgrounds',function(req,res){
    // Get campgrounds from database
    Campground.find({},function(error, campgrounds){
        if(error){
            console.log('There is an error\n'+error);
        }else {
            console.log(campgrounds);
            res.render("campground",{campgrounds : campgrounds});
        }
    });
});

app.post("/campgrounds",function(req,res){
    var place = req.body.place;
    var image = req.body.image;
    var campNew = {place,image};
    //campgrounds.push(campNew);
    //console.log(campgrounds);
    res.redirect('/campgrounds');
});

app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Server Started");
} );