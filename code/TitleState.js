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

        var camera = new global.Camera(w, h);
        camera.mWidth(main.width);
        camera.mHeight(main.height);
        this.camera = camera;

        //resource.cacheImage('overBackground', temp);
        this.background = new Drawable({
            source: backgroundGenerator.getBackground(w + (main.width - w / 2) / 4, main.height, rows, cols, distance),
            draw: function(ctx, t){
                ctx.drawImage(this.source, this.x + camera.x / 4, this.y, w, h, this.x, this.y, w, h);
            }
        });

        this.foreground = new Drawable({
            source: backgroundGenerator.getForeground(w / 2 + main.width, main.height, rows, cols, distance),
            draw: function(ctx, t){
                ctx.drawImage(this.source, this.x + camera.x, this.y, w, h, this.x, this.y, w, h);
            }
        });

        var generator = new global.MapGenerator(resource);
        this.map = generator.generateMap(w, h);
        console.log(this.map)
    }

    TitleState.prototype = new State({
        init: function(){
            var self = this;
            var map = this.map;
            var player = this.player;
            var camera = this.camera;
            var resource = this.resource;
            var locationChanged = function(x, y){
                if(map.locate(player, x, y)){
                    camera.setLocation(x, y);
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
            var camera = this.camera;
            var player = this.player;
            var resource = this.resource;

            this.background.draw(ctx, t);
            this.foreground.draw(ctx, t);

            this.map.draw(ctx, resource, camera.x, camera.y);
            
            ctx.fillText(Math.round(camera.x) + ':' + Math.round(camera.y), 50, 90);
            ctx.fillText(Math.round(player.x) + ':' + Math.round(player.y), 50, 70);

            ctx.save();
            ctx.translate(-camera.x, -camera.y);
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