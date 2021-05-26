const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  
    author: String,
    text: String,
    post: String,
    date: {type: Date, default: Date.now }
});


const Comment = mongoose.model("Comments", commentSchema);


module.exports = Comment;