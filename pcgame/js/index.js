$(function() {
	//换肤
	$('.header .top .tp_l .tp_name.tp_cash .tp_other>p>label').on('click',function(){
		var color=$(this).attr('rel');
//		var classNameList='';
//		$('.purple .header .top .tp_l .tp_name .tp_other.skin>p').each(function(){
//			classNameList+=$(this).children('label').attr('rel')+" ";
//		})
//		$('body').removeClass(classNameList).addClass(color);
		$('body').removeClass('gold');
		$('body').removeClass('purple');
		$('body').removeClass('green');
		$('body').addClass(color)
	})
	
	//导航动画
	var index, _left;
	//动画初始化
	index = $('.header_box .nav_box .nav .nav_r ul .active').index();
	if(index == -1) {
		$('.header_box .nav_box .nav .nav_r .nav_move').hide();
	} else {
		$('.header_box .nav_box .nav .nav_r .nav_move').show();
	}
	_left = 124 * index + 12;
	$('.header_box .nav_box .nav .nav_r .nav_move').stop().animate({
		'left': _left
	}, 300);
	$('.header_box .nav_box .nav .nav_r ul li').mouseover(function() {
		index = $(this).index();
		_left = 124 * index + 12;
		$('.header_box .nav_box .nav .nav_r .nav_move').stop().animate({
			'left': _left
		}, 300);
		if(index == -1) {
			$('.header_box .nav_box .nav .nav_r .nav_move').hide();
		} else {
			$('.header_box .nav_box .nav .nav_r .nav_move').show();
		}
	})
	$('.header_box .nav_box .nav .nav_r').mouseleave(function() {
		index = $('.header_box .nav_box .nav .nav_r ul .active').index();
		_left = 124 * index + 12;
		$('.header_box .nav_box .nav .nav_r .nav_move').stop().animate({
			'left': _left
		}, 300);
		if(index == -1) {
			$('.header_box .nav_box .nav .nav_r .nav_move').hide();
		} else {
			$('.header_box .nav_box .nav .nav_r .nav_move').show();
		}
	});
	//眼睛开眼 闭眼
	$(".header .top .tp_r p .eyes").click(function() {
		if($(this).hasClass('eyeClose')) {
			$(this).addClass('eyes');
			$(this).removeClass('eyeClose');
			$('.header .top .tp_r p .cash').show();
			$('.header .top .tp_r p .spwd').hide();
		} else {
			$(this).removeClass('eyes');
			$(this).addClass('eyeClose');
			$('.header .top .tp_r p .cash').hide();
			$('.header .top .tp_r p .spwd').show();
		}
	});

	//小飞机点击 收起 展开 2016-5-11修改
	$('.fly .flyBottom a', window.document.top).click(function() {
		if($(this).children('label').html() == '收起<i></i>') {
			$(this).children('label').html('展开<i style="background-position: 0 -14px;"></i>');
			$(this).parent().parent().children('.flyCenter').children('.dropList').slideUp();
			$('.fly').animate({
				'top': '145px'
			});
			//$(this).parent().parent().children('.flyBottom').css({'margin-top':'-2px'});
		} else {
			$(this).children('label').html('收起<i></i>');
			$(this).parent().parent().children('.flyCenter').children('.dropList').slideDown();

			var screeH = $(window).height();
			var flyH = $('.fly').height();
			var bottomH = screeH - flyH;
			//2016-5-13修改
			if(bottomH > 150) {
				$('.fly').animate({
					'top': bottomH - 150
				});
			} else {
				$('.fly').animate({
					'top': 0
				});
			}
		}
	});

	//二维码显示特效 2016-5-21
	$('.fly .flyCenter .dropList .tel,.fly .flyCenter .dropList .public,.fly .flyCenter .dropList .night').hover(function() {
		$(this).children('.p_ma2').stop().animate({
			'left': '-124px'
		})
	}, function() {
		$(this).children('.p_ma2').stop().animate({
			'left': '-154px'
		})
	});
});
//滚轮回滚顶部
function goTop() {
	$('body,html').animate({
		'scrollTop': 0
	});
}

//夜间模式滑块
//			滑块变动
(function($) {
	$.fn.drag = function(options) {
		var x, drag = this,
			isMove = false,
			defaults = {};
		var options = $.extend(defaults, options);
		//添加背景，文字，滑块
		var html = '<div class="drag_bg1"></div>' +
			'<div class="drag_text1" onselectstart="return false;" unselectable="on"></div>' +
			'<div id="picture1" class="handler1 handler_bg1"></div>';
		this.append(html);
		var handler = drag.find('.handler1');
		var drag_bg = drag.find('.drag_bg1');
		var text = drag.find('.drag_text1');
		var maxWidth = drag.width() - handler.width(); //能滑动的最大间距
		//鼠标按下时候的x轴的位置
		handler.mousedown(function(e) {
			isMove = true;
			x = e.pageX - parseInt(handler.css('left'), 10);
		});
		//鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
		$("#picture1").mousemove(function(e) {
			var _x = e.pageX - x;
			if(isMove) {
				if(_x > 0 && _x <= maxWidth) {
					handler.css({
						'left': _x
					});
					drag_bg.css({
						'width': _x + 11
					});
				};
				//夜间百分比-----^_^----------
				var val = _x / maxWidth;
				if(val > 0.8) {
					val = 0.8;
				}
				if(val <= 0.01) {
					val = 0
				}

				$('.cover').css({
					"outline": "5000px solid rgba(0,0,0," + val + ""
				});
			}
		}).mouseup(function(e) {
			isMove = false;
		});
		//手机拖动
		//获取元素
		var picture = document.getElementById("picture1");
		//添加触屏开始事件
		// 		picture.addEventListener("touchstart", function(e) {
		// 			isMove = true;
		// 			var touch = e.touches[0];
		// 			x = touch.pageX - parseInt(handler.css('left'), 10);
		// 		}, false);
		//添加触屏移动事件
//		document.addEventListener("touchmove", function(e) {
//			var touch = e.touches[0];
//			var _x;
//			_x = touch.pageX - x;
//			if(isMove) {
//				if(_x > 0 && _x <= maxWidth) {
//					handler.css({
//						'left': _x
//					});
//					drag_bg.css({
//						'width': _x + 11
//					});
//					//夜间百分比-----^_^----------
//					var val = _x / maxWidth;
//					if(val > 0.8) {
//						val = 0.8;
//					}
//					if(val <= 0.01) {
//						val = 0
//					}
//					$('.cover').css({
//						"outline": "5000px solid rgba(0,0,0," + val + ""
//					});
//				}
//			}
//		}, false);
	};
})(jQuery);
$('.drag1').drag();

//点击换肤
$(function() {
	$('.fly .flyCenter .dropList .skin').click(function() {
		if($('body').hasClass('night')) {
			$('body').removeClass();
		} else {
			//活动当前的路径的文件名称
			var a = location.href;
			var b = a.split("/");
			var c = b.slice(b.length - 1, b.length).toString(String).split(".");
			var urlName = c.slice(0, 1); //当前路径的文件名
			if(urlName == "index") {
				$('body').addClass('night');
			} else {
				$('body').addClass('night ot');
			}
		}
	})
})

//可拖拽的联系客服
//判断状态值
var stateKefu=false;
var MoveDiv = function() {};

/**
 * @deprecated 移动div的方法
 * @param{id} id 要移动的层ID
 */
MoveDiv.Move = function(id) {
	var o = document.getElementById(id);
	var oo = $('#' + id);
	
	o.onmousedown = function() {
		stateKefu=true;
	}
	o.onmouseup=function(){
		stateKefu=false;
	}
	
	//当前元素转到父级元素
	o=o.parentElement
	oo=oo.parent()
	var divW = parseInt(oo.css('width'), 10) / -2.0;
	var divH = parseInt(oo.css('height'), 10) / -2.0;
	var screenW = $(window).width() + divW;
	var screenH = $(window).height() + divH;
	o.onselectstart = function() {
		return(false);
	};

	o.onmousedown = function(e) {
		$('.zhezhao').css({'width':'100%'})
		e = e || window.event;
		var x = e.layerX || e.offsetX;
		var y = e.layerY || e.offsetY;
		//处理ie11 偏移位置
		if ("ActiveXObject" in window){
			x = e.offsetX || e.layerX;
			y = e.offsetY || e.layerY;
		}
		x = x - document.body.scrollLeft;
		y = y - document.body.scrollTop;
		
		document.onmousemove = function(e) {
			if(stateKefu){
				e = e || window.event;
				var l = e.clientX - x;
				var r = e.clientY - y;
				if(l < divW) {
					o.style.left = divW + "px";
				} else if(l > screenW) {
					o.style.left = screenW + "px";
				} else {
					o.style.left = l + "px";
				}
				if(r < divH) {
					o.style.top = divH + "px";
				} else if(r > screenH) {
					o.style.top = screenH + "px";
				} else {
					o.style.top = r + "px";
				}
			}
		};

		document.onmouseup = function() {
			document.onmousemove = null;
			$('.zhezhao').css({'width':'0%'})
		};
	};
}
MoveDiv.Move('DragOnline');