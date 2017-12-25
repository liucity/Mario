(function(global){
    var State = global.State;
    var Drawable = global.Drawable;

    var LoadingState = function(main){
        this.main = main;
        this.loading = new Drawable({
            x: 10,
            y: main.canvas.height - 30,
            w: main.canvas.width - 20,
            h: 20,
            draw: function(ctx, percentage){
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.w, this.h);
                ctx.stroke();
    
                ctx.beginPath();
                ctx.rect(this.x, this.y, percentage * this.w, this.h);
                ctx.fillStyle = '#205081';
                ctx.fill();
            }
        });

        this.loadText = new Drawable({
            x: 10,
            y: main.canvas.height - 40,
            w: main.canvas.width - 20,
            draw: function(ctx, words){
                //ctx.fillStyle = '#205081';
                ctx.font = 'bold 16px Arial';
                ctx.fillText(words, this.x + this.w / 2 - ctx.measureText(words).width / 2, this.y);
            }
        });
    }
    
    LoadingState.prototype = new State({
        init: function(){
            var self = this;
            var resource = this.main.resource;
            resource.basePath = '../';
            resource.on('onLoad', function(count, total){
                if(count === total){
                    resource.off('onLoad');
                    self.main.setState(global.TitleState);
                }
                self.count = count;
                self.total = total;
            });

            resource.addImage("background", "images/bgsheet.png")
                .addImage("endScene", "images/endscene.gif")
                .addImage("enemies", "images/enemysheet.png")
                .addImage("fireMario", "images/firemariosheet.png")
                .addImage("font", "images/font.gif")
                .addImage("gameOverGhost", "images/gameovergost.gif")
                .addImage("items", "images/itemsheet.png")
                .addImage("logo", "images/logo.gif")
                .addImage("map", "images/mapsheet.png")
                .addImage("mario", "images/mariosheet.png")
                .addImage("particles", "images/particlesheet.png")
                .addImage("racoonMario", "images/racoonmariosheet.png")
                .addImage("smallMario", "images/smallmariosheet.png")
                .addImage("title", "images/title.gif")
                .addImage("worldMap", "images/worldmap.png");
            
            if (new Audio().canPlayType("audio/mp3")) {
                resource.addAudio("1up", "sounds/1-up.mp3", 1)
                    .addAudio("breakblock", "sounds/breakblock.mp3")
                    .addAudio("bump", "sounds/bump.mp3", 4)
                    .addAudio("cannon", "sounds/cannon.mp3")
                    .addAudio("coin", "sounds/coin.mp3", 5)
                    .addAudio("death", "sounds/death.mp3", 1)
                    .addAudio("exit", "sounds/exit.mp3", 1)
                    .addAudio("fireball", "sounds/fireball.mp3", 1)
                    .addAudio("jump", "sounds/jump.mp3")
                    .addAudio("kick", "sounds/kick.mp3")
                    .addAudio("pipe", "sounds/pipe.mp3", 1)
                    .addAudio("powerdown", "sounds/powerdown.mp3", 1)
                    .addAudio("powerup", "sounds/powerup.mp3", 1)
                    .addAudio("sprout", "sounds/sprout.mp3", 1)
                    .addAudio("stagestart", "sounds/stagestart.mp3", 1)
                    .addAudio("stomp", "sounds/stomp.mp3", 2);
            } else {
                resource.addAudio("1up", "sounds/1-up.wav", 1)
                    .addAudio("breakblock", "sounds/breakblock.wav")
                    .addAudio("bump", "sounds/bump.wav", 2)
                    .addAudio("cannon", "sounds/cannon.wav")
                    .addAudio("coin", "sounds/coin.wav", 5)
                    .addAudio("death", "sounds/death.wav", 1)
                    .addAudio("exit", "sounds/exit.wav", 1)
                    .addAudio("fireball", "sounds/fireball.wav", 1)
                    .addAudio("jump", "sounds/jump.wav", 1)
                    .addAudio("kick", "sounds/kick.wav", 1)
                    .addAudio("message", "sounds/message.wav", 1)
                    .addAudio("pipe", "sounds/pipe.wav", 1)
                    .addAudio("powerdown", "sounds/powerdown.wav", 1)
                    .addAudio("powerup", "sounds/powerup.wav", 1)
                    .addAudio("sprout", "sounds/sprout.wav", 1)
                    .addAudio("stagestart", "sounds/stagestart.wav", 1)
                    .addAudio("stomp", "sounds/stomp.wav", 1);
            }
        },
        draw: function(ctx){
            var percentage = (this.count || 0) / (this.total || 1);
            this.loading.draw(ctx, percentage);
            this.loadText.draw(ctx, (this.count || 0) + ' / ' + (this.total || 0));
        },
        destroy: function(){

        }
    });

    global.LoadingState = LoadingState;
})(window);