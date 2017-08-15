var mongoose = require("mongoose")
//创建数据库模式
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new mongoose.Schema({
	director:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	pv:{
		type:Number,
		default:0
	},
	//与分类的数据集进行映射，双向映射
	category:{
		type:ObjectId,
		ref:"Category"
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

MovieSchema.pre("save",function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})
//创建静态方法
MovieSchema.statics = {
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

module.exports = MovieSchema