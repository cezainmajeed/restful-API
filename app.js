const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view-engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useFindAndModify: false,
  //useCreateIndex: true
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

// specific article route

app.route("/articles/:articleTitle")

.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(err) {
      res.send(err);
    } else
    {
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No articles matched with this title");
      }
    }
  });
})

.put(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err) {
      if(err) {
        res.send(err);
      } else {
        res.send("Updated Successfully");
      }
    }
  );
})

.patch(function(req,res){
  Article.findOneAndUpdate(
    {title:req.params.articleTitle},
    {$set:req.body},
    function(err) {
      if(err) {
        res.send(err);
      } else {
        res.send("Updated Successfully");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle},function(err){
    if(err) {
      res.send(err);
    } else {
      res.send("deleted article Successfully.")
    }
  });
});


/// server listen

app.listen(3000,function() {
  console.log("server listening to port.");
});
