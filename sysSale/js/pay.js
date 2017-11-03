$(function(){
	var strHref = this.location.href;
	var ProjectCD = strHref.getQuery("money");
	if(ProjectCD>0){
		$('#all-count').val(ProjectCD);
	}
	
	//后退
	$('.pay-head .left').on('click',function(){
		window.location.href="main.html";
	})

	//选中金额文本框
	$('.pay-content-left .p-txt .one .txt-two').focus(function(){
		$(this).parent().parent().addClass('active');
		$(this).parent().parent().siblings().removeClass('active');
	})
	//现金 被选中
	$('body').on('focus','.pay-content-left .p-txt .one.group .txt-two',function(){
		$('.pay-content-left .p-txt .one.group').removeClass('cur');
		$(this).parent().addClass('cur');
	});
	
	//文本框获取焦点
	$('.pay-content-left .p-txt .one .img-three img').on('click',function(){
		var txt=$(this).parent().attr('for');
		$('#'+txt).focus();
	})
	
	//点击现金支付
	var cashes=[];
	$('body').on('click','.pay-content-left .p-txt .two',function(){
		var id=$(this).attr('id');
		//组合支付
		if($('.pay-content-left .p-ck .sp-pays').hasClass('active')){
			if($(this).hasClass('active')){
				$(this).removeClass('active');
				
				var n = cashes.indexOf(id);
				if(n!=-1)
				cashes.splice(n,1);
			}else{
				$(this).addClass('active');
				cashes.push(id);
			}
			if(cashes.length>2){
				var first=cashes[0];
				var n = cashes.indexOf(first);
				if(n!=-1)
				cashes.splice(n,1);
			}
			if(cashes.length<1){
				cashes=['cashMoney'];
			}
			$('.pay-content-left .p-cashes .one').removeClass('hidden').addClass('hidden').removeClass('showed');
			$('.pay-content-left .p-txt .two').removeClass('active');
			for(var k=0;k<cashes.length;k++){
				var idName=cashes[k];
				switch(idName){
					case "cashMoney":
					$('.pay-content-left .p-cashes .one').eq(0).removeClass('hidden').addClass('group').removeClass('showed').addClass('showed').children('.txt-two').focus();
					$('#cashMoney').addClass('active');
					break;
					case "Scard":
					$('.pay-content-left .p-cashes .one').eq(1).removeClass('hidden').addClass('group').removeClass('showed').addClass('showed').children('.txt-two').focus();
					$('#Scard').addClass('active');
					break;
					case "Ucard":
					$('.pay-content-left .p-cashes .one').eq(2).removeClass('hidden').addClass('group').removeClass('showed').addClass('showed').children('.txt-two').focus();
					$('#Ucard').addClass('active');
					break;
				}
			}
			if(cashes.length==1){
				$('.pay-content-left .p-cashes .one').removeClass('hidden').addClass('hidden').removeClass('group').removeClass('showed');
				$('.pay-content-left .p-txt .two').removeClass('active');
				var idName=cashes[0];
				switch(idName){
					case "cashMoney":
					$('.pay-content-left .p-cashes .one').eq(0).removeClass('hidden').removeClass('showed').addClass('showed').children('.txt-two').focus();
					$('#cashMoney').addClass('active');
					break;
					case "Scard":
					$('.pay-content-left .p-cashes .one').eq(1).removeClass('hidden').removeClass('showed').addClass('showed').children('.txt-two').focus();
					$('#Scard').addClass('active');
					break;
					case "Ucard":
					$('.pay-content-left .p-cashes .one').eq(2).removeClass('hidden').removeClass('showed').addClass('showed').children('.txt-two').focus();
					$('#Ucard').addClass('active');
					break;
				}
			}
		}else{
			$('.pay-content-left .p-cashes .one').removeClass('group').removeClass('showed');
			$('.pay-content-left .p-txt .two').removeClass('active');
			$(this).addClass('active');
			switch(id){
				case "cashMoney":
				$('.pay-content-left .p-cashes .one').eq(0).removeClass('hidden').removeClass('showed').addClass('showed').children('.txt-two').focus();
				$('.pay-content-left .p-cashes .one').eq(1).addClass('hidden');
				$('.pay-content-left .p-cashes .one').eq(2).addClass('hidden');
				break;
				case "Scard":
				$('.pay-content-left .p-cashes .one').eq(1).removeClass('hidden').removeClass('showed').addClass('showed').children('.txt-two').focus();
				$('.pay-content-left .p-cashes .one').eq(0).addClass('hidden');
				$('.pay-content-left .p-cashes .one').eq(2).addClass('hidden');
				break;
				case "Ucard":
				$('.pay-content-left .p-cashes .one').eq(2).removeClass('hidden').removeClass('showed').addClass('showed').children('.txt-two').focus();
				$('.pay-content-left .p-cashes .one').eq(0).addClass('hidden');
				$('.pay-content-left .p-cashes .one').eq(1).addClass('hidden');
				break;
			}
		}
	});
	
	//组合复选框选中
	$('.pay-content-left .p-ck .sp-pays').on('click',function(){
		var id=$('.pay-content-left .p-txt .two.active').attr('id');
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			cashes=[];
		}else{
			$(this).addClass('active');
			cashes.push(id);
		}
	})
	
	//点击数字
	$('.key-nums .nums-center a').on('click',function(){
		var num=$(this).text();
		var $inputNum=$('.pay-content-left .p-txt.active .txt-two');
		if(num==''){
			$inputNum.val(0);
			$('#all-back').val((parseFloat($('#all-cash').val())-parseFloat($('#all-count').val())).toFixed(2));
			return;
		}else if(num=='确认'){
			//需过滤错误
			if($('#all-back').val()>0){
				alert('付款成功,找客人'+$('#all-back').val()+'元');
				window.location.href="main.html";
			}else{
				alert('付款失败,余额还差'+$('#all-back').val()+'元!!!!!!!!!');
			}
			return;
		}else{
			if($(this).hasClass('active')){
				if($inputNum.val()==''){
					$inputNum.val(0);
				}
				$inputNum.val((parseFloat($inputNum.val())+parseFloat(num)).toFixed(2));
			}else{
				if($inputNum.val()=='0'){
					$inputNum.val('');
				}
				$inputNum.val($inputNum.val()+num);
			}
		}
		$('#all-back').val((parseFloat($('#all-cash').val())-parseFloat($('#all-count').val())).toFixed(2));
	})

});
//获取路径参数值
String.prototype.getQuery = function(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = this.substr(this.indexOf("\?") + 1).match(reg);
     if (r != null) return unescape(r[2]); return null;
}