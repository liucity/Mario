(function(global){
    var Drawable = global.Drawable;

    var direction = {
        LEFT: -1,
        RIGHT: 1
    };
    var status = {
        normal: 0,
        moving: 1,
        jumping: 2,
        dying: 3,
        levelUp: 4,
        levelDown: 5,
        firing: 6,
        carried: 7
    }

    var Character = function(props){
        this.x = 0;
        this.y = 0;

        this.face = direction.RIGHT;
        this.status = status.normal;
        this.speed = 0;

        Object.assign(this, props);
    }

    Character.prototype = new global.EventHandler({
        init: function(){

        },
        
        destroy: function(){

        },
        
        draw: function(ctx, t){

        },

        die: function(){
            this.status = status.dying;
            this.fire('die.start', this.x, this.y);
        }
    });

    Character.direction = direction;
    Character.status = status;

    global.Character = Character;
})(window);