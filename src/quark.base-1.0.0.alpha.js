//这是一个立即调用函数表达式，模式为：(function(){})();
//c是参数，即下面传入的window对象
(function(c) {
	//给window创建一个全局对象，描述版本信息,第一次初始化时就是version和global(window)
	//b与c.Quark指向同一个对象,给b扩充就是给Quark扩充,这有一个指针的循环指向问题window有Quark,而Quark又有window对象
    var b = c.Quark = c.Quark || {
        version: "1.0.0",
        global: c
    },
	//a是一个临时变量方便后面使用
    a = function() {};
	//继承方法 b继承g
    b.inherit = function(b, g) {
        a.prototype = g.prototype;
        b.superClass = g.prototype;
        b.prototype = new a;
        b.prototype.constructor = b
    };
	//合并方法,将b合并到a,参数d表示的是是否使用严格模式复制
    b.merge = function(a, b, d) {
        for (var c in b) if (!d || a.hasOwnProperty(c)) a[c] = b[c];
        return a
    };
	//改变函数作用域对象,即改变this的指向.
	//改变a函数的作用域scope,即this的指向.a:要改变函数作用域的函数,b指定的作用域对象
    b.delegate = function(a, b) {
		//没有传入参数b,则d默认就是window对象
        var d = b || c;
		//传入的参数个数大于2
        if (arguments.length > 2) {
			//选取arguments对象的第3-end的元素
			//arguments是一个类数组对象,即属性有0开始全部为正整数,且包含length属性,{0:"23",1:"ewr",2:"fgd",length=3}
            var e = Array.prototype.slice.call(arguments, 2);
            return function() {
                var b = Array.prototype.concat.apply(e, arguments);
                return a.apply(d, b)
            }
        } else return function() {
			//每当一张图片加载完成时开始调用这个函数,用来触发加载完成的回调函数
            return a.apply(d, arguments)
        }
    };
	//获得dom对象的封装函数,a是对象的id
    b.getDOM = function(a) {
        return document.getElementById(a)
    };
    b.createDOM = function(a, b) {
        var c = document.createElement(a),
        e;
        for (e in b) {
            var h = b[e];
            if (e == "style") for (var i in h) c.style[i] = h[i];
            else c[e] = h
        }
        return c
    };
	//根据限定名称返回一个命名空间,例如:Quark.use('Quark.test')。
    b.use = function(a) {
        for (var a = a.split("."), b = c, d = 0; d < a.length; d++){
			var e = a[d],
			//这是||运用在赋值语句里面的情况,如果b[e]是 '',null,undefined等等则把b赋值为Object
			//这句话做了多件事情如果b[e]是空,则把||后面的语句(b[e] = {})赋值给b,在这之前b[e] = {}先给window对象设置一个属性e,值是一个Object对象.
			//只要b[e]是undefined null,则b最后重新赋值后都会是Object:{}.
			b = b[e] || (b[e] = {});
			//console.log((b[e] = {})); //输出的是:Object {}
		}
        return b
    }; 
	(function(a) {
		//navigator是客户端浏览器的检测对象
		//navigator.userAgent：是浏览器的用户代理字符串，例如：Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36
		//Mozilla/5.0 (Windows NT 6.1; WOW64)：Mozilla公司名/版本号 （平台 window7；加密类型），Windows NT 6.1 对应操作系统 windows 7  
		//AppleWebKit/537.36 (KHTML, like Gecko)版本号   chorm浏览器名称  后面是版本号
        var b = a.ua = navigator.userAgent;
		//检测呈现引擎的类型WebKit  IE  Gecko  KHTML  Opera,一共有5大类型
        a.isWebKit = /webkit/i.test(b);
        a.isMozilla = /mozilla/i.test(b);
        a.isIE = /msie/i.test(b);
		//检测浏览器名称
        a.isFirefox = /firefox/i.test(b);
        a.isChrome = /chrome/i.test(b);
        a.isSafari = /safari/i.test(b) && !this.isChrome;
		//检测手机和平板等移动设备
        a.isMobile = /mobile/i.test(b);
        a.isOpera = /opera/i.test(b);
        a.isIOS = /ios/i.test(b);
        a.isIpad = /ipad/i.test(b);
        a.isIpod = /ipod/i.test(b);
        a.isIphone = /iphone/i.test(b) && !this.isIpod;
        a.isAndroid = /android/i.test(b);
		//是否支持本地存储
        a.supportStorage = "localStorage" in c;
		//方向
        a.supportOrientation = "orientation" in c;
		//重力感应
        a.supportDeviceMotion = "ondevicemotion" in c;
		//触摸
        a.supportTouch = "ontouchstart" in c;
        a.cssPrefix = a.isWebKit ? "webkit": a.isFirefox ? "Moz": a.isOpera ? "O": a.isIE ? "ms": ""
    })(b);
	//获取dom元素在页面位置中的偏移量,格式为:{left: leftValue, top: topValue}。
    b.getElementOffset = function(a) {
        for (var b = a.offsetLeft,
        c = a.offsetTop; (a = a.offsetParent) && a != document.body && a != document;) b += a.offsetLeft,
        c += a.offsetTop;
        return {
            left: b,
            top: c
        }
    };
	
	//创建一个可渲染的DOM,可指定targetName,如canvas或div.
	//参数:a:是一个DisplayObject或类似的对象,c:指定渲染的image及相关设置,返回值为新创建的dom对象
    b.createDOMDrawable = function(a, c) {
        var d = a.tagName || "div",
        e = c.image,
        h = a.width || e && e.width,
        i = a.height || e && e.height,
        j = b.createDOM(d);
        if (a.id) j.id = a.id;
        j.style.position = "absolute";
        j.style.left = (a.left || 0) + "px";
        j.style.top = (a.top || 0) + "px";
        j.style.width = h + "px";
        j.style.height = i + "px";
        if (d == "canvas") j.width = h,
        j.height = i,
        e && (d = j.getContext("2d"), h = c.rect || [0, 0, h, i], d.drawImage(e, h[0], h[1], h[2], h[3], a.x || 0, a.y || 0, a.width || h[2], a.height || h[3]));
        else if (j.style.opacity = a.alpha != void 0 ? a.alpha: 1, j.style.overflow = "hidden", e && e.src) j.style.backgroundImage = "url(" + e.src + ")",
        j.style.backgroundPosition = -(a.rectX || 0) + "px " + -(a.rectY || 0) + "px";
        return j
    };
    b.toString = function() {
        return "Quark"
    };
	//简单的log方法，同console.log作用相同。
    b.trace = function() {
        var a = Array.prototype.slice.call(arguments);
        typeof console != "undefined" && typeof console.log != "undefined" && console.log(a.join(" "))
    };
	//给Quark对象起一个别名,同时将其付给window对象
	//默认的全局namespace为Quark或Q（当Q没有被占据的情况下）。
    if (c.Q == void 0) c.Q = b;
	//将trace赋值给window对象
    if (c.trace == void 0) c.trace = b.trace
})(window); 

//定义一些"矩阵"操作模块
(function() {
    var c = Quark.Matrix = function(b, a, f, c, d, e) {
        this.a = b;
        this.b = a;
        this.c = f;
        this.d = c;
        this.tx = d;
        this.ty = e
    };
    c.prototype.concat = function(b) {
        var a = this.a,
        f = this.c,
        c = this.tx;
        this.a = a * b.a + this.b * b.c;
        this.b = a * b.b + this.b * b.d;
        this.c = f * b.a + this.d * b.c;
        this.d = f * b.b + this.d * b.d;
        this.tx = c * b.a + this.ty * b.c + b.tx;
        this.ty = c * b.b + this.ty * b.d + b.ty;
        return this
    };
	//旋转
    c.prototype.rotate = function(b) {
        var a = Math.cos(b),
        b = Math.sin(b),
        f = this.a,
        c = this.c,
        d = this.tx;
        this.a = f * a - this.b * b;
        this.b = f * b + this.b * a;
        this.c = c * a - this.d * b;
        this.d = c * b + this.d * a;
        this.tx = d * a - this.ty * b;
        this.ty = d * b + this.ty * a;
        return this
    };
	//
    c.prototype.scale = function(b, a) {
        this.a *= b;
        this.d *= a;
        this.tx *= b;
        this.ty *= a;
        return this
    };
    c.prototype.translate = function(b, a) {
        this.tx += b;
        this.ty += a;
        return this
    };
    c.prototype.identity = function() {
        this.a = this.d = 1;
        this.b = this.c = this.tx = this.ty = 0;
        return this
    };
    c.prototype.invert = function() {
        var b = this.a,
        a = this.b,
        f = this.c,
        c = this.d,
        d = this.tx,
        e = b * c - a * f;
        this.a = c / e;
        this.b = -a / e;
        this.c = -f / e;
        this.d = b / e;
        this.tx = (f * this.ty - c * d) / e;
        this.ty = -(b * this.ty - a * d) / e;
        return this
    };
    c.prototype.clone = function() {
        return new c(this.a, this.b, this.c, this.d, this.tx, this.ty)
    };
    c.prototype.toString = function() {
        return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")"
    }
})(); 

