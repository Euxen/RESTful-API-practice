//jshint esversion:6
 
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
 
const app = express();
 
app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
 
//TODO
main().catch(err => console.log(err));
 
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser:true});
}  
// mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser:true});
 
const articleSchema=new mongoose.Schema({
    title: String,
    content:String
});
 
const Article= mongoose.model("Article",articleSchema);
 
app.get("/articles", async(req,res)=>{
    try{
    const foundArticles= await Article.find();
        // console.log(foundArticles);
        res.send(foundArticles);
    }catch(err){
        // console.log(err);
        res.send(err);
    }
});
 
 
 
app.listen(3000, function() {
  console.log("Server started on port 3000");
});