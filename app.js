var express = require("express");
var app = express();
// 引入mongoose
var mongoose = require('mongoose');
// 设置session 
 var session  = require('express-session');

// 引入mainctrl
var mainctrl = require("./controllers/mainctrl.js");
var registandlogin = require('./controllers/registandlogin.js');
var profilectrl = require('./controllers/profilectrl.js');
var changeavatarctrl = require("./controllers/changeavatarctrl.js");





// 连接数据库 如果QASystem不存在会自动创建
mongoose.connect('mongodb://localhost/QASystem');

// 设置session
 app.use(session({
 	secret : 'willslience',
 	saveUninitialized : true,
 	resave : false
 }));

// 设置模板引擎
app.set("view engine" , "ejs" );
// 静态化文件夹 
app.use(express.static("www"));
// 静态化uploads 前缀
app.use("/uploads" ,express.static("uploads"));


//*****************************************************************************************
// 路由表Restful风格路由
app.get("/" , mainctrl.showIndex);
app.get("/regist" , registandlogin.showRegist);
app.get("/login" , registandlogin.showLogin);
app.post("/login" , registandlogin.doLogin);
app.checkout("/user" , registandlogin.checkUser);
app.post("/user" , registandlogin.doRegist);
app.get("/logout", registandlogin.doLogout);

// 修改页面 开一个路由接口
app.get("/user/:email" , profilectrl.getUserProfile);
app.get("/profile" , profilectrl.showProfile);
app.post("/user/:email" , profilectrl.setUserProfile);
app.get("/change_avatar_step1" , changeavatarctrl.showStep1);
app.get("/change_avatar_step2" , changeavatarctrl.showStep2);
app.post("/uploadavatar" , changeavatarctrl.uploadavatar);
// 裁切头像
app.get("/cut", changeavatarctrl.docut);
// 
app.post('/uploadpic' , mainctrl.douploadpic);
app.post("/q" ,mainctrl.addQ);
app.get("/q" ,mainctrl.getQ);


 //*******************************************************************************************



// 开机
app.listen(3000, function(){
	console.log("已经运行在3000端口");
})