// 暴露中间件 传入字典
var formidable = require("formidable");
var fs = require("fs");
var User = require("../models/User.js");
var url = require("url");
var gm = require("gm");
var Q = require("../models/Q.js");
 

 exports.showIndex = function(req,res){
 	res.render("index" , {
 		"locate" :  "index",
 	 	"title" : "首页",
 	 	"login" : req.session.login, 
 	 	"email" : req.session.email
 	});
 }

  exports.douploadpic = function(req,res){
  	var form = new formidable.IncomingForm();
 	form.uploadDir = "./uploads"; //上传文件夹设置
 	form.keepExtensions = true;//保留扩展名
 	form.parse(req , function(err,fields, files){
 			 //上传的文件files name=avatar
 		 var  picname = files.files.path.substr(8);
 		 // console.log(filename); 
 		 // 页面不跳转
 		 // 使用gm生成缩略图
 		 gm("./uploads/" + picname).resize(100,100).write("./uploads/small/" + picname , function(){
				res.json({"picname" : picname});
 			 })	
 		});
  }
  // 增加问题
  exports.addQ = function(req,res){
	var form = new formidable.IncomingForm();
	form.parse(req , function(err , fields , files){
	 	var q = new Q({
	 		email : req.session.email , 
	 		content : fields.content, 
	 		picnames : JSON.parse(fields.picnames),
	 		date : new Date()
	 	});

	 	q.save(function(){
	 		res.json({"result" : 1});
	 	});
	});
}
// 得到所有问题
exports.getQ = function(req,res){
	var RESULT = [];
	//得到参数
	var page = Number(url.parse(req.url , true).query.page);
	var pagesize = Number(url.parse(req.url , true).query.pagesize);
	//这个接口比较难写，因为是两个数据表共同配合查找。
	//先在Q这个表中寻找到帖子，根据这个发帖人的Email寻找这个人的昵称和一句话简介。
	//这里的sort、skip、limit特别常用！！！以后的ARV课，大量使用！！
	Q.find({}).sort({"date" : -1}).skip(pagesize * (page)).limit(pagesize).exec(function(err , qs){
		iterator(0);

		//这是一个迭代器，主要功能就是让异步语句一条一条执行。
		//下一条异步语句在上一条的回调函数里面。
		function iterator(n){
			if(n == qs.length){
				//当迭代结束之后，此时可以寻找总数
				Q.count({},function(err , qAmount){
					res.json(
						{
							"qAmount" : qAmount , 
							"pageAmount" : Math.ceil(qAmount / pagesize) , 
							"page" : page , 
							"pagesize" : pagesize ,  
							"qs" : RESULT  
						}
					);
				})
				
				return;
			}
			User.find({"email" : qs[n].email} , function(err , us){
				if(us.length == 0){
					 iterator(++n);
					 return;
				}
				 
				var u = us[0];

				if(!u) {
					iterator(++n);
					return;
				}

				RESULT.push({
					"email" : u.email , 
					"nickname" : u.nickname ,
					"signature" : u.signature ,
					"avatar" : u.avatar ,
					"content" : qs[n].content , 
					"picnames" : qs[n].picnames,
					"date" : qs[n].date
				});
				iterator(++n);
			});
		}
	});	
	 
}