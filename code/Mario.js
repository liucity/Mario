(function(global){
    var Defines = global.Defines;

    var status = Defines.status;
    var direction = Defines.direction;
    var level = Defines.MarioLevel;
    var limitation = Defines.MarioLimitation;

    var getFrame = function(val){
        return Math.abs((val / 10) | 0);
    }

    var Mario = function(main){
        this.resource = main.resource;

        this.customDraw = true;
        this.level = level.smallMario;
        this.refreshSource();
        this.lives = 3;
        this.coins = 0;
        this.acceleration = limitation.speed * 3;
        this.climbSpeed = 0;
        this.climbAcceleration = limitation.jump * 3;
        this.frameSX = 0;
        
        this.keys = {};
    }

    Mario.prototype = new global.DrawableItem({
        init: function(){
        },

        keydown: function(key){
            this.keys[key] = true;
        },

        keyup: function(key){
            delete this.keys[key];
        },
        
        draw: function(ctx, t){
            this.updateStatus(t);

            var img = this.resource.getImage(this.imgKey);
            if(img) {
                var flip = this.face === direction.LEFT;
                var frame = 0;
                
                switch(this.status){
                    case status.moving:
                        frame = getFrame(this.x - this.frameSX) % 2; 
                        break;
                    case status.jumping:
                        frame = getFrame(this.x - this.frameSX) % 2 + 2;
                        break;
                    case status.carried:
                        frame = getFrame(this.x - this.frameSX) % 2 + 8;
                        break;
                }

                ctx.fillText(frame, 50, 50);

                ctx.save();
                ctx.translate(Math.round(this.x), Math.round(this.fixedY));
                ctx.scale(flip ? -1 : 1, 1);
                ctx.drawImage(img, frame * this.w, 0, this.w, this.h,
                                            -this.w / 2, 0, this.w, this.h);
                // ctx.rect(-this.w / 2, 0, this.w, this.h);
                // ctx.strokeStyle = 'red';
                // ctx.stroke();
                ctx.restore();
            }
        },

        updateStatus: function(t){
            var dt = this.getTimeStamp('status', t);
            var keys = this.keys;
            var key;
            var isMove = false;
            var isJump = false;
            var _status = this.status;
            
            if(_status === status.dying) return;
            
            for(key in keys){
                if(keys[key]){
                    switch(key){
                        case 'ArrowLeft':
                        case 'a':
                            this.move(dt, direction.LEFT);
                            isMove = true;
                            break;
                        case 'ArrowUp':
                        case 'w':
                        case ' ':
                            if(!this.ignoreJump) {
                                this.jump(dt);
                                if(this.y > Math.pow(limitation.jump, 2) / this.climbAcceleration / 2) this.ignoreJump = true; // max height = 1/2 * v * v / a
                            }
                            isJump = true;
                            break;
                        case 'ArrowRight':
                        case 'd':
                            this.move(dt, direction.RIGHT);
                            isMove = true;
                            break;
                        case 'ArrowDown':
                        case 's':
                            break;
                        case 'f':
                            this.attack(dt);
                            break;
                    }
                }
            }
            
            if(!isMove && this.speed !== 0) {
                this.stop(dt);
            }
            if(this.ignoreJump || !isJump) {
                this.fall(dt);
                this.ignoreJump = true;
            }

            var newX = this.x + this.speed * dt;
            var newY = Math.max(this.y + this.climbSpeed * dt, 0);

            if(this.speed === 0){
                this.frameSX = newX;
            }
            if(newY === 0) {
                this.climbSpeed = 0;
                this.ignoreJump = false;
            }

            if(this.speed || this.climbSpeed){
                if(this.fire('moved', newX, newY) === false){
                    newX = this.x;
                    newY = this.y;
                    this.frameSX = this.x;
                }
            }

            this.x = newX;
            this.y = newY;
            
            if(_status !== status.dying){
                if(this.y) {
                    _status = status.jumping;
                }else if(this.speed){
                    _status = status.moving;
                }else{
                    _status = status.normal;
                }
            }

            this.status = _status;
        },

        move: function(dt, _direction){
            var speed = this.speed;

            switch(_direction){
                case direction.LEFT:
                    if(speed > -limitation.speed) speed = Math.max(speed - this.acceleration * dt, -limitation.speed); 
                    break;
                case direction.RIGHT:
                    if(speed < limitation.speed) speed = Math.min(speed + this.acceleration * dt, limitation.speed);
                    break;
            }
            
            this.face = speed < 0 ? direction.LEFT : direction.RIGHT;
            this.speed = speed;
        },
        
        stop: function(dt){
            var speed = this.speed;

            if(speed < 0){
                speed = Math.min(speed + this.acceleration * dt, 0);
            }else if(this.speed > 0){
                speed = Math.max(speed - this.acceleration * dt, 0);
            }

            this.speed = speed;
        },

        jump: function(dt){
            var speed = this.climbSpeed;
            if(!speed) {
                this.fire('jumpStart', this.x, this.y);
            }
            if(this.fire('jump', this.x, this.y) === false){
                this.climbSpeed = 0;
                this.ignoreJump = true;
                return;
            }
            if(speed < limitation.jump) {
                speed = Math.min(speed + this.climbAcceleration * dt, limitation.jump);
            }

            this.climbSpeed = speed;
        },

        fall: function(dt){
            var speed = this.climbSpeed;
            speed = speed - this.climbAcceleration * dt;
            if(this.fire('fall', this.x, this.y) === false){
                this.climbSpeed = 0;
                return;
            }
            this.climbSpeed = speed;
        },

        attack: function(){
            switch(this.level){
                case level.fireMario:
                    this.fire('attack', this.x, this.y);
                    break;
            }
        },
        
        stomp: function(){
            this.fire('stomp', this.x, this.y);

        },

        hurt: function(){
            this.levelDown();
        },

        getMushroom: function(){
            this.levelUp(2);
        },

        getFlower: function(){
            this.levelUp(3);
        },

        getCoin: function(){
            this.coins += 1;
            if(this.coins === 100){
                this.lives += 1;
                this.coins = 0;
            }
        },

        levelUp: function(max){
            var level = this.level;
            this.level = Math.min(level + 1, max);
            this.refreshSource();
            if(level !== this.level)
                this.fire('levelUp', this.x, this.y);
        },

        levelDown: function(){
            this.level--;
            this.refreshSource();
            if(!this.level){
                this.die();
            }else{
                this.fire('levelDown', this.x, this.y);
            }
        },

        refreshSource: function(){
            var frameSize = 0;
            var imgResourceKey = '';

            switch(this.level){
                case level.smallMario:
                    frameSize = 16;
                    imgResourceKey = 'smallMario';
                    break;
                case level.mario:
                    frameSize = 32;
                    imgResourceKey = 'mario';
                    break;
                case level.fireMario:
                    frameSize = 32;
                    imgResourceKey = 'fireMario';
                    break;
                case level.deadMario:
                    break;
                default:
                    break;
            }
            this.w = frameSize;
            this.h = frameSize;
            this.imgKey = imgResourceKey;
        },

        getTimeStamp: function(key, t){
            key = '_t_' + key;
            if(!this[key]) this[key] = t - 16;
            var val = (t - this[key]) / 1000;
            this[key] = t;
            return val;
        },

        range: (function(){
            var fMax = Math.max;
            var fMin = Math.min;
            return function(val, min, max){
                return fMin(fMax(min, val), max);
            }
        })()
    });

    global.Mario = Mario;
})(window)