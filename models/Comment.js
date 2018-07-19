var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Comment");

var commentSchema = mongoose.Schema({
    text:String,
    name:String
});

module.exports = mongoose.model("Comment",commentSchema);