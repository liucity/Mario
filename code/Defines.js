(function(global){
    var ImageMap = (function(){
        var imgMap = {};
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
            mapMap[key].w = distance;
            mapMap[key].h = distance;
            mapMap[key].imgKey = 'map';
            imgMap[key] = mapMap[key];
        });

        var itemMap = {
            'mashroom': { x: 0, y: 0 },
            'floor': { x: 1, y: 0 },
            'zzzz': empty,
            'wwww': empty
        }

        Object.keys(itemMap).forEach(function(key){
            itemMap[key].x *= distance;
            itemMap[key].y *= distance;
            itemMap[key].w = distance;
            itemMap[key].h = distance;
            itemMap[key].imgKey = 'items';
            imgMap[key] = itemMap[key];
        });

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
            enemyMap[key].w = distance;
            enemyMap[key].h = distance * 2;
            enemyMap[key].imgKey = 'enemies';
            imgMap[key] = enemyMap[key];
        });

        empty.x = 0;
        empty.y = 0;
        empty.imgKey = 'map';

        return imgMap;
    })();

    global.Defines = {
        //
        direction: {
            LEFT: -1,
            RIGHT: 1
        },
        //
        status: {
            normal: 0,
            moving: 1,
            jumping: 2,
            dying: 3,
            levelUp: 4,
            levelDown: 5,
            firing: 6,
            carried: 7
        },
        //
        MarioLevel: {
            deadMario: 0,
            smallMario: 1,
            mario: 2,
            fireMario: 3
        },
        //
        MarioLimitation: {
            speed: 150,
            jump: 150
        },

        ImageMap: ImageMap
    };
})(window);