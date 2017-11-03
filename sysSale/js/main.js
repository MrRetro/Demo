$(function(){
	power("1001,1002,1003");
//	$('#maName').keyboard();
//	$('#price').keyboard();
//	$('#tel').keyboard();
	
	//关闭窗体
	$('.clsDialog').on('click',function(){
		if(window.confirm('您确定要关闭吗？')){
			window.location.href="index.html";
		}
	})
	
	//提交查询
	$('#maName').on('click',function(){
		appendTr($(this));
	});
	$('#maName').on('keyup',function(){
		if(event.keyCode == 13){                        
		 	appendTr($(this));                 
		}  
	});
	
	//导航栏选中
	$('.main-nav-left p').on('click',function(){
		if($(this).hasClass('active')){
			$('.main-nav-left p').removeClass('active');
		}else{
			$('.main-nav-left p').removeClass('active');
			$(this).addClass('active');
		}
	})
	//皮肤选中
	$('.main-nav-right .two .skin .skin-img .otherSkin p').on('click',function(){
		if($(this).hasClass('active')){
			$('.main-nav-right .two .skin .skin-img .otherSkin p').removeClass('active');
		}else{
			$('.main-nav-right .two .skin .skin-img .otherSkin p').removeClass('active');
			$(this).addClass('active');
		}
		$('.main-body').css({'background-color':$(this).attr('color')});
		$('.border-color').css({'border-color':$(this).attr('color')});
	})
	//表格行选中
	$("body").on('click','.main-content table tbody tr',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$('.main-content table tbody tr').removeClass('active');
			$(this).addClass('active');
		}
	})
	//禁用虚拟键盘
	$('body').addClass('hidden');
	$('.keys').on('click',function(){
		if($('body').hasClass('hidden')){
			$('body').removeClass('hidden');
		}else{
			$('body').addClass('hidden');
		}
	})
	
	//空格收款
	$(document).on('keyup',function(){
		if(event.keyCode == 32){                        
		 	alert('收款，跳转页面');
		 	window.location.href='pay.html?money='+$('.sels-submit-right .sp-right').html().substr(1);
		}  
	});
	
	//搜索栏 商品被选中
	$('body').on('click','.search-content .search-table table tbody tr',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$('.search-content .search-table table tbody tr').removeClass('active');
			$(this).addClass('active');
		}
	})
	//关闭搜索弹框
	$('.search-dialog .title .right').on('click',function(){
		$('.search-dialog').hide();
	})
	
	//添加弹框 展开
	$('.addpro-dialog .pro-content .other-info .a-drop').on('click',function(){
		if($('.addpro-dialog .pro-content .other-info .a-drop').parent().hasClass('show')){
			$('.addpro-dialog .pro-content .other-info .a-drop').parent().removeClass('show');
			$('.addpro-dialog .pro-content .other-info .a-drop span').html('展开');
			$('.drop-other').slideUp();
		}else{
			$('.addpro-dialog .pro-content .other-info .a-drop').parent().addClass('show');
			$('.addpro-dialog .pro-content .other-info .a-drop span').html('收缩');
			$('.drop-other').slideDown();
		}
	})
	//关闭添加弹框
	$('.addpro-dialog .title .right').on('click',function(){
		$('.addpro-dialog').hide();
	})
	//数字小键盘 选中具体数字
	$('.num-dialog .nums a').on('click',function(){
		var nowVl=$('#numSearch').val();
		if($(this).attr('vl')=='-1'){
			nowVl=nowVl.substr(0,nowVl.length-1);
		}else{
			nowVl+=$(this).attr('vl');
		}
		$('#numSearch').val(nowVl);
	});
	//关闭数字键盘
	$('.num-dialog .title .right,.num-dialog .num-btns .cancel').on('click',function(){
		closeNumKeys();
	});
	//数字小键盘触发展示
	$('.sels-submit-left p.txt .sels-img,.sels-submit-center p.txt .sels-img').on('click',function(){
		$('.num-dialog').attr('cid',$(this).parent().children('input').attr('id'));
		showNumKeys();
	});
	//数字小键盘确认
	$('.num-dialog .num-btns .ok').on('click',function(){
		if($('#numSearch').val().length<=0){
			alert('商品关键字不能为空！');
			return false;
		}
		$('#'+$('.num-dialog').attr('cid')).val($('#numSearch').val());
		$('#numSearch').val('');
		closeNumKeys();
	});
	//数字键盘里面的数字板块隐藏
	$('.num-dialog .num-search .p-search .sp-img').on('click',function(){
		if($(this).hasClass('ot')){
			$(this).removeClass('ot');
			$('.num-dialog .nums').animate({
				height:'184px'
			});
		}else{
			$(this).addClass('ot');
			$('.num-dialog .nums').animate({
				height:'0px'
			});
		}
	});
	//随机生成条形码
	$('.addpro-dialog .pro-content .pro-info .left .a-three').on('click',function(){
		var d = new Date();
		$('#maNum').val(''+d.getFullYear()+d.getMonth()+d.getDay()+d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds())
	});
});
//数字小键盘展示
function showNumKeys(){
	$('.num-dialog-box').animate({
		marginTop:'0px'
	});
	$('.num-dialog').show();
}
//关闭数字小键盘
function closeNumKeys() {
    $('.num-dialog-box').animate({
        marginTop: '404px'
    },500);
    $('.num-dialog').animate({
        diplay: 'none'
    }, 1000);
}
//添加弹框显示
function showAdd(){
	$('.addpro-dialog').show();
}
//搜索弹框显示
function showSearch(){
	$('.search-dialog').show();
}

