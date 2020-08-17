
var bird = {
    cout: 0,
    game: 0,
    bird: 0,
    start: 0,
    x:0,
    birdTop:0,
    birdPosition:0,
    eng:0,
    getInit: function () {
        this.game = document.querySelector('#game');
        this.bird = document.querySelector('#game>.bird');
        this.start = document.querySelector('#game>.start');
    },
        skyMove: function () {
            var self = this;
        setInterval(function () {
            self.x -= 2;
            self.game.style.backgroundPositionX = self.x +'px';
        }, 30)
    },
    birdJump:function(){
        var self = this;
        setInterval(function(){

            self.birdTop === 235 ? self.birdTop = 265 : self.birdTop= 235;
            self.bird.style.top = self.birdTop + 'px';
        },300)
        
    },
    birdFly:function(){
        var self = this;
        setInterval(function(){
                self.birdPosition -= 30;
                self.bird.style.backgroundPositionX = self.birdPosition + 'px';
        },300)
    },
    startE:function(){
        var self = this;
        setInterval( function(){
            if(self.start.className.match(/start-white/g)){
                self.start.classList.add('start-blue');
                self.start.classList.remove('start-white');
            
            }else{
                self.start.classList.add('start-white');
                self.start.classList.remove('start-blue');
            }
              
        }, 300);
    },
   
}

bird.getInit();
bird.skyMove();
bird.birdJump();
bird.birdFly();
bird.startE();