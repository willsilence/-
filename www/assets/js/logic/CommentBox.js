function CommentBox(){
	//当前的页数（从1开始，当然后台从0开始，所以发请求的时候，减去1）
	this.page = 1;
	//初始化
	this.init();
	//自己的分页条
	var self = this;
	//实例化的时候会有默认的第1页的数据
	this.pn = new PageNavigator(this.page , 40 , function(number){
		self.page = number;
		self.fetchData(this.page - 1);
	});
	//上树
	this.$dom.find(".navbox").append(this.pn.$dom);
	//去这页
	this.pn.gotoPage(this.page);
}
CommentBox.prototype.init = function(){
	//自己的DOM
	this.$dom = $(
		[
			'<div>',
			'	<div class="itembox"></div>',
			'	<div class="navbox" style="margin-top:40px;"></div>',
			'</div>'
		].join("")
	);

	//上树
	$("#qsbox").append(this.$dom)
}
//拉取数据
CommentBox.prototype.fetchData = function(page){
	var self = this;
	//这里是jQuery的JSONP的跨域请求，请求数据之后在回调函数中实例化CommentItem。
	$.ajax({
		"type" : "GET" ,
		"url" 	   : "/q",
		"data" 	   : {
			"page"	 		: page ,
			"pagesize" 		: 10 
		},
		"success" : function(data){
			 
			//清空DOM
			self.$dom.find(".itembox").empty();
			//遍历10个评论的字典
			$.each(data.qs , function(){
				//this表示你遍历到的人。this就是字典，我们的子组件CommentItem要字典，此时就给他字典！
				var commentitem = new CommentItem(this);
				//让子组件上树
				self.$dom.find(".itembox").append(commentitem.$dom);
			});
	 
			//改变分页条
			self.pn.pageamount = data.pageAmount;
			//规整分页条的dom
			self.pn.initdom(self.page);
		}
	});
}