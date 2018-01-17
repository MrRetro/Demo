var imgUrl;
window.addEventListener("dragenter", function(event) {
	event.preventDefault()
}, false)
window.addEventListener("dragover", function(event) {
	event.preventDefault()
}, false)
window.addEventListener("drop", function(event) {
	var reader = new FileReader()
	reader.onload = function(e) {
		document.getElementById('div').innerHTML = "<img src='" + e.target.result + "' alt='img' />";
		imgUrl = e.target.result
		showWater()
	};
	reader.readAsDataURL(event.dataTransfer.files[0])
	event.preventDefault()
}, false)

canvas = document.getElementById('canvas')
input = document.getElementById('waterTxt')
ctx = canvas.getContext('2d')
image = new Image()

//水印
watermarkCanvas = document.getElementById('watermark-canvas')
watermarkCtx = watermarkCanvas.getContext('2d')

function showWater(){
	if(imgUrl){
	
		image.src = imgUrl
	
		image.onload = function() {
	
			canvas.width = image.width
			canvas.height = image.height
	
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
	
			//水印绘画
			watermarkCanvas.width = input.offsetWidth
			watermarkCanvas.height = input.offsetHeight
			console.log(watermarkCanvas.width)
			
			watermarkCtx.font = 'bold 18px Arial'
			watermarkCtx.fillStyle = 'rgba( 255 , 0 , 0 , 0.5 )'
			watermarkCtx.textBaseline = 'middle'
			watermarkCtx.fillText(input.innerHTML, 8,8)
			ctx.translate(watermarkCanvas.width/2,watermarkCanvas.height/2)//将绘图原点移到画布中点
            ctx.rotate(-(Math.PI/180)*5)//旋转角度
            ctx.translate(-watermarkCanvas.width/2,-watermarkCanvas.height/2)//将画布原点移动
	
			document.getElementById('result').style.display='block'
			ctx.drawImage(watermarkCanvas, canvas.width/2-watermarkCanvas.width/2,canvas.height/2-watermarkCanvas.height/2,watermarkCanvas.width,watermarkCanvas.height)
	
		}
	
	}
}