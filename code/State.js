(function(global){
    var State = function(props){
        Object.assign(this, props);
    }

    State.prototype = new global.EventHandler({
        init: function(){
            
        },
        draw: function(){

        },
        destroy: function(){
            
        }
    });

    global.State = State;
})(window);