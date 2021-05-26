const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  
    author: String,
    text: String,
    title: String,
    date: {type: Date, default: Date.now }
});


const Post = mongoose.model("Posts", postSchema);


module.exports = Post;