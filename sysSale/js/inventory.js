$(function(){
	//分类列表选项被选中
	$('.inventory-nav .txt').on('click',function(){
		$('.inventory-nav .txt').removeClass('active');
		$(this).addClass('active');
	});
	//头部大分类被选中
	$('.pay-head .right p.one.inventory span').on('click',function(){
		$('.pay-head .right p.one.inventory span').removeClass('active');
		$(this).addClass('active');
	});
	//弹框确认
	$('.showDialog .p-btns a').on('click',function(){
		$('.showDialog').hide();
	});
})