//矩形模块
(function() {
    var c = Quark.Rectangle = function(b, a, f, c) {
        this.x = b;
        this.y = a;
        this.width = f;
        this.height = c
    };
    c.prototype.intersects = function(b) {
        return this.x <= b.x + b.width && b.x <= this.x + this.width && this.y <= b.y + b.height && b.y <= this.y + this.height
    };
    c.prototype.intersection = function(b) {
        var a = Math.max(this.x, b.x),
        f = Math.min(this.x + this.width, b.x + b.width);
        if (a <= f) {
            var g = Math.max(this.y, b.y),
            b = Math.min(this.y + this.height, b.y + b.height);
            if (g <= b) return new c(a, g, f - a, b - g)
        }
        return null
    };
    c.prototype.union = function(b, a) {
        var f = Math.min(this.x, b.x),
        g = Math.min(this.y, b.y),
        d = Math.max(this.x + this.width, b.x + b.width) - f,
        e = Math.max(this.y + this.height, b.y + b.height) - g;
        if (a) return new c(f, g, d, e);
        else this.x = f,
        this.y = g,
        this.width = d,
        this.height = e
    };
    c.prototype.containsPoint = function(b, a) {
        return this.x <= b && b <= this.x + this.width && this.y <= a && a <= this.y + this.height
    };
    c.prototype.clone = function() {
        return new c(this.x, this.y, this.width, this.height)
    };
    c.prototype.toString = function() {
        return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")"
    }
})(); 

//按钮Key的code映射表。(定义键盘和鼠标的keyCode)
(function() {
    Quark.KEY = {
        MOUSE_LEFT: 1,
        MOUSE_MID: 2,
        MOUSE_RIGHT: 3,
        BACKSPACE: 8,
        TAB: 9,
        NUM_CENTER: 12,
        ENTER: 13,
        RETURN: 13,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS_LOCK: 20,
        ESC: 27,
        ESCAPE: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        PRINT_SCREEN: 44,
        INSERT: 45,
        DELETE: 46,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        CONTEXT_MENU: 93,
        NUM_ZERO: 96,
        NUM_ONE: 97,
        NUM_TWO: 98,
        NUM_THREE: 99,
        NUM_FOUR: 100,
        NUM_FIVE: 101,
        NUM_SIX: 102,
        NUM_SEVEN: 103,
        NUM_EIGHT: 104,
        NUM_NINE: 105,
        NUM_MULTIPLY: 106,
        NUM_PLUS: 107,
        NUM_MINUS: 109,
        NUM_PERIOD: 110,
        NUM_DIVISION: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123
    }
})(); 

//定义事件管理器模块
(function() {
	//EventManager是一个简单的事件管理器.
    var c = Quark.EventManager = function() {
        this.keyState = {}
    };
	//注册Quark.Stage事件侦听,使得Stage能够接收和处理指定的事件
    c.prototype.registerStage = function(b, a, f, c) {
        this.register(
			b.context.canvas, a,
			function(a) {
				var f = a;
				if (a.type.indexOf("touch") == 0) f = a.touches && a.touches.length > 0 ? a.touches[0] : a.changedTouches && a.changedTouches.length > 0 ? a.changedTouches[0] : a,
				f.type = a.type;
				b.onEvent(f)
			},
			f, c
		)
    };
	//注册DOM事件侦听,当事件触发时调用会调函数callback
    c.prototype.register = function(b, a, f, c, d) {
        for (var e = {prevent: c,stop: d},h = this, c = function(a) {h._onEvent(a, e, f)},d = 0; d < a.length; d++) 
			b.addEventListener(a[d], c, !1)
    };
	//内部事件处理器
    c.prototype._onEvent = function(b, a, f) {
        var c = b.type;
        if (c == "keydown" || c == "keyup" || c == "keypress") this.keyState[b.keyCode] = c;
        f != null && f(b);
        a.prevent && b.preventDefault();
        a.stop && (b.stopPropagation(), b.stopImmediatePropagation && b.stopImmediatePropagation())
    };
	//停止事件
    c.stop = function(b, a, f) {
        a || b.preventDefault();
        f || b.stopPropagation()
    }
})(); 

//定义事件分发器模块
(function() {
	//EventDispatcher类是可调度事件的类的基类，它允许显示列表上的任何对象都是一个事件目标。
	//构造函数
    var c = Quark.EventDispatcher = function() {
		//事件映射表,格式:{type1:[listener1, listener2], type2:[listener3, listener4]}
        this._eventMap = {}
    };
	//注册事件侦听器对象,以使侦听器能够接收事件通知。
    c.prototype.addEventListener = function(b, a) {
        var f = this._eventMap[b];
		//如果f是null或undefined则执行与后面的逻辑,将f设置成为一个[]
        f == null && (f = this._eventMap[b] = []);
		//console.log((f.push(a), !0)); 返回的是一个true 或者 false
		//(f.push(a),!0),强制执行表达式,从左到右执行先执行f.push()操作,最后返回最后一个表达式的值即!0,
		//小括号的用法:执行单个或多个表达式，并返回最后一个表达式的值,多个表达式之间需要用逗号“,”分隔开
		//此处的返回值就是true或者false
        return f.indexOf(a) == -1 ? (f.push(a), !0) : !1
    };
	//删除事件侦听器
    c.prototype.removeEventListener = function(b, a) {
        var f = this._eventMap[b];
        if (f == null) return ! 1;
        for (var c = 0; c < f.length; c++) if (f[c] === a) return f.splice(c, 1),
        f.length == 0 && delete this._eventMap[b],
        !0;
        return ! 1
    };
	//删除指定类型的事件侦听器
    c.prototype.removeEventListenerByType = function(b) {
        return this._eventMap[b] != null ? (delete this._eventMap[b], !0) : !1
    };
	//删除所有事件侦听器
    c.prototype.removeAllEventListeners = function() {
        this._eventMap = {}
    };
	//派发事件,调用事件侦听器
    c.prototype.dispatchEvent = function(b) {
		//在事件类型(_eventMap)里查找
        var a = this._eventMap[b.type];
		//如果a==null,表示要加载的资源还没有加载完成,返回false,之后继续加载
        if (a == null) return ! 1;
        if (!b.target) b.target = this;
		//a是所有资源加载完成后的回调函数,a.slice()之后变成一个数组,第一个元素就是这个回调函数,maybe可以处理多个回调函数的情况
        for (var a = a.slice(), f = 0; f < a.length; f++) {
            var c = a[f];
			//如果c是函数类型,则调用当前这个回调函数
            typeof c == "function" && c.call(this, b)
        }
        return ! 0
    };
	//检测是否为指定事件注册了任何侦听器
    c.prototype.hasEventListener = function(b) {
        b = this._eventMap[b];
        return b != null && b.length > 0
    };
	//给事件名称起一个简单的别名
    c.prototype.on = c.prototype.addEventListener;
    c.prototype.un = c.prototype.removeEventListener;
    c.prototype.fire = c.prototype.dispatchEvent
})(); 

(function() {
	//UIDUtil用来生成一个全局唯一的ID。
    var c = Quark.UIDUtil = {
        _counter: 0
    };
	//根据指定名字生成一个全局唯一的ID，如Stage1，Bitmap2等。
    c.createUID = function(b) {
        var a = b.charCodeAt(b.length - 1);
        a >= 48 && a <= 57 && (b += "_");
        return b + this._counter++
    };
	//为指定的displayObject显示对象生成一个包含路径的字符串表示形式。如Stage1.Container2.Bitmap3。
    c.displayObjectToString = function(b) {
        for (var a; b != null; b = b.parent) {
            var f = b.id != null ? b.id: b.name;
            a = a == null ? f: f + "." + a;
            if (b == b.parent) break
        }
        return a
    }
})();

