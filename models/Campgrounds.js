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
       ],
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model("Campground",campgroundSchema);