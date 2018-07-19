//Importing required packages
var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    mongoose     = require("mongoose"),
    Campground   = require("./models/Campgrounds"),
    Comment      = require("./models/Comment"),
    seedDB       = require("./seeds");

//Connection to the database
mongoose.connect("mongodb://localhost/yelp_camp");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/public"));

//Calling a seed function from a sedds.js
//seedDB();

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
            res.render("campgrounds/campground",{campgrounds : campgrounds});
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
            res.render("campgrounds/show", {campgrounds:findCampground});
        }
    });
});

//==============================================
//COMMENT ROUTES
//==============================================
//Route for a new comments
app.get("/campgrounds/:id/comment/new",function(req, res){
   Campground.findById(req.params.id,function(error, foundId){
       if(error){
           console.log("===============================\n"+error);
       }else{
              res.render("comments/new",{campground:foundId}); 
       }
   })
});

app.post("/campgrounds/:id/comments", function(req, res){
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
})

//Listening to port and IP addresses of the host
app.listen(process.env.PORT,process.env.IP,function(req,res){
    console.log("Server Started");
} );