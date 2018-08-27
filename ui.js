(function(){
	var ns = Q.use("BallGame");
	
	var ui = ns.ui = {};
	//ui初始化函数
	ui.init = function()
	{
		//舞台
		var stage = ns.stage;
		//图像对象
		var images = ns.images;
		var bitmaps = ns.bitmaps;

		var x = ns.offset.x;
		var y = ns.offset.y;
		//创建两个玩家的图片,rect:[0, 0, 175, 28]是要设置的显示的区域,是相对于图片来说的,
		//例如rect:[175, 0, 175, 28]表示显示图片player-txt,从左边是175像素开始,上边是0像素开始,要显示的大小是175*28的
		var boardPlayer1 = ns.boardPlayer1 = new Quark.Bitmap({image:images["player-txt"], rect:[0, 0, 175, 28], eventEnabled:false});
		var boardPlayer2 = ns.boardPlayer2 = new Quark.Bitmap({image:images["player-txt"], rect:[175, 0, 175, 28], eventEnabled:false});
		
		//设置两个玩家的图片的显示位置
		ns.playerPos = [x + 120, x + 680];
		//将Player变小一些,图片太大
		boardPlayer1.scaleX = 0.6;
		boardPlayer1.scaleY = 0.6;
		//设置在舞台上的位置(regX是设置自身的注册点的位置的)
		boardPlayer1.x = x + 20;
		boardPlayer1.y = y - 50;

		boardPlayer2.scaleX = .6;
		boardPlayer2.scaleY = .6;

		boardPlayer2.x = x + 723;
		boardPlayer2.y = y - 50;
		//初始化时选手二的透明度很低,说明是选手一开始击球
		boardPlayer2.alpha = .2;

		stage.addChild(boardPlayer1);
		stage.addChild(boardPlayer2);
		//设置两个玩家要打的球的图片,只有分了球之后才会显示
		ns.bitmaps["ball1"].y = y - 50;
		ns.bitmaps["ball9"].y = y - 50;
		
	};

	//参数type是进球的类型  -1大号 1小号
	ns.initPlayerType = function(type){
		//分球后就将相应的球添加
		ns.stage.addChild(ns.bitmaps["ball1"]);
		ns.stage.addChild(ns.bitmaps["ball9"]);
		//获取当前玩家
		var player = ns.player;
		//进的球是小号
		if(type == 1){
			//通过判断当前玩家的类型来将球放入相应的位置
			ns.bitmaps["ball1"].x = ns.playerPos[player.id-1];
			ns.bitmaps["ball9"].x = ns.playerPos[player.next.id-1];
			//定义当前玩家的类型
			ns.player.type = type;
			ns.player.ball = ns.bitmaps["ball1"];
			ns.player.next.ball = ns.bitmaps["ball9"];
			//设置非当前玩家的球的表示的透明度减小
			ns.player.next.ball.alpha = .3;
			//设置非当前玩家的球的类型
			ns.player.next.type = -1;
		}
		//进的球是大号
		else{
			ns.bitmaps["ball9"].x = ns.playerPos[player.id-1];
			ns.bitmaps["ball1"].x = ns.playerPos[player.next.id-1];

			ns.player.ball = ns.bitmaps["ball9"];
			ns.player.next.ball = ns.bitmaps["ball1"];
			ns.player.next.ball.alpha = .3;
			ns.player.type = type;
			ns.player.next.type = 1;
		}
	};

	ns.initScore = function(num){
		ns.Player.score = num;
	}
	//更换玩家
	ns.changePlayer = function()
	{	
		//如果当前是玩家一
		if(ns.player == ns.player1){
			//设置不透明度
			ns.boardPlayer1.alpha = .2;
			ns.score1.alpha = .2;
			ns.boardPlayer2.alpha = 1;
			ns.score2.alpha = 1;
			//更换当前玩家
			ns.player = ns.player2;
		}
		//如果当前是玩家二
		else{
			ns.boardPlayer2.alpha = .2;
			ns.score2.alpha = .2;
			ns.boardPlayer1.alpha = 1;
			ns.score1.alpha = 1;
			ns.player = ns.player1;
		}
		//将当前玩家该打的球标识透明度增加
		ns.player.ball.alpha = 1;
		//将非当前玩家该打的球标识透明度减小
		ns.player.next.ball.alpha = .3;
	}

	//初始化击球完成后的提示文本的图像(bad,good)
	ns.initShotTxt = function(){
		var shotTxt = ns.shotTxt = ns.bitmaps["shot-txt"];
		ns.stage.addChild(shotTxt);
		//shotTxt.x:55 shotTxt.y:170
		shotTxt.x = ns.offset.x
		shotTxt.y = ns.offset.y + 100
		shotTxt.alpha = 0;	
	}

	ns.setGood = function(){
		var shotTxt = ns.shotTxt;
		//图像的大小是350*60的,good是0-200,bad是200-350(横坐标)
		shotTxt.setRect([0, 0, 200, 60]);
		//设置提示文本以及提示文本的位置,动画事件,
		//shotTxt动画的对象,{x:ns.offset.x + 330, alpha:1}对象的目标属性,下一个参数是缓动动画的参数
		Q.Tween.to(shotTxt, {x:ns.offset.x + 330, alpha:1}, {time:300, ease:Q.Easing.Quadratic.EaseIn, onComplete:function(){
			Q.Tween.to(shotTxt, {alpha:0, x:ns.offset.x + 800}, {time:300, delay:500, onComplete:function(){
				//动画结束的回调函数,进了不用切换选手
				shotTxt.x = 0;
				//开始击球
				startShoot();
			}});
		}})
	};
	
	ns.setBad = function(){
		var shotTxt = ns.shotTxt;
		//图像的大小是350*60的,good是0-200,bad是200-350(横坐标)
		shotTxt.setRect([200, 0, 150, 60]);
		//设置提示文本以及提示文本的位置,动画事件,
		//shotTxt动画的对象,{x:ns.offset.x + 350, alpha:1}对象的目标属性,下一个参数是缓动动画的参数
		Q.Tween.to(shotTxt, {x:ns.offset.x + 350, alpha:1}, {time:300, ease:Q.Easing.Quadratic.EaseIn, onComplete:function(){
			Q.Tween.to(shotTxt, {alpha:0,  x:ns.offset.x + 800}, {time:300, delay:500, onComplete:function(){
			
			shotTxt.x = 0;
			//没进球要切换选手
			ns.changePlayer();
			//开始击球
			startShoot();
		}});
		}});
	}

	//开始击球的一系列操作
	var startShoot = ns.startShoot = function()
	{
		//可以击球
		ns.canShot = true;
		ns.loop = ns.shoot;
		//杆可见
		ns.cue.visible = true;
		//击球线可见
		ns.line.visible = true;
		//击球点可见
		ns.point.visible = true;
	}
	//初始化得分
	ns.initScore = function()
	{
		//max为2因为得分是两位数的
		ns.score1 = new ns.Num({max:2, x:ns.offset.x + 40, y:ns.offset.y - 30});
		ns.score2 = new ns.Num({max:2, x:ns.offset.x + 730, y:ns.offset.y - 30});
		//选手二的分数初始化透明度低
		ns.score2.alpha = .2;	
		//将分数加入舞台
		ns.stage.addChild(ns.score1);	
		ns.stage.addChild(ns.score2);
	};
	//赢了的提示文本
	ns.initWin = function()
	{
		//初始化时文本时完全透明的
		ns.winTxt = new Q.Bitmap({image:ns.images["win"], x:0, alpha:0, y:ns.offset.y + 150, eventEnabled:false});	
		//加入舞台
		ns.stage.addChild(ns.winTxt);
	};
	//输了的提示文本
	ns.initLose = function()
	{
		////初始化时文本时完全透明的
		ns.loseTxt = new Q.Bitmap({image:ns.images["lose"], x:0, alpha:0, y:ns.offset.y + 150, eventEnabled:false});	
		//加入舞台
		ns.stage.addChild(ns.loseTxt);
	};

	//赢了
	ns.setWin = function()
	{
		Q.Tween.to(ns.winTxt, {x:ns.offset.x + 330, alpha:1}, {time:350, ease:Q.Easing.Quadratic.EaseIn, onComplete:function(){
			//玩完一局狗设置成不可见
			ns.cue.visible = false;
			ns.line.visible = false;
			ns.point.visible = false;
			//循环函数制空
			ns.loop = function(){};
		}});
	};

	ns.setLose = function()
	{
		Q.Tween.to(ns.loseTxt, {x:ns.offset.x + 290, alpha:1}, {time:350, ease:Q.Easing.Quadratic.EaseIn, onComplete:function(){
			ns.cue.visible = false;
			ns.line.visible = false;
			ns.point.visible = false;																																																																																																											
			ns.loop = function(){};
			//输了之后和赢了不一样,输了要把所有的球进洞
			for(var i = 0,len = ns.Ball.balls.length;i < len;i++)
			{
				setTimeout(function(i){ns.Ball.balls[i].update = ns.Ball.prototype.inHole}, i*2000, i);
			}
		}});
	};

	var hitNum = 0;
	var hitX = 5;//桌面抖动的范围,左右抖动
	//这是控制桌面抖动的函数
	window.m = function(){
		var time = 10;
		Q.Tween.to(ns.stage, {x:hitX}, {time:time, onComplete:function(){
			Q.Tween.to(ns.stage, {x:-hitX}, {time:time*2, onComplete:function(){
				Q.Tween.to(ns.stage, {x:0}, {time:time, onComplete:function(){
				hitNum++;
				hitX -= 1;
				if(hitNum < 2){m()}
				else(hitNum = 0)
				}})
			}})
		}})
	};

})();