(function(){
	
var ns = Q.use("BallGame");
//var ns = Q.use("BallGame.test");
//alert(BallGame);
var r = ns.r = 14;
//var width = window.innerWidth, height = window.innerHeight;
//区域的大小
var width = 960, height =600;
var fps = 60;
var params = ns.params = Quark.getUrlParams();
var mouseR = ns.mouseR = params.r||Q.supportTouch?90:0;
var stage = ns.stage;
var bitmaps = ns.bitmaps = {};
var images = ns.images = {};
//这个偏移量是桌子左上角相对于屏幕左上角的像素值
var offset = ns.offset = {x:55, y:70};
ns.canShot = true;
var timer;

var res = [
	{id:"table", src:"res/table.jpg"},
	{id:"cue", src:"res/cue.png"},
	{id:"light", src:"res/light.png"},
	{id:"ballRoad", src:"res/ballRoad.png"},
	{id:"player-txt", src:"res/player-txt.png"},
	{id:"ball1", src:"res/ball1.png"},
	{id:"ball9", src:"res/ball9.png"},
	{id:"shot-txt", src:"res/shot-txt.png"},
	{id:"num", src:"res/number.png"},
	{id:"win", src:"res/win.png"},
	{id:"lose", src:"res/lose.png"},
	{id:"loading", src:"res/loading.gif"},
	{id:"num1", src:"res/num.png"}
];

function loadImage(res){
	var loader = new Quark.ImageLoader();
	//complete表示:加载完成的时候再去调用后面回调函数,在alpha的源码里_loadNext里有complete
	//其中e为{type: "complete",target: this,images: this._images}
	loader.addEventListener("complete", function(e){
		//e.target就是当前ImageLoader对象,加载完成后要把它的监听都清除
		e.target.removeAllEventListeners();
		
		for(var i in e.images)
		{
			images[i] = e.images[i].image;
		}
		//所有资源加载完成后,会触发这个回调函数
		init();
	});

	loader.load(res);	
}

function createBitmaps(){
	for(var i in images)
	{
		//创建bitmap对象,第一个参数是要显示的image
		bitmaps[i] = new Quark.Bitmap({image:images[i], x:ns.offset.x, y:ns.offset.y, eventEnabled:false});
	}
}

window.onload = loadImage(res);

//init完成了所有初始化的任务,之后就是一直循环监听相应的事件
function init(){
	//将所有加载的图片资源包装成Bitmap类型
	createBitmaps();
	//初始化舞台
	initStage();
	//设置fps的显示
	initFps();
	//UI初始化
	ns.ui.init();
	//初始化球
	initBalls();
	//初始化事件
	ns.initEvent();
	//初始化球杆
	ns.initCue(); 
	//初始化击球线
	ns.initLine();
	//初始化击球后的提示文本
	ns.initShotTxt();
	//初始化得分
	ns.initScore();
	ns.initWin();
	ns.initLose();

	//没有击球的时候的循环监听,只是改变瞄准点和瞄准线,如果鼠标按下了还要改变球杆
	ns.loop = ns.shoot;
	//重写舞台的更新方法
	stage.update = function()
	{
		ns.frames++;
		ns.loop();
	}
	
}

ns.shoot = function()
{
	var ang = ns.line.rotation*Math.PI/180;
	//每次更新舞台时保证瞄准点一同更新位置,否则只会停在一个地方不动
	ns.point.x = ns.mouse.x - mouseR * Math.cos(ang);
	ns.point.y = ns.mouse.y - mouseR * Math.sin(ang);
	//检测鼠标是否按下
	if(ns.isDown)
	{
		ns.power+=ns.powerV;
		//达到最大值27(或小于最小值1),就开始变小(或变大)
		if(ns.power > 27 || ns.power < 1) 
		{
			ns.powerV *= -1;
		}
	}
}

function initStage(){
	//获取html页面上的div容器
	var container = Quark.getDOM("container");
	//创建dom上下文,{canvas:container}必须包含canvas属性,否则会报错,框架要求.canvas是渲染上下文所对应的画布
	var domContext = new Quark.DOMContext({canvas:container});
	//这里是动态创建canvas对象的地方,整个图形操作也是基于canvas的,创建的代码在alpha框架里
	canvas = Quark.createDOM("canvas", {width:width, height:height, style:{position:"absolute"}});
	//创建canvas的上下文
	canvasContext = new Quark.CanvasContext({canvas:canvas});
	//将动态创建的canvas对象添加到container中
	container.appendChild(canvas);
	//创建stage舞台对象
	stage = ns.stage = new Quark.Stage({container:container, width:width, height:height, context:domContext});
	//stage = ns.stage = new Quark.Stage({width:width, height:height, context:domContext});
	//创建定时器,fps是传入的帧数(一秒刷新多少次),1000/fps即为每隔多长时间执行一次
	//舞台默认是静止的，不会主动刷新，因此我们需要一个计时器timer来定时更新舞台，从而驱动整个游戏运行
	//舞台Stage上的物体的运动等变化，都是通过一个计时器Timer不断地调用Stage.step()方法来实现刷新的。
	timer = new Quark.Timer(1000/fps);
	//注册舞台事件，使舞台上的元素能接收交互事件
	timer.addListener(stage);
	//注册缓动动画事件
	timer.addListener(Q.Tween);
	//启动定时器
	timer.start();
	//将table添加到舞台
	stage.addChild(bitmaps["table"]);
	//初始化玩家
	ns.initPlayers();
}

function initBalls(){
	//创建所有的球一共16个球,包含白球
	ns.Ball.createBalls();
	//point是击球的时候那个虚拟圆球
	var point = ns.point = new Quark.Bitmap({image:ns.Ball.images[0], rect:[0, 0, ns.r*2, ns.r*2], regX:ns.r, regY:ns.r});
	stage.addChild(ns.point);
	//设置虚拟球的透明度为0.3,当值是1时为不透明
	point.alpha = .3;
	
	//这一步很重要,显示了桌子,和所有的球,只不过这时候的球是方块形状的还不是圆的
	stage.step();
	//下面的for循环把所有的球都由方形变成圆形
	for(var i = 0,len = ns.Ball.balls.length;i < len;i++){
		var ball = ns.Ball.balls[i];
		//borderRadius是css的一个简写属性,用于把矩形的四个角圆滑一下,这样设置后成为一个圆形
		ball.bitmap.drawable.domDrawable.style["borderRadius"] = r + "px";
		ball.light.drawable.domDrawable.style["borderRadius"] = r + "px";
	}
	//瞄准点也圆滑边角
	ns.point.drawable.domDrawable.style["borderRadius"] = ns.r + "px";

	stage.addChild(bitmaps["ballRoad"]);
	stage.addChild(bitmaps["cue"]);
	//bitmaps["ballRoad"]是进洞的球的那条路
	bitmaps["ballRoad"].y = offset.y - 60;
	bitmaps["ballRoad"].x = offset.x + 180;
	//ns.xx的值是703?是干什么的
	ns.xx = bitmaps["ballRoad"].x + bitmaps["ballRoad"].width - r - 6;
}

function initFps(){
	//获得fps的div
	ns.frames = 0, fpsContainer = Quark.getDOM("fps");
	//每个一秒更新一次当前fps
	setInterval(function()
	{
		fpsContainer.innerHTML = "FPS:" + ns.frames;
		ns.frames = 0;//每次更新后都重新清零计数
	}, 1000);
}

//这个函数没有调用的过程,没用
window.shoot = function(x, y){
	BallGame.whiteBall.v.reset(x, y)
	BallGame.loop = BallGame.Ball.update
}
//这个也没有调用,应该都是调试用的
window.print = function(){
	for(var i = 0;i < BallGame.Ball.balls.length;i++){
		var b = BallGame.Ball.balls[i]
		console.log(b.x - offset.x, b.y - offset.y, b.num)
	}

}

})();