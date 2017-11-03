$(function(){
	//取消分类
	$('.show-Dialog .btns a.cancel').on('click',function(){
		$('.show-Dialog').hide();
	});
	//显示分类
	$('.member-content .member-txts .member-txt .p-right.p-type img').on('click',function(){
		$('.show-Dialog').show();
	});
	//分类选中
	$('body').on('click','.show-Dialog .dialog-content .dialog-txt',function(){
		$('.show-Dialog .dialog-content .dialog-txt').removeClass('active');
		$(this).addClass('active');
	});
	//确认
	$('body').on('click','.member-content .member-txts .member-txt .p-btn a',function(){
		if($('#memberID').val()==''){
			alert('会员卡号不能为空！');
			$('#memberID').focus();
			return false;
		}
		if($('#memberPwd').val()!=$('#memberPwd1').val()){
			alert('两次密码输入不一致！');
			$('#memberPwd').focus();
			return false;
		}
		if($('#memberName').val()==''){
			alert('会员姓名不能为空！');
			$('#memberName').focus();
			return false;
		}
		if($('#memberTel').val()==''){
			alert('会员电话不能为空！');
			$('#memberTel').focus();
			return false;
		}
		var typeID=$('.member-content .member-txts .member-txt .p-right.p-type').attr('rel');
		if(!typeID){
			typeID=1;
		}
		var str=$('#memberID').val()+'|'+$('#memberPwd').val()+'|'+typeID+'|'+$('#memberName').val()+'|'+$('#memberTel').val()+'|'+$('#memberDated').val()+'|'+$('#memberBirth').val()+'|'+$('#memberAddress').val()+'|'+$('#memberRemark').val();
		alert(str);
	});
})
