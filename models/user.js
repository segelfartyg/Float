const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  
    name: String,
    id: String,
    date: {type: Date, default: Date.now }
});


const User = mongoose.model("Posts", postSchema);


module.exports = User;