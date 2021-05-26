const express = require("express");
const mustachexpress = require("mustache-express");
var bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const app = express();
const db = require("./dbfunctions");
const axios = require('axios');
const sa = require("superagent");
const { response } = require("express");
const session = require("express-session");
const clientID = "9f071734d8a85db659a9";
const clientSecret = "339b73a682e10f94c4ba66d41872d2ee125108da";
var access;
let token = null;

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(__dirname + "/public/"));
app.engine("html", mustachexpress());
app.set("view engine", "html");
app.set("views", "./views");

app.use(session({
    secret: "secrey-key",
    resave: false,
    saveUninitialized: false,
}));


db.startDB();



app.get("/", async (req, res) =>{
    
    var para = await db.assemblePosts();
  
    if(req.session.name != null){
        res.render("index", { paragraphs:para, name:req.session.name });
    }
    else{
        res.render("windex");
    }
    
});

app.get("/login", (req, res) =>{
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}`);
});

app.get("/logout", (req, res) =>{

    req.session.name = null;
    req.session.at = "";
    res.redirect("/");
});

app.get('/callback', (req, res) => {
    
    const { query } = req;

    const { code } = query;
  
   if(!code){
       return res.send({
           success: false,
           message: "Error: no code"
       });
    }

     sa
     .post("https://github.com/login/oauth/access_token")
     .send({
        client_id: "9f071734d8a85db659a9",
        client_secret: "339b73a682e10f94c4ba66d41872d2ee125108da",
        code: code
    }).set("Accept", "application/json")
    .then(function(result) {
        const data = result.body;
        req.session.at = data.access_token;
        
        console.log(req.session.at);
        res.redirect("/user");
    });
});


//db.createComment("kallej", "Snoppen!", "60872cef9d429e3e98f36174")
//db.createPost("segel", "mitt meddelande", "WOW");


app.get("/user", (req, res) =>{
     
    
    console.log(req.session.at);
    axios({
        method: "get",
        url: `https://api.github.com/user`,
        headers:{
        Authorization: 'token ' + req.session.at
        }
    }).then((response) => {
        req.session.name = response.data.name;
        res.redirect("/");
       
    });
    
});


app.post("/", urlencodedParser, async (req, res) =>{  
   db.createPost(req.session.name, req.body["message"], req.body["title"]);
   var para = await db.assemblePosts(); 
    res.render("index", { paragraphs:para, name:req.session.name });
});

app.post("/:id", urlencodedParser, async (req, res) =>{  
    db.createComment(req.session.name, req.body["message"], req.params.id);
    var para = await db.assemblePosts(); 
    res.redirect("/");

 });
 


const port = process.env.PORT || 3000;

app.listen(port, () => (console.log(`Listening on port ${port}`)));