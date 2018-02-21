(function(global){
    var Util = global.Util;
    var toArray = Util.toArray;

    var MapManager = function(){
        this.items = [];
        this.locations = [];
    }

    MapManager.prototype = {
        add: function(){
            var self = this;
            var args = toArray(arguments);

            args.forEach(function(arg){
                arg.manager = self;
                self.items.push(arg);
                self.locate(arg, arg.x, arg.y);
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
        locate: function(item, x, y){
            var locations = this.locations;

            if(!locations[item.x]) locations[item.x] = [];
            if(locations[item.x][item.y]) locations[item.x][item.y] = null;
            item.x = x;
            item.y = y;
            locations[item.x][item.y] = item;
        },
        forEach: function(callback){
            this.items.forEach(callback);
        }
    }

    var MapItem = function(x, y, key, frame){
        this.x = x;
        this.y = y;
        this.key = key;
        this.frame = frame === undefined ? '' : frame;
    }

    MapItem.prototype = {
        x: 0,
        y: 0,
        manager: null,
        isMoveable: false,
        location: function(x, y){
            this.manager.locate(this, x, y);
        },
        move: function(x, y){

        },
        draw: function(){

        },
        crash: function(){

        }
    }

    var MapGenerator = function(resource, w, h){
        this.monsterCount = 0;
        this.monsterMaxLevel = 1;
        this.hills = 0;
        this.steps = 0;

        this.w = w;
        this.h = h;
        this.init(resource);
        this.generateMap(w, h);
    }

    MapGenerator.prototype = {
        init: function(resource){
            var imgMap = {};
            var map = resource.getImage('map');
            var distance = 16;
            var empty = { x: 0, y: 0 };
    
            var mapMap = {
                'smallBlock0': { x: 4, y: 0 },
                'smallBlock1': { x: 5, y: 0 },
                'smallBlock2': { x: 6, y: 0 },
                'smallBlock3': { x: 7, y: 0 },
                //
                'bigBlock0': { x: 0, y: 1 },
                'bigBlock1': { x: 1, y: 1 },
                'bigBlock2': { x: 2, y: 1 },
                'bigBlock3': { x: 3, y: 1 },
                //random block
                'giftBlock0': { x: 4, y: 1 },
                'giftBlock1': { x: 5, y: 1 },
                'giftBlock2': { x: 6, y: 1 },
                'giftBlock3': { x: 7, y: 1 },
                //coin
                'coin0': { x: 0, y: 2 },
                'coin1': { x: 1, y: 2 },
                'coin2': { x: 2, y: 2 },
                'coin3': { x: 3, y: 2 },
                //groud
                'topLeft': { x: 0, y: 8 },
                'top': { x: 1, y: 8 },
                'topRight': { x: 2, y: 8 },
                'J': { x: 3, y: 8 },
                'left': { x: 0, y: 9 },
                'middle': { x: 1, y: 9 },
                'right': { x: 2, y: 9 },
                'L': { x: 3, y: 9 },
                'bottomLeft': { x: 0, y: 10 },
                'bottom': { x: 1, y: 10 },
                'bottomRight': { x: 2, y: 10 },
                'xxxx': empty,
                //hill
                'hTopLeft': { x: 4, y: 8 },
                'hTop': { x: 5, y: 8 },
                'hTopRight': { x: 6, y: 8 },
                'hJ': { x: 7, y: 8 },
                'hLeft': { x: 4, y: 9 },
                'hMiddle': { x: 5, y: 9 },
                'hRight': { x: 6, y: 9 },
                'hL': { x: 7, y: 9 },
                'hBottomLeft': { x: 4, y: 10 },
                'hBottom': { x: 5, y: 10 },
                'hBottomRight': { x: 6, y: 10 },
                'yyyy': empty,
            };
    
            Object.keys(mapMap).forEach(function(key){
                mapMap[key].x *= distance;
                mapMap[key].y *= distance;
                mapMap[key].img = map;
                imgMap[key] = mapMap[key];
            });
    
            var items = resource.getImage('items');
            var itemMap = {
                'mashroom': { x: 0, y: 0 },
                'floor': { x: 1, y: 0 },
                'zzzz': empty,
                'wwww': empty
            }
    
            Object.keys(itemMap).forEach(function(key){
                itemMap[key].x *= distance;
                itemMap[key].y *= distance;
                itemMap[key].img = items;
                imgMap[key] = itemMap[key];
            });
    
            var enemies = resource.getImage('enemies');
            var enemyMap = {
                //red turtle
                'redTurtle0': { x: 0, y: 0 },
                'redTurtle1': { x: 1, y: 0 },
                'redTurtle2': { x: 2, y: 0 },
                'aaaa': empty,
                //red turtle shell
                'redShell0': { x: 3, y: 0 },
                'redShell1': { x: 4, y: 0 },
                'redShell2': { x: 5, y: 0 },
                'redShell3': { x: 6, y: 0 },
                //green turtle
                'greenTurtle0': { x: 0, y: 1 },
                'greenTurtle1': { x: 1, y: 1 },
                'greenTurtle2': { x: 2, y: 1 },
                'bbbb': empty,
                //green turtle shell
                'greenShell0': { x: 3, y: 1 },
                'greenShell1': { x: 4, y: 1 },
                'greenShell2': { x: 5, y: 1 },
                'greenShell3': { x: 6, y: 1 },
                //green turtle shell
                'greenShell0': { x: 3, y: 1 },
                'greenShell1': { x: 4, y: 1 },
                'greenShell2': { x: 5, y: 1 },
                'greenShell3': { x: 6, y: 1 },
                //Goombas
                'goombas0': { x: 0, y: 2 },
                'goombas1': { x: 1, y: 2 },
                'cccc': empty,
                'dddd': empty,
                //fire shell
                'fireShell0': { x: 0, y: 3 },
                'fireShell1': { x: 1, y: 3 },
                'eeee': empty,
                'ffff': empty,
                //wing
                'wing0': { x: 0, y: 4 },
                'wing1': { x: 1, y: 4 },
                'gggg': empty,
                'hhhh': empty,
                //flower
                'flower0': { x: 0, y: 6 },
                'flower1': { x: 1, y: 6 },
                'flower2': { x: 2, y: 6 },
                'flower3': { x: 3, y: 6 },
            }
    
            Object.keys(enemyMap).forEach(function(key){
                enemyMap[key].x *= distance;
                enemyMap[key].y *= distance * 2;
                enemyMap[key].dx = distance;
                enemyMap[key].dy = distance * 2;
                enemyMap[key].img = enemies;
                imgMap[key] = enemyMap[key];
            });
    
            empty.x = 0;
            empty.y = 0;
            empty.img = map;
    
            this.distance= distance;
            this.ImageMap = imgMap;
        },
        generateMap: function(w, h){
            var map = new MapManager();
            var x = 0;
            while(x < w){
                map.add(new MapItem(x, 10, 'top'));
                x++;
            }

            this.map = map;
        },
        draw: function(ctx){
            var w = this.w;
            var h = this.h;
            var map = this.ImageMap;
            var distance = this.distance;

            this.map.forEach(function(item){
                var drawItem = map[item.key + item.frame];
                if(!drawItem) return;
                ctx.drawImage(drawItem.img, drawItem.x, drawItem.y, drawItem.dx || distance, drawItem.dy || distance, 
                                            item.x, h - item.y, drawItem.dx || distance, drawItem.dy || distance);
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

    global.MapGenerator = MapGenerator;
})(window);