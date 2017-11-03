$(function(){
	//订单数据被选中
	$('.order-content-left .order-nav-txt').on('click',function(){
		$('.order-content-left .order-nav-txt').removeClass('active');
		$(this).addClass('active');
	});
})
