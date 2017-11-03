$(function(){
	//是否启动
	$('.order-content-right .settings-table .txt .btn').on('click',function(){
		$(this).parent().children('a').removeClass('active');
		$(this).addClass('active');
	});
	//开机启动勾选
	$('.order-content-right .settings-table .txt .setStart').on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	//纸张数选择
	$('.order-content-right .settings-table .txt .sp-num-right a').on('click',function(){
		$(this).parent().children('a').removeClass('active');
		$(this).addClass('active');
	});
	//选择上传logo
	$('.order-content-right .settings-table .txt.smallLogo .a-sel').on('click',function(){
		$('#newFile').click();
	});
	//进货标签选择
	$('.order-content-right .settings-table .txt.mulsels .sel').on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	//订单设置选中
	$('.order-content-right .settings-table .txt .sp-yesStatus').on('click',function(){
		if($(this).hasClass('active')){
			$(this).removeClass('active');
		}else{
			$(this).addClass('active');
		}
	});
	//广告设置 播放等待时间
	$('.order-content-right .settings-table .txt .a-waittime').on('click',function(){
		$('.order-content-right .settings-table .txt .a-waittime').removeClass('active');
		$(this).addClass('active');
	});
	//广告设置 图片切换时间
	$('.order-content-right .settings-table .txt .a-imgtime').on('click',function(){
		$('.order-content-right .settings-table .txt .a-imgtime').removeClass('active');
		$(this).addClass('active');
	});
})

