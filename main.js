var yyy = document.getElementById('xxx');
var context = yyy.getContext('2d');
var lineWidth = 5

autoSetCanvasSize(yyy)

listenToUser(yyy)

var eraserEnabled = false
eraser.onclick = function() {
  eraserEnabled = true
  //actions.className = 'actions x'// actions actions.x 生效，actions.其他 无效
  eraser.classList.add('active') // 增加类
  pen.classList.remove('active') // 删除类
}
pen.onclick = function(){
  eraserEnabled = false
  //actions.className = 'actions'
  eraser.classList.remove('active')
  pen.classList.add('active')
}

red.onclick = function(){
  context.fillStyle = 'red'
  context.strokeStyle = 'red'
  red.classList.add('active')
  green.classList.remove('active')
  blue.classList.remove('active')
}
green.onclick = function(){
  context.fillStyle = 'green'
  context.strokeStyle = 'green'
  green.classList.add('active')
  red.classList.remove('active')
  blue.classList.remove('active')
}
blue.onclick = function(){
  context.fillStyle = 'blue'
  context.strokeStyle = 'blue'
  blue.classList.add('active')
  green.classList.remove('active')
  red.classList.remove('active')
}

thin.onclick = function(){
  lineWidth = 5
}
thick.onclick = function(){
  lineWidth = 10
}

clear.onclick = function(){
  context.clearRect(0, 0, yyy.width, yyy.height)
}
download.onclick = function(){ // 下载
  var url = yyy.toDataURL("image/png")
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = '我的画儿'
  a.target = '_blank'
  a.click()
}
/******/
function autoSetCanvasSize(canvas) { //自动设置画布尺寸
  setCanvasSize()

  window.onresize = function() {
    setCanvasSize()
  }

  function setCanvasSize() { //设置画布尺寸
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight

    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}

function drawCircle(x, y, radius) { //画圆//如果不画圆，变粗后看线是一段一段的，圆半径是线宽的一半
   context.beginPath()
   context.fillStyle = lineWidth // 这个优先级更高，换不了色
   context.arc(x, y, radius, 0, Math.PI * 2);
   context.fill()
}

function drawLine(x1, y1, x2, y2) { //画线
  context.beginPath()
  // context.strokeStyle = 'black' // 这个优先级更高，换不了色
  context.moveTo(x1, y1) // 起点
  context.lineWidth = lineWidth
  context.lineTo(x2, y2) // 终点
  context.stroke()
  context.closePath()
}

function listenToUser(canvas) { //监听鼠标
  var using = false
  var lastPoint = {x: undefined,y: undefined}

  if(document.body.ontouchstart !== undefined){ // 特性检测
    // 触屏设备
    canvas.ontouchstart = function(aaa){
      console.log('开始摸我了')
      console.log(aaa)
      var x = aaa.touches[0].clientX
      var y = aaa.touches[0].clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      }
      else {
        lastPoint = {"x": x,"y": y}
      } 
    }
    canvas.ontouchmove = function(aaa){
      console.log('边摸变动')
      var x = aaa.touches[0].clientX
      var y = aaa.touches[0].clientY
      if(!using) return
      if(eraserEnabled){
      context.clearRect(x - 5, y - 5, 10, 10)
      }
      else {
        var newPoint = {"x": x,"y": y}
        drawCircle(x, y, lineWidth/2) //如果不画圆，变粗后看线是一段一段的，圆半径是线宽的一半
        drawLine(lastPoint.x, lastPoint.y, newPoint.x,newPoint.y)
        lastPoint = newPoint
      }
    }
    canvas.ontouchend = function(){
      console.log('摸完了')
      using = false
    }
  }else{//非触屏设备
    canvas.onmousedown = function(aaa) { //点击鼠标
      var x = aaa.clientX
      var y = aaa.clientY
      using = true
      if (eraserEnabled) {
        context.clearRect(x - 5, y - 5, 10, 10)
      }
      else {
        lastPoint = {"x": x,"y": y}
      } 
    }
    canvas.onmousemove = function(aaa) { //滑动鼠标
      var x = aaa.clientX
      var y = aaa.clientY
      if(!using) return
      if(eraserEnabled){
      context.clearRect(x - 5, y - 5, 10, 10)
      }
      else {
        var newPoint = {"x": x,"y": y}
        drawCircle(x, y, lineWidth/2)//如果不画圆，变粗后看线是一段一段的，圆半径是线宽的一半
        drawLine(lastPoint.x, lastPoint.y, newPoint.x,newPoint.y)
        lastPoint = newPoint
      }   
    }
    canvas.onmouseup = function(aaa) { //释放鼠标
      using = false
    }
  }
}
