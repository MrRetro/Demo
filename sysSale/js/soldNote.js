$(function(){
	//单据选中
	$('body').on('click','#memberNumber',function(){
		$(this).select();
	});
	//初始化状态
	$('.soldNote-content-bottom .content-left .nav-txt').eq(0).addClass('active');
	//左-订单选中
	$('.soldNote-content-bottom .content-left .nav-txt').on('click',function(){
		$('.soldNote-content-bottom .content-left .nav-txt').removeClass('active');
		$(this).addClass('active');
	});
	//右-订单选中
	$('.soldNote-content-bottom .content-right .content-right-table table tbody tr').on('click',function(){
		var num1=$(this).children('td:last-child').html();//未退货的的 数量
		var num=$('.soldNote-content-bottom .content-right .content-right-table table tr.active td .sp-num').html();//已退货的数量
		if($(this).hasClass('active')){
			$('.soldNote-content-bottom .content-right .content-right-table table tr.active td:last-child').html(num);
			$(this).removeClass('active');
		}else{
			$('.show-Dialog.saleNote .div-input input').val(num1);
			$('.show-Dialog.saleNote').attr('good_no',$(this).attr('rel'));
			$('.show-Dialog.saleNote').attr('val',num1);
			$('.show-Dialog.saleNote').fadeIn();
		}
	});
	
	//退货
	$('.soldNote-content-bottom').on('click','.content-right .content-right-btns a.a-backGoods',function(){
		var count=$('.soldNote-content-bottom .content-right .content-right-table table tbody tr.active').length;
		if(count<1){
			alert('您未选中退货商品！');
		}else if($('.soldNote-content-bottom .content-right .content-right-table table tbody tr.active .sp-backed .one').html()=='退货'){
			alert('此单已经退过处理，不能再退货了！')
		}else{
			//退单处理
			alert("退货啦！")
			
		}
	});
	//弹框取消
	$('.show-Dialog.saleNote .btns a.cancel').on('click',function(){
		$('.show-Dialog.saleNote .div-input input').val('');
		$('.show-Dialog.saleNote').fadeOut();
	});
	//弹框确认
	$('.show-Dialog.saleNote .btns a.ok').on('click',function(){
		var rel=$('.show-Dialog.saleNote').attr('rel');
		var val=$('.show-Dialog.saleNote').attr('val');
		
		alert(rel+","+val)
		$('.show-Dialog.saleNote').fadeOut();
	});
	
	//时间控件
	laydate({
	   elem: '#startTime'
	});
	laydate({
	   elem: '#endTime'
	});
})
