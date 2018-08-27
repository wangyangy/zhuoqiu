(function(){
	var ns = Q.use("BallGame");
	var stage = ns.stage;
	ns.initEvent = function()
	{
		//初始化鼠标的位置,在屏幕的左上角
		var mouse = ns.mouse = {x:0,y:0};
		var balls = ns.Ball.balls;
		var stage = ns.stage;
		//击球的力度,初始化为1最小
		ns.power = 1;
		//每次增加的力度
		ns.powerV = .4;
		//鼠标是否按下
		ns.isDown = false;
		//定义onmousemove事件监听函数(回调函数),时时获得鼠标的坐标
		window.onmousemove = function(e)
		{
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		};
		//鼠标点击的事件监听函数
		window.onmousedown = function(e){
			ns.isDown = true;
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		}
		//鼠标点击抬起的事件监听函数
		window.onmouseup = function(e){
			//满足条件就击球
            if(ns.isDown && ns.canShot){
				shoot(mouse.x, mouse.y);
				//恢复false设置
				ns.canShot = false;
			}
			//恢复false设置,鼠标没有按下
			ns.isDown = false;	 
		}
		
		//ontouchstart当手指触摸屏幕时触发的事件(给手机应用的??)
		stage.container.ontouchstart = function(e)
		{
			//阻止浏览器的默认行为
			e.preventDefault();
            ns.isDown = true;
		};
		
		//ontouchmove当手指在屏幕上滑动时连续的触发,判断浏览器是否支持滑屏操作
		stage.container.ontouchmove = function(e)
		{
			e.preventDefault();
			mouse.x = e.touches[0].clientX;
			mouse.y = e.touches[0].clientY;
		};
		
		//当手指在屏幕上离开时触发(给手机应用的??)
		stage.container.ontouchend = function(e)
		{
			e.preventDefault();
            if(ns.isDown && ns.canShot){
				shoot(mouse.x, mouse.y);
				ns.canShot = false;
			}

			if(ns.isDown && !ns.whiteBall.isDown)
			{
				ns.whiteBall.isDown = true;
			}

			ns.isDown = false;
		};		
	}

	//击球的函数,参数是鼠标的坐标
	function shoot(mouseX, mouseY){
		//当击球开始后改变Stage的更新函数中的ns.loop的指向,这时候监听的是各个球的移动
		ns.loop = ns.Ball.update;
		//首先获得白球
		var ball = ns.Ball.balls[0];
		var vx = mouseX - ball.loc.x;
		var vy = mouseY - ball.loc.y;
		//定义击球力度向量,
		ball.v = new Vector(vx, vy);
		//重新设置击球力度的大小,
		ball.v.setLength(false||ns.power);
		//重新赋值击球的力度等值
		ns.power = 1;
		ns.powerV = .4;
		//本次击球的进洞的球的类型,每次都会更新的
		ns.Ball.type = [];
		//球杆此时设置不可见
		ns.cue.visible = false;
		//击球线设置不可见
		ns.line.visible = false;
		//击球点设置不可见
		ns.point.visible = false;	
	}



})();