//追加表数据
function appendTr(target){
//	window.external.selName(target);
	var hdTxt='{"Table":[{"num1":"1001","num2":"1001","price":"50","youhui1":"0.3","youhui2":"0.2","youhui3":"0.5","youhui4":"0.7"},{"num1":"1002","num2":"1002","price":"100","youhui1":"0.8","youhui2":"0.9","youhui3":"0.8","youhui4":"0.9"},{"num1":"1003","num2":"1003","price":"130","youhui1":"0.6","youhui2":"0.7","youhui3":"0.5","youhui4":"0.7"},{"num1":"1004","num2":"1004","price":"160","youhui1":"0.8","youhui2":"0.8","youhui3":"0.9","youhui4":"0.7"},{"num1":"1005","num2":"1005","price":"199","youhui1":"0.9","youhui2":"0.9","youhui3":"0.9","youhui4":"0.9"}]}';//$('#hd_txts').html();
	var txt=JSON.parse(hdTxt);
	var txtVal=target.val();
	var num=-1;
	for(var i=0;i<txt.Table.length;i++){
		if(txt.Table[i]["num1"]==txtVal){
			num=i;
		}
	}
	var tr="<tr><td>"+txt.Table[num]["num1"]+"</td><td>"+txt.Table[num]["num2"]+"</td><td>"+txt.Table[num]["price"]+"</td><td>"+txt.Table[num]["youhui1"]+"</td><td>"+txt.Table[num]["youhui2"]+"</td><td>"+txt.Table[num]["youhui3"]+"</td><td>"+txt.Table[num]["youhui4"]+"</td></tr>"

	//$('body').html(tr)
	$('.main-content table tbody').append(tr);
	target.focus().val('');
	
	//总价跟着变
	$('.main-content .main-count .left span').html($('.main-content table tbody tr').length);
	var allCount=0.0;
	$('.main-content table tbody tr').each(function(){
		allCount+=$(this).children('td').eq(2).text()*$(this).children('td').eq(3).text();
	});
	allCount=allCount.toFixed(2)
	$('.sels-submit-right .sp-right').html("￥"+allCount);
	
//				$("#allCount").val(allCount);
}