$(function(){
	//头部大分类被选中
	$('.pay-head .right p.one.inventory span').on('click',function(){
		var thisName=$(this).html();
		if(thisName=='全部'){
			$('.inventory-nav').hide();
			$('.main-content.edit .main-table.inventory').addClass('widthFill');
			$('.main-content.edit .goodsBtns').addClass('widthFill');
		}else{
			$('.inventory-nav').show();
			$('.main-content.edit .main-table.inventory').removeClass('widthFill');
			$('.main-content.edit .goodsBtns').removeClass('widthFill');
		}
	});
	
	//多选
	$('.main-content.edit .goodsBtns .p-one .a-sels').on('click',function(){
		if($(this).hasClass('cur')){
			$('.cked').remove();
			$(this).removeClass('cur');
		}else{
			$(this).addClass('cur');
			$('.main-content .main-table.inventory table thead tr').append('<th class="cked">全选</th>');
			$('.main-content .main-table.inventory table tbody tr').append('<td class="cked"><input type="checkbox" /></td>');
		}
	});
	//全选
	$('.main-content').on('click','.main-table.inventory table th.cked',function(){
		if($(this).html()=='全选'){
			$('.main-content .main-table.inventory table tbody tr input').prop('checked',true);
			$(this).html('不选');
		}else{
			$('.main-content .main-table.inventory table tbody tr input').prop('checked',false);
			$(this).html('全选');
		}
	})
	//条码/拼音码/编号搜索
	$('body').on('focus','.main-content.edit .goodsBtns .p-one.input input',function(){
			$(document).on('keyup',function(){
			if(event.keyCode == 13){ 
			 	alert($('.main-content.edit .goodsBtns .p-one.input input').val());
			}  
		});
	});
	
})
