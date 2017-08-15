var _ = require("underscore")//调用underscore模块 以新对象替换旧对象
var Comment = require("../models/comment")//调用私有模块（数据库模型评论数据


//post comment
exports.save = function(req,res){
	var _comment = req.body.comment
	var movieId = _comment.movie
	//判断在评论的隐藏域值中是否含有cid（某条评论数据的数据库id值）
	// 有，增加reply，无，作为一条新评论加入到数据库
	if(_comment.cid){
		Comment.findById(_comment.cid,function(err,comment){
			var reply = {
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}

			comment.reply.push(reply)

			comment.save(function(err,comment){
				if(err){
					console.log(err)
				}
				res.redirect("/movie/" + movieId)
			})
		})
	}else{
		var comment = new Comment(_comment)

		comment.save(function(err,comment){
			if(err){
					console.log(err)
				}
			res.redirect("/movie/" + movieId)
		})		
	}
}



