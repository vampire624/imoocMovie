var _ = require("underscore")//调用underscore模块 以新对象替换旧对象
var Movie = require("../models/movie")//调用私有模块（数据库模型）电影数据
var Comment = require("../models/comment")//调用私有模块（数据库模型）评论数据
var Category = require("../models/category")//调用私有模块（数据库模型）电影数据

//detail page

exports.detail = function(req,res){
	var id = req.params.id
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			console.log()
		}
	})

	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}
		Comment
			.find({movie:id})
			.populate("from","name")
			.populate("reply.from reply.to","name")
			.exec(function(err,comments){
				console.log(comments)
				res.render("detail",{
					title:"imooc" + movie.title,
					movie:movie,
					comments:comments
				})		
			})
	})
}

//admin page

exports.new = function(req,res){
	Category.find({},function(err,categories){
		res.render("admin",{
			title:"imooc 后台录入页",
			categories:categories,
			movie:{},
		})
	})
}
//admin update movie

exports.update = function(req,res){
	var id = req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				res.render("admin",{
					title:"imooc 后台更新页",
					movie:movie,
					categories:categories
				})
			})
		})
	}
}
//admin post movie
exports.save = function(req,res){
	//隐藏域传来的_id
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if(id !== undefined){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			//require的underscore模块的extend方法，用新对象替换就对象
			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log(err)
				}
				res.redirect("/movie/" + movie._id)
			})

		})
	}else{
		_movie = new Movie(movieObj)

		var categoryId = _movie.category
		var categoryName = movieObj.categoryName
		_movie.save(function(err,movie){
			if(err){
					console.log(err)
				}

			if(categoryId !== undefined){
				Category.findById(categoryId,function(err,category){
					if(err){
						console.log(err)
					}
					category.movies.push(movie._id)
					category.save(function(err,category){
						if(err){
							console.log(err)
						}
						res.redirect("/movie/" + movie._id)					
					})
				})	
			}else if(categoryName){
				var category = new Category({
					name:categoryName,
					movies:[movie._id]
				})
				category.save(function(err,category){
					if(err){
						console.log(err)
					}
					movie.category = category._id
					movie.save(function(err,movie){
						if(err){
							console.log(err)
						}
						res.redirect("/movie/" + movie._id)					
					})
				})
			}
		})
	}
}

//list page

exports.list = function(req,res){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
		res.render("list",{
			title:"imooc 列表页",
			movies:movies
		})
	})
}

//list delete movie
exports.del = function(req,res){
	var id = req.query.id

	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}
		})
	}
}
