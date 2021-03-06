(function(global){
    var Canvas = global.Canvas;

    var Mario = function(dom){
        this.zoom = 2;
        this.canvas = new Canvas(dom, this.zoom);
        this.resource = new global.ResourceManager();
        this.control = new global.OperationCenter(this, dom);
        this.character = new global.Character(this);

        this.width = 5120;
        this.height = dom.height;

        this.init();
        this.start();
    };
    
    Mario.prototype = {
        init: function(){
            this.setState(global.LoadingState);
        },
        start: function(){
            this.canvas.start();
        },
        setState: function(state){
            if(this.currentState) this.currentState.destroy();
            this.currentState = new state(this);
            this.currentState.init();
            this.canvas.setItems([this.currentState]);
        },
        destroy: function(){
            this.control.destroy();
        }
    };

    global.Mario = Mario;
})(window);