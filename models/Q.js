var mongoose = require("mongoose");

//schema的意思：模式；计划；图解；概要
var qSchema = new mongoose.Schema({
	"content" : String , 
	"picnames" : [String] ,
	"email" : String ,
	"date" :  Date
});

//通过schema来创建model。mongoose.model()这个方法会返回一个类。
var Q = mongoose.model("Q",qSchema);

//暴露
module.exports = Q;