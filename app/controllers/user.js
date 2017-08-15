var User = require("../models/user")//调用私有模块（数据库模型）用户数据

//signup 
exports.signup = function(req,res){
	var _user = req.body.user

	User.findOne({name: _user.name},function(err,user){
		if(err){
			console.log(err)
		}if(user){
			return res.redirect("/signin")
		}else{
			var user = new User(_user)			
			user.save(function(err,user){
				if(err){
					console.log(err)
				}

				res.redirect("/")
			})
		}
	})

}
//show signin page
exports.showSignin = function(req,res){
	res.render("signin",{
		title:"登录页面"
	})
}

//show signup page
exports.showSignup = function(req,res){
	res.render("signup",{
		title:"注册页面"
	})
}

//signin page

exports.signin = function(req,res){
	var _user = req.body.user
	var name = _user.name
	var password = _user.password

	User.findOne({name:name},function(err,user){
		if(err){
			consoel.log(err)
		}

		if(!user){
			return res.redirect("/signup")
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user = user
				return res.redirect("/")
			}
			else{
				return res.redirect("/signin")
			}

		})
	})
}


//logout page

exports.logout = function(req,res){
	delete req.session.user
	// delete app.locals.user
	res.redirect("/")
}

//userlist page

exports.list = function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render("userlist",{
			title:"imooc 用户列表页",
			users:users
		})
	})
}


// midware for user
exports.signinRequired = function(req,res,next){
	var user = req.session.user

	if(!user){
		return res.redirect("/signin")
	}	

	next()
}


// midware for admin
exports.adminRequired = function(req,res,next){
	var user = req.session.user

	if(user.role <= 10){
		return res.redirect("/signin")
	}

	next()
}
