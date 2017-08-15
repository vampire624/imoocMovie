var mongoose = require("mongoose")
//创建数据库模式
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategroySchema = new Schema({
	name:String,
	//当前分类名称下的电影数据，与movie完成映射
	movies:[{
		type:ObjectId,
		ref:"Movie"
	}],
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
 CategroySchema.pre("save",function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	next()
})
//创建静态方法 
CategroySchema.statics = {
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

module.exports = CategroySchema