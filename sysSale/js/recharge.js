$(function(){
	//开票被选中
	$('body').on('click','.recharge-content .sels .p-trick',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	//此卡选中
	$('body').on('click','.recharge-content .carTable .txt',function(){
		$('.recharge-content .carTable .txt').removeClass('active');
		$(this).addClass('active');
	});
	//支付方式选中
	$('body').on('click','.recharge-content .banks a',function(){
		$('.recharge-content .banks a').removeClass('active');
		$(this).addClass('active');
	});
	//选择导购员
	$('body').on('click','.recharge-content .sels .p-guide',function(){
		$('.dialogGuide').fadeIn();
	});
	//关闭导购员选择框
	$('body').on('click','.dialogGuide .title b.b-close,.dialogGuide .btns .a-cancel',function(){
		$('.dialogGuide').fadeOut();
	});
	//清空搜索框
	$('body').on('click','.dialogGuide .guideTable .search .closed i',function(){
		$('.dialogGuide .guideTable .search input').val('').focus();
	});
	//导购员选中
	$('body').on('click','.dialogGuide .guideTable .txt',function(){
		$('.dialogGuide .guideTable .txt').removeClass('active');
		$(this).addClass('active');
	});
	//充值金额选中
	$('body').on('focus','#money',function(){
		$('.rechargeCenter .regright .angle').animate({
			top:95
		});
		$('#money').select();
		
		$('.rechargeCenter .regLeft .seled').removeClass('seled');
		$('#money').parent().parent().addClass('seled');
	});
	//赠送金额选中
	$('body').on('focus','#outMoney',function(){
		$('.rechargeCenter .regright .angle').animate({
			top:308
		});
		$('#outMoney').select();
		
		$('.rechargeCenter .regLeft .seled').removeClass('seled');
		$('#outMoney').parent().parent().addClass('seled');
	});
	//数字点击
	$('body').on('click','.rechargeCenter .regright .matchs .p-one a',function(){
		var length=$('.rechargeCenter .regLeft .seled').length;
		if(length<1){
			alert('请点击要改的金额！');
			return;
		}
		var num=$(this).text();
		var vl=$('.rechargeCenter .regLeft .seled span input').val();
		if(num==''){
			$('.rechargeCenter .regLeft .seled span input').val('').focus();
			return;
		}
		if(vl=='0.00'){
			vl='';
		}
		vl+=num;
		$('.rechargeCenter .regLeft .seled span input').val(vl).focus();
	});
})
