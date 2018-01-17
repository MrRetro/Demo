$(function(){
	//切换图片
	$('.retro-box.content-box .imgs .img-right .topImg .ul-top .li-top').on('click',function(){
		$('.retro-box.content-box .imgs .img-right .topImg .ul-top .li-top').removeClass('cur');
		$(this).addClass('cur');
	});
	$('.retro-box.nav-box .ul-navs .li-nav').on('click',function(){
		var index=$(this).index();
		switch(index){
			case 0:
				window.location.href='index.html';
				break;
			case 1:
				window.location.href='article.html';
				break;
			default:
				window.location.href='index.html';
				break;
		}
	});
	
	$(window).on('hashchange',function(){
		var status=window.location.hash;
		switch(status){
			case '#1':
				window.location.href='./catalog.html'
				break;
		}
	});
	
	//点击图片切换暂时-动画
	$('.retro-box.content-box .imgs .img-right .topImg .ul-top .li-top').on('click',function(){
		init(Math.random()*450+50,Math.random()*250+50);
		animate();
	})
})

var position;
var target;
var tween, tweenBack;

function init(x1,y1) {

	position = {
		x: 0,
		y: 0,
		rotation: 0
	};
	target = document.getElementById('target');
	tween = new TWEEN.Tween(position)
		.to({
			x: x1,
			y: y1,
			rotation: 359
		}, 2000)
		.delay(1000)
		.easing(TWEEN.Easing.Elastic.InOut)
		.onUpdate(update);

	tweenBack = new TWEEN.Tween(position)
		.to({
			x: 0,
			y: 0,
			rotation: 0
		}, 3000)
		.easing(TWEEN.Easing.Elastic.InOut)
		.onUpdate(update);

	tween.chain(tweenBack);
	tweenBack.chain(tween);

	tween.start();
}


function animate(time) {

	requestAnimationFrame(animate);

	TWEEN.update(time);

}

function update() {

	target.style.left = position.x + 'px';
	target.style.top = position.y + 'px';
	target.style.webkitTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';
	target.style.MozTransform = 'rotate(' + Math.floor(position.rotation) + 'deg)';

}