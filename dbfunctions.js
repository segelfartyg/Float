const mongoose = require("mongoose");
const Post = require("./models/post");
const Comment = require("./models/comment");


function startDB() {
  mongoose
    .connect("mongodb://localhost/float")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Couldnt connect ti MongoDB"));
}

async function createPost(_author, _message, _title) {
  const post = new Post({
    author: _author,
    text: _message,
    title: _title,
  });

  try {
    const result = await post.save();
    console.log(result);
  } catch (err) {
    for (f in err.errors) {
      console.log(err.errors[f]);
    }
  }
}

async function createComment(_author, _message, _postid) {
  const comment = new Comment({
    author: _author,
    text: _message,
    post: _postid,
  });

  try {
    const result = await comment.save();
    console.log(result);
  } catch (err) {
    for (f in err.errors) {
      console.log(err.errors[f]);
    }
  }
}

async function assemblePosts() {
  var allposts = "";
  const posts = await Post.find()
    .select({ text: true, author: true, title: true, date: true })
    .sort({ date: -1 });

  for (const element of posts) {
    var poststring = "";
    var postcomments = await assembleComments(element["_id"]);

    poststring += `<div class="writeform"><h3 class="posttitle">${element["title"]}</h3>
      <p class="postp">${element["text"]}</p>
      <p class="posta">${element["author"]}</p>
      <p class="posta">${element["date"]}</p>
  
      </div>`;

    poststring =
      poststring +
      postcomments +
      `<div class="commentfield">      
      <form id="form_${element["_id"]}" class="commentform" action="/${element["_id"]}" method="post">
          <input class="comment" name="message">
          <br>
          <button id="btn_${element["_id"]}" onclick="addComment(${element["_id"]})"type="submit" class="combutton one">ADD COMMENT</button>
      </form>
  </div>`;

    allposts += poststring;
  }

  return allposts;
}

async function assembleComments(_id) {
  var commentstring = "";

  const comments = await Comment.find()
    .select({ text: true, author: true })
    .where("post")
    .equals(_id);

  comments.forEach((element) => {
    commentstring += `<div class="commentfield">      
    <div>
        <p class="postp">${element["text"]}</p>
        <p class="posta">${element["author"]}</p>
    </div>
</div>`;
  });

  return commentstring;
}

module.exports = {
  startDB: startDB,
  createPost: createPost,
  assemblePosts: assemblePosts,
  createComment: createComment,
  assembleComments: assembleComments,
};