(function() {
	//绘制显示对象的外包围矩形。名称应该为drawObjectRect(obj,ctx),这是一个私有方法
    function drawObjectRect(obj, ctx) {
        for (var f = 0; f < obj.children.length; f++) {
            var h = obj.children[f];
            if (h.children) drawObjectRect(h, ctx);
            else if (ctx != null) {
                var i = h.getBounds();
                if (h._rotatedPoints != null) {
                    ctx.globalAlpha = 0.2;
                    ctx.beginPath();
                    var j = h._rotatedPoints[0];
                    ctx.moveTo(j.x - 0.5, j.y - 0.5);
                    for (var k = 1; k < h._rotatedPoints.length; k++) {
                        var l = h._rotatedPoints[k];
                        ctx.lineTo(l.x - 0.5, l.y - 0.5)
                    }
                    ctx.lineTo(j.x - 0.5, j.y - 0.5);
                    ctx.stroke();
                    ctx.closePath();
                    ctx.globalAlpha = 0.5
                }
                ctx.beginPath();
                ctx.rect((i.x >> 0) - 0.5, (i.y >> 0) - 0.5, i.width >> 0, i.height >> 0);
                ctx.stroke();
                ctx.closePath()
            } else if (h.drawable.domDrawable) h.drawable.domDrawable.style.border = "1px solid #f00"
        }
    }
	//获取URL里面的请求参数
    Quark.getUrlParams = function() {
        var d;
        var a = {},
        b = window.location.href,
		//判断问号的位置
        f = b.indexOf("?");
		//逗号运算符是二元运算符，它的操作数可以是任意类型。它首先计算左操作数，然后计算右操作数，最后返回右操作数的值，用逗号运算符可以在一条语句中执行多个运算
		//写成,不如写成分号的形式好理解,多数情况下,与;表达的意义相同
        if (f > 0) {
			for (var b = b.substring(f + 1).split("&"), f = 0, c; c = b[f]; f++){
				d = b[f] = c.split("="),c = d,a[c[0]] = c.length > 1 ? c[1] : !0;
			}
		}
		//返回参数的键值对模式
        return a
    };
    var b = document.head,
    a = b.getElementsByTagName("meta"),
    f = a.length > 0 ? a[a.length - 1].nextSibling: b.childNodes[0];
	//动态添加meta到head中。
	//a要添加的meta的属性. 格式如：{name:'viewport', content:'width=device-width'}。
    Quark.addMeta = function(a) {
        var c = document.createElement("meta"),
        e;
        for (e in a) c.setAttribute(e, a[e]);
        b.insertBefore(c, f)
    };
	//显示或关闭舞台上所有显示对象的外包围矩形。此方法主要用于调试物体碰撞区域等。
    Quark.toggleDebugRect = function(a) {
        a.paused = !a.paused;
        if (a.paused) {
            var b = a.context;
            a._update(b);
            b = b.context;
            if (b != null) b.save(),
            b.lineWidth = 1,
            b.strokeStyle = "#f00",
            b.globalAlpha = 0.5;
            drawObjectRect(a, b);
            b != null && b.restore()
        }
    }
})(); 

//Timer是一个计时器。它能按指定的时间序列运行代码。
(function() {
	// 构造函数.
    var c = Quark.Timer = function(b) {
        this.interval = b || 50;
        this.paused = !1;
        this.info = {
            lastTime: 0,
            currentTime: 0,
            deltaTime: 0,
            realDeltaTime: 0
        };
        this._startTime = 0;
        this._intervalID = null;
        this._listeners = []
    };
	//启动计时器
    c.prototype.start = function() {
        if (this._intervalID == null) {
            this._startTime = this.info.lastTime = this.info.currentTime = Date.now();
            var b = this,
            a = function() {
                b._intervalID = setTimeout(a, b.interval);
                b._run()
            };
            a()
        }
    };
	//停止计时器。
    c.prototype.stop = function() {
        clearTimeout(this._intervalID);
        this._intervalID = null;
        this._startTime = 0
    };
	//暂停计时器。
    c.prototype.pause = function() {
        this.paused = !0
    };
	//恢复计时器。
    c.prototype.resume = function() {
        this.paused = !1
    };
	//计时器的运行回调。当达到执行条件时，调用所有侦听器的step方法。
    c.prototype._run = function() {
        //if (!this.paused) {
        //   var b = this.info,
        //    a = b.currentTime = Date.now();
        //    b.deltaTime = b.realDeltaTime = a - b.lastTime;
			//循环调用所有的监听器的step方法。
        //    for (var f = 0,c = this._listeners.length,d, e; f < c; f++) 
		//		d = this._listeners[f],
		//		e = d.__runTime || 0,
		//		e == 0 ? d.step(this.info) : a > e && (d.step(this.info), this._listeners.splice(f, 1), f--, c--);
		//		b.lastTime = a
        //}
		//下面的方式更好理解
		if(this.paused) return;
		var info = this.info;
		var time = info.currentTime = Date.now();
		info.deltaTime = info.realDeltaTime = time - info.lastTime;
		
		for(var i = 0, len = this._listeners.length, obj, runTime; i < len; i++)
		{
			obj = this._listeners[i];
			runTime = obj.__runTime || 0;
			if(runTime == 0)
			{
				obj.step(this.info);
			}else if(time > runTime)
			{
				obj.step(this.info);
				this._listeners.splice(i, 1);
				i--;
				len--;
			}
		}
		
		info.lastTime = time;
    };
	//延迟一定时间time调用callback方法。
    c.prototype.delay = function(b, a) {
        this.addListener({
            step: b,
            __runTime: Date.now() + a
        })
    };
	//添加侦听器对象，计时器会按照指定的时间间隔来调用侦听器的step方法。即listner必需有step方法。
    c.prototype.addListener = function(b) {
        if (b == null || typeof b.step != "function") throw "Timer Error: The listener object must implement a step() method!";
        this._listeners.push(b)
    };
	//删除侦听器。
    c.prototype.removeListener = function(b) {
        b = this._listeners.indexOf(b);
        b > -1 && this._listeners.splice(b, 1)
    }
})(); 

//ImageLoader类是一个图片加载器，用于动态加载图片资源。
(function() {
	//构造函数,b要加载的图片资源
    var c = Quark.ImageLoader = function(b) {
        c.superClass.constructor.call(this);
        this.loading = !1;
        this._index = -1;
        this._loaded = 0;
        this._images = {};
        this._totalSize = 0;
		//这个地方很不好理解
        this._loadHandler = Quark.delegate(this._loadHandler, this);
        this._addSource(b)
    };
	//继承自EventDispatcher
    Quark.inherit(c, Quark.EventDispatcher);
	//开始顺序加载图片资源。可以是单独的资源或者是一个资源数组
    c.prototype.load = function(b) {
        this._addSource(b);
        this.loading || this._loadNext()
    };
	//添加图片资源。
    c.prototype._addSource = function(b) {
		//传入了要加载的资源列表
        if (b) {
			//将b转化为数组遍历
            for (var b = b instanceof Array ? b: [b], a = 0; a < b.length; a++){
				this._totalSize += b[a].size || 0;
			}
            this._source = this._source ? this._source.concat(b) : b
        }
    };
	//加载下一个图片资源。
    c.prototype._loadNext = function() {
        this._index++;
		//资源加载完成
        if (this._index >= this._source.length) 
			this.dispatchEvent({type: "complete",target: this,images: this._images}),
			this._source = [],
			this.loading = !1,
			this._index = -1;
		//还没完全加载完成
        else {
			//这里是图片预加载的模式代码
            var b = new Image;
			//图片加载完成后触发的事件
			//因为当image的src发生改变，浏览器就会跑去加载这个src里的资源。这个操作是异步的，
			//就是说，js不会傻傻地在原地等待图片的加载，而是继续读代码，直到图片加载完成，触发onload事件，js才会回来执行onload里面的内容。
            b.onload = this._loadHandler;
            b.src = this._source[this._index].src;
            this.loading = !0
        }
    };
	//图片加载处理器。
    c.prototype._loadHandler = function(b) {
		//已经加载的图片数加一
        this._loaded++;
        var a = this._source[this._index];
        a.image = b.target;
        this._images[a.id || a.src] = a;
        this.dispatchEvent({type: "loaded",target: this,image: a});
        this._loadNext()
    };
	//返回已加载图片资源的数目。
    c.prototype.getLoaded = function() {
        return this._loaded
    };
	//返回所有图片资源的总数。
    c.prototype.getTotal = function() {
        return this._source.length
    };
	//返回已加载的图片资源的大小之和（在图片资源的大小size已指定的情况下）
    c.prototype.getLoadedSize = function() {
        var b = 0,
        a;
        for (a in this._images) b += this._images[a].size || 0;
        return b
    };
	//返回所有图片资源的大小之和（在图片资源的大小size已指定的情况下）。
    c.prototype.getTotalSize = function() {
        return this._totalSize
    }
})(); 

