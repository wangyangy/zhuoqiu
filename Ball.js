(function(){
	//获取BallGame对象,如果没有就创建一个空对象,有就直接获得
	var ns = Q.use("BallGame");
	var r = ns.r;  //14
	//做一个git的测试
	var lines = ns.lines; //获得桌子的边
	var Ball = ns.Ball = function(props){
		this.num = 0;
		this.v = new Vector()//Math.random()*10,Math.random()*10);
		
		this.rx = 0;
		this.ry = 0;
		
		this.constructor.superClass.constructor.call(this, props);
		//为什么要设置成为32,因为球的反光图片是32*32的所以要设置成反光图片的大小,把自己画的图片包裹在里面
		this.width = 32;
		this.height = 32;
		//球的中心的位置
		this.loc = new Vector(this.x, this.y);
		//rect是显示图像的位置和大小,相对图片自身来说的
		//理解regX=14 regY=14相当于内部注册对象自己的中心点(注册点)相对于自己的坐标的坐标值;x相当于是内部对象的中心相对于容器的坐标值
		//怎么理解注册点,球的注册点是球心14,14;而球杆的注册点是杆的击球位置,不再是杆的中心,regX=0,regY=15因为杆的图像是433*31的,而且干透的位置是x=0处
		this.bitmap = new Quark.Bitmap({image:images[this.num],regX:r,regY:r,x:16, y:16, rect:[0, 0, 2*r, 2*r], eventEnabled:false});
		//this.bitmap = new Quark.Bitmap({image:images[this.num],regX:20,regY:20,x:16, y:16, rect:[0, 0, 2*r, 2*r], eventEnabled:false});
		//为什么每次都要创建一个白球???????
		//这个球不是白球,而是给每一个球上亮光的,反光,因为light是图片大小和容器大小相同,所以regX=x;
		this.light = new Quark.Bitmap({image:ns.images["light"], regX:16, regY:16, x:16, y:16, eventEnabled:false});
		//this.light = new Quark.Bitmap({image:ns.images["light"], regX:16, regY:16, eventEnabled:false});
		
		this.init();
	}	
	
	
	var balls = Ball.balls = [];  //球 
	var images = Ball.images = []; 
	Ball.scale = .99;  //0.99
	//继承, Ball继承Quark.DisplayObjectContainer(展示对象的容器)
	//利用这个js框架,自定义的要显示的对象一般都要继承DisplayObjectContainer
	Quark.inherit(Ball, Quark.DisplayObjectContainer);

	Ball.prototype.init = function()
	{
		this.addChild(this.bitmap)
		this.addChild(this.light);
		//这句是用于调试的,是否显示反光的部分,很重要
		//this.light.visible = false
		//返回的是球的种类,四类,白球0,黑八8,小号1,大号-1
		this.type = this.num == 0?0:this.num < 8?1:this.num==8?8:-1;
	}
	//真正创建球的图片的函数,参数为颜色和数值
	function createImage(col, num)
	{	
		//动态创建canvas,大小是56*56像素
		var canvas = Q.createDOM('canvas',{width:4*r,height:4*r});
		var context = canvas.getContext('2d');
		//将笔触移动到指定的坐标x以及y上。
		context.moveTo(r, r);
		//设置图形的填充颜色。
		context.fillStyle = col;
		//绘制矩形,参数:矩形起始点的 x 轴坐标,y轴坐标,宽度,高度
		//生成一个大小为56*56的矩形
		context.fillRect(0, 0, 4*r, 4*r);

		if(num){
			context.fillStyle = "#eee";
			//球的数字大于8,大号
			if(num > 8 ){	
				//生成三个矩形,在原来的矩形的基础上(上边,中间,下边),因为大号的球是花色的
				context.fillRect(0, 0, 4*r, r/3);
				context.fillRect(0, 2*r-r/3, 4*r, r/3*2);
				context.fillRect(0, 4*r-r/3, 4*r, r/3);
				//在左上角和右下角画两个圆形
				context.arc(r + 2*r, r + 2*r, r/3*2, 0, Math.PI*2);
				context.fill();	
				//将颜色重新设置成白色用于写字
				context.fillStyle = col;
				context.textAlign = "center";
				context.textBaseline = "middle";
				context.font = r + "px/1 Consolas, tahoma, Srial, helvetica, sans-serif";
				//在右下角的圆中写字,后边会覆盖的
				context.fillText(num,3*r, 3*r);
			}
			context.fillStyle = "#eee";
			//新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
			context.beginPath();
			//arc(x, y, radius, startAngle, endAngle, anticlockwise)
			//画一个以（x,y）为圆心的以radius为半径的圆弧（圆），从startAngle开始到endAngle结束，
			//按照anticlockwise给定的方向（默认为顺时针）来生成。
			//在矩形的左上角和右下角生成两个圆
			context.arc(r, r, r/3*2, 0, Math.PI*2);
			context.arc(3*r, 3*r, r/3*2, 0, Math.PI*2);
			//通过填充路径的内容区域生成实心的图形。
			context.fill();	
			context.fillStyle = col;
			//设置文本对齐方式
			context.textAlign = "center";
			context.textBaseline = "middle";
			//字体
			context.font = r + "px/1 Consolas, tahoma, Srial, helvetica, sans-serif";
			//填充字体在生成的两个圆上填充,在给定的x,y处,num是要填充的字
			context.fillText(num,r, r);
			context.fillText(num,3*r, 3*r);
		}

		var url = canvas.toDataURL();
		return url;		
	}
	//创建球的图片				
	function createBallImages()
	{
		//第一个是白球的颜色,最后一个是黑八的颜色,中间的7个颜色是其余球的
		var colors = ["#ffffff", "#E1AE07", "#064771", "#D7141A", "#1E1D63", "#E9520B", "#0A5326", "#900910", "#000"];
		for(var i = 0;i < 9;i++){
			images[i] = new Image();
			images[i].src = createImage(colors[i], i);
		}
		for(i = 0;i < 7;i++){
			images[i+9] = new Image();
			images[i+9].src = createImage(colors[i+1], i+9);
		}
	}

	Ball.createBalls = function(){
		createBallImages();
		//a3=1.83205...
		var a3 = Math.sqrt(3)+.1;
		var ar = r;
		//设置球的初始位置坐标,一共16个球包含白球,ballxy[2],ballxy[3],是以这个球为相对的中心,是1号球
		//ballxy[0],ballxy[1]是白球的相对坐标.
		//前边的是y,后边的是x
		var ballxy = [
			0, -330, 0, 0, -ar,a3*ar,ar,a3*ar,-2*ar,2*a3*ar,0,2*a3*ar,2*ar,2*a3*ar,-3*ar,3*a3*ar,-ar,3*a3*ar,ar,3*a3*ar,3*ar,3*a3*ar,-4*ar,4*a3*ar,-2*ar,4*a3*ar,0,4*a3*ar,2*ar,4*a3*ar,4*ar,4*a3*ar
		];
        
		
		for(var i = 0;i < 16;i++){
			//因为桌子的宽度是438,所以Y要加上桌子的一半宽度219,同时又因为是以15个球组成的三角的第一个球
			//为'中心',所以600-330就是白球和第一个球之间的距离
			var ball = new Ball({num:i, regX:16, regY:16, x:600 + ballxy[2*i+1] + ns.offset.x,y:219+ballxy[2*i] + ns.offset.y});
			//var ball = new Ball({num:i, x:600 + ballxy[2*i+1] + ns.offset.x,y:219+ballxy[2*i] + ns.offset.y});
			//将创建的球添加到数组中
			Ball.balls[i] = ball;
			//将球添加到舞台
			ns.stage.addChild(ball);
		}
		//白球
		ns.whiteBall = ns.Ball.balls[0];
		//设置透明度
		ns.whiteBall.alpha = 1;
		//白球添加到舞台
		ns.stage.addChild(ns.whiteBall);
	};

	
	//球滚动的函数,包括移动和自转,要实现小球的滚动,只需要在精灵动画的基础上加上小球自传
	//Ball.prototype.update = Ball.prototype.move;重写了父类更新数据的方法
	Ball.prototype.move = function()
	{
		//当力度向量的长度小于0.01时就设置其为0,就停止了
		if(this.v.getLength() < .1)
		{

			this.v.x = 0;
			this.v.y = 0;
            return;
		}
        //向量相加,this.v是向前走的一小步
        this.loc.plus(this.v);
		//检测是否有碰撞弹跳
		this.bounce();
		//使得v减小Ball.scale=0.99
		this.v.scale(Ball.scale);
		//this.v.setLength(this.v.getLength()-.13);
		
		///////////////////////////////////////
		//球滚动的实现
		//移动后重新赋值
		this.x = this.loc.x;
		this.y = this.loc.y;
		//注释掉下面一句,球就没有滚动的效果了
		this.bitmap.setRect([this.rx, this.ry, 2*r, 2*r]);
		//this.bitmap.setRect([0, 0, 2*r, 2*r]);
		//沿着击球的方向旋转
		//注释掉后旋转只会朝着一个方向
		this.bitmap.rotation = this.v.getAngle() *180/Math.PI;
		//注释掉后也不会旋转,如果是+=就会倒着旋转
		this.rx -= this.v.getLength();
		
		//检测是否进洞
		this.checkHole();
	}

	Ball.prototype.update = Ball.prototype.move;

	Ball.prototype.checkHole = function()
	{
		//六个洞的中心坐标
		var hole = ns.holePoint;
		
		for(var i = 0;i < 6;i++)
		{
			var lx = this.x - hole[i][0] - ns.offset.x;
			var ly = this.y - hole[i][1] - ns.offset.y;
			//只有这种进球情况才抖动桌面,距离平方小于500就算进洞,且球是活的
			//如果打的太好了在bounce()中已经进了,此时this.isDie为true,所以不会抖动
			if(lx*lx+ly*ly < 500 && !this.isDie)
			{
				m();//球进洞了桌面要抖动一下,
				this.isDie = true;  //设置球die
				this.update = this.inHole;  //球进洞后改变更新事件
				ns.Ball.type.push(this.type);  //进洞的球加入数组
				//进洞的球在控制台打印一下
				console.log(this.num);
				return;
			}
		}
	};

	Ball.prototype.inHole = function()
	{
		//当球透明到一定程度,或小到一定程度,就改变更新力度
		if(this.alpha <.1 || this.scaleX <.1 || this.scaleY <.1) 
		{
			//如果不是白球,重新定义更新函数
			this.update = this.num ==0?null:function()
			{
				//球在球路里滚动
				this.x += 4;
				this.bitmap.setRect([this.rx, this.ry, 2*r, 2*r]);
				this.rx -= 4;
				//横着滚
				this.bitmap.rotation = 0;
				//进入球路底部
				if(this.x > ns.xx )
				{
					//不在更新
					this.update = null;
					//设置球的位置
					this.x = ns.xx;
					//重置求路长度
					ns.xx = this.x - 2*r;
				}

			};
			//当前进的球力度向量清空
			this.v = new Vector();
			//变回原来大小
			this.scaleX = 1;
			this.scaleY = 1;
			//设置透明度为不透明
			this.alpha = 1;
			if(this.num ==0)
			{
				this.visible = false;
			}
			//让球由洞中直接进入球路
			//把球的x坐标设置为球路的x的起始值+半径
			this.x = ns.bitmaps["ballRoad"].x + r;
			//设置球的y坐标
			this.y = ns.bitmaps["ballRoad"].y + ns.bitmaps["ballRoad"].height/2+1;
			
		};
		//使球一直变小,边的透明
		this.scaleX -= .07;
		this.scaleY -= .07;
		this.alpha  -= .07;
	};

	//bounce弹跳
	Ball.prototype.bounce = function()
	{
		var scale = .999;
		var a = 0;
		//minx左侧的边界
		minx = ns.offset.x + 27 - a;
		//miny上册的边界
		miny = ns.offset.y + 28 - a;
		//右侧的边界
		maxx = ns.offset.x + 818 + a;
		//下册的边界
		maxy = ns.offset.y + 408 + a;
		
		//检测每一个边界
		for(var i = 0,l = lines.length;i < l;i++)
		{
			if( this.checkLine(lines[i]))
			{
				//console.log(this.num + " hit")
				return;
			};
		}
		//也进球了但是桌面不抖动,这的作用就是你打的直了,进球没撞到洞,就不晃动
		//如果不想要这个效果可以注释掉
		if(this.loc.x < minx || this.loc.y < miny || this.loc.x > maxx || this.loc.y > maxy && !this.isDie){
			this.isDie = true;
			this.update = this.inHole;
			ns.Ball.type.push(this.type);
			console.log(this.num + "aaaaaaaaaaaaaaaaaaaaaaaaa lose")
			return;			
		}
		/*
		if(this.loc.x < minx + r) 
		{
			this.loc.x = minx + r;
			this.v.x *= -scale;
		}
		else if(this.loc.x >maxx - r)
		{
			this.loc.x = maxx - r;
			this.v.x *= -scale;
		}
		if(this.loc.y < miny + r)
		{
			this.loc.y = miny + r;
			this.v.y *= -scale;
		}
		else if(this.loc.y > maxy - r)
		{
			this.loc.y = maxy - r;
			this.v.y *= -scale;
		}			
        */
	};

	//这是为手机写的,并没有调用
	Ball.prototype.touchMove = function()
	{
		if(ns.isDown)
		{
			this.update = this.checkBounds();
		}	
	};

	//这个函数是白球进洞后的更新函数
	Ball.prototype.checkBounds = function()
	{
		//桌面的坐标范围
		minx = ns.offset.x + 27;
		miny = ns.offset.y + 28;
		maxx = ns.offset.x + 818;
		maxy = ns.offset.y + 408;
		//将白球的位置重置为鼠标的位置
		this.loc.x = ns.mouse.x;
		this.loc.y = ns.mouse.y;

		//如果当前鼠标出了桌面的位置,就把白球放在桌边上即可
		if(this.loc.x < minx + r) 
		{
			this.loc.x = minx + r;
		}
		else if(this.loc.x >maxx - r)
		{
			this.loc.x = maxx - r;
		}
		if(this.loc.y < miny + r)
		{
			this.loc.y = miny + r;
		}
		else if(this.loc.y > maxy - r)
		{
			this.loc.y = maxy - r;
		}
		//设置坐标
		this.x = this.loc.x;
		this.y = this.loc.y;
		//检测白球放的位置有没有和别的球的位置起冲突,x=14*14*2*2=(14*2)^2
		for(var i = 1,l = balls.length,x = r*r*4; i < l;i++)
		{
			var a1 = this.loc.x - balls[i].loc.x;
			var a2 = this.loc.y - balls[i].loc.y;
			//x=784是28的平方,即检测两个球有没有重合的部分
			if((a1*a1+a2*a2) <= x)
			{
				this.alpha = .5;
				//supportTouch的检测好像没用,判断浏览器是否支持触屏事件
				if(Q.supportTouch)
				{
					ns.whiteBall.isDown = false;
				}
				//有重合的部分直接返回
				return;
			}
		}
		//设置透明度
		this.alpha = 1;
		//放好了白球了
		if(ns.whiteBall.isDown && ns.isDown)
		{
			//重新设置更新函数为move函数
			this.update = this.move;
			//恢复设置
			this.isDie = false;	
			//准备开始击球
			ns.startShoot();
			//设置isDown为false,鼠标没有按下
			if(!Q.supportTouch) ns.isDown = false;
		}
	}; 

	//边界检测,看是否和边界碰撞了
	Ball.prototype.checkLine = function(line){
		//旋转设计就只需要判读x是否在范围,y是否撞上了即可
		//获得边界的角度:不是(+-)1.57...(pi/2)就是0,或pi
		var ang = line.p1.minusNew(line.p2).getAngle();
		var temp = false;
		var cos = Math.cos(ang);
		var sin = Math.sin(ang);
		var r = ns.r; 
		//最后移动的距离可能没有球的半径大
		if(this.v.getLength()>r)
		{
			r = this.v.getLength();
		}
		//简单来说就是把p1,p2,v,loc按照ang的角度旋转一下,是逆时针旋转
		line.p1.rotate(cos, -sin);
		line.p2.rotate(cos, -sin);
		
		this.loc.rotate(cos, -sin);
		this.v.rotate(cos, -sin);
		//获得旋转后的坐标
		var y = line.p1.y;
		var x1 = line.p1.x;
		var x2 = line.p2.x;
		//如果x1>x2,交换两个的值,保证x1是较小的
		if(x1 > x2){var xx = x1;x1 = x2;x2 =xx}
		var by = this.loc.y;
		var bx = this.loc.x;
		var vy = this.v.y;
		//检测会不会撞边界的,不太明白
		if(bx > x1 && bx < x2 && (by + r > y && by - r < y))
		{
			this.loc.y = this.v.y>0?y-r:y+r;
			//力度调转方向
			this.v.y *= -1;
			temp = true;
		}
		//在旋转回来,恢复原值
		line.p1.rotate(cos, sin);
		line.p2.rotate(cos, sin);
		this.loc.rotate(cos, sin);
		this.v.rotate(cos, sin);

		return temp;
	};

	//检测球是否停止
	function isStop()
	{
		var temp = true;
		//只要有球的v向量的长度大于0.01就是还有球在动,返回false
		for(var i = 0,len = balls.length;i < len;i++){
			if(balls[i].v.getLength() > .01){
				temp = false;
			}
		}
		return temp;
	};

	//球都停止后
	function afterStop()
	{
		//进球是否成功的标志
		var rightBall = false;
		//进洞的球的类型
		var type = Ball.type;
		//进球的数量
		var len = Ball.type.length;
		//标识白球是否进洞
		var white = false;
		//没有进球
		if(len == 0){
			ns.setBad();
			return;
		}
		//进球了
		else{
			//遍历进洞的球
			for(var i = 0;i < len;i++){
				//黑八进了
				if(type[i]==8){
					//如果还有自己的球没打完,就输了
					if(ns.player.num != 7){
						ns.setLose();}
					else{
						//否则赢了
						ns.setWin();
					}
					return;
				} 
				//白球进了
				else if(type[i]==0){
					white = true;
				}
			}
			
			for(var i = 0;i < len;i++){
				//ns.player.type==null就是还没有分球
				if(!ns.player.type && type[i] != 0){  
					//分球了				
					ns.initPlayerType(type[i]);
					//白球没进洞就加分
					if(!white){
						ns.player.addScore(10);
						rightBall = true;
					}
					//进的球数加加
					ns.player.num++;
				}
				//已经分球了,且进的球是自己的
				else if(ns.player.type == type[i]){ 
					//白球没进
					if(!white){
						//加分
						ns.player.addScore(10);
						rightBall = true;
					}
					//进的球数加一
					ns.player.num++;
				}
				//进的是对手的球,给对手加分
				else if(ns.player.next.type == type[i]){
					ns.player.next.num++;
				}
			}
			console.log(ns.player1.num + " " +ns.player2.num)
			//白球进了
			if(white){
				//切换玩家
				ns.changePlayer();
				//ns.whiteBall.isDown的值为true
				ns.whiteBall.isDown = Q.supportTouch?false:true;
				ns.whiteBall.visible = true;
				//白球进洞后重置白球的更新函数
				ns.whiteBall.update = ns.Ball.prototype.checkBounds;
				return;
			}
			//进球成功
			if(rightBall){
				ns.setGood();
			}
			//进球失败
			else{
				ns.setBad();
			}
		}
		
	}

	//这个update方法和Ball.prototype.update原型里的update方法干什么
	//此处的update方法在event.js中的shoot函数中调用了
	Ball.update = function()
	{
		if(isStop())
		{
			//球都停止了就把循环函数置为空函数
			ns.loop = function(){};
			afterStop();
			return;
		}

		var i,j,len = balls.length,ball1,ball2;
		var s,s1,t1,v1s,v2s,v1t,v2t,k,rr = 2 * r;
		//检测任意两个球之间是否碰撞
		for(var i = 0,len = balls.length; i < len - 1;i++)
		{	
			//球1
			ball1 = balls[i];
			//如果球死了(已经进洞)且不是白球,就不用判断了
			if(ball1.isDie && ball1.num!=0){
				//将球删除,splice会更改原数组,i是要删除的索引,1是要删除的数目
				balls.splice(i, 1);
				len--;//长度减小
				i --;//一定要i--否则会有没判断的
				continue;
			}
			//球1分别和其余的球检测是否有碰撞
			for(var j = i + 1;j < len;j++)
			{
				ball2 = balls[j];
				checkCollision(ball1, ball2);	
			}
		}
	}

	//碰撞检测函数
	function checkCollision(ball0, ball1)
	{	
		//如果球死了(已经进了),不会碰撞,直接退出
		if(ball0.isDie || ball1.isDie) return;
		//如果两个球移动的距离都小于0.1,就说都快停了,不会撞上
		var vl0 = ball0.v.getLength(), vl1 = ball1.v.getLength();
		if(vl0 < .1 && vl1 < .1) {
			return ;
		}
		//两个球的中心向量
		var s = ball0.loc.minusNew(ball1.loc);
		//如果距离小于等于2倍的半径,说明撞上了,
		//两球碰撞后球心连线方向速度相互交换,碰撞点切线方向的速度保持不变
		if(s.getLength() <= 2*r)
		{
			//中心向量的角度
			var ang = s.getAngle();
			var sin = Math.sin(ang);
			var cos = Math.cos(ang);	
			//旋转中心向量
			s.rotate(cos, -sin);
			//旋转球0的坐标
			ball0.loc.rotate(cos, -sin);
			//旋转球0的力度向量
			ball0.v.rotate(cos, -sin);
			//旋转球1的坐标
			ball1.loc.rotate(cos, -sin);
			//旋转球1的力度向量
			ball1.v.rotate(cos, -sin);
			
			s =2*r - Math.abs(ball0.loc.x - ball1.loc.x);
			//这几个条件语句只会执行一个
			if(ball0.v.x == 0){
				//位置坐标+-s的值
				ball1.loc.x -= (ball1.v.x > 0?s:-s);
				ball1.loc.y -= (ball1.v.y * s/Math.abs(ball1.v.x));
			}
			else if(ball1.v.x == 0){
				ball0.loc.x -= (ball0.v.x > 0?s:-s);
				ball0.loc.y -= (ball0.v.y * s/Math.abs(ball0.v.x));
			}
			else if(ball0.loc.x < ball1.loc.x){
				ball0.loc.x -= s*.5;
				ball1.loc.x += s*.5;
			}
			else{
				ball0.loc.x += s*.5;
				ball1.loc.x -= s*.5;
			}
			//旋转恢复原值
			ball0.loc.rotate(cos, sin);
			ball0.v.rotate(cos, sin);
			ball1.loc.rotate(cos, sin);
			ball1.v.rotate(cos, sin);
			//再次计算中心向量
			s = ball0.loc.minusNew(ball1.loc);
			//计算角度
			ang = s.getAngle();
			sin = Math.sin(ang);
			cos = Math.cos(ang);
			//旋转																												
			s.rotate(cos, -sin);
			ball0.loc.rotate(cos, -sin);
			ball0.v.rotate(cos, -sin);
			ball1.loc.rotate(cos, -sin);
			ball1.v.rotate(cos, -sin);
			//交换两个球的x坐标
			var tempV = ball0.v.x;
			ball0.v.x = ball1.v.x;
			ball1.v.x = tempV;
			//旋转恢复原值
			ball0.loc.rotate(cos, sin);
			ball0.v.rotate(cos, sin);
			ball1.loc.rotate(cos, sin);
			ball1.v.rotate(cos, sin);

		}	
	}
	
})();