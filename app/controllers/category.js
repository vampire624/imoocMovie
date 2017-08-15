var Category = require("../models/category")//调用私有模块（数据库模型）电影类型数据



//admin page

exports.new = function(req,res){
	res.render("categoryAdmin",{
		title:"imooc 后台分类录入页",
		category:{}
	})
}

//admin post movie

exports.save = function(req,res){
	var _category = req.body.category
	var category = new Category(_category)

	category.save(function(err,movie){
		if(err){
				console.log(err)
			}
		res.redirect("/admin/category/list")
	})
}


//categorylist page

exports.list = function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		res.render("categorylist",{
			title:"imooc 电影分类列表页",
			categories:categories
		})
	})
}
