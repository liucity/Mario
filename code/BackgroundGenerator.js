(function(global){
    var random = function(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }
    var getIndexs = function(count){
        return Array.from(Array(Math.ceil(count))).map(function(item, i){
            return i;
        });
    }
    
    var getMap = function(rows, cols){
        rows = Math.ceil(rows);
        cols = Math.ceil(cols);
        var hs = [];
        var count = cols;
        var h
        while(count > 0){
            h = random(0, rows);
            if(h !== hs[hs.length - 1]){
                hs.push(h);
                count--;
            }
        }
        var map = [];
        cIndexs = getIndexs(cols);
        rIndexs = getIndexs(rows);
        cIndexs.forEach(function(c){
            var col = [];
            var h = hs[c];
            var nh = hs[c + 1] || 0;
            var pid;
            rIndexs.forEach(function(r){
                pid = undefined;
                if(h > nh){
                    if(r < nh){
                        pid = '|-';
                    } else if(r === nh){
                        pid = '|/';
                    } else if(r < h){
                        pid = '-|';
                    } else if (r === h){
                        pid = '\\';
                    }
                }else{
                    if(r < h){
                        pid = '-|';
                    } else if(r === h){
                        pid = '\\|';
                    } else if(r < nh){
                        pid = '|-';
                    } else if (r === nh){
                        pid = '/';
                    }
                }

                col.push(pid);
            });
            map.push(col);
        })
        return map;
    }

    var BackgroundGenerator = function(resource){
        this.bkImage = resource.getImage('background');
        this.bkImageMap = {
            0: { x: 4, y: 0 },
            1: { x: 4, y: 1 },
            2: { x: 4, y: 2 },
            '/': { x: 0, y: 0 },
            '\\': { x: 1, y: 0 },
            '|-': { x: 0, y: 1 },
            '-|': { x: 1, y: 1 },
            '\\|': { x: 0, y: 2 },
            '|/': { x: 1, y: 2 },
        };
    }

    BackgroundGenerator.prototype = {
        getBackground: function(w, h, rows, cols, distance){
            var bkImage = this.bkImage;
            var bkImageMap = this.bkImageMap;
            var backgroundTemp = document.createElement('canvas');
            backgroundTemp.width = w;
            backgroundTemp.height = h;
            var ctx = backgroundTemp.getContext("2d");
            var rIndexs = getIndexs(h / distance);
            var cIndexs = getIndexs(w / distance);

            //blue background
            cIndexs.forEach(function(c){
                rIndexs.forEach(function(r){
                    var imgMap = bkImageMap[Math.min(r, 2)];
                    ctx.drawImage(bkImage, distance * imgMap.x, distance * imgMap.y, distance, distance, 
                        distance * c, distance * r, distance, distance);
                })
            });

            //back hills
            getMap(h / distance - 3, w / distance).forEach(function(arr, c){
                arr.forEach(function(t, r){
                    var imgMap = bkImageMap[t];
                    if(!imgMap) return;
                    ctx.drawImage(bkImage, distance * (imgMap.x + 2), distance * imgMap.y, distance, distance, 
                                distance * c, distance * (rows - r - 1), distance, distance);
                })
            });

            return backgroundTemp;
        },
        getForeground: function(w, h, rows, cols, distance, bkImage){
            var bkImage = this.bkImage;
            var bkImageMap = this.bkImageMap;
            var foregroundTemp = document.createElement('canvas');
            foregroundTemp.width = w;
            foregroundTemp.height = h;
            var tctx = foregroundTemp.getContext("2d");
            
            getMap(h / distance - 3, w / distance + 1).forEach(function(arr, c){
                arr.forEach(function(t, r){
                    var imgMap = bkImageMap[t];
                    if(!imgMap) return;
                    tctx.drawImage(bkImage, distance * imgMap.x, distance * imgMap.y, distance, distance, 
                                distance * c, distance * (rows - r - 1), distance, distance);
                })
            });

            return foregroundTemp;
        }
    }

    global.BackgroundGenerator = BackgroundGenerator;
})(window);