//缓动动画模块
(function() {
	//Tween是一个缓动动画类,使用它能实现移动/改变大小/淡入淡出等效果
	//构造函数:a是target,实现缓动动画的目标对象,f是设置目标对象新的属性,c设置缓动动画的参数
    var c = Quark.Tween = function(a, f, c) {
        this.target = a;
        this.delay = this.time = 0;
        this.reverse = this.loop = this.paused = !1;
        this.interval = 0;
        this.ease = b.Linear.EaseNone;
        this.onComplete = this.onUpdate = this.onStart = this.next = null;
        this._oldProps = {};
        this._newProps = {};
        this._deltaProps = {};
        this._lastTime = this._startTime = 0;
        this._reverseFlag = 1;
        this._frameCount = this._frameTotal = 0;
        for (var d in f) {
            var e = a[d],
            h = f[d];
            e !== void 0 && typeof e == "number" && typeof h == "number" && (this._oldProps[d] = e, this._newProps[d] = h, this._deltaProps[d] = h - e)
        }
        for (d in c) this[d] !== void 0 && (this[d] = c[d])
    };
	//设置缓动对象的初始和目标属性
    c.prototype.setProps = function(a, b) {
        for (var c in a) this.target[c] = this._oldProps[c] = a[c];
        for (c in b) this._newProps[c] = b[c],
        this._deltaProps[c] = b[c] - this.target[c]
    };
    c.prototype._init = function() {
        this._startTime = Date.now() + this.delay;
        if (this.interval > 0) this._frameTotal = Math.round(this.time / this.interval);
        c.add(this)
    };
	//启动缓动动画的播放
    c.prototype.start = function() {
        this._init();
        this.paused = !1
    };
	//停止缓动动画
    c.prototype.stop = function() {
        this.paused = !0;
        c.remove(this)
    };
	//暂停缓动动画的播放
    c.prototype.pause = function() {
        this.paused = !0
    };
    c.prototype._update = function() {
        if (!this.paused) {
            var a = Date.now(),
            b = a - this._startTime;
            if (! (b < 0)) {
                if (this._lastTime == 0 && this.onStart != null) this.onStart(this);
                this._lastTime = a;
                a = this._frameTotal > 0 ? ++this._frameCount / this._frameTotal: b / this.time;
                a > 1 && (a = 1);
                var b = this.ease(a),
                g;
                for (g in this._oldProps) this.target[g] = this._oldProps[g] + this._deltaProps[g] * this._reverseFlag * b;
                if (this.onUpdate != null) this.onUpdate(this, b);
                if (a >= 1) {
                    if (this.reverse) {
                        if (g = this._oldProps, this._oldProps = this._newProps, this._newProps = g, this._startTime = Date.now(), this._frameCount = 0, this._reverseFlag *= -1, !this.loop) this.reverse = !1
                    } else if (this.loop) {
                        for (g in this._oldProps) this.target[g] = this._oldProps[g];
                        this._startTime = Date.now();
                        this._frameCount = 0
                    } else if (c.remove(this), g = this.next, g != null && (g instanceof c ? (a = g, g = null) : a = g.shift(), a != null)) a.next = g,
                    a.start();
                    if (this.onComplete != null) this.onComplete(this)
                }
            }
        }
    };
    c._tweens = [];
	//更新多有Tween实例,一般由Quark.Timer类自动调用
    c.step = function() {
        for (var a = this._tweens,b = a.length; --b >= 0;) a[b]._update()
    };
	//添加Tween实例
    c.add = function(a) {
        this._tweens.indexOf(a) == -1 && this._tweens.push(a);
        return this
    };
	//删除Tween实例
    c.remove = function(a) {
        var b = this._tweens,
        a = b.indexOf(a);
        a > -1 && b.splice(a, 1);
        return this
    };
	//创建一个缓动动画,让目标对象从当前属性变换到目标属性
    c.to = function(a, b, g) {
        a = new c(a, b, g);
        a._init();
        return a
    };
	//创建一个缓动动画让目标对象从指定起始属性变换到当前属性
    c.from = function(a, b, g) {
        b = new c(a, b, g);
        g = b._oldProps;
        b._oldProps = b._newProps;
        b._newProps = g;
        b._reverseFlag = -1;
        for (var d in b._oldProps) a[d] = b._oldProps[d];
        b._init();
        return b
    };
    var b = Quark.Easing = {
        Linear: {},
        Quadratic: {},
        Cubic: {},
        Quartic: {},
        Quintic: {},
        Sinusoidal: {},
        Exponential: {},
        Circular: {},
        Elastic: {},
        Back: {},
        Bounce: {}
    };
    b.Linear.EaseNone = function(a) {
        return a
    };
    b.Quadratic.EaseIn = function(a) {
        return a * a
    };
    b.Quadratic.EaseOut = function(a) {
        return - a * (a - 2)
    };
    b.Quadratic.EaseInOut = function(a) {
        return (a *= 2) < 1 ? 0.5 * a * a: -0.5 * (--a * (a - 2) - 1)
    };
    b.Cubic.EaseIn = function(a) {
        return a * a * a
    };
    b.Cubic.EaseOut = function(a) {
        return--a * a * a + 1
    };
    b.Cubic.EaseInOut = function(a) {
        return (a *= 2) < 1 ? 0.5 * a * a * a: 0.5 * ((a -= 2) * a * a + 2)
    };
    b.Quartic.EaseIn = function(a) {
        return a * a * a * a
    };
    b.Quartic.EaseOut = function(a) {
        return - (--a * a * a * a - 1)
    };
    b.Quartic.EaseInOut = function(a) {
        return (a *= 2) < 1 ? 0.5 * a * a * a * a: -0.5 * ((a -= 2) * a * a * a - 2)
    };
    b.Quintic.EaseIn = function(a) {
        return a * a * a * a * a
    };
    b.Quintic.EaseOut = function(a) {
        return (a -= 1) * a * a * a * a + 1
    };
    b.Quintic.EaseInOut = function(a) {
        return (a *= 2) < 1 ? 0.5 * a * a * a * a * a: 0.5 * ((a -= 2) * a * a * a * a + 2)
    };
    b.Sinusoidal.EaseIn = function(a) {
        return - Math.cos(a * Math.PI / 2) + 1
    };
    b.Sinusoidal.EaseOut = function(a) {
        return Math.sin(a * Math.PI / 2)
    };
    b.Sinusoidal.EaseInOut = function(a) {
        return - 0.5 * (Math.cos(Math.PI * a) - 1)
    };
    b.Exponential.EaseIn = function(a) {
        return a == 0 ? 0 : Math.pow(2, 10 * (a - 1))
    };
    b.Exponential.EaseOut = function(a) {
        return a == 1 ? 1 : -Math.pow(2, -10 * a) + 1
    };
    b.Exponential.EaseInOut = function(a) {
        return a == 0 ? 0 : a == 1 ? 1 : (a *= 2) < 1 ? 0.5 * Math.pow(2, 10 * (a - 1)) : 0.5 * ( - Math.pow(2, -10 * (a - 1)) + 2)
    };
    b.Circular.EaseIn = function(a) {
        return - (Math.sqrt(1 - a * a) - 1)
    };
    b.Circular.EaseOut = function(a) {
        return Math.sqrt(1 - --a * a)
    };
    b.Circular.EaseInOut = function(a) {
        return (a /= 0.5) < 1 ? -0.5 * (Math.sqrt(1 - a * a) - 1) : 0.5 * (Math.sqrt(1 - (a -= 2) * a) + 1)
    };
    b.Elastic.EaseIn = function(a) {
        var b, c = 0.1,
        d = 0.4;
        if (a == 0) return 0;
        else if (a == 1) return 1;
        else d || (d = 0.3); ! c || c < 1 ? (c = 1, b = d / 4) : b = d / (2 * Math.PI) * Math.asin(1 / c);
        return - (c * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - b) * 2 * Math.PI / d))
    };
    b.Elastic.EaseOut = function(a) {
        var b, c = 0.1,
        d = 0.4;
        if (a == 0) return 0;
        else if (a == 1) return 1;
        else d || (d = 0.3); ! c || c < 1 ? (c = 1, b = d / 4) : b = d / (2 * Math.PI) * Math.asin(1 / c);
        return c * Math.pow(2, -10 * a) * Math.sin((a - b) * 2 * Math.PI / d) + 1
    };
    b.Elastic.EaseInOut = function(a) {
        var b, c = 0.1,
        d = 0.4;
        if (a == 0) return 0;
        else if (a == 1) return 1;
        else d || (d = 0.3); ! c || c < 1 ? (c = 1, b = d / 4) : b = d / (2 * Math.PI) * Math.asin(1 / c);
        return (a *= 2) < 1 ? -0.5 * c * Math.pow(2, 10 * (a -= 1)) * Math.sin((a - b) * 2 * Math.PI / d) : c * Math.pow(2, -10 * (a -= 1)) * Math.sin((a - b) * 2 * Math.PI / d) * 0.5 + 1
    };
    b.Back.EaseIn = function(a) {
        return a * a * (2.70158 * a - 1.70158)
    };
    b.Back.EaseOut = function(a) {
        return (a -= 1) * a * (2.70158 * a + 1.70158) + 1
    };
    b.Back.EaseInOut = function(a) {
        return (a *= 2) < 1 ? 0.5 * a * a * (3.5949095 * a - 2.5949095) : 0.5 * ((a -= 2) * a * (3.5949095 * a + 2.5949095) + 2)
    };
    b.Bounce.EaseIn = function(a) {
        return 1 - b.Bounce.EaseOut(1 - a)
    };
    b.Bounce.EaseOut = function(a) {
        return (a /= 1) < 1 / 2.75 ? 7.5625 * a * a: a < 2 / 2.75 ? 7.5625 * (a -= 1.5 / 2.75) * a + 0.75 : a < 2.5 / 2.75 ? 7.5625 * (a -= 2.25 / 2.75) * a + 0.9375 : 7.5625 * (a -= 2.625 / 2.75) * a + 0.984375
    };
    b.Bounce.EaseInOut = function(a) {
        return a < 0.5 ? b.Bounce.EaseIn(a * 2) * 0.5 : b.Bounce.EaseOut(a * 2 - 1) * 0.5 + 0.5
    }
})(); 

