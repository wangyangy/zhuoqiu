(function(){
	//获取BallGame对象,如果没有就创建一个空对象,有就直接获得
	var ns = Q.use("BallGame");
	
	ns.initCue = function()
	{
		var cue = ns.cue = ns.bitmaps["cue"];
		
		var mouse = ns.mouse;
		//调试一下试一试这个值的作用
		cue.regY = 15,cue.regX = 0;
		//更新球杆的位置
		cue.update = function(){
			//白球的位置
			this.x = ns.whiteBall.x;
			this.y = ns.whiteBall.y;
			var px = mouse.x - this.x;
			var py = mouse.y - this.y;
			var ang = Math.atan2(py,px);
			
			this.rotation = ang/Math.PI*180 + 180;
			//根据力道变更位置
			this.x -= (ns.power*3 + 10)* Math.cos(ang);
			this.y -= (ns.power*3 + 10) * Math.sin(ang);
		}
	}

	
	ns.initLine = function()
	{
		//这是击球瞄准的那条白线,初始化时宽1像素高3像素,rect的设置只要不超过范围就可以,regX可以不写
		//var line = ns.line = new Quark.Bitmap({image:ns.Ball.images[0], regX:0, width:1, height:3, rect:[16, 16, 1, 3]});
		var line = ns.line = new Quark.Bitmap({image:ns.Ball.images[0], width:1, height:3, rect:[50, 50, 1, 3]});
		//透明度
		line.alpha = .5;
		//line.alpha = 1;

		//覆盖DisplayObject对象的update方法,更新数据
		line.update = function()
		{
			//开始鼠标没有进入浏览器界面的时候,mouse.x=0,mouse.y=0,所以初始化是指向左上角
			var mouse = ns.mouse;
			//白球的位置坐标
			this.x = ns.whiteBall.x;
			this.y = ns.whiteBall.y;
			//鼠标的位置坐标
			var px = mouse.x - this.x;
			var py = mouse.y - this.y;
			//atan2的范围是-pi到pi,不包括-pi,通过反正切求角度
			var ang = Math.atan2(py,px);
			//将pi这样的角度转化为0-360度这样的角度
			this.rotation = ang/Math.PI*180;
			//这是根据距离求瞄准线的伸缩程度(初始长为1像素,求出距离直接相乘即可)
			//mouseR==0
			this.scaleX = Math.sqrt(px*px+py*py) - ns.mouseR;
		}
		ns.stage.addChild(ns.line);
		
	}
})();