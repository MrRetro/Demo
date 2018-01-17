(function($){
	$.fn.extend({
		e_status:{times:false},
		e_click:function($e,func){
			$e.on('click',func);
		},
		e_move:function($e,func){
			$e.on('mouseenter',func);
		},
		e_leave:function($e,func){
			$e.on('mouseleave',func);
		},
		AlertSelf:function(){
	      	$(this).on('click',function(){alert($(this).html())});
	   	}
	});
})(jQuery)