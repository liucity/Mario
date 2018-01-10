(function(global){
    var MapGenerator = function(){
        this.monsterCount = 0;
        this.monsterMaxLevel = 1;
        this.hills = 0;
        this.steps = 0;
    }

    MapGenerator.prototype = {
    }

    global.MapGenerator = MapGenerator;
})(window);