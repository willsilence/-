// 0.0.1
(function(){
	//全局数据是放大镜的位置：x、y、w、h
	var x = 0, y = 0 , w = 100, h = 100;
	//图片的宽度、高度
	var pic_w , pic_h;
	//图片原来的宽度和高度
	var origin_w , origin_h;

	window.cut_init = function (picname){
		var image = new Image();
		image.src = "/uploads/" + picname;
		
		image.onload = function(){
			$(".big_img_box").append($(image));
			//得到图片原来的宽度和高度
			origin_w = $(image).width();
			origin_h = $(image).height();

			 
			$(image).css({
				"max-width" : 600 ,
				"max-height" : 400
			});

			//图片的宽度、高度
			pic_w = $(image).width();
			pic_h = $(image).height();

			//反设盒子的宽度等于图片的宽度
			$(".big_img_box").css({
				"width" : pic_w,
				"height" : pic_h
			});

			//设置放大镜里面的图片的宽度高度
			$(".cut").css({
				"background-size" : pic_w + "px " + pic_h + "px"
			});

			////http://jqueryui.com/draggable/
			//实现拖拽
			$(".cut").draggable({
				"containment" : "parent" ,
				"drag" : function(event , ui){
					x = ui.position.left;
					y = ui.position.top;

					$(this).css({
						"background-position" : -x + "px " + -y + "px"
					});

					//调用函数
					setPreviews();
				}
			});

			//http://jqueryui.com/resizable/
			//实现可以更改尺寸
			$(".cut").resizable({
				//约数比例：
				aspectRatio: 1 / 1 ,
				//限制区域：
				containment: "parent" ,
				resize : function(event , ui){
					w = ui.size.width;
					h = ui.size.height;
					//调用函数
					setPreviews();
				}
			});

			setPreviews();
		}
	

		//设置一个函数，让三个预览框的图片的backgrund-position和backgorund-size随着放大镜的位置变化而变化
		function setPreviews(){
			$(".preview_img_box p").each(function(){
				//从自己的身上读取data-w属性的值
				var _w = $(this).data("w");
				var _h = $(this).data("h");

				//按比例去更改图片的背景尺寸、背景定位
				$(this).css({
					"background-size" : _w * (pic_w / w) + "px " + _h * (pic_h / h) + "px"  , 
					"background-position" : -_w * (x / w) + "px " + -_h * (y / h) + "px"
				});
			});
		}

		//裁切按钮
		$(".btngo").click(function(){
			var rate1 = origin_w / pic_w ;
			var rate2 = origin_h / pic_h ; 

			console.log(rate1 , rate2)
			$.get("/cut" , {
				picname : picname ,
				w : w * rate1,
				h : h * rate2,
				x : x * rate1,
				y : y * rate2
			} , function(){
				//现在是小电视中（iframe），所以我们希望上一层返回首页
				window.open("/" , "_top");
			});
		});
	}
})();