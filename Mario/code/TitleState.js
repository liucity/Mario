(function(global){
    var State = global.State;
    var Drawable = global.Drawable;

    var TitleState = function(main){
        this.main = main;
        this.control = main.control;
        this.npc = main.character;

        var resource = main.resource;
        var backgroundGenerator = new global.BackgroundGenerator(resource);
        var w = main.canvas.width;
        var h = main.canvas.height;
        var distance = 32;
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
    }

    TitleState.prototype = new State({
        init: function(){
            var self = this;
            var character = this.npc;
            var camera = this.camera;
            this.control.on('keydown.title', function(e){
                character.keydown(e.key);
            });
            this.control.on('keyup.title', function(e){
                character.keyup(e.key);
            });

            character.off('moved');
            character.on('moved', function(x, y){
                camera.setLocation(x, y);
            })
            // this.control.on('orientationchange', function(e){
            //     key.code = window.orientation;
            // });

            // document.documentElement.requestFullscreen();
            // screen.orientation.lock('portrait').then(null, function(error) {
            // document.exitFullscreen()

            // if (window.DeviceOrientationEvent) {
            //     window.addEventListener('deviceorientation', function(e) {
            //     if (e.absolute) {
            //     console.log('Compass heading:', Math.floor(e.alpha));
            //     }
            //     });
            // }
            // alpha 
            // beta 
            // gamma 
        },
        draw: function(ctx, t){
            var camera = this.camera;
            var npc = this.npc;

            this.background.draw(ctx, t);
            this.foreground.draw(ctx, t);
            
            ctx.fillText(Math.round(camera.x) + ':' + Math.round(camera.y), 50, 90);
            ctx.fillText(Math.round(npc.x) + ':' + Math.round(npc.y), 50, 70);

            ctx.save();
            ctx.translate(-camera.x, -camera.y);
            npc.draw(ctx, t);
            ctx.restore();
        },
        destroy: function(){
            this.control.off('keydown.title');
            this.control.off('keyup.title');
        }
    });

    global.TitleState = TitleState;
})(window);