
(function(){
	
var ns = Q.use("BallGame");

var Num = ns.Num = function(props)
{
	this.num = 0;
	props = props || {};
	Num.superClass.constructor.call(this, props);
	this.id = props.id || Q.UIDUtil.createUID("Num");
	
	if(!this.max) this.max = 1;
	//每个数字的大小是20*24的
	this.width = this.max * 20;
	this.height = 24;

	this.init();
};
//继承
Q.inherit(Num, Q.DisplayObjectContainer);

Num.prototype.init = function()
{	
	//图片的大小是200*24的,每个数字的大小都是20*24
	this.rects = 
	[
		[0,0,20,24],
		[20,0,20,24],
		[40,0,20,24],
		[60,0,20,24],
		[80,0,20,24],
		[100,0,20,24],
		[120,0,20,24],
		[140,0,20,24],
		[160,0,20,24],
		[180,0,20,24]
	];
	//相当于初始化两个bitmap,后面再具体赋值
	for(var i = 0; i < this.max; i++)
	{
		//通过类似精灵图的方式显示相应的分数,由于分数最多是两位数字所以只需要产生两个bitmap
		var rect = this.rects[0];
		var n = new Q.Bitmap({image:ns.images["num"], rect:rect, x:(rect[2]-2)*i});
		//添加为子节点
		this.addChild(n);
	}

	this.setValue(this.num);
};

Num.prototype.setValue = function(val)
{
	this.num = val; //初始化时是0加分时是分数值
	var str = val.toString(), len = this.children.length;   //str="0" ,len=2
	while(str.length < len) str = "0" + str;  //str="00"
	//从后往前更新分数
	for(var i = len - 1; i >=0; i--)
	{
		var n = this.getChildAt(i); //获得第i个子节点
		n.setRect(this.rects[Number(str.charAt(i))]);  //设置显示整个图片具体数字的区域
	}
};
	
})();