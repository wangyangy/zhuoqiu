(function(){
	var ns = Q.use("BallGame");
	//玩家构造函数,并且付给ns
	var Player = ns.Player = function(id){
		//玩家id
		this.id = id;
		//玩家类型
		this.type = null;
		//分数
		this.score = 0;
		this.num = 0;
		//玩家的球
		this.ball = {};	
	};

	Player.prototype.initType = function(type){
		this.type = type;	
	};

	Player.prototype.init = function(){
		this.score = 0;
		this.num = 0;
	}

	Player.prototype.shot = function(v, angle){
		var balls = ns.Ball.balls;
		balls[0].v = v;
		balls[0].v.setAngle(angle);
	}

	//初始化玩家的函数
	ns.initPlayers = function(){
		//创建两个玩家
		var player1 = ns.player1 = new Player(1);
		var player2 = ns.player2 = new Player(2);
		//加分的函数
		player1.addScore = function(num)
		{
			this.score += num;
			ns.score1.setValue(this.score); 
		}

		player2.addScore = function(num)
		{
			this.score += num;
			ns.score2.setValue(this.score); 
		}
		//下一位
		player1.next = player2;
		player2.next = player1;
		//开杆的是玩家1
		ns.player = player1;
	}


})();