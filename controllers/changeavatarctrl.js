var formidable = require("formidable");
var url = require("url");
var fs = require('fs')
var gm = require('gm');
// 数据库
var User = require("../models/User.js");
 


exports.showStep1 = function(req,res){
	res.render("change_avatar_step1" , {
		
	});
}
 exports.uploadavatar = function(req,res){
 	 var form = new formidable.IncomingForm();
 	 form.uploadDir = "./uploads"; //上传文件夹设置
 	 form.keepExtensions = true;//保留扩展名
 	 form.parse(req , function(err,fields, files){
 		 //上传的文件files name=avatar
 	 	var  filename = files.avatar.path.substr(8);
 	 	console.log(filename); 
 	 	res.redirect("/change_avatar_step2?picname=" + filename);
 	 });	

}  	
 exports.showStep2 = function(req,res){
 	// 解析url字符串 得到get 请求的参数
 	var picname = url.parse(req.url , true).query.picname;
 	res.render("change_avatar_step2" , {
 		// 当字典传入
		"picname" :  picname
});
}

//裁切 
 exports.docut = function(req,res){
 	// 获取图片名称
 	var picname = url.parse(req.url , true).query.picname;
 	var x = url.parse(req.url , true).query.x;
 	var y = url.parse(req.url , true).query.y;
 	var w = url.parse(req.url , true).query.w;
 	var h = url.parse(req.url , true).query.h;

 	// 需要裁切的图片路径
 	gm('./uploads/' + picname) 
 	//  crop四个参数(宽,高,X,Y) 请用firework量取
 	.crop(w,h, x, y)
 	.resize(120 ,120, "!")
 	// 写入文件
 	.write('./www/avatars/' + picname  ,function(err){
 		// res.json({"result" : 1}); 
 		User.find({"email" : req.session.email} ,function(err , users){
 			var u = users[0];
 			u.avatar = picname;
 			u.save(function(){
 				res.json({"result" : 1});
 			});
 		})
 	})
 	// console.log(w,h,x,y);
 }
 