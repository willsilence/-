function PageNavigator(page , pageamount , callback){
	//当前页数
	this.page = page;
	//总页数
	this.pageamount = pageamount;
	//回调
	this.callback = callback;
	//初始化
	this.init();
	//事件委托
	this.bindEvent();
}
//初始化
PageNavigator.prototype.init = function(){
	//创建DOM
	this.$dom = $("<div class='pagenavigator'></div>");
	this.$ul = $("<ul></ul>");
	this.$dom.append(this.$ul);
	var count = 9;
	while(count--){
		this.$ul.append($('<li><a href="javascript:void(0)"></a></li>'));
	}
}
//前往第几页
PageNavigator.prototype.gotoPage = function(number){
	this.page = number;
	//规整DOM
	this.initdom(number);
	//调用回调
	this.callback(this.page);
}
//规整一下分页条的dom
PageNavigator.prototype.initdom = function(number){
	if(this.pageamount < 9){
		this.$ul.empty();
		var count = 0;
		while(count != this.pageamount){
			this.$ul.append($('<li><a href="javascript:void(0)">' + (count + 1) +'</a></li>'));
			count++;
		}
		this.$ul.find("li").eq(this.page - 1).addClass('cur').siblings('').removeClass('cur');

		return;
	}
	if(number <= 3){
		this.$ul.find("li").eq(0).html('<a href="javascript:void(0);">1</a>');
		this.$ul.find("li").eq(1).html('<a href="javascript:void(0);">2</a>');
		this.$ul.find("li").eq(2).html('<a href="javascript:void(0);">3</a>');
		this.$ul.find("li").eq(3).html('<a href="javascript:void(0);">4</a>');
		this.$ul.find("li").eq(4).html('...');
		this.$ul.find("li").eq(5).html('<a href="javascript:void(0);">' + (this.pageamount - 3) + '</a>');
		this.$ul.find("li").eq(6).html('<a href="javascript:void(0);">' + (this.pageamount - 2) + '</a>');
		this.$ul.find("li").eq(7).html('<a href="javascript:void(0);">' + (this.pageamount - 1) + '</a>');
		this.$ul.find("li").eq(8).html('<a href="javascript:void(0);">' + (this.pageamount - 0) + '</a>');

		this.$ul.find("li").eq(number - 1).addClass('cur').siblings().removeClass('cur');
	}else if(number == 4){
		this.$ul.find("li").eq(0).html('<a href="javascript:void(0);">1</a>');
		this.$ul.find("li").eq(1).html('<a href="javascript:void(0);">2</a>');
		this.$ul.find("li").eq(2).html('<a href="javascript:void(0);">3</a>');
		this.$ul.find("li").eq(3).html('<a href="javascript:void(0);">4</a>');
		this.$ul.find("li").eq(4).html('<a href="javascript:void(0);">5</a>');
		this.$ul.find("li").eq(5).html('<a href="javascript:void(0);">6</a>');
		this.$ul.find("li").eq(6).html("...");
		this.$ul.find("li").eq(7).html('<a href="javascript:void(0);">' + (this.pageamount - 1) +'</a>');
		this.$ul.find("li").eq(8).html('<a href="javascript:void(0);">' + (this.pageamount - 0) +'</a>');

		this.$ul.find("li").eq(3).addClass('cur').siblings().removeClass('cur');
	}else if(number <= this.pageamount - 4){
		this.$ul.find("li").eq(0).html('<a href="javascript:void(0);">1</a>');
		this.$ul.find("li").eq(1).html('...');
		this.$ul.find("li").eq(2).html('<a href="javascript:void(0);">' + (number - 2) + '</a>');
		this.$ul.find("li").eq(3).html('<a href="javascript:void(0);">' + (number - 1) + '</a>');
		this.$ul.find("li").eq(4).html('<a href="javascript:void(0);">' + number + '</a>');
		this.$ul.find("li").eq(5).html('<a href="javascript:void(0);">' + (number + 1) + '</a>');
		this.$ul.find("li").eq(6).html('<a href="javascript:void(0);">' + (number + 2) + '</a>');
		this.$ul.find("li").eq(7).html('...');
		this.$ul.find("li").eq(8).html('<a href="javascript:void(0);">' + this.pageamount + '</a>');

		this.$ul.find("li").eq(4).addClass('cur').siblings().removeClass('cur');
	}else if(number == this.pageamount - 3){
		this.$ul.find("li").eq(0).html('<a href="javascript:void(0);">1</a>');
		this.$ul.find("li").eq(1).html('<a href="javascript:void(0);">2</a>');
		this.$ul.find("li").eq(2).html('...');
		this.$ul.find("li").eq(3).html('<a href="javascript:void(0);">' + (this.pageamount - 5) +'</a>');
		this.$ul.find("li").eq(4).html('<a href="javascript:void(0);">' + (this.pageamount - 4) +'</a>');
		this.$ul.find("li").eq(5).html('<a href="javascript:void(0);">' + (this.pageamount - 3) +'</a>');
		this.$ul.find("li").eq(6).html('<a href="javascript:void(0);">' + (this.pageamount - 2) +'</a>');
		this.$ul.find("li").eq(7).html('<a href="javascript:void(0);">' + (this.pageamount - 1) +'</a>');
		this.$ul.find("li").eq(8).html('<a href="javascript:void(0);">' + (this.pageamount - 0) +'</a>');

		this.$ul.find("li").eq(5).addClass('cur').siblings().removeClass('cur');
	}else{
		this.$ul.find("li").eq(0).html('<a href="javascript:void(0);">1</a>');
		this.$ul.find("li").eq(1).html('<a href="javascript:void(0);">2</a>');
		this.$ul.find("li").eq(2).html('<a href="javascript:void(0);">3</a>');
		this.$ul.find("li").eq(3).html('<a href="javascript:void(0);">4</a>');
		this.$ul.find("li").eq(4).html('...');
		this.$ul.find("li").eq(5).html('<a href="javascript:void(0);">' + (this.pageamount - 3) +'</a>');
		this.$ul.find("li").eq(6).html('<a href="javascript:void(0);">' + (this.pageamount - 2) +'</a>');
		this.$ul.find("li").eq(7).html('<a href="javascript:void(0);">' + (this.pageamount - 1) +'</a>');
		this.$ul.find("li").eq(8).html('<a href="javascript:void(0);">' + (this.pageamount - 0) +'</a>');
		
		this.$ul.find("li").eq(number - this.pageamount - 1).addClass('cur').siblings().removeClass('cur');
	}
}
//事件绑定
PageNavigator.prototype.bindEvent = function(){
	var self = this;
	this.$dom.delegate("a" , "click" , function(){
		self.gotoPage(Number($(this).html()));
	});
}