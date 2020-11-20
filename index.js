var bird = {
  skyPosition: 0,
  skyStep: 2,
  birdTop: 235,
  birdPosition: 0,
  startColor: "blue",
  birdFlag: true,
  timer: null,
  pipeArr: [],
  pipeLast: 6, //最后一根柱子的索引
  score: 0,
  scoreArr: [],
  pipeLength: 7,
  getInit: function () {
    this.game = document.querySelector("#game");
    this.bird = document.querySelector("#game>.bird");
    this.start = document.querySelector("#game>.start");
    this.oScore = document.querySelector("#game>.score");
    this.oMask = document.querySelector("#game>.mask");
    this.oEnd = document.querySelector("#game>.end");
    this.oFinalScore = document.querySelector("#game>.end>.score");
    this.oRankList = document.querySelector("#game>.end>.rank-list");
    this.oRestart = document.querySelector("#game>.end>.restart");

    this.scoreArr = this.getScore();
  },
  getScore: function () {
    var scoreArr = getLocal("score");
    scoreArr = scoreArr || [];
    return scoreArr;
    // scoreArr || this.scoreArr;
  },
  //游戏初始化
  init: function () {
    this.animation();
    this.getInit();
    this.handleClick();
    this.handlestart();
    this.handreStart();


    if(sessionStorage.getItem('play')){
      this.startA();
    }
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
        self.pipeMove();
      }
      if (count % 10 === 0) {
        self.birdFly(count);
      }
    }, 30);
  },

  //天空移动的动画
  skyMove: function () {
    this.skyPosition -= this.skyStep;
    this.game.style.backgroundPositionX = this.skyPosition + "px";
  },
  birdJump: function () {
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
  startA: function () {
    var self = this;
    self.skyStep = 5; // 天空加速
    self.bird.style.left = "80px"; //移动bird位置到左侧
    self.birdFlag = false; // 用来判定哪些动画生效 哪些动画不生效
    self.bird.style.transition = "none";
    self.start.style.display = "none";
    self.oScore.style.display = "block";
    //依次给柱子设置一个x
    for (var i = 0; i < self.pipeLength; i++) {
      self.creatPipe((i + 1) * 300);
    }
  },
  // start 点击注册事件
  handlestart: function () {
    var self = this;
    // F1
    // this.start.onclick = function () {
    //     self.startA();
    // };
    // F2
    this.start.onclick = this.startA.bind(this);
    
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

    this.gameJudge();
    this.addScore();
  },
  // 游戏失败判定
  gameJudge: function () {
    this.judegPipe();
    this.judegBird();
  },
  //bird上天 或者入地
  judegBird: function () {
    if (this.birdTop < 0 || this.birdTop > 570) {
      this.gameOver();
    }
  },
  addScore: function () {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;

    if (pipeX < 28) {
      this.oScore.innerText = ++this.score;
    }
  },
  //bird撞上柱子
  judegPipe: function () {
    var index = this.score % this.pipeLength;
    var pipeX = this.pipeArr[index].up.offsetLeft;
    var pipeY = this.pipeArr[index].y; // []
    var birdY = this.birdTop;

    if (
      pipeX <= 100 &&
      pipeX >= 13 &&
      (birdY <= pipeY[0] || birdY >= pipeY[1])
    ) {
      this.gameOver();
    }
  },
  gameOver: function () {
    clearInterval(this.timer);
    this.oMask.style.display = "block";
    this.oEnd.style.display = "block";
    this.bird.style.display = "none";
    this.oScore.style.display = "none";
    this.oFinalScore.innerText = this.score; //把分数放到 oFinalscore
    this.setScore();

    this.renderRankList();
  },
  // 创建柱子
  creatPipe: function (x) {
    var high = 50 + Math.floor(Math.random() * 176);
    var pipeUp = creatEl("div", ["pipeUp"], {
      height: high + "px",
      left: x + "px",
    });
    var pipeDown = creatEl("div", ["pipeDown"], {
      height: 450 - high + "px",
      left: x + "px",
    });
    this.game.appendChild(pipeUp);
    this.game.appendChild(pipeDown);
    this.pipeArr.push({
      up: pipeUp,
      down: pipeDown,
      y: [high, high + 120],
    });
  },
  pipeMove: function () {
    for (var i = 0; i < this.pipeLength; i++) {
      var up = this.pipeArr[i].up;
      var down = this.pipeArr[i].down;
      var x = up.offsetLeft - this.skyStep;
      up.style.left = x + "px";
      down.style.left = x + "px";

      if (x < -52) {
        var lastLeft = this.pipeArr[this.pipeLast].up.offsetLeft;
        //必须要 300 + 'px'因为lastleft 是一个数字 ，把他直接加一个字符串是 300lastleftpx
        // 当 x < -52是改变高度和left的值  怎么改变 改变成什么
        // var highUp = 50 + Math.floor(Math.random() * 176);
        // var highDown = 450 - highUp;
        // this.pipeArr[i].y[0] = highUp + 'px';
        // this.pipeArr[i].y[1] = highUp - 120 + 'px';
        // up.style.height = highUp + "px";
        // down.style.height = highDown + "px";
        up.style.left = lastLeft + 300 + "px";
        down.style.left = lastLeft + 300 + "px";
        this.pipeLast = i; // 在把最后一个柱子的 index 存放到 this.pipeLast
      }
    }
  },

  getDate: function () {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hour = d.getHours();
    var minute = d.getMinutes();
    var second = d.getSeconds();

    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  },
  setScore: function () {
    this.scoreArr.push({
      score: this.score,
      time: this.getDate(),
    });
    setlocal("score", this.scoreArr);

    this.scoreArr.sort(function (a, b) {
      return b.score - a.score;
    });

    this.scoreArr.length = this.scoreArr.length > 8 ? 8 : this.scoreArr.length;
  },
  renderRankList: function () {
    var tmplist = "";
    for (var i = 0; i < this.scoreArr.length; i++) {
      var tmpRanking = "";
      switch (i) {
        case 0:
          tmpRanking = "first";
          break;

        case 1:
          tmpRanking = "second";
          break;

        case 2:
          tmpRanking = "third";
          break;
      }
      tmplist += `
          <li class="rank-item">
          <span class="rank-degree ${tmpRanking}">${i + 1}</span>
          <span class="rank-score">${this.scoreArr[i].score}</span>
          <span class="rank-time">${this.scoreArr[i].time}</span>
          </li>
    `;
    }
    this.oRankList.innerHTML = tmplist;
  },
  handreStart: function () {
    this.oRestart.onclick = function () {
      sessionStorage.setItem("play", true);
      window.location.reload();
    };
  },
};
bird.init();
