var dom=document.getElementById('clock')
var ctx=dom.getContext('2d')
var width=ctx.canvas.width
var height=ctx.canvas.height
var r=width/2
var rem=width/200

//画时钟背景
function drawBackground(){
	//保存状态
	ctx.save()
	//圆心
	ctx.translate(r,r)
	//定义路径开始
	ctx.beginPath()
	
	//白色实心圆
	ctx.save()
	ctx.fillStyle='#fff'
	ctx.lineWidth=10*rem
	ctx.arc(0,0,r-ctx.lineWidth/2,0,2*Math.PI,false)
	ctx.fill()
	ctx.restore()
	
	//圆
	ctx.lineWidth=10*rem
	ctx.arc(0,0,r-ctx.lineWidth/2,0,2*Math.PI,false)
	ctx.stroke()
	
	//小时数
	var hourNumbers=[3,4,5,6,7,8,9,10,11,12,1,2]
	ctx.font=18*rem +'px Arial'
	//水平居中
	ctx.textAlign='center'
	ctx.textBaseline='middle'
	hourNumbers.forEach(function(number,i){
		//每个小时的弧度
		var rad=2*Math.PI/12*i
		//每个小时的x坐标
		var x=Math.cos(rad)*(r-30*rem)
		//每个小时的y坐标
		var y=Math.sin(rad)*(r-30*rem)
		//坐标点填写小时数
		ctx.fillText(number,x,y)
	})
	
	//60个点
	for(var i=0;i<60;i++){
		//每点的弧度
		var rad=2*Math.PI/60*i
		//每点的x坐标
		var x=Math.cos(rad)*(r-18*rem)
		//每点的y坐标
		var y=Math.sin(rad)*(r-18*rem)
		ctx.beginPath()
		if(i % 5 === 0){
			ctx.fillStyle='#000'
			ctx.arc(x,y,2*rem,0,2*Math.PI,false)
		}else{
			ctx.fillStyle='#ccc'
			ctx.arc(x,y,2*rem,0,2*Math.PI,false)
		}
		ctx.fill()
	}
	
}

//时针
function drawHour(hour,minute){
	//保存状态
	ctx.save()
	ctx.beginPath()
	//每小时的弧度
	var rad=2*Math.PI/12*hour
	//分针所引起时针弧度的变化
	var mrad=2*Math.PI/12/60*minute
	//旋转的弧度
	ctx.rotate(rad+mrad)
	//线宽
	ctx.lineWidth=6*rem
	//给线两端加弧度
	ctx.lineCap='round'
	//画直线 从0，10点开始--让时帧向外突出一点点
	ctx.moveTo(0,10*rem)
	ctx.lineTo(0,-r/2)
	ctx.stroke()
	//还原状态
	ctx.restore()
}

//分针
function drawMinute(minute){
	//保存状态
	ctx.save()
	ctx.beginPath()
	//每小时的弧度
	var rad=2*Math.PI/60*minute
	ctx.rotate(rad)
	//线宽
	ctx.lineWidth=3*rem
	//给线两端加弧度
	ctx.lineCap='round'
	//画直线 从0，10点开始--让时帧向外突出一点点
	ctx.moveTo(0,10*rem)
	ctx.lineTo(0,-r+30*rem)
	ctx.stroke()
	//还原状态
	ctx.restore()
}

//秒针
function drawSecond(second){
	//保存状态
	ctx.save()
	ctx.beginPath()
	ctx.fillStyle='red'
	//每小时的弧度
	var rad=2*Math.PI/60*second
	ctx.rotate(rad)
	//线宽
	ctx.lineWidth=6*rem
	//给线两端加弧度
	ctx.lineCap='round'
	//画直线 从0，10点开始--让时帧向外突出一点点
	ctx.moveTo(-2*rem,20*rem)
	ctx.lineTo(0,20*rem)
	ctx.lineTo(1,-r+18*rem)
	ctx.lineTo(-1,-r+18*rem)
	ctx.fill()
	//还原状态
	ctx.restore()
}

//中心圆点 固定
function drawDot(){
	ctx.beginPath()
	ctx.fillStyle='#fff'
	ctx.arc(0,0,3*rem,0,2*Math.PI,false)
	ctx.fill()
}


//开始画
function draw(){
	ctx.clearRect(0,0,width,height)
	var now=new Date()
	var hour=now.getHours()
	var minute=now.getMinutes()
	var second=now.getSeconds()
	drawBackground()
	drawHour(hour,minute)
	drawMinute(minute)
	drawSecond(second)
	drawDot()
	ctx.restore()
}

draw()
setInterval(draw,1000)


































