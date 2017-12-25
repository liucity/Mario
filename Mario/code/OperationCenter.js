(function(global){
    var OperationCenter = function(main, canvas){
        this.main = main;
        this.canvas = canvas;
        this.init();
    }

    OperationCenter.prototype = new global.EventHandler({
        init: function(){
            var self = this;
            this._handler = function(e){
                self.handler(e.type, e);
            };

            window.addEventListener('keydown', this._handler);
            window.addEventListener('keyup', this._handler);
            window.addEventListener('orientationchange', this._handler);
            this.canvas.addEventListener('click', this._handler);
        },
        handler: function(t, e){
            this.fire(t, e, this.main);
        },
        destroy: function(){
            window.removeEventListener('keydown', this._handler);
            window.removeEventListener('keyup', this._handler);
            window.removeEventListener('orientationchange', this._handler);
            this.canvas.removeEventListener('click', this._handler);
        }
    });

    global.OperationCenter = OperationCenter;
})(window);