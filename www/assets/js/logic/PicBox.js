function PicBox(picarr){
	//图片序列
	this.picarr = picarr;
	//当前正在显示的图片序号
	this.idx = 0;
	//当前大图的角度
	this.rotate = 0;
	//初始化
	this.init();
	//绑定事件监听
	this.bindEvent();
}
//初始化，负责图片的上树
PicBox.prototype.init = function(){
	//DOM的字符串，一会儿$()一下就是jQuery对象了，就能上树了
	//注意是join的方式，ul中是空的。一会儿动态上li。
	var domstr = [
		'<div class="picBox">',
		'	<div class="smallPicsBox">',
		'		<ul></ul>',
		'	</div>',
		'	<div class="bigPicBox">',
		'		<img src="" class="bigPic"/>',
		'		<div class="leftBtn"></div>',
		'		<div class="rightBtn"></div>',
		'		<div class="tools_btn">',
		'			<a href="javascript:void(0);" class="leftRotateBtn">左转</a>',
		'			<a href="javascript:void(0);" class="rightRotateBtn">右转</a>',
		'		</div>',
		'	</div>',
		'</div>'
	].join("");

	//可以成为jQuery对象，很简单，直接$()即可
	this.$dom = $(domstr);

	//*********下面拿出各个小东西*********
	//自己的小图ul
	this.$ul = this.$dom.find(".smallPicsBox ul");
	//自己的大图img
	this.$bigPic = this.$dom.find(".bigPic");
	//左边按钮
	this.$leftBtn = this.$dom.find(".leftBtn");
	//右边按钮
	this.$rightBtn = this.$dom.find(".rightBtn");
	//左转按钮
	this.$leftRotateBtn = this.$dom.find(".leftRotateBtn");
	//右转按钮
	this.$rightRotateBtn = this.$dom.find(".rightRotateBtn");
	//大图盒子
	this.$bigPicBox = this.$dom.find(".bigPicBox");

	//*********上小图*********
	var self = this;
	//上小图，遍历传入的图片URL数组。可以用for遍历没问题。
	$.each(this.picarr , function(){
		//替换为小图片这里的this表示遍历到的项目
		var imgurl = this;
		//这个局部的DOM形式：
		var _domstr = [
			'<li>',
			'	<a href="javascript:void(0);">',
			'		<img src="/uploads/small/' + imgurl +'" />',
			'	</a>',
			'</li>'
		].join("");
		//上小树
		self.$ul.append($(_domstr));
	});
 
}
//绑定事件监听
PicBox.prototype.bindEvent = function(){
	var self = this;
	//事件委托，只需要给ul添加监听，不需要给很多li添加监听，挺高系统性能。
	//jQuery实现事件委托用delegate函数，
	//第一个参数是自己的内部元素谁要添加监听，
	//第二个参数是事件，
	//第三个参数是事件处理函数。
	this.$ul.delegate("li" , "click" , function(){
		//调用自己的看图方法
		self.showPic($(this).index());
	});

	//给自己的左右按钮绑定监听
	this.$rightBtn.bind("click" , function(){
		self.goNext();
	});

	this.$leftBtn.bind("click" , function(){
		self.goPrev();
	});

	//给自己的旋转按钮添加监听
	this.$rightRotateBtn.bind("click",function(){
		self.rotateRight();
	});

	this.$leftRotateBtn.bind("click",function(){
		self.rotateLeft();
	});
}
//展示图片
PicBox.prototype.showPic = function(number){
	//改变信号量
	this.idx = number;
	//改变cur
	this.$ul.find("li").eq(this.idx).addClass("cur").siblings().removeClass("cur");
	//让盒子显示
	this.$bigPicBox.show();
	//先隐藏图片
	this.$bigPic.hide();
	//让盒子携带菊花
	this.$bigPicBox.addClass('loading');
	//让大图的旋转归0
	this.rotate = 0;
	//设置DOM归0
	this.$bigPic.css({
		"transform" : "none" ,
		"margin" : 0 
	});

	//得到URL
	var url = "/uploads/" + this.picarr[number];
 
	//要用下面的套路发出图片请求，一回生二回熟
	var img = new Image();		//创建一个<img />的孤儿节点，等价于var img = document.createElement("img");
	img.src = url;			//一旦设置src，将立即发出图片请求！

	var self = this;
	//当这个img对象已经加载完毕的时候，此时显示图片。
	$(img).bind("load" , function(){
		//让我们的大图也称为这个url地址。让bigPic显示。
		self.$bigPic.attr("src" , url).show();
		//让盒子服帖图片
		self.$bigPicBox.css({
			"width" : self.$bigPic.width(),
			"height" : self.$bigPic.height()
		});
	});

	//如果到了最后，此时就变为放大镜
	if(number == this.picarr.length - 1){
		this.$rightBtn.css("cursor" , "url(/assets/images/small.cur),auto");
	}else{
		this.$rightBtn.css("cursor" , "url(/assets/images/next.cur),auto");
	}

	if(number == 0){
		this.$leftBtn.css("cursor" , "url(/assets/images/small.cur),auto");
	}else{
		this.$leftBtn.css("cursor" , "url(/assets/images/prev.cur),auto");
	}
}
//下一张
PicBox.prototype.goNext = function(){
	if(this.idx == this.picarr.length - 1){
		//隐藏大盒子
		this.$bigPicBox.hide();
		return;
	}
	this.idx++;

	this.showPic(this.idx);
}
//上一张
PicBox.prototype.goPrev = function(){
	if(this.idx == 0){
		//隐藏大盒子
		this.$bigPicBox.hide();
		return;
	}
	this.idx--;

	this.showPic(this.idx);
}
//旋转
PicBox.prototype.rotateRight = function(){
	this.rotate += 90;
	//宽度和高度的差，用来调整图片的位置，让质心重合。
	var diff = (this.$bigPic.width() - this.$bigPic.height()) / 2;
	//旋转
	this.$bigPic.css({
		"transform" : "rotate(" + this.rotate + "deg)" ,
		"margin-left" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? -diff : 0 ,
		"margin-top" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? diff  : 0 
	});

	//让盒子服帖图片
	this.$bigPicBox.css({
		"width" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? this.$bigPic.height() : this.$bigPic.width(),
		"height" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? this.$bigPic.width() : this.$bigPic.height()
	});
}
//旋转
PicBox.prototype.rotateLeft = function(){
	this.rotate -= 90;
	//宽度和高度的差，用来调整图片的位置，让质心重合。
	var diff = (this.$bigPic.width() - this.$bigPic.height()) / 2;
	//旋转
	this.$bigPic.css({
		"transform" : "rotate(" + this.rotate + "deg)" ,
		"margin-left" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? -diff : 0 ,
		"margin-top" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? diff  : 0 
	});

	//让盒子服帖图片
	this.$bigPicBox.css({
		"width" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? this.$bigPic.height() : this.$bigPic.width(),
		"height" : this.rotate % 90 == 0 && this.rotate % 180 != 0 ? this.$bigPic.width() : this.$bigPic.height()
	});
}