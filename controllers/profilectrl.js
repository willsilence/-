 var User = require("../models/User.js");
 var formidable = require("formidable");

 exports.getUserProfile = function(req,res){
 	 var email = req.params.email;
 	 User.find({"email" : email} , function(err, users){
 	 	var  u  = users[0];
 	 	 res.json({
 	 	 	"email" : u.email,
 	 	 	"_id" :u._id,
 	 	 	"avatar" : u.avatar,
 	 	 	"nickname" : u.nickname
 	 	 });
 	})
 }
  exports.showProfile = function(req,res){
  	// 访问个人信息修改页面,必须要求用户登录,如果用户没有登录,强制跳转到登录页面
  	if(!req.session.login){
        res.redirect("/login") ;
        return;
    } 
  	// 呈递ejs页面
  	res.render("profile" , {
  			"locate" : "profile",
  			"title" : "个人资料修改",
  			"login" : req.session.login, 
 	 		"email" : req.session.email
  		});
  }

exports.setUserProfile = function(req,res){
         var form = new formidable.IncomingForm();
         form.parse(req , function(err,fields, files){
               // console.log(fields);测试通过
               User.find({"email" : req.session.email} , function(err ,users){
                  var  u = users[0];
                  u.nickname = fields.nickname;
                  u.signature = fields.signature;
                  // 持久化
                  u.save(function(){
                        res.json({"result" : 1});
                        // console.log(u);
                  })
               })
         }); 
}