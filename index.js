var bird = {
  x: 0,
  skyStep: 2,
  birdTop: 235,
  birdPosition: 0,
  startColor: "blue",
  birdFlag: true,
  timer: null,
  pipeArr: [],
  pipeLength: 7,
  getInit: function () {
    this.game = document.querySelector("#game");
    this.bird = document.querySelector("#game>.bird");
    this.start = document.querySelector("#game>.start");
  },
  //游戏初始化
  init: function () {
    this.animation();
    this.getInit();
    this.handleClick();
    this.handlestart();
  },

  //动画函数 用来执行多个动画
  animation: function () {
    var self = this;
    var count = 0;

    self.timer = setInterval(function () {
      self.skyMove();
      count++;
      if (self.birdFlag && count % 10 === 0) {
        self.birdJump();
        self.startE();
      }

      if (!self.birdFlag) {
        self.birdDown();
        self.gameJudge();
        self.pipeMove();
      }
      if (count % 10 === 0) {
        self.birdFly(count);
      }
    }, 30);
  },

  //天空移动的动画
  skyMove: function () {
    this.x -= this.skyStep;
    this.game.style.backgroundPositionX = this.x + "px";
  },
  birdJump: function (count) {
    this.birdTop = this.birdTop === 220 ? 260 : 220;
    this.bird.style.top = this.birdTop + "px";
  },
  //小鸟翅膀煽动动画
  birdFly: function (count) {
    //  0 -30 -60
    // count 10 20 30 40 50 60 传进来的count的值
    this.bird.style.backgroundPositionX = (count % 3) * -30 + "px";
  },
  // 游戏开始界面的字体动画
  startE: function () {
    //移除原先已有的颜色类名
    this.start.classList.remove("start-" + this.startColor);
    // 给this.startColor赋值一个新类颜色
    this.startColor = this.startColor === "blue" ? "white" : "blue";
    //让start加上一个新的的类名
    this.start.classList.add("start-" + this.startColor);
  },
  // start 点击注册事件
  handlestart: function () {
    var self = this;
    this.start.onclick = function () {
      self.skyStep = 5; // 天空加速
      self.bird.style.left = "120px"; //移动bird位置到左侧
      self.birdFlag = false; // 用来判定哪些动画生效 哪些动画不生效
      self.bird.style.transition = "none";
      self.start.style.display = "none";
      //依次给柱子设置一个x
      for (var i = 0; i < self.pipeLength; i++) {
        self.creatPipe((i + 1) * 300);
      }
    };
  },

  // game的点击注册事件
  handleClick: function () {
    var self = this;
    self.game.onclick = function (e) {
      var dom = e.target;

      // 只有当点击到game时才触发  点击到不包含包含start这个类名的触发
      if (!dom.classList.contains("start")) {
        // self.i = -30; 因为计时器时20 所以小鸟上升的速度太快了
        self.i = -10;
      }
    };
  },
  i: 0, // 开始游戏后小鸟下落的速度
  birdDown: function () {
    this.birdTop += this.i++;
    this.bird.style.top = this.birdTop + "px";
  },
  // 游戏失败判定
  gameJudge: function () {
    this.judegPipe();
    this.judegBird();
  },
  //bird上天 或者入地
  judegBird: function () {
    if (this.birdTop < 0 || this.birdTop > 570) {
      clearInterval(this.timer);
    }
  },
  //bird撞上柱子
  judegPipe: function () {},
  // 创建柱子
  creatPipe: function (x) {
    var high = 50 + Math.floor(Math.random() * 176);
    var pipeUp = this.creatEl("div", ["pipeUp"], {
      height: high + "px",
      left: x + "px",
    });
    var pipeDown = this.creatEl("div", ["pipeDown"], {
      height: 450 - high + "px",
      left: x + "px",
    });
    this.game.appendChild(pipeUp);
    this.game.appendChild(pipeDown);
    this.pipeArr.push({
      up: pipeUp,
      down: pipeDown,
    });
  },
  creatEl: function (element, classArr, styleObj) {
    var ele = document.createElement(element);
    for (var i = 0; i < classArr.length; i++) {
      ele.classList.add(classArr[i]);
    }
    for (var j in styleObj) {
      ele.style[j] = styleObj[j];
    }
    return ele;
  },

  pipeMove: function () {
    for (var i = 0; i < this.pipeLength; i++) {
      var up = this.pipeArr[i].up;
      var down = this.pipeArr[i].down;
      var x = up.offsetLeft - this.skyStep;
      up.style.left = x + "px";
      down.style.left = x + "px";
      if(this.pipeArr[i].offsetLeft - 0 > 300){
        var tmp =  this.pipeArr.shift();
        this.pipeArr.push(tmp);
      }
      console.log(this.pipeArr)
    }
  },
};
bird.init();
