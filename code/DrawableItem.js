(function(global){
    var Defines = global.Defines;

    var direction = Defines.direction;
    var status = Defines.status;
    var ImageMap = Defines.ImageMap;

    var DrawableItem = function(props){
        this.face = direction.RIGHT;
        this.status = status.normal;
        this.ax = 0;

        Object.assign(this, props);
    }

    DrawableItem.prototype = new global.EventHandler({
        x: undefined,
        y: undefined,
        ax: undefined,
        ay: undefined,
        w: undefined,
        h: undefined,
        halfW: undefined,
        halfH: undefined,
        drawY: 0,

        manager: null,
        isMoveable: false,
        isBreakable: false,
        
        init: function(){

        },
        location: function(x, y){
            this.manager.locate(this, x, y);
        },
        move: function(x, y){

        },
        draw: function(ctx, t){
            var drawItem = ImageMap[this.key + this.frame];
            if(!drawItem) return;
            ctx.drawImage(this.resource.getImage(drawItem.imgKey), drawItem.x, drawItem.y, drawItem.w, drawItem.h, 
                                        this.x - drawItem.w / 2, this.drawY, drawItem.w, drawItem.h);
            ctx.beginPath();
            ctx.rect(this.x - drawItem.w / 2, this.drawY, drawItem.w, drawItem.h);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.manager.items.indexOf(this) + 1, this.x, this.drawY + drawItem.h / 2);
        },
        collide: function(){
            return false;
        },
        destroy: function(){

        },
        die: function(){
            this.status = status.dying;
            this.fire('die.start', this.x, this.y);
        }
    });

    DrawableItem.Create = function(resource, x, y, key, frame){
        var item = new DrawableItem();

        frame = frame === undefined ? '' : frame;

        item.x = x;
        item.y = y;
        item.ax = 0;
        item.ay = 0;
        item.key = key;
        item.frame = frame;
        item.resource = resource;

        item.w = ImageMap[key + frame].w;
        item.h = ImageMap[key + frame].h;
        
        return item;
    }

    global.DrawableItem = DrawableItem;
})(window)