//Audio类,Audio类是原生Audio的封装。
(function() {
	//构造函数
    var c = Quark.Audio = function(b, a, f, g) {
        c.superClass.constructor.call(this);
        this.src = b;
        this.autoPlay = a && f;
        this.loop = g;
        this._playing = this._loaded = !1;
        this._evtHandler = Quark.delegate(this._evtHandler, this);
        this._element = document.createElement("audio");
        this._element.preload = a;
        this._element.src = b;
        a && this.load()
    };
	//继承自EventDispatcher
    Quark.inherit(c, Quark.EventDispatcher);
	//开始加载声音文件
    c.prototype.load = function() {
        this._element.addEventListener("progress", this._evtHandler, !1);
        this._element.addEventListener("ended", this._evtHandler, !1);
        this._element.addEventListener("error", this._evtHandler, !1);
        try {
            this._element.load()
        } catch(b) {
            trace(b)
        }
    };
	//模块内部的声音事件处理
    c.prototype._evtHandler = function(b) {
        if (b.type == "progress") {
            var a = 0,
            c = 0,
            g = b.target.buffered;
            if (g && g.length > 0) for (a = g.length; a >= 0; a--) c = g.end(a) - g.start(a);
            if (c / b.target.duration >= 1) this._element.removeEventListener("progress", this._evtHandler),
            this._element.removeEventListener("error", this._evtHandler),
            this._loaded = !0,
            this.dispatchEvent({
                type: "loaded",
                target: this
            }),
            this.autoPlay && this.play()
        } else b.type == "ended" ? (this.dispatchEvent({
            type: "ended",
            target: this
        }), this.loop ? this.play() : this._playing = !1) : b.type == "error" && trace("Quark.Audio Error: " + b.target.src)
    };
	//开始播放
    c.prototype.play = function() {
        this._loaded ? (this._element.play(), this._playing = !0) : (this.autoPlay = !0, this.load())
    };
	//停止播放
    c.prototype.stop = function() {
        if (this._playing) this._element.pause(),
        this._playing = !1
    };
	//指示声音文件是否已经被加载
    c.prototype.loaded = function() {
        return this._loaded
    };
	//指示声音文件正在播放
    c.prototype.playing = function() {
        return this._playing
    }
})(); 

//Drawable类,Drawable是可绘制图像或DOM的包装。当封装的是HTMLImageElement、HTMLCanvasElement或HTMLVideoElement对象时，
//可同时支持canvas和dom两种渲染方式，而如果封装的是dom时，则不支持canvas方式。
(function() { 
	//构造函数,c一个可绘制的对象
	(Quark.Drawable = function(c, b) {
        if (c instanceof HTMLImageElement || c instanceof HTMLCanvasElement || c instanceof HTMLVideoElement) this.rawDrawable = c;
        if (b === !0) this.domDrawable = c
		//根据context上下文获取不同的Drawable包装的对象。
    }).prototype.get = function(c, b) {
        if (b == null || b.canvas.getContext != null) return this.rawDrawable;
        else {
            if (this.domDrawable == null) this.domDrawable = Quark.createDOMDrawable(c, {
                image: this.rawDrawable
            });
            return this.domDrawable
        }
    }
	//上面的写法比较复杂,其实与下面的写法相同
	//Quark.Drawable = function(c, b) {
     //   if (c instanceof HTMLImageElement || c instanceof HTMLCanvasElement || c instanceof HTMLVideoElement) this.rawDrawable = c;
     //   if (b === !0) this.domDrawable = c
    //}
	//Quark.Drawable.prototype.get = function(c, b) {
    //    if (b == null || b.canvas.getContext != null) return this.rawDrawable;
    //    else {
    //        if (this.domDrawable == null) this.domDrawable = Quark.createDOMDrawable(c, {
      //          image: this.rawDrawable
        //    });
          //  return this.domDrawable
        //}
    //}
})(); 


