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
            
            var audioExt = new Audio().canPlayType("audio/mp3") ? '.mp3' : '.wav';
            resource.addAudio("1up", "sounds/1-up" + audioExt, 1)
                .addAudio("breakblock", "sounds/breakblock" + audioExt)
                .addAudio("bump", "sounds/bump" + audioExt, 4)
                .addAudio("cannon", "sounds/cannon" + audioExt)
                .addAudio("coin", "sounds/coin" + audioExt, 5)
                .addAudio("death", "sounds/death" + audioExt, 1)
                .addAudio("exit", "sounds/exit" + audioExt, 1)
                .addAudio("fireball", "sounds/fireball" + audioExt, 1)
                .addAudio("jump", "sounds/jump" + audioExt)
                .addAudio("kick", "sounds/kick" + audioExt)
                .addAudio("pipe", "sounds/pipe" + audioExt, 1)
                .addAudio("powerdown", "sounds/powerdown" + audioExt, 1)
                .addAudio("powerup", "sounds/powerup" + audioExt, 1)
                .addAudio("sprout", "sounds/sprout" + audioExt, 1)
                .addAudio("stagestart", "sounds/stagestart" + audioExt, 1)
                .addAudio("stomp", "sounds/stomp" + audioExt, 2);

            resource
                .addAudio("background", "sounds/main-theme-overworld" + audioExt, 2)

            resource.addMIDI("title", "midi/title.mid")
                .addMIDI("map", "midi/map.mid")
                .addMIDI("background", "midi/background.mid")
                .addMIDI("overground", "midi/overground.mid")
                .addMIDI("underground", "midi/underground.mid")
                .addMIDI("castle", "midi/castle.mid");
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