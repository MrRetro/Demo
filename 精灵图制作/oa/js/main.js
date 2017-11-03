//全选全不选
$.fn.extend({
	allSel: function(a) {
		$(a.par).on("click", function() {
			if(!$(this).find(a.pick).hasClass(a.act)){
				$(this).find(a.pick).addClass(a.act);
			} else {
				$(this).find(a.pick).removeClass(a.act);
			}
			aa(true);
		});
		$(a.allsel).on("click", function() {
			aa(false);
		});
		function aa(b) {
			var i = 0; //计算.pick_box数量
			var o = 0; //计算.pick_box有active数量
			$(a.par+" "+a.pick).each(function() {
				i++;
				if($(this).hasClass(a.act)) {
					o++;
				}
			});
			if(b) {
				if(o == i) {
					$(a.allsel).find(a.pick).addClass(a.act);
				}else{
					$(a.allsel).find(a.pick).removeClass(a.act);
				}
			} else{
				if(o < i) {
					$(a.par).find(a.pick).addClass(a.act);
					$(a.allsel).find(a.pick).addClass(a.act);
				} else {
					$(a.par).find(a.pick).removeClass(a.act);
					$(a.allsel).find(a.pick).removeClass(a.act);
				}
			}
		}
	}
});

$(function() {
	//book creatTalk 选中打勾
	$.fn.allSel({
		allsel: ".allsel", //全选按钮类名
		par: ".onesel", //单个父级 也是触发事件
		pick: ".pick_box", // 添加active的类
		act: "active", //控制变量
	});
	//出生时间
	$(".birthDay").on("click", function() {
		$(this).find("input").focus();
	});
	//index nav
	$(".nav ul li").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	
	//book_group  nav
	$(".book_group ul.ul_nav_flex li").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	//taskmgr_cpm弹窗开关
	$(".add_blue").on("click",function(){
		$(".aside_cpm").toggle();
	});
	//taskmgr_cpm弹窗开关
	$(".ther").on("click",function(){
		$(".taskmgr_cpm").toggle();
	});
	//taskmgr_cpm弹窗开关
	$(".approve_wait ul li").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	//cpm taskmgr_cpm 选中
	$(".taskmgr_cpm .oneline").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
		var val=$(this).find(".c9").text();
		$(".ther").find("p").text(val);
	});
	//taskmgr_nav
	$(".mgr_nav ul li").on("click",function(){
		$(this).addClass("active").siblings().removeClass("active");
	});
	
	//msg set 按钮开关
	$(".main .oneline").on("click", function() {
		if(!$(this).find(".toggle_btn").hasClass("active")) {
			$(this).find(".toggle_btn").addClass("active");
		} else {
			$(this).find(".toggle_btn").removeClass("active");
		}
	});
	//msg detail 聊天功能切换
	$(".talk .add").on("click", function() {
		if(!$(this).parents(".talk").siblings(".msg_function").hasClass("active")) {
			$(".msg_function").addClass("active");
			$(this).parents(".talk_wrap").siblings().slideDown();
		} else {
			$(".msg_function").removeClass("active");
			$(this).parents(".talk_wrap").siblings().slideUp();
		}
	});

	//my msg_common 选中打勾
	$(".msg_common .oneline").on("click", function() {
		if(!$(this).find(".picked").hasClass("active")) {
			$(this).find(".picked").addClass("active");
		} else {
			$(this).find(".picked").removeClass("active");
		}
	});
	//my infoSet mySex_cpm 选中打勾
	$(".mySex_cpm .oneline").on("click", function() {
		$(this).siblings().find(".pick_box").removeClass("active");
		if(!$(this).find(".pick_box").hasClass("active")) {
			$(this).find(".pick_box").addClass("active");
		} else {
			$(this).find(".pick_box").removeClass("active");
		}
	});
	//login 清空input中的字符
	$(".login_main .delete").on("click", function() {
		$(this).siblings().find("input").val("");
	});
	//login 打开/关闭眼睛查看密码
	$(".login_main .eye").on("click", function() {
		if(!$(this).hasClass("active")) {
			$(this).addClass("active");
			$(this).siblings().find("input").attr("type", "text");
		} else {
			$(this).removeClass("active");
			$(this).siblings().find("input").attr("type", "password");
		}

	});

	//book mobile 通讯录右边字母
	letter();

	function letter() {
		$(".letter_fixed .right li").on("click", function() {
			$(this).addClass("active").siblings().removeClass("active");
		});
		var letter_ip = $(window).height();
		var letter_h = (letter_ip - 100) / 28;
		$(".letter_fixed .right li").css({
			width: letter_h + "px",
			height: letter_h + "px",
			lineHeight: letter_h - 2 + "px",
			fontsize: letter_h / 1.5 + "px",
			borderRadius: letter_h + "px"
		});

	}

	//login 登录页面大小
	$(".login_main").width($(window).width());
	$(".login_main").height($(window).height());

});