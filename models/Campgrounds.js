var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   place:{
       type:String
   }, 
   image:{
       type:String
   },
   description:{
       type:String
   },
   comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
       ]
});

module.exports = mongoose.model("Campground",campgroundSchema);