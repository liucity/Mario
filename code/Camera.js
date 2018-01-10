(function(global){
    var range = function(v, min, max){
        return Math.max(0, Math.min(v, max));
    }
    
    var Camera = function(w, h){
        this.x = 0;
        this.y = 0;
        this.w = w;
        this.h = h;
        this.mw = null;
        this.mh = null;
    }

    Camera.prototype = {
        value: function(name, v){
            if(v === undefined){
                return this[name];
            }
            this[name] = v;
        },
        mWidth: function(v){
            return this.value('mw', v);
        },
        mHeight: function(v){
            return this.value('mh', v);
        },
        setLocation: function(x, y){
            this.location = { x: x, y: y }
            this.x = range(x - this.w / 2, 0, this.mw - this.w / 2);
            this.y = range(y - this.h / 2, 0, this.mh - this.h / 2);
        }
    }

    global.Camera = Camera;
})(window);