var mongoose = require("mongoose")
//创建数据库模式

var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
	//通过引用的方式拿到Movie,User数据库模式
	movie:{
		type:ObjectId,
		ref:"Movie"
	},
	from:{
		type:ObjectId,
		ref:"User"
	},
	reply:[{
		from:{type:ObjectId,ref:"User"},
		to:{type:ObjectId,ref:"User"},
		content:{type:String}
	}],
	content:{
		type:String
	},
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
 CommentSchema.pre("save",function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})
 
//创建静态方法 
CommentSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("meta.updateAt")
			.exec(cb)
	},
	findById: function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

module.exports = CommentSchema