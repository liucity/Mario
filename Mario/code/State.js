(function(global){
    var EventHandler = global.EventHandler;

    var State = function(props){
        Object.assign(this, props);
    }

    State.prototype = new EventHandler({
        init: function(){
            
        },
        draw: function(){

        },
        destroy: function(){
            
        }
    });

    global.State = State;
})(window);