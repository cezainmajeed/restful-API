const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view-engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{
  useNewUrlParser:true,
  useUnifiedTopology:true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article =new mongoose.model("Article",articleSchema);


// article route
app.route("/articles")

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(err)
    {
      res.send(err);
    } else {
      res.send(foundArticles);
    }
  });
})

.post(function(req,res){
  const article = new Article({
    title:req.body.title,
    content:req.body.content
  });

  article.save(function(err){
    if(err)
    {
      res.send(err);
    } else {
      res.send("Added Successfully.")
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err)
    res.send(err);
    else
    res.send("deleted all articles");
  });
});





app.listen(3000,function() {
  console.log("server listening to port.");
});
