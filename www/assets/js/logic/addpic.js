(function(){
	//向外暴露这一个构造函数
	var AddPicManager = window.AddPicManager = function(params){
		//大盒子的ID
		this.$dom = $(params.boxid);
		//计数器，我一共有多少个儿子？
		//这里并不需要用数组存储儿子们，为什么？因为没有必要，儿子一会儿的DOM删除了即可。
		this.addplusamount = 0;
		//来一个数组存储文件名们
		this.picnames = [];

		var start;
		var self = this;
		//可以被排序
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
		//测试一下：
		new AddPlus(this);
	}


	//小加号类，这个类负责上传图片，调用我们的插件
	function AddPlus(owner){
		this.owner = owner;
		//这里面一个a标签一个猫腻input标签
		this.$dom = $([
			'<div class="addbtnsbox">',
			'	<a href="javascript:void(0);" class="fileaddbtn">+</a>',
			'	<a href="javascript:void(0);" class="fileremovebtn">×</a>',
			'	<input type="file" name="files" style="display:none"/>',
			'</div>'
		].join(""));

		//上树
		this.$dom.appendTo(this.owner.$dom);

		//按钮和a标签
		this.$input = this.$dom.find("input");
		this.$fileaddbtn = this.$dom.find(".fileaddbtn");
		this.$fileremovebtn = this.$dom.find(".fileremovebtn");

		//信号量
		this.state = 0;	//0原始状态，没有被上传图片，1表示上传了

		var self = this;

		this.bindEvent();

		//就在构造器中添加监听得了
		this.$input.fileupload({
	        url: "/uploadpic",
	        dataType: 'json',
	        done: function (e, data) {
	            // alert("服务器已经以这个文件名保存了文件："  + data.result.picname);
	            self.$fileaddbtn.css({
	            	"background" : "url(/uploads/small/" + data.result.picname + ")",
	            	"background-size" : "cover",
	            	"background-position" : "center center"
	            }).html("");
	            //自己的状态改为1
	            self.state = 1;
	            //让父亲的计数器加1
	            self.owner.addplusamount ++;
	            //再次new一个
	            self.owner.addplusamount < 3 && new  AddPlus(self.owner);
	            //让自己的这个文件名加入父亲的数组中
	            self.owner.picnames.push(data.result.picname);

	            self.$dom.addClass("cansort");

	            console.log(self.owner.picnames)
	        } 
    	});

		//这是一个猫腻，就是说当我们点击加号按钮的时候实际上触发的是input[file]那个文件
    	this.$fileaddbtn.click(function(){
        	self.$input.trigger("click");
   	 	});
	}
	//鼠标悬浮的事件把您大概
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