(function(global){
    var Util = global.Util;
    var DrawableItem = global.DrawableItem;

    var toArray = Util.toArray;

    var MapManager = function(baseLineHeight, width, height){
        this.baseY = baseLineHeight;
        this.w = width;
        this.h = height;

        this.items = [];
        this.locations = [];
    }

    MapManager.prototype = {
        add: function(){
            var self = this;
            var args = toArray(arguments);

            args.forEach(function(arg){
                if(self.items.indexOf(arg) === -1){
                    arg.manager = self;
                    if(arg.x === undefined) arg.x = 0;
                    if(arg.y === undefined) arg.y = self.baseY + arg.h;
                    arg.fixedY = self.h - arg.y;
                    self.items.push(arg);
                    self.locate(arg, arg.x, arg.y);
                }
            })
        },
        remove: function(){
            var self = this;
            var args = toArray(arguments);

            self.items = self.items.filter(function(item){
                if(args.indexOf(item) > -1){
                    item.manager = null;
                    return false;
                }
                return true;
            })
        },
        cleanLocation: function(x, y){
            var locations = this.locations;
            if(!locations[x]) locations[x] = [];
            if(locations[x][y]) locations[x][y] = null;
        },
        setLocation: function(x, y, obj){
            var locations = this.locations;
            if(!locations[x]) locations[x] = [];
            locations[x][y] = obj;
        },
        locate: function(item, x, y){
            var crashObjs = [];
            this.pointInRange(item.x - item.w / 2, item.fixedY, item.w, item.h, function(obj, row, _x, _y){
                if(obj != null && crashObjs.indexOf(obj) === -1 && item !== obj) crashObjs.push(obj);
            });
            if(crashObjs.length) {
                return item.crash.apply(item, crashObjs);
            }

            this.pointInRange(item.x - item.w / 2, item.fixedY, item.w, item.h, function(obj, row, _x, _y){
                row[_y] = null;
            });
            
            item.x = x;
            item.y = y;
            item.fixedY = this.h - y;

            this.pointInRange(item.x - item.w / 2, item.fixedY, item.w, item.h, function(obj, row, _x, _y){
                row[_y] = item;
            });
        },
        pointInRange: function(x, y, w, h, callback){
            var locations = this.locations;
            var dx, dy;
            x = Math.round(x);
            y = Math.round(y);
            w = Math.round(w);
            h = Math.round(h);

            var i = 0, j = 0;
            for(; i < w; i++){
                j = 0;
                for(; j < h; j++){
                    dx = x + i;
                    dy = y + j;
                    if(dx < 0 || dy < 0) continue;
                    if(!locations[dx]) locations[dx] = []
                    callback(locations[dx][dy], locations[dx], dx, dy);
                }
            }
        },
        draw: function(ctx, resource, x, y, sw, sh){
            var distance = this.distance;

            this.items.forEach(function(item){
                if(!item.customDraw){
                    item.draw(ctx, resource, distance);
                }
            });
            // var x = 0;
            // var item;
            // for(var key in map){
            //     item = map[key];
            //     ctx.drawImage(item.img, item.x, item.y, item.dx || distance, item.dy || distance, 
            //                             (x % 8) * distance, Math.floor(x / 8) * distance, item.dx || distance, item.dy || distance);
            //     x++;
            // }
        }
    }

    var MapGenerator = function(){
        this.monsterCount = 0;
        this.monsterMaxLevel = 1;
        this.hills = 0;
        this.steps = 0;
        this.distance = 16;
    }

    MapGenerator.prototype = {
        generateMap: function(w, h){
            var distance = this.distance;
            var map = new MapManager(distance, w, h);
            var x = 0;

            while(x < w){
                map.add(DrawableItem.Create(x, distance, 'top'));
                x += distance;
            }

            return map;
        }
    }

    global.MapGenerator = MapGenerator;
})(window);