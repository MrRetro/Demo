$(function(){
	//次卡选中
	$('body').on('click','.memberOnce-content table tr',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$('.memberOnce-content table tr').removeClass('active');
			$(this).addClass('active');
		}
	});
})
