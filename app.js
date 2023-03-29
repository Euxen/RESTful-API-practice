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
 
 
app.route("/articles")
.get(
    async(req,res)=>{
        try{
        const foundArticles= await Article.find();
            // console.log(foundArticles);
            res.send(foundArticles);
        }catch(err){
            // console.log(err);
            res.send(err);
        }
    }
)
.post(
    async(req, res) => {
    
        const reqTitle = req.body.title;
        const reqContent = req.body.content;
    
        try{
        const article = new Article({
            title: reqTitle,
            content: reqContent
        });
    
        article.save();
        res.send("Succesfully saved your article!")
    
        }
        catch(err){
            console.log(err);
        }
    }
)
.delete(
    async (req, res) => {
        try{
            await Article.deleteMany()
                res.send("Articles succesfully deleted!");
            }
            catch(err){
                res.send(err);
            }
    }
);

app.route("/articles/:articleTitle")
.get(
    async(req,res)=>{

        try{
        const foundArticle= await Article.findOne({title: req.params.articleTitle});
            // console.log(foundArticles);
            res.send(foundArticle);
        }catch(err){
            // console.log(err);
            res.send("There's no such article");
        }
    }
)
.put(
    async(req, res) => {
        try{
        
        await Article.replaceOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true}
        )
        res.send("Succesfully updated existing article")
        }
        catch(err){
            console.log(err);
        }
    }
)
.patch(
    async(req, res) => {
        try{
        
        await Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body}
        )
        res.send("Succesfully updated existing article")
        }
        catch(err){
            console.log(err);
        }
    }
)
.delete(
    async (req, res) => {
        try{
            await Article.deleteOne({
                title: req.params.articleTitle
            })
                res.send("Article succesfully deleted!");
            }
            catch(err){
                res.send(err);
            }
    }
);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});