//DisplayObject类,是可放在舞台上的所有显示对象的基类。DisplayObject类定义了若干显示对象的基本属性。
//渲染一个DisplayObject其实是进行若干变换后再渲染其drawable对象。
(function() {
    function c(a) {
        for (var b = new Quark.Matrix(1, 0, 0, 1, 0, 0); a.parent != null; a = a.parent) {
            var c = 1,
            e = 0;
            a.rotation % 360 != 0 && (e = a.rotation * Quark.RADIAN, c = Math.cos(e), e = Math.sin(e));
            a.regX != 0 && (b.tx -= a.regX);
            a.regY != 0 && (b.ty -= a.regY);
            b.concat(new Quark.Matrix(c * a.scaleX, e * a.scaleX, -e * a.scaleY, c * a.scaleY, a.x, a.y))
        }
        return b
    }
    function b(a, b, c, e) {
        return {
            x: (b.x - a.x) * e - (b.y - a.y) * c + a.x + 0.5 >> 0,
            y: (b.y - a.y) * e + (b.x - a.x) * c + a.y + 0.5 >> 0
        }
    }
	//构造函数
    var a = Quark.DisplayObject = function(a) {
		//id DisplayObject对象唯一标识符id。
        this.id = Quark.UIDUtil.createUID("DisplayObject");
		//name DisplayObject对象的名称。
        this.name = null;
		//x DisplayObject对象相对父容器的x轴坐标。 y DisplayObject对象相对父容器的y轴坐标。
		//regX DisplayObject对象的注册点（中心点）的x轴坐标。regY DisplayObject对象的注册点（中心点）的y轴坐标。
		//width DisplayObject对象的宽。height DisplayObject对象的高。
        this.height = this.width = this.regY = this.regX = this.y = this.x = 0;
		//alpha DisplayObject对象的透明度。取值范围为0-1，默认为1。
		//scaleX DisplayObject对象在x轴上的缩放值。取值范围为0-1。
		//scaleY DisplayObject对象在y轴上的缩放值。取值范围为0-1。
        this.scaleY = this.scaleX = this.alpha = 1;
		//rotation DisplayObject对象的旋转角度。默认为0。
        this.rotation = 0;
		//visible 指示DisplayObject对象是否可见。默认为true。
		//eventEnabled 指示DisplayObject对象是否接受交互事件，如mousedown，touchstart等。默认为true。
		//transformEnabled 指示DisplayObject对象是否执行变换。默认为false。
        this.transformEnabled = this.eventEnabled = this.visible = !0;
		//parent DisplayObject对象的父容器。只读属性。
        this.context = this.parent = this.drawable = null;
        this._depth = 0;
        this._lastState = {};
        this._stateList = ["x", "y", "regX", "regY", "width", "height", "alpha", "scaleX", "scaleY", "rotation", "visible", "_depth"];
        Quark.merge(this, a)
    };
	//设置可绘制对象，默认是一个Image对象，可通过覆盖此方法进行DOM绘制。
	//a(drawable)要设置的可绘制对象
    a.prototype.setDrawable = function(a) {
        if (this.drawable == null || this.drawable.rawDrawable != a) this.drawable = new Quark.Drawable(a)
    };
	//获得可绘制对象实体，如Image或Canvas等其他DOM对象。
    a.prototype.getDrawable = function(a) {
        return this.drawable && this.drawable.get(this, a)
    };
	//对象数据更新接口，仅供框架内部或组件开发者使用。用户通常应该重写update方法。
    a.prototype._update = function(a) {
        this.update(a)
    };
	//对象数据更新接口，可通过覆盖此方法实现对象的数据更新。
    a.prototype.update = function() {};
	//对象渲染接口，仅供框架内部或组件开发者使用。用户通常应该重写render方法。
    a.prototype._render = function(a) {
        a = this.context || a; 
		! this.visible || this.alpha <= 0 ? (a.hide != null && a.hide(this), this.saveState(["visible", "alpha"])) : (a.startDraw(), a.transform(this), this.render(a), a.endDraw(), this.saveState())
    };
	//DisplayObject对象渲染接口，可通过覆盖此方法实现对象的渲染。
    a.prototype.render = function(a) {
        a.draw(this, 0, 0, this.width, this.height, 0, 0, this.width, this.height)
    };
	//
    a.prototype._onEvent = function(a) {
        if (this.onEvent != null) this.onEvent(a)
    };
    a.prototype.onEvent = null;
    a.prototype.saveState = function(a) {
        for (var a = a || this._stateList,
        b = this._lastState,
        c = 0,
        e = a.length; c < e; c++) {
            var h = a[c];
            b["last" + h] = this[h]
        }
    };
	//获得DisplayObject对象保存的状态列表中的指定的属性状态。
    a.prototype.getState = function(a) {
        return this._lastState["last" + a]
    };
	//比较DisplayObject对象的当前状态和最近一次保存的状态，返回指定属性中是否发生改变。
    a.prototype.propChanged = function() {
        for (var a = arguments.length > 0 ? arguments: this._stateList, b = 0, c = a.length; b < c; b++) {
            var e = a[b];
            if (this._lastState["last" + e] != this[e]) return ! 0
        }
        return ! 1
    };
	// 计算DisplayObject对象的包围矩形，以确定由x和y参数指定的点是否在其包围矩形之内。
    a.prototype.hitTestPoint = function(a, b, c) {
        return ! c ? (c = this.getBounds(), a >= c.x && a <= c.x + c.width && b >= c.y && b <= c.y + c.height) : !1
    };
	//计算DisplayObject对象的包围矩形，以确定由object参数指定的显示对象是否与其相交。
    a.prototype.hitTestObject = function(a, b) {
        var c = this.getBounds(),
        e = a.getBounds();
        return ! b ? c.x <= e.x + e.width && e.x <= c.x + c.width && c.y <= e.y + e.height && e.y <= c.y + c.height: !1
    };
	//将x和y指定的点从显示对象的（本地）坐标转换为舞台（全局）坐标。
    a.prototype.localToGlobal = function(a, b) {
        var d = c(this);
        return {
            x: d.tx + a,
            y: d.ty + b
        }
    };
	// 将x和y指定的点从舞台（全局）坐标转换为显示对象的（本地）坐标。
    a.prototype.globalToLocal = function(a, b) {
        var d = c(this).invert();
        return {
            x: d.tx + a,
            y: d.ty + b
        }
    };
	//将x和y指定的点从显示对象的（本地）坐标转换为指定对象的坐标系里坐标。
    a.prototype.localToTarget = function(a, b, c) {
        a = this.localToGlobal(a, b);
        return c.globalToLocal(a.x, a.y)
    };
	//返回DisplayObject对象在舞台全局坐标系内的矩形区域以及所有顶点。
    a.prototype.getBounds = function(a) {
        var a = a == null ? this.localToGlobal(0, 0) : this.localToTarget(0, 0, a),
        c = this.x,
        d = this.y,
        e = this.regX,
        h = this.regY,
        i = this.getCurrentWidth(),
        j = this.getCurrentHeight();
        if (this.rotation % 360 != 0) {
            var a = this.rotation * Quark.RADIAN,
            k = Math.sin(a),
            l = Math.cos(a),
            n = {
                x: c,
                y: d
            },
            a = b(n, {
                x: c - e,
                y: d - h
            },
            k, l),
            m = b(n, {
                x: c - e + i,
                y: d - h
            },
            k, l),
            i = b(n, {
                x: c - e + i,
                y: d - h + j
            },
            k, l),
            c = b(n, {
                x: c - e,
                y: d - h + j
            },
            k, l);
            this._rotatedPoints = [a, m, i, c];
            d = Math.min(a.x, m.x, i.x, c.x);
            e = Math.min(a.y, m.y, i.y, c.y);
            return {
                x: d,
                y: e,
                width: Math.max(a.x, m.x, i.x, c.x) - d,
                height: Math.max(a.y, m.y, i.y, c.y) - e
            }
        }
        return {
            x: a.x,
            y: a.y,
            width: i,
            height: j
        }
    };
	//获得DisplayObject对象变形后的宽度。
    a.prototype.getCurrentWidth = function() {
        return Math.abs(this.width * this.scaleX)
    };
	//获得DisplayObject对象变形后的高度。
    a.prototype.getCurrentHeight = function() {
        return Math.abs(this.height * this.scaleY)
    };
	//获得DisplayObject对象的舞台引用。如未被添加到舞台，则返回null。
    a.prototype.getStage = function() {
        for (var a = this; a.parent;) a = a.parent;
        return a instanceof Quark.Stage ? a: null
    };
	//返回DisplayObject对象的全路径的字符串表示形式，方便debug。如Stage1.Container2.Bitmap3。
    a.prototype.toString = function() {
        return Quark.UIDUtil.displayObjectToString(this)
    }
})(); 


//DisplayObjectContainer类,是显示列表中显示对象容器的基类。
//每个DisplayObjectContainer对象都有自己的子级列表children，
//用于组织对象的Z轴顺序。注意：DisplayObjectContainer对象的宽高默认为0，
//在autoSize=false的情况下，需要手动设置宽高。
(function() {
	//构造函数
    var c = Quark.DisplayObjectContainer = function(b) {
		//eventChildren指示DisplayObjectContainer的子元素是否接受交互事件，如mousedown，touchstart等。默认为true。
        this.eventChildren = !0;
		//autoSize 指示DisplayObjectContainer是否随子元素自动设置大小。默认为false。
        this.autoSize = !1;
        this.children = [];
        b = b || {};
        c.superClass.constructor.call(this, b);
        this.id = b.id || Quark.UIDUtil.createUID("DisplayObjectContainer");
        this.setDrawable(b.drawable || b.image || null);
        if (b.children) for (var a = 0; a < b.children.length; a++) this.addChild(b.children[a])
    };
	//继承自DisplayObject类
    Quark.inherit(c, Quark.DisplayObject);
	//将一个DisplayObject子实例添加到该DisplayObjectContainer实例的子级列表中的指定位置。
	//b为要添加的显示对象,a(index)指定显示对象要添加的位置,返回值为容器本身
    c.prototype.addChildAt = function(b, a) {
        if (a < 0) a = 0;
        else if (a > this.children.length) a = this.children.length;
        var c = this.getChildIndex(b);
        if (c != -1) {
            if (c == a) return this;
            this.children.splice(c, 1)
        } else b.parent && b.parent.removeChild(b);
        this.children.splice(a, 0, b);
        b.parent = this;
        if (this.autoSize) {
            var c = new Quark.Rectangle(0, 0, this.rectWidth || this.width, this.rectHeight || this.height),
            g = new Quark.Rectangle(b.x, b.y, b.rectWidth || b.width, b.rectHeight || b.height);
            c.union(g);
            this.width = c.width;
            this.height = c.height
        }
        return this
    };
	//将一个DisplayObject子实例添加到该DisplayObjectContainer实例的子级列表中。
	//b为要添加的显示对象,返回值为容器本身
    c.prototype.addChild = function(b) {
        for (var a = this.children.length,c = 0; c < arguments.length; c++) 
			b = arguments[c],
			this.addChildAt(b, a + c);
        return this
    };
	//从DisplayObjectContainer的子级列表中指定索引处删除子对象。b(index)要删除的索引
	//删除成功返回true,失败返回false
    c.prototype.removeChildAt = function(b) {
        if (b < 0 || b >= this.children.length) return ! 1;
        var a = this.children[b];
        if (a != null) this.getStage().context.remove(a),
        a.parent = null;
        this.children.splice(b, 1);
        return ! 0
    };
	//从DisplayObjectContainer的子级列表中删除指定子对象。
    c.prototype.removeChild = function(b) {
        return this.removeChildAt(this.children.indexOf(b))
    };
	//删除DisplayObjectContainer的所有子对象。
    c.prototype.removeAllChildren = function() {
        for (; this.children.length > 0;) this.removeChildAt(0)
    };
	//返回DisplayObjectContainer的位于指定索引处的子显示对象。
    c.prototype.getChildAt = function(b) {
        return b < 0 || b >= this.children.length ? null: this.children[b]
    };
	//返回指定对象在DisplayObjectContainer的子级列表中的索引位置。
    c.prototype.getChildIndex = function(b) {
        return this.children.indexOf(b)
    };
	//设置指定对象在DisplayObjectContainer的子级列表中的索引位置。
    c.prototype.setChildIndex = function(b, a) {
        if (b.parent == this) {
            var c = this.children.indexOf(b);
            a != c && (this.children.splice(c, 1), this.children.splice(a, 0, b))
        }
    };
	//确定指定对象是否为DisplayObjectContainer的子显示对象。
    c.prototype.contains = function(b) {
        return this.getChildIndex(b) != -1
    };
	//返回DisplayObjectContainer的子显示对象的数量。
    c.prototype.getNumChildren = function() {
        return this.children.length
    };
	//覆盖父类DisplayObject的_update方法，更新所有子显示对象的深度。
    c.prototype._update = function(b) {
        this.update != null && this.update(b);
        for (var a = 0,c = this.children.length; a < c; a++) {
            var g = this.children[a];
            g._depth = a;
            g._update(b)
        }
    };
	//渲染DisplayObjectContainer本身及其所有子显示对象。
    c.prototype.render = function(b) {
        c.superClass.render.call(this, b);
        for (var a = 0,f = this.children.length; a < f; a++) 
			this.children[a]._render(b)
    };
	//返回b和a指定点下的DisplayObjectContainer的子项（或孙子项，依此类推）的数组集合。默认只返回最先加入的子显示对象。
	//b指定点的x坐标,a指定点的y坐标,c(usePolyCollision)指定是否采用多边形碰撞检测,
	//返回值为指定点下的显示对象集合
    c.prototype.getObjectUnderPoint = function(b, a, c, g, d) {
        if (d) var e = [];
        for (var h = this.children.length - 1; h >= 0; h--) {
            var i = this.children[h];
            if (! (i == null || !i.eventEnabled || !i.visible || i.alpha <= 0)) if (i.children != void 0 && i.eventChildren && i.getNumChildren() > 0) {
                var j = i.getObjectUnderPoint(b, a, c, g, d);
                if (j) if (d) j.length > 0 && (e = e.concat(j));
                else return j;
                else if (i.hitTestPoint(b, a, c, g)) if (d) e.push(i);
                else return i
            } else if (i.hitTestPoint(b, a, c, g)) if (d) e.push(i);
            else return i
        }
        return d ? e: null
    }
})(); 

//舞台Stage类是显示对象的根，所有显示对象都会被添加到舞台上，必须传入一个context使得舞台能被渲染。
//舞台是一种特殊显示对象容器，可以容纳子显示对象。
(function() {
	//参数b是JSON格式,{context:context},context上下文必须指定。
    var c = Quark.Stage = function(b) {
		//stageX舞台在页面中的X偏移量，即offsetLeft。只读属性
		//舞台在页面中的Y偏移量，即offsetTop。只读属性
        this.stageY = this.stageX = 0;
		//指示舞台更新和渲染是否暂停,默认值是false(!1)
        this.paused = !1;   //!1是false的一种表述
        this._eventTarget = null;
        b = b || {};
        c.superClass.constructor.call(this, b);
        this.id = b.id || Quark.UIDUtil.createUID("Stage");
        if (this.context == null) throw "Quark.Stage Error: context is required.";
        this.updatePosition()
    };
	//继承自DisplayObjectContainer类
    Quark.inherit(c, Quark.DisplayObjectContainer);
	//更新舞台Stage上的所有显示对象。可被Quark.Timer对象注册调用。
	//参数b是时间相关的信息,this.paused先看是否暂停了,如果是直接结束,
	//否则执行_update(b)函数,最后执行渲染函数,将Stage上的对象渲染出来
    c.prototype.step = function(b) {
        this.paused || (this._update(b), this._render(this.context))
    };
	// 更新舞台Stage上所有显示子对象的数据。
    c.prototype._update = function(b) {
		//Stage作为根容器，先更新所有子对象，再调用update方法。
        for (var a = 0,c = this.children.length; a < c; a++) {
            var g = this.children[a];
            g._depth = a;
            g._update(b)
        }
		//update方法提供渲染前更新舞台自身对象的数据,数据是timer.info时间信息
        this.update != null && this.update(b)
    };
	//渲染舞台Stage上的所有显示对象。
    c.prototype._render = function(b) {
		//如果b.clear不是null,就执行clear函数清楚是所有对象
        b.clear != null && b.clear(0, 0, this.width, this.height);
        c.superClass._render.call(this, b)
    };
    c.prototype.onEvent = function(b) {
        var a = this.getObjectUnderPoint(b.pageX - this.stageX, b.pageY - this.stageY);
        if (this._eventTarget != null && this._eventTarget != a) {
            var c = b.type == "mousemove" ? "mouseout": b.type == "touchmove" ? "touchend": null;
            c && this._eventTarget._onEvent({
                type: c
            });
            this._eventTarget = null
        }
        if (a != null && a.eventEnabled) this._eventTarget = a,
        a._onEvent(b);
        if (!Quark.supportTouch) this.context.canvas.style.cursor = this._eventTarget && this._eventTarget.useHandCursor && this._eventTarget.eventEnabled ? "pointer": ""
    };
	//更新舞台Stage在页面中的偏移位置，即stageX/stageY。
    c.prototype.updatePosition = function() {
        var b = Quark.getElementOffset(this.context.canvas);
        this.stageX = b.left;
        this.stageY = b.top
    }
})();

//Bitmap位图类，表示位图图像的显示对象，简单说它就是Image对象的某个区域的抽象表示。
(function() {
	//构造函数,用于创建图像的函数,出入的参数如:b = Object {image: img, x: 55, y: 70, eventEnabled: false}
    var c = Quark.Bitmap = function(b) {
		//Image对象,要把image封装成为Bitmap类型,传入的image就成为生成的Bitmap的一个image属性
        this.image = null;
		//显示区域的高宽和显示区域左上顶点的坐标
        this.rectHeight = this.rectWidth = this.rectY = this.rectX = 0;
        b = b || {};
        c.superClass.constructor.call(this, b);
        this.id = b.id || Quark.UIDUtil.createUID("Bitmap");
		//设置图形显示的位置及大小
        this.setRect(b.rect || [0, 0, this.image.width, this.image.height]);
		//将this.image包装成为一个可绘制图象,并设置this.drawable
        this.setDrawable(this.image);
        this._stateList.push("rectX", "rectY", "rectWidth", "rectHeight")
    };
	//继承自DisplayObject类
    Quark.inherit(c, Quark.DisplayObject);
	//设置Bitmap对象的image的显示区域。,b为要显示的区域数组格式为[rectX, rectY, rectWidth, rectHeight]。
    c.prototype.setRect = function(b) {
        this.rectX = b[0];
        this.rectY = b[1];
        this.rectWidth = this.width = b[2];
        this.rectHeight = this.height = b[3]
    };
	//覆盖父类的渲染方法。渲染image指定的显示区域。
    c.prototype.render = function(b) {
        b.draw(this, this.rectX, this.rectY, this.rectWidth, this.rectHeight, 0, 0, this.width, this.height)
    }
})(); 

//影片剪辑模块,继承自Bitmap类
//影片剪辑类，表示一组动画片段。MovieClip是由Image对象的若干矩形区域组成的集合序列，
//并按照一定规则顺序播放。帧frame的定义格式为：{rect:*required*, label:"", interval:0, stop:0, jump:-1}。
(function() {
	//构造函数
    var c = Quark.MovieClip = function(b) {
        this.interval = 0;
        this.useFrames = this.paused = !1;
        this.currentFrame = 0;
        this._frames = [];
        this._frameLabels = {};
        this._frameDisObj = null;
        this._displayedCount = 0;
        b = b || {};
        c.superClass.constructor.call(this, b);
        this.id = b.id || Quark.UIDUtil.createUID("MovieClip")
    };
	//继承自Bitmap类
    Quark.inherit(c, Quark.Bitmap);
	//向MovieClip中添加帧frame，可以是单个帧或多帧的数组。
    c.prototype.addFrame = function(b) {
        var a = this._frames.length;
        if (b instanceof Array) for (var c = 0; c < b.length; c++) this.setFrame(b[c], a + c);
        else this.setFrame(b, a);
        return this
    };
	//指定帧frame在MovieClip的播放序列中的位置（从0开始）。
    c.prototype.setFrame = function(b, a) {
        a == void 0 || a > this._frames.length ? a = this._frames.length: a < 0 && (a = 0);
        this._frames[a] = b;
        b.label && (this._frameLabels[b.label] = b);
        if (b.interval == void 0) b.interval = this.interval;
        a == 0 && this.currentFrame == 0 && this.setRect(b.rect)
    };
	//获得指定位置或标签的帧frame。
    c.prototype.getFrame = function(b) {
        return typeof b == "number" ? this._frames[b] : this._frameLabels[b]
    };
	//从当前位置开始播放动画序列。
    c.prototype.play = function() {
        this.paused = !1
    };
	//停止播放动画序列。
    c.prototype.stop = function() {
        this.paused = !0
    };
	//跳转到指定位置或标签的帧，并停止播放动画序列。
    c.prototype.gotoAndStop = function(b) {
        this.currentFrame = this.getFrameIndex(b);
        this.paused = !0
    };
	//跳转到指定位置或标签的帧，并继续播放动画序列
    c.prototype.gotoAndPlay = function(b) {
        this.currentFrame = this.getFrameIndex(b);
        this.paused = !1
    };
	//获得指定参数对应的帧的位置。
    c.prototype.getFrameIndex = function(b) {
        if (typeof b == "number") return b;
        for (var b = this._frameLabels[b], a = this._frames, c = 0; c < a.length; c++) if (b == a[c]) return c;
        return - 1
    };
	//播放动画序列的下一帧。
    c.prototype.nextFrame = function(b) {
        var a = this._frames[this.currentFrame];
        if (a.interval > 0) b = this._displayedCount + b,
        this._displayedCount = a.interval > b ? b: 0;
        if (a.jump >= 0 || typeof a.jump == "string") if (this._displayedCount == 0 || !a.interval) return this.currentFrame = this.getFrameIndex(a.jump);
        return a.interval > 0 && this._displayedCount > 0 ? this.currentFrame: this.currentFrame >= this._frames.length - 1 ? this.currentFrame = 0 : ++this.currentFrame
    };
	//更新MovieClip对象的属性。
    c.prototype._update = function(b) {
        var a = this._frames[this.currentFrame];
        a.stop ? this.stop() : (this.paused || this.nextFrame(this.useFrames ? 1 : b && b.deltaTime), this.setRect(a.rect), c.superClass._update.call(this, b))
    };
	//渲染当前帧到舞台。
    c.prototype.render = function(b) {
        var a = this._frames[this.currentFrame].rect;
        b.draw(this, a[0], a[1], a[2], a[3], 0, 0, this.width, this.height)
    }
})(); 

//上下文模块,Context是一个抽象类
(function() {
	//构造函数, props 一个对象。包含以下属性：
	//* <p>canvas - 渲染上下文所对应的画布。</p>
    var c = Quark.Context = function(props) {
        if (props.canvas == null) throw "Quark.Context Error: canvas is required.";
		//声明canvas属性
        this.canvas = null;
        Quark.merge(this, props)
    };
	//为开始绘制图像做准备,需要子类实现
    c.prototype.startDraw = function() {};
	//绘制显示对象，需要子类来实现。
    c.prototype.draw = function() {};
	//完成绘制显示对象后的处理方法，需要子类来实现。
    c.prototype.endDraw = function() {};
	//对显示对象进行变换，需要子类来实现。
    c.prototype.transform = function() {};
	//从画布中删除显示对象，需要子类来实现。
    c.prototype.remove = function() {}
})(); 

//CanvasContext模块
(function() {
	//CanvasContext构造函数,获取canvas的上下文,是Context的一个具体子类
    var c = Quark.CanvasContext = function(props) {
        c.superClass.constructor.call(this, props);
        this.context = this.canvas.getContext("2d")
    };
    Quark.inherit(c, Quark.Context);
	//准备绘制,保存当前上下文
    c.prototype.startDraw = function() {
        this.context.save()
    };
	//绘制指定的显示对象到Canvas上。
    c.prototype.draw = function(a) {
        var b = a.getDrawable(this);
        b != null && (arguments[0] = b, this.context.drawImage.apply(this.context, arguments))
    };
	//绘制完毕，恢复上下文。
    c.prototype.endDraw = function() {
        this.context.restore()
    };
	//对指定的显示对象进行context属性设置或变换。
	//* @param {DisplayObject} a 要进行属性设置或变换的显示对象。
    c.prototype.transform = function(a) {
        var c = this.context; (a.x != 0 || a.y != 0) && c.translate(a.x, a.y);
        a.rotation % 360 != 0 && c.rotate(a.rotation % 360 * b); (a.scaleX != 1 || a.scaleY != 1) && c.scale(a.scaleX, a.scaleY); (a.regX != 0 || a.regY != 0) && c.translate( - a.regX, -a.regY);
        a.alpha > 0 && (c.globalAlpha *= a.alpha)
    };
	//清除画布上的指定区域内容。
    c.prototype.clear = function(a, b, c, d) {
        this.context.clearRect(a, b, c, d)
    };
    var b = Math.PI / 180
})(); 


(function() {
	//根据指定对象生成css变换的样式。返回值是生成的css样式
    function c(a, b) {
        var c = "";
        c += b ? "translate3d(" + (a.x - a.regX) + "px, " + (a.y - a.regY) + "px, 0px)rotate3d(0, 0, 1, " + a.rotation + "deg)scale3d(" + a.scaleX + ", " + a.scaleY + ", 1)": "translate(" + (a.x - a.regX) + "px, " + (a.y - a.regY) + "px)rotate(" + a.rotation + "deg)scale(" + a.scaleX + ", " + a.scaleY + ")";
        return c
    }
    var b = document.createElement("div"),
    a = b.style[Quark.cssPrefix + "Transform"] != void 0,
    f = b.style[Quark.cssPrefix + "Perspective"] != void 0,
    g = document.documentElement;
    if (f && "webkitPerspective" in g.style) {
        b.id = "test3d";
        var d = document.createElement("style");
        d.textContent = "@media (-webkit-transform-3d){#test3d{height:3px}}";
        document.head.appendChild(d);
        g.appendChild(b);
        f = b.offsetHeight === 3;
        d.parentNode.removeChild(d);
        b.parentNode.removeChild(b)
    }
	//检测浏览器是否支持transform或transform3D。
    Quark.supportTransform = a;
    Quark.supportTransform3D = f;
    if (!a) throw "Error: DOMContext requires css transfrom support.";
	//DOMContext构造函数,DOMContext是DOM渲染上下文，将显示对象以dom方式渲染到舞台上。
    var e = Quark.DOMContext = function(props) {
        e.superClass.constructor.call(this, props)
    };
    Quark.inherit(e, Quark.Context);
	//绘制指定对象的DOM到舞台上。a要绘制显示的对象,真正绘制图像的底层函数
    e.prototype.draw = function(a) {
        if (!a._addedToDOM) {
            var b = a.parent,
            c = a.getDrawable(this);
			//当执行完DOM原生添加节点的方法b.appendChild(c);时图像就被渲染上了
            (b == null && c.parentNode == null) ? this.canvas.appendChild(c) : (b = b.getDrawable(this), c.parentNode != b && b.appendChild(c));
            a._addedToDOM = !0
        }
    };
	//对指定的显示对象的DOM进行css属性设置或变换。a要进行属性设置过变换的显示对象
    e.prototype.transform = function(a) {
        var b = a.getDrawable(this);
        if (a.transformEnabled || !a._addedToDOM) {
            var d = Quark.cssPrefix,
            e = d + "TransformOrigin";
            d += "Transform";
            if (a.propChanged("visible", "alpha")) {
				b.style.display = !a.visible || a.alpha <= 0 ? "none": "";
			}
            if (a.propChanged("alpha")){
				b.style.opacity = a.alpha;
			}
            if (a.propChanged("rectX", "rectY")){
				b.style.backgroundPosition = -a.rectX + "px " + -a.rectY + "px";
			}
            if (a.propChanged("width", "height")) {
				b.style.width = a.width + "px";
				b.style.height = a.height + "px";
			}
            a.propChanged("regX", "regY") && (b.style[e] = a.regX + "px " + a.regY + "px");
            a.propChanged("x", "y", "regX", "regY", "scaleX", "scaleY", "rotation") && (e = Quark.supportTransform3D ? c(a, !0) : c(a, !1), b.style[d] = e);
            if (a.propChanged("_depth")) b.style.zIndex = a._depth
        }
    };
	//隐藏指定对象渲染的dom节点，用于当显示对象visible=0或alpha=0等情况，由显示对象内部方法调用。
    e.prototype.hide = function(a) {
        a.getDrawable(this).style.display = "none"
    };
	//删除指定显示对象渲染的dom节点，由显示对象内部方法调用。
    e.prototype.remove = function(a) {
        var b = a.getDrawable(this),
        c = b.parentNode;
        c != null && c.removeChild(b);
        a._addedToDOM = !1
    }
})();