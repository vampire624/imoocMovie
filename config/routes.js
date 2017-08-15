var Index = require("../app/controllers/index")//调用underscore模块 以新对象替换旧对象
var Movie = require("../app/controllers/movie")//调用私有模块（数据库模型）电影数据
var User = require("../app/controllers/user")//调用私有模块（数据库模型）用户数据
var Comment = require("../app/controllers/comment")//调用私有模块（数据库模型）用户评论数据
var Category = require("../app/controllers/category")//调用私有模块（数据库模型）电影类型数据

module.exports = function(app){
	// pre handle user
app.use(function(req,res,next){
	var _user = req.session.user

	app.locals.user = _user
	console.log(_user)

	next()
})


// index page
app.get("/",Index.index)


/************************
user page
***********************/

//signup 
app.post("/user/signup",User.signup)

//signin page
app.post("/user/signin",User.signin)

//show signin page
app.get("/signin",User.showSignin)

//show signup page
app.get("/signup",User.showSignup)

//logout page
app.get("/logout",User.logout)

//userlist page
app.get("/admin/user/list", User.signinRequired, User.adminRequired, User.list)



/************************
movie page
***********************/

//detail page
app.get("/movie/:id",Movie.detail)

//admin page
app.get("/admin/movie/add", User.signinRequired, User.adminRequired, Movie.new)

//admin update movie
app.get("/admin/update/:id", User.signinRequired, User.adminRequired, Movie.update)

//admin post movie
app.post("/admin/movie/new", User.signinRequired, User.adminRequired, Movie.save)

//movie list page
app.get("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.list)

//movie list delete movie
app.delete("/admin/movie/list", User.signinRequired, User.adminRequired, Movie.del)



/********
*****Comnent *********/

app.post("/user/comment", User.signinRequired, Comment.save)


/********
*****category *********/

//Category admin page
app.get("/admin/category/new", User.signinRequired, User.adminRequired, Category.new)

//admin post category
app.post("/admin/category", User.signinRequired, User.adminRequired, Category.save)

//category list page
app.get("/admin/category/list", User.signinRequired, User.adminRequired, Category.list)



/*results page*/
app.get("/results", Index.search)


}
