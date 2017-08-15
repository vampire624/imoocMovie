var express = require("express") 
var path = require("path")
var cookieParser = require("cookie-parser")//调用cookie-parser中间件 同上
var session = require("express-session")//调用express-session中间件 同上
var mongoose = require("mongoose")//调用mongoose模块 操作mongoDB
var mongoStore = require("connect-mongo")(session) //调用connect-mongo 中间件 将session会话存入mongoDB
var _ = require("underscore")//调用underscore模块 以新对象替换旧对象
var Movie = require("./app/models/movie")//调用私有模块（数据库模型）电影数据
var User = require("./app/models/user")//调用私有模块（数据库模型）用户数据
var bodyParser = require("body-parser")//express4以上版本 中间件已删除 需要手动安装
var logger = require("morgan")//调用打印日志模块
var port = process.env.PORT || 3000 
var app = express()
var dbUrl = "mongodb://localhost/imooc"
mongoose.Promise = global.Promise
mongoose.connect(dbUrl,{useMongoClient:true})//连接数据库

app.set("views","./app/views/pages")//设置视图文件路径
app.set("view engine","jade")//设置视图模板引擎
app.use(bodyParser.json())//调用body-parser模块
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))//使用path定位静态文件地址
app.use(cookieParser())//调用express中的cookie
app.use(session({
	secret:"imooc",
	store: new mongoStore({
		url:dbUrl,
		collection:"sessions"
	}),
	resave:false,
	saveUninitialized:true
}))//调用express中的cookie

//开发环境下的日志打印设置 http请求方法 地址 状态码 前端视图模板引擎采用pretty输出，打开mongoose的debug模式
var env = process.env.NODE_ENV || "development"
if("development" === env){
	app.set("showStackError",true)
	app.use(logger(":method :url :status"))
	app.locals.pretty = true
	mongoose.set("debug",true)
}

app.locals.moment = require("moment")//调用本地时间管理模块,注入到app的本地属性中，贯穿整个生命周期
app.listen(port)

//路由
require("./config/routes.js")(app)

console.log("service started at port: " + port)

