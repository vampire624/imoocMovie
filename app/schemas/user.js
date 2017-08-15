var mongoose = require("mongoose")
//导入bcrypt 密码加盐工具
var bcrypt = require("bcryptjs")
var SATL_WORK_FACTOR = 10
//创建数据库模式
var UserSchema = new mongoose.Schema({
	name:{
		unique:true,
		type:String
	},
	password:{
		type:String
	},
	//使用数值表示当前用户的权限
	
	// 0:normal
	// 1:verified user
	// 2:professional user

	// >10:admin
	// >50:super admin
	role:{
		type:Number,
		default:0
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

//增加实例方法
UserSchema.methods = {
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err){
				return cb(err)
			}
			cb(null,isMatch)
		})
	}
}


UserSchema.pre("save",function(next){
	var user = this
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}

	bcrypt.genSalt(SATL_WORK_FACTOR,function(err,salt){
		if(err) return next(err)
			
		bcrypt.hash(user.password,salt,function(err,hash){
			if(err) return next(err)
			user.password = hash
			next()
		})
	})
})
//创建静态方法
UserSchema.statics = {
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

module.exports = UserSchema