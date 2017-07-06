var WINDOW_WIDTH=1024;//屏幕宽度
var WINDOW_HEIGHT=768;//屏幕高度
var RADIUS=8;//小球半径
var MARGIN_TOP=60;//小球上边距
var MAEGIN_LEFT=30;//小球左边距

const endTime=new Date();
endTime.setTime(endTime.getTime()+3600*1000);
var curShowTimeSeconds=0;

var balls=[];
const colors=["#33B5E5","#0099CC","AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload=function(){
	//屏幕自适应
	WINDOW_WIDTH=document.body.clientWidth;
	WINDOW_HEIGHT=document.body.clientHeight;
	
	MAEGIN_LEFT=Math.round(WINDOW_WIDTH/10);
	RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
	MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);
	
	
	var canvas=document.getElementById('canvas');
	var context=canvas.getContext("2d");
	
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;
	
	curShowTimeSeconds=setCurrentShowTimeSeconds();
	
	setInterval(function(){
		render(context);
		update();
	},50);
}

//当前倒计时的毫秒数
function setCurrentShowTimeSeconds(){
	var curTime=new Date();
	var ret=endTime.getTime()-curTime.getTime();
	ret=Math.round(ret/1000);
	
	return ret>=0?ret:0;
}

//时间变化，小球变化
function update(){
	var nextShowTimeSeconds=setCurrentShowTimeSeconds();
	var nextHours=parseInt(nextShowTimeSeconds/3600);
	var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
	var nextSeconds=nextShowTimeSeconds%60;
	
	var curHours=parseInt(curShowTimeSeconds/3600);
	var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
	var curSeconds=curShowTimeSeconds%60;
	
	//判断秒数是否改变
	if(nextSeconds!=curSeconds){
		//判断小时的十位数是否发生改变
		if(parseInt(curHours/10)!=parseInt(nextHours/10)){
			addBalls(MAEGIN_LEFT+0,MARGIN_TOP,parseInt(curHours/10));
		}
		//判断小时的个位数是否发生改变
		if(parseInt(curHours%10)!=parseInt(nextHours%10)){
			addBalls(MAEGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(curHours%10));
		}
		//判断分钟的十位数是否发生改变
		if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){
			addBalls(MAEGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes/10));
		}
		//判断分钟的个位数是否发生改变
		if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){
			addBalls(MAEGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(curMinutes%10));
		}
		//判断秒钟的十位数是否发生改变
		if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){
			addBalls(MAEGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds/10));
		}
		//判断秒钟的个位数是否发生改变
		if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){
			addBalls(MAEGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(curSeconds%10));
		}
		
		curShowTimeSeconds=nextShowTimeSeconds;
	}
	
	updateBalls();
	
}

//新增的所有小球 更新操作
function updateBalls(){
	for(var i=0;i<balls.length;i++){
		balls[i].x+=balls[i].vx;//小球x轴坐标=原始x坐标+初速度
		balls[i].y+=balls[i].vy;//小球y轴坐标=原始y坐标+末速度
		balls[i].vy+=balls[i].g;//末速度=末速度+重力加速度
		
		if(balls[i].y>=WINDOW_HEIGHT-RADIUS){//小球y轴与画面减去小球半径后的高度 比较
			balls[i].y=WINDOW_HEIGHT-RADIUS;//小球贴地上
			balls[i].vy=-balls[i].vy*0.75;//末速度=末速度*摩察系数
		}
		
	}
	
	//移除滚动出画面的小球
	var cnt=0;//存放要保留的小球
	for(var i=0;i<balls.length;i++){
		if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH){
			balls[cnt++]=balls[i];
		}
	}
	while(balls.length>Math.min(300,cnt)){//判断小球数量是否小于在画面内的数量
		balls.pop();//减去最后一个小球
	}
}

//添加彩色运动新小球
function addBalls(x,y,num){
	
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				var aBall={
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
					y:y+i*2*(RADIUS+1)+(RADIUS+1),
					g:1.5+Math.random(),
					vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
					vy:-5,
					color:colors[Math.floor(Math.random()*colors.length)]
				};
				
				balls.push(aBall);
				
			}
		}
	}
	
}

function render(cxt){
	
	//清除画板
	cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	
	var hours=parseInt(curShowTimeSeconds/3600);
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds%60;
	
	//绘制时间
	renderDigit(MAEGIN_LEFT,MARGIN_TOP,parseInt(hours/10),cxt);
	renderDigit(MAEGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(hours%10),cxt);
	renderDigit(MAEGIN_LEFT+30*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MAEGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(minutes/10),cxt);
	renderDigit(MAEGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(minutes%10),cxt);
	renderDigit(MAEGIN_LEFT+69*(RADIUS+1),MARGIN_TOP,10,cxt);
	renderDigit(MAEGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(seconds/10),cxt);
	renderDigit(MAEGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(seconds%10),cxt);
	
	//绘制彩色小球
	for(var i=0;i<balls.length;i++){
		cxt.fillStyle=balls[i].color;
		
		cxt.beginPath();
		cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
		cxt.closePath();
		
		cxt.fill();
	}
}
function renderDigit(x,y,num,cxt){
	cxt.fillStyle="rgb(0,102,153)";
	
	for(var i=0;i<digit[num].length;i++){
		for(var j=0;j<digit[num][i].length;j++){
			if(digit[num][i][j]==1){
				cxt.beginPath();
				cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
				cxt.closePath();
				
				cxt.fill();
			}
		}
	}
}
