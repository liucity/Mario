(function(global){
    var Defines = global.Defines;

    var direction = Defines.direction;
    var status = Defines.status;
    var ImageMap = Defines.ImageMap;

    var DrawableItem = function(props){
        this.face = direction.RIGHT;
        this.status = status.normal;
        this.speed = 0;

        Object.assign(this, props);
    }

    DrawableItem.prototype = new global.EventHandler({
        x: undefined,
        y: undefined,
        fixedY: 0,
        manager: null,
        isMoveable: false,
        init: function(){

        },
        location: function(x, y){
            this.manager.locate(this, x, y);
        },
        move: function(x, y){

        },
        draw: function(ctx, resource, distance){
            var drawItem = ImageMap[this.key + this.frame];
            if(!drawItem) return;
            ctx.drawImage(resource.getImage(drawItem.imgKey), drawItem.x, drawItem.y, drawItem.w, drawItem.h, 
                                        this.x - drawItem.w / 2, this.fixedY, drawItem.w, drawItem.h);
            ctx.beginPath();
            ctx.rect(this.x - drawItem.w / 2, this.fixedY, drawItem.w, drawItem.h);
            ctx.strokeStyle = 'red';
            ctx.stroke();
        },
        crash: function(){
            return false;
        },
        destroy: function(){

        },
        die: function(){
            this.status = status.dying;
            this.fire('die.start', this.x, this.y);
        }
    });

    DrawableItem.Create = function(x, y, key, frame){
        var item = new DrawableItem();

        item.x = x;
        item.y = y;
        item.key = key;
        item.frame = frame === undefined ? '' : frame;

        item.w = ImageMap[key].w;
        item.h = ImageMap[key].h;
        
        return item;
    }

    global.DrawableItem = DrawableItem;
})(window)