var mongoose  = require("mongoose");
var Campground = require("./models/Campgrounds");
var Comment = require("./models/Comment");

//Sample data 
var data = [
        {
            place:"Granite Hill",
            image:"https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
            description:"This is the great place. Bacon ipsum dolor amet beef ribs meatball tongue doner beef meatloaf. Cow pastrami shank chicken venison, bacon picanha ground round pork loin pork chop fatback. Shank jerky doner tail meatball tri-tip frankfurter pancetta cow corned beef pastrami porchetta cupim. Jerky sausage landjaeger kevin. Kevin shank chicken picanha drumstick swine brisket tail bresaola ground round. Landjaeger short loin ground round, corned beef swine bresaola venison sirloin doner."
        },
        {
            place:"Desrt Messa",
            image:"https://www.nps.gov/nabr/planyourvisit/images/campground_utahscyncty.jpg",
            description:"This is the great place. Bacon ipsum dolor amet beef ribs meatball tongue doner beef meatloaf. Cow pastrami shank chicken venison, bacon picanha ground round pork loin pork chop fatback. Shank jerky doner tail meatball tri-tip frankfurter pancetta cow corned beef pastrami porchetta cupim. Jerky sausage landjaeger kevin. Kevin shank chicken picanha drumstick swine brisket tail bresaola ground round. Landjaeger short loin ground round, corned beef swine bresaola venison sirloin doner."
        },
        {
            place:"Cloude's Rest",
            image:"http://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg",
            description:"This is the great place. Bacon ipsum dolor amet beef ribs meatball tongue doner beef meatloaf. Cow pastrami shank chicken venison, bacon picanha ground round pork loin pork chop fatback. Shank jerky doner tail meatball tri-tip frankfurter pancetta cow corned beef pastrami porchetta cupim. Jerky sausage landjaeger kevin. Kevin shank chicken picanha drumstick swine brisket tail bresaola ground round. Landjaeger short loin ground round, corned beef swine bresaola venison sirloin doner."
        },
        {
            place:"Trail Canyon",
            image:"http://media2.picsearch.com/is?mcFJY0c5gt7uSQP3FbwAISy_KT9KC4cXfJPwzXeSO4s&height=215",
            description:"This is the great place. Bacon ipsum dolor amet beef ribs meatball tongue doner beef meatloaf. Cow pastrami shank chicken venison, bacon picanha ground round pork loin pork chop fatback. Shank jerky doner tail meatball tri-tip frankfurter pancetta cow corned beef pastrami porchetta cupim. Jerky sausage landjaeger kevin. Kevin shank chicken picanha drumstick swine brisket tail bresaola ground round. Landjaeger short loin ground round, corned beef swine bresaola venison sirloin doner."
        }
    ]
    
//Removing a data from a database
function seedDB(){
    //Reemove all camp grounds
    Campground.remove({},function(error){
        if(error){
            console.log(error);
        }else{
            console.log("Data cleared");
            data.forEach(function(seed){
                Campground.create(seed, function(error, newData){
                   if(error){
                       console.log(error)
                   } else{
                       console.log("Campground added");
                   }
                   //Add few comments
                   Comment.create({text:"This is a great place",name:"Jordhan"},function(error,newComment){
                       if(error){
                           console.log(error);
                       }else{
                           newData.comments.push(newComment);
                           newData.save()
                           console.log("New comment added");
                           //console.log(newData.comments.text);
                       }
                   });
                });   
            });
        }
    
    });
        //Add few data
}
module.exports = seedDB;