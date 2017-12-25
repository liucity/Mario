(function(global){
    var EventHandler = global.EventHandler;
    var Drawable = global.Drawable;

    var range = (function(){
        var fMax = Math.max;
        var fMin = Math.min;
        return function(val, min, max){
            return fMin(fMax(min, val), max);
        }
    })()
    var getFrame = function(val){
        return Math.abs((val / 10) | 0);
    }

    var direction = {
        LEFT: -1,
        RIGHT: 1
    };
    var level = {
        smallMario: 1,
        mario: 2,
        fireMario: 3
    }
    var status = {
        normal: 0,
        moving: 1,
        jumping: 2,
        dying: 3,
        levelUp: 4,
        levelDown: 5,
        firing: 6,
        carried: 7
    }
    var max = {
        speed: 150,
        jump: 250
    }

    var Character = function(main){
        this.x = 0;
        this.y = 0;
        this.w = main.canvas.width;
        this.h = main.canvas.height;
        this.resource = main.resource;

        this.level = level.smallMario;
        this.lives = 3;
        this.coins = 0;
        this.face = direction.RIGHT;
        this.status = status.normal;
        this.speed = 0;
        this.acceleration = max.speed * 3;
        this.climbSpeed = 0;
        this.climbAcceleration = max.jump * 3;

        this.keys = {};

        this.init();
    }

    Character.prototype = new EventHandler({
        init: function(){
            var self = this;
            var h = this.h;

            this.image = new Drawable({
                source: null,
                frameSX: 0,
                maxFrame: 11,
                frameSize: 16,
                draw: function(ctx, t){
                    if(this.source) {
                        var frameSize = this.frameSize;
                        var flip = self.face === direction.LEFT;
                        var frame = 0;
                        
                        switch(self.status){
                            case status.moving:
                                frame = getFrame(self.x - this.frameSX) % 2; 
                                break;
                            case status.jumping:
                                frame = getFrame(self.x - this.frameSX) % 2 + 2;
                                break;
                            case status.carried:
                                frame = getFrame(self.x - this.frameSX) % 2 + 8;
                                break;
                        }
    
                        ctx.fillText(frame, 50, 50);
    
                        ctx.save();
                        ctx.translate(self.x, h - self.y - frameSize);
                        ctx.scale(flip ? -1 : 1, 1);
                        ctx.drawImage(this.source, frame * frameSize, 0, frameSize, frameSize,
                                                    -frameSize / 2, 0, frameSize, frameSize);
                        ctx.restore();
                    }
                }
            });
            
            this.refreshResource();
        },
        
        destroy: function(){

        },

        keydown: function(key){
            this.keys[key] = true;
        },

        keyup: function(key){
            delete this.keys[key];
        },
        
        draw: function(ctx, t){
            this.updateStatus(t);

            this.image.draw(ctx, t);
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
                                if(this.y > Math.pow(max.jump, 2) / this.climbAcceleration / 2) this.ignoreJump = true; // max height = 1/2 * v * v / a
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

            this.x += this.speed * dt;
            this.y = Math.max(this.y + this.climbSpeed * dt, 0);

            if(this.speed === 0){
                this.image.frameSX = this.x;
            }
            if(this.y === 0) {
                this.climbSpeed = 0;
                this.ignoreJump = false;
            }

            if(this.speed || this.climbSpeed){
                this.fire('moved', this.x, this.y);
            }
            
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
            var face = this.face;

            switch(_direction){
                case direction.LEFT:
                    if(speed > -max.speed) speed = Math.max(speed - this.acceleration * dt, -max.speed); 
                    break;
                case direction.RIGHT:
                    if(speed < max.speed) speed = Math.min(speed + this.acceleration * dt, max.speed);
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
            if(speed < max.jump) {
                speed = Math.min(speed + this.climbAcceleration * dt, max.jump);
            }

            this.climbSpeed = speed;
        },

        fall: function(dt){
            var speed = this.climbSpeed;
            speed = speed - this.climbAcceleration * dt;
            this.climbSpeed = speed;
        },

        attack: function(){
            switch(this.level){
                case level.fireMario:

                    break;
            }
        },
        
        stomp: function(){

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
            this.level = Math.min(this.level + 1, max);
            this.refreshResource();
        },

        levelDown: function(){
            this.level--;
            this.refreshResource();
            if(!this.level){
                this.die();
            }
        },

        refreshResource: function(){
            var imgResourceKey = '';
            var frameSize = 0;
            switch(this.level){
                case level.smallMario:
                    imgResourceKey = 'smallMario';
                    frameSize = 16;
                    break;
                case level.mario:
                    imgResourceKey = 'mario';
                    frameSize = 32;
                    break;
                case level.fireMario:
                    imgResourceKey = 'fireMario';
                    frameSize = 32;
                    break;
                default:
                    throw new {
                        Error: 'shit!!'
                    }
                    break;
            }

            this.image.source = this.resource.getImage(imgResourceKey);
            this.image.frameSize = frameSize;
            if(!this.image.source){
                var self = this;
                this.resource.one('onAllLoaded', function(){
                    self.refreshResource();
                });
            }
        },

        die: function(){
            this.status = status.dying;
        },

        getTimeStamp: function(key, t){
            key = '_t_' + key;
            if(!this[key]) this[key] = t - 16;
            var val = (t - this[key]) / 1000;
            this[key] = t;
            return val;
        }
    });

    global.Character = Character;
})(window);