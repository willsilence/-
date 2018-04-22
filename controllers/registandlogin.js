 var formidable = require("formidable");
 // 持久化数据库
 var User = require("../models/User.js");
 // 加密工具
 var crypto = require("crypto");

 exports.showRegist = function(req,res){
 	res.render("regist" , {
 		"locate" : "regist",
 		"title" : "注册",
          "login" : req.session.login,
          "email" : req.session.email
 	})
 }

  exports.showLogin = function(req,res){
 	res.render("login" , {
 		"locate" : "login",
 		"title" : "登录",
          "login" : req.session.login,
          "email" : req.session.email
 	})
   } 
  exports.checkUser = function(req,res){
 	 // 获取用户传入数据,
 	var form = new formidable.IncomingForm();
 	// 识别用户数据然后持久化  该方法会转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
 	form.parse(req , function(err,fields, files){
 		// collections找到users表单,对应的条目 然后用回调嵌套的方法判断
 	 	User.find({"email" : fields.email}, function(err, results){
 	 		res.json({"result" : results.length != 0});
 	 	});
 	});
  }  
  // 执行注册
 exports.doRegist = function(req,res){
 	// console.log("用户请求注册");
 	// 得到用户传入的数据 nodejs建议用formidable库拉取数据;
 	  	var form = new formidable.IncomingForm();
 	  	form.parse(req , function(err,fields, files){
 	 		User.find({"email": fields.email} , function(err ,results){
 	 			if(err){
 	 				res.json({"result" : -1});
 	 				return;
 	 			}
 	 			if(results.length == 0){
 	 				var  u  = new User({
 	 					"email" : fields.email,
 	 					"password" : crypto.createHash("sha256").update(fields.password).digest("hex")
 	 				});
 	 				u.save(function(err){
 	 					if(err){
 	 						res.json({
 	 							"result" : -1
 	 						});
 	 						return
 	 					}
 	 					res.json({"result" : 1});
 	 				});
 	 			}else{
 	 				res.json({
 	 					"result" : -2
 	 				})
 	 			}
 	 		})  
 	  	});
  }

  exports.doLogin = function(req , res){
  	var form = new formidable.IncomingForm();
  	form.parse(req , function(err,fields, files){
  	 	var password =  crypto.createHash("sha256").update(fields.password).digest("hex");
  	 	User.find({"email" : fields.email , "password" : password} , function(err, results){	 		
 				if(results.length != 0){
 				     req.session.login = true;   //记录这个用户已经登录了！！
                          req.session.email = fields.email;
  	 				res.json({"result" : 1});
 				}else{
 					res.json({"result" : -1});
 				}
  	 	});
  	});
  }

  exports.doLogout = function(req , res){
    // 退出登录
          req.session.login = false;
          req.session.email = "";
          // 非ajax退出.
          res.redirect("/");
  }