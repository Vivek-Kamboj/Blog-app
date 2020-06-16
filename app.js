var express      =require("express"),
app    		     =express(),
expressSanitizer =require("express-sanitizer"),
methodOverride   =require("method-override"),
bodyparser       =require("body-parser"),
mongoose         =require("mongoose");


app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/blog_app");

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"))

var blogSchema=mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created: {type:Date, default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

// Blog.create({
// 	title:"My Blog:)",
// 	image:"https://dl3.pushbulletusercontent.com/R6z8nCa4Z0ZBKAQji8GV4S7x5vW9v1Db/IMG20200603184928.jpg",
// 	body:"Hi all!!, this is the blog made by me ---*\/*-----"
// })

app.get("/",function(req,res){
	res.redirect("/blogs");
})


app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err)
		{
			console.log("------->ERROR<----------");
		}
		else
		{
			res.render("index",{blogs:blogs});
		}
	})
});

app.get("/blogs/new",function(req,res){
	res.render("new")
});

app.post("/blogs",function(req,res){
	req.body.Blog.body=req.sanitize(req.body.Blog.body);
	Blog.create(req.body.Blog,function(err,newBlog){
		if(err)
		{
			res.redirect("/blogs/new")
			console.log("------->ERROR<----------");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,blog)
	{
		if(err)
		{
			res.redirect("/blogs")
			console.log("------->ERROR<----------");
		}
		else
		{
			res.render("show",{blog:blog});
		}
	})
});


app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,fblog){
		if(err)
		{
			res.redirect("/blogs")
			console.log("------->ERROR<----------");
		}
		else
		{
			res.render("edit",{blog:fblog});
		}
	})
});

app.put("/blogs/:id",function(req,res){
	req.body.Blog.body=req.sanitize(req.body.Blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.Blog,function(err,updatedBlog){
		if(err)
		{
			res.redirect("/blogs")
			console.log("------->ERROR<----------");
		}
		else
		{
			res.redirect("/blogs/"+req.params.id);
		}
	})
});


app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			res.redirect("/blogs")
			console.log("------->ERROR<----------");
		}
		else
		{
			res.redirect("/blogs");
		}
	})
});


app.listen(3500,function()
{
	console.log("Server started!!        --blog_app--   ");
})