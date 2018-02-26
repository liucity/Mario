(function(global){
    var DrawableItem = global.DrawableItem;
    var MapManager = global.MapManager;

    var MapGenerator = function(){
        this.monsterCount = 0;
        this.monsterMaxLevel = 1;
        this.hills = 0;
        this.steps = 0;
    }

    MapGenerator.prototype = {
        generateMap: function(resource, w, h, screenW, screenH){
            var distance = 16;
            var map = new MapManager(distance, w, h, screenW, screenH);
            var x = 0;

            while(x < w){
                map.add(DrawableItem.Create(resource, x, distance, 'top'));
                x += distance;
            }

            return map;
        }
    }

    global.MapGenerator = MapGenerator;
})(window);