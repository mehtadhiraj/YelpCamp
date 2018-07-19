var mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost/Comment");

var commentSchema = mongoose.Schema({
    text:String,
    createdAt:{
      type: Date,
      default: Date.now
    },
    name:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model("Comment",commentSchema);