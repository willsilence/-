(function(){
	// 两个类
	var AddPicManager = window.AddPicManager = function(params){
		// 大盒子ID
		this.$dom = $(params.boxid);			
		//儿子计数器
		this.addplusamount = 0;
 		//来一个数组存储文件名们
		this.picnames = [];
		var start;
		var self = this;
		//图片排序
		this.$dom.sortable({
			items : ".cansort",
			//开始拖拽的时候做的事情
			start : function(event ,o){
				//开始拖拽的时候元素的位置
				start = o.item.index();
			},
			//结束拖拽的时候做的事情
			stop : function(event , o){
				//结束拖拽的时候元素的位置
				var stop = o.item.index();
				//让数组中的元素移动位置
				self.picnames.splice(stop , 0 , self.picnames.splice(start , 1)[0]);
				console.log(self.picnames)
			}
		});
	 
		
		new AddPlus(this);

	}

	function AddPlus(owner){
		this.owner = owner;
		this.$dom = $([
			'<div class="addbtnsbox">',
			'	<a href="javascript:void(0);" class="fileaddbtn">+</a>',
			'	<a href="javascript:void(0);" class="fileremovebtn">×</a>',
			'	<input type="file" name="files" style="display:none"/>',
			'</div>'
		].join(""));
		this.$dom.appendTo(this.owner.$dom);
		// 上树
		this.$input = this.$dom.find("input");
		this.$fileaddbtn = this.$dom.find(".fileaddbtn");
		this.$fileremovebtn = this.$dom.find(".fileremovebtn");

		this.state = 0; // 0表示没有上传图片 1表示上传了图片

		var self = this;
		// 绑定事件监听
		this.bindEvent();
		// 上传
		this.$input.fileupload({
			url : "/uploadpic",
			dataType: 'json',
			done : function(e ,data){
				self.$fileaddbtn.css({
					"background" : "url(/uploads/small/"+ data.result.picname +")",
					 "background-size" : "cover" ,
					 "background-position" : "center center"
				}).html("");
				self.state =1;
				// 父亲的计数器+1
				 self.owner.addplusamount ++;
				 //再次new一个
	            		self.owner.addplusamount < 3 && new  AddPlus(self.owner);
	            		//让自己的这个文件名加入父亲的数组中
	            		self.owner.picnames.push(data.result.picname);
	            		// 
	            		self.$dom.addClass("cansort");

	            		console.log(self.owner.picnames)

			}
		});

		// trigger 一下 
		this.$fileaddbtn.click(function(){ 
			self.$input.trigger("click");
		})

	}	
	AddPlus.prototype.bindEvent = function(){
		var self = this;
		 this.$dom.bind("mouseenter" , function(){
			if(self.state == 1){
				self.$fileremovebtn.show();
			}
		});
		 this.$dom.bind("mouseleave" , function(){
			if(self.state == 1){
				self.$fileremovebtn.hide();
			}
		});
		 //删除按钮，只需要删除DOM
		this.$fileremovebtn.bind("click" , function(){
			self.$dom.remove();
			self.owner.addplusamount --;
			self.owner.addplusamount == 2 && new AddPlus(self.owner) 
		});
	}
})();