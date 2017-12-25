(function(global){
    let requestFrame = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame  ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame   ||
                window.msRequestAnimationFrame  ||
                function(callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    let cancelFrame = window.cancelAnimationFrame   ||
                window.webkitCancelAnimationFrame   ||
                window.mozCancelAnimationFrame  ||
                window.oCancelAnimationFrame    ||
                window.msCancelAnimationFrame   ||
                function(id) {
                    clearTimeout(id);
                };
                
    var Util = global.Util;
    var getTime = Util.getTime;

    var Canvas = function(dom, zoom){
        if(!dom){
            throw 'Please check your canvas element';
        }
        this.canvas = dom;
        this.width = dom.width;
        this.height = dom.height;
        dom.style['width'] = dom.width * zoom + 'px';
        dom.style['height'] = dom.height * zoom + 'px';
        this.context = dom.getContext('2d');
        this.speed = 1;
        this.isDrawing = false;
        this.isLooping = false;
    }

    Canvas.prototype = {
        _loop: function(){
            if(this.isLooping){
                var self = this;
                requestFrame(function(timestamp){
                    self.loop(timestamp)
                });
            }
        },
        loop: function(timestamp){
            var self = this;
            var context = this.context;
            context.clearRect(0, 0, this.width, this.height);
            if(this.isDrawing && this.items){
                this.items.forEach(function(item){
                    item.draw(context, timestamp, self);
                });
            }
            this._loop();
        },
        
        start: function(){
            this.timestamp = getTime();
            if(!this.isLooping) this.isLooping = true;
            if(!this.isDrawing) this.isDrawing = true;
            this._loop();
        },
        pause: function(){
            this.isDrawing = false;
        },
        stop: function(){
            this.isLooping = false;
        },

        setItems: function(items){
            this.items = items;
        }
    }

    global.Canvas = Canvas;
})(window);