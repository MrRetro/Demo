$(function() {
	$('#txt_num').keyboard();
	$('#txt_pwd').keyboard();

	//禁用虚拟键盘
	$('body').addClass('hidden');
	$('.keys').on('click', function() {
		if($('body').hasClass('hidden')) {
			$('body').removeClass('hidden');
		} else {
			$('body').addClass('hidden');
		}
	})

	//关闭窗体
	$('.login-head .three').on('click', function() {
		if(window.confirm('您确定要退出吗？')) {
			window.close();
		}
	})

	//登陆
	$('.login-content-txts-p .btn').on('click', function() {
		loging();
	})
	$(document).on('keyup', function() {
		if(event.keyCode == 13) {
			loging();
		}
	});
	
	
	//初始化焦点
	$('#txt_num').focus();
});

function loging() {
	if($('#txt_num').val() == "") {
		alert('用户名不能为空！')

		$('#txt_num').focus();
		return false;
	}
	if($('#txt_pwd').val() == "") {
		alert('密码不能为空！')

		$('#txt_pwd').focus();
		return false;
	}
	location.href='main.html'
	
	window.external.VerifyAccount($('#txt_num').val() + ',' + $('#txt_pwd').val());
}