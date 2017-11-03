/* 
 * drag 1.0
 * date 2016-04-14
 * 拖动滑块
 */
(function($) {
	$.fn.drag = function(options) {
		var x, drag = this,
			isMove = false,
			defaults = {};
		var options = $.extend(defaults, options);
		//添加背景，文字，滑块
		var html = '<div class="drag_bg"></div>' +
			'<div class="drag_text" onselectstart="return false;" unselectable="on">向右滑动登录>>></div>' +
			'<div id="picture" class="handler handler_bg"></div>';
		this.append(html);
		var handler = drag.find('.handler');
		var drag_bg = drag.find('.drag_bg');
		var text = drag.find('.drag_text');
		var maxWidth = drag.width() - handler.width(); //能滑动的最大间距
		//鼠标按下时候的x轴的位置
		handler.mousedown(function(e) {
			isMove = true;
			x = e.pageX - parseInt(handler.css('left'), 10);
		});
		//鼠标指针在上下文移动时，移动距离大于0小于最大间距，滑块x轴位置等于鼠标移动距离
		$(document).mousemove(function(e) {
			var _x = e.pageX - x;
			if (isMove) {
				if (_x > 0 && _x <= maxWidth) {
					handler.css({
						'left': _x
					});
					drag_bg.css({
						'width': _x+11
					});
				} else if (_x > maxWidth) { //鼠标指针移动距离达到最大时清空事件
					dragOk();
				}
			}
		}).mouseup(function(e) {
			isMove = false;
			var _x = e.pageX - x;
			if (true) { //if (_x < maxWidth) 鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
				handler.css({
					'left': 0
				});
				drag_bg.css({
					'width': 0
				});
				$('#picture').addClass('animated shake');
				setTimeout(function(){$('#picture').removeClass('animated shake');},800)
			}
		});
		//手机拖动
			  //获取元素
			  var picture=document.getElementById("picture");
			  //添加触屏开始事件
			  picture.addEventListener("touchstart",function(e){
			  	isMove = true;
			  	var touch=e.touches[0];
				x =touch.pageX - parseInt(handler.css('left'), 10);
			  },false);
			  	
			    //添加触屏移动事件
			    document.addEventListener("touchmove",function(e){
			    	var touch=e.touches[0];
			    	var _x;
			      	_x= touch.pageX - x;
					if (isMove) {
						if (_x > 0 && _x <= maxWidth) {
							handler.css({
								'left': _x
							});
							drag_bg.css({
								'width': _x+11
							});
						} else if (_x > maxWidth) { //鼠标指针移动距离达到最大时清空事件
							dragOk();
						}
					}
			    },false);
			    document.addEventListener("touchend",function(e){
			        isMove = false;
					if (true) { //if (_x < maxWidth) 鼠标松开时，如果没有达到最大距离位置，滑块就返回初始位置
						handler.css({
							'left': 0
						});
						drag_bg.css({
							'width': 0
						});
						$('#picture').addClass('animated shake');
						setTimeout(function(){$('#picture').removeClass('animated shake');},800)
					}
			    },false);
		//清空事件
		function dragOk() {
			//验证 账号 密码 验证码
			if ($('.tbody_box .contentBox .content_right .top p').eq(0).children('input').val() == "") {
				alert('用户名不能为空！');
				$('.tbody_box .contentBox .content_right .top p').eq(0).children('input').focus();
				initCicle();
			} else if ($('.tbody_box .contentBox .content_right .top p').eq(1).children('input').val() == "") {
				alert('密码不能为空！');
				$('.tbody_box .contentBox .content_right .top p').eq(1).children('input').focus();
				initCicle();
			} else if ($('.tbody_box .contentBox .content_right .top p').eq(2).children('input').val() == "") {
				alert('验证码不能为空！');
				$('.tbody_box .contentBox .content_right .top p').eq(2).children('input').focus();
				initCicle();
			} else {
				handler.removeClass('handler_bg').addClass('handler_ok_bg').html('<span class="gopng_rightOk_outer"><span class="gopng_rightOk"></span></span>');
				$('.drag_text').removeClass('in').addClass('in');
				text.text('登录成功');
				location.href="index.html";
				drag.css({
					'color': '#fff'
				});
				handler.unbind('mousedown');
				$(document).unbind('mousemove');
				$(document).unbind('mouseup');
			}
		}
		//鼠标滑动块初始化
		function initCicle() {
			handler.css({
				'left': 0
			});
			drag_bg.css({
				'width': 0
			});
			isMove = false;
		}
	};
})(jQuery);
$('.drag').drag();
var index = 0;
$(function() {
//	//根据显示器分辨率的高度设置body高度
//	var cHeight=screen.height-100;
//	if(cHeight<800){
//		cHeight=800;
//	}
//	$('body,html').css({'height':cHeight});  
//	//页尾贴浏览器底部
//	var offsetH=$('.support').offset().top;
//	var marTop=cHeight-offsetH+12;
//	$('.support').css({'margin-top':marTop});
	
	
	//自动轮播
	var start = setInterval(lunbo, 5000);
	//广告图初始状态
	$('.tbody_box .contentBox .content_left .content_left_t p').hide();
	$('.tbody_box .contentBox .content_left .content_left_t p').eq(0).show();
	//鼠标移到广告小横条样式变换 且大图切换
	$('.tbody_box .contentBox .content_left .content_left_t .lbList label').hover(function() {
		$('.tbody_box .contentBox .content_left .content_left_t .lbList label').removeClass('active');
		$(this).addClass('active');
		index = $(this).index();
		$('.tbody_box .contentBox .content_left .content_left_t p').fadeOut();
		$('.tbody_box .contentBox .content_left .content_left_t p').eq(index).fadeIn();

		clearInterval(start);
	}, function() {
		start = setInterval(lunbo, 5000);
	});

	//当鼠标移到大图后禁止轮播 鼠标移开后继续轮播
	$('.tbody_box .contentBox .content_left .content_left_t p').hover(function() {
		clearInterval(start);
	}, function() {
		start = setInterval(lunbo, 5000);
	});
});
//轮播
function lunbo() {
	index = index + 1;
	var length = $('.tbody_box .contentBox .content_left .content_left_t .lbList label').length;
	if (index >= length) {
		index = 0;
	}
	$('.tbody_box .contentBox .content_left .content_left_t .lbList label').removeClass('active');
	$('.tbody_box .contentBox .content_left .content_left_t .lbList label').eq(index).addClass('active');
	$('.tbody_box .contentBox .content_left .content_left_t p').fadeOut();
	$('.tbody_box .contentBox .content_left .content_left_t p').eq(index).fadeIn();
}