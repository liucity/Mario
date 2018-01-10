(function(global){
    var EventHandler = global.EventHandler;

    var Drawable = function(props){
        this.x = 0;
        this.y = 0;
        
        Object.assign(this, props);
    };

    Drawable.prototype = new EventHandler({
        draw: function(context){
        }
    });

    global.Drawable = Drawable;
})(window);