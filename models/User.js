// day3-04 在models创建一个文件, 目的持久化数据
var mongoose = require("mongoose");

//schema的意思：模式；计划；图解；概要
// 存库
var userSchema = new mongoose.Schema({
	"email" : String, 
	"password"  : String,
	"nickname" : String,
	"avatar"  :  String,
	"signature" : String
});

//通过schema来创建model。mongoose.model()这个方法会返回一个类。
var User = mongoose.model("User",userSchema);

//暴露
module.exports = User;