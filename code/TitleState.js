(function(global){
    var State = global.State;
    var Drawable = global.Drawable;

    var TitleState = function(main){
        this.main = main;
        this.control = main.control;
        this.player = main.player;
        this.resource = main.resource

        var resource = main.resource;
        var distance = 32;
        var backgroundGenerator = new global.BackgroundGenerator(resource);
        var w = main.canvas.width;
        var h = main.canvas.height;
        var rows = h / distance;
        var cols = w / distance;

        var generator = new global.MapGenerator(resource);
        var map = generator.generateMap(resource, main.width, main.height, w, h);

        //resource.cacheImage('overBackground', temp);
        this.background = new Drawable({
            source: backgroundGenerator.getBackground(w + (main.width - w / 2) / 4, main.height, rows, cols, distance),
            draw: function(ctx, t){
                ctx.drawImage(this.source, this.x + map.x / 4, this.y, w, h, this.x, this.y, w, h);
            }
        });

        this.foreground = new Drawable({
            source: backgroundGenerator.getForeground(w / 2 + main.width, main.height, rows, cols, distance),
            draw: function(ctx, t){
                ctx.drawImage(this.source, this.x + map.x, this.y, w, h, this.x, this.y, w, h);
            }
        });

        this.map = map;
        console.log(this.map)
    }

    TitleState.prototype = new State({
        init: function(){
            var self = this;
            var map = this.map;
            var player = this.player;
            var resource = this.resource;
            var locationChanged = function(x, y){
                if(map.locate(player, x, y)){
                    map.camera(x, y);
                }else{
                    return false;
                }
            };

            map.add(player);

            this.control.on('keydown.title', function(e){
                player.keydown(e.key);
            });
            this.control.on('keyup.title', function(e){
                player.keyup(e.key);
            });

            // resource.playAudio('background', true);
            // resource.playMIDI('background');
            MIDI.Player.loadFile('./midi/background.mid', function(){
                console.log(arguments);
            });
            player.off('moved').on('moved', locationChanged);
            player.off('jump').on('jump', locationChanged);
            player.off('fall').on('fall', locationChanged);
            player.off('jumpStart').on('jumpStart', function(x, y){
                resource.playAudio('jump');
            })
            player.off('levelUp').on('levelUp', function(x, y){
                resource.playAudio('powerup');
            })
            player.off('levelDown').on('levelDown', function(x, y){
                resource.playAudio('powerdown');
            })
        },
        draw: function(ctx, t){
            var player = this.player;
            var map = this.map;

            this.background.draw(ctx, t);
            this.foreground.draw(ctx, t);

            map.draw(ctx, t);
            
            ctx.fillText(Math.round(map.x) + ':' + Math.round(map.y), 50, 90);
            ctx.fillText(Math.round(player.x) + ':' + Math.round(player.y), 50, 70);

            ctx.save();
            ctx.translate(-map.x, -map.y);
            player.draw(ctx, t);
            ctx.restore();
        },
        destroy: function(){
            this.control.off('keydown.title');
            this.control.off('keyup.title');
        }
    });

    global.TitleState = TitleState;
})(window);