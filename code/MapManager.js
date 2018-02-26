(function(global){
    var Defines = global.Defines;
    var limitation = Defines.MarioLimitation;
    var Util = global.Util;
    var toArray = Util.toArray;
    var intArgs = Util.intArgs;

    //helper
    var max = Math.max;
    var min = Math.min;
    var round = Math.round;
    var range = function(v, minV, maxV){
        return max(minV, min(v, maxV));
    }

    var MapManager = function(baseLineHeight, width, height, screenW, screenH){
        intArgs(arguments);

        this.baseY = baseLineHeight;
        this.w = width;
        this.h = height;
        this.screenW = screenW;
        this.screenH = screenH;

        this.items = [];
        this.locations = [];

        this.camera(screenW / 2, screenH / 2);
    }

    MapManager.prototype = {
        camera: function(x, y){
            intArgs(arguments);

            this.x = range(x - this.screenW / 2, 0, this.w - this.screenW / 2);
            this.y = range(y - this.screenH / 2, 0, this.h - this.screenH / 2);
        },
        
        getDrawY: function(y){
            return this.h - y;
        },
        add: function(){
            var self = this;
            var args = toArray(arguments);

            args.forEach(function(arg){
                if(self.items.indexOf(arg) === -1){
                    arg.manager = self;
                    if(arg.x === undefined) arg.x = 0;
                    if(arg.y === undefined) arg.y = self.baseY + arg.h;
                    arg.drawY = self.getDrawY(arg.y);
                    self.items.push(arg);
                    self.locate(arg, arg.x, arg.y);
                }
            });
        },
        remove: function(){
            var args = toArray(arguments);

            this.items = this.items.filter(function(item){
                if(args.indexOf(item) > -1){
                    item.manager = null;
                    item.drawY = null;
                    return false;
                }
                return true;
            });
        },
        cleanLocation: function(item){
            this.pointInRange(item.x - item.w / 2, item.y, item.w, item.h, function(obj, row, _x, _y){
                row[_y] = null;
            });
        },
        setLocation: function(item){
            this.pointInRange(item.x - item.w / 2, item.y, item.w, item.h, function(obj, row, _x, _y){
                row[_y] = item;
            });
        },
        getItemsInRange: function(x, y, w, h, item){
            var collideObjs = [];
            this.pointInRange(x, y, w, h, function(obj, row, _x, _y){
                if(obj != null && collideObjs.indexOf(obj) === -1 && item !== obj) collideObjs.push(obj);
            });
            return collideObjs;
        },
        locate: function(item, x, y){
            var collideObjs = this.getItemsInRange(item.x - item.w / 2, item.y, item.w, item.h, item);
            if(collideObjs.length) {
                return item.collide.apply(item, collideObjs);
            }

            this.cleanLocation(item);
            
            item.x = x;
            item.y = y;
            item.drawY = this.getDrawY(y);

            this.setLocation(item);
            return true;
        },
        pointInRange: function(x, y, w, h, callback){
            intArgs(arguments);

            var locations = this.locations;
            var dx, dy, isCancel;

            var i = 0, j = 0;
            for(; i < w; i++){
                j = 0;
                for(; j < h; j++){
                    dx = x + i;
                    dy = y + j;
                    if(dx < 0 || dy < 0) continue;
                    if(!locations[dx]) locations[dx] = []
                    if(callback(locations[dx][dy], locations[dx], dx, dy) === false){
                        isCancel = true;
                        break;
                    }
                }
                if(isCancel) break;
            }
        },
        draw: function(ctx, t){
            this.updateStatus(t);

            ctx.save();
            ctx.translate(-this.x, -this.y);
            this.getItemsInRange(this.x, this.y, this.screenW, this.screenH).forEach(function(item){
                item.draw(ctx, t);
            });
            ctx.restore();
            // var x = 0;
            // var item;
            // for(var key in map){
            //     item = map[key];
            //     ctx.drawImage(item.img, item.x, item.y, item.dx || distance, item.dy || distance, 
            //                             (x % 8) * distance, Math.floor(x / 8) * distance, item.dx || distance, item.dy || distance);
            //     x++;
            // }
        },

        updateStatus: function(t){
            var dt = this.getTimeStamp('status', t);

            var self = this;
            var items = this.items;

            items.forEach(function(item){
                if(!item.isMoveable) return;
                if(!item.ignoreGravity) self.updateGravity(item, dt);
                if(!item.ignoreMovement) self.updateMovement(item, dt);
            })
        },

        updateGravity: function(item, dt){
            var isFallable = true;
            this.pointInRange(item.x - item.w / 2, item.y - 1, item.w, 1, function(obj){
                if(obj && obj !== item){
                    isFallable = false;
                    return false;
                }
            });

            if(isFallable){
                item.ay -= limitation.jump * 3 * dt;
            }else{
                item.ay = 0;
                item.canJump = true;
            }
        },

        updateMovement: function(item, dt){
            var dx = 0, dy = 0;
            if(item.ax) dx = item.ax * dt;
            if(item.ay) dy = item.ay * dt;

            if(dx === 0 && dy === 0) return false;

            var collideObjs = this.getItemsInRange(item.x - item.w / 2, item.y + dy, item.w, item.h, item);
            if(collideObjs.length){
                if(item.ay > 0){
                    dy = Math.min.apply(null, collideObjs.map(function(obj){
                        return obj.y;
                    })) - (item.y + item.h);
                }else{
                    dy = Math.max.apply(null, collideObjs.map(function(obj){
                        return obj.y + obj.h;
                    })) - item.y;
                }
                item.ay = 0;
                item.ignoreGravity = false;
            }

            collideObjs = this.getItemsInRange(item.x - item.w / 2 + dx, item.y, item.w, item.h, item);
            if(collideObjs.length){
                if(item.ax > 0){
                    dx = Math.min.apply(null, collideObjs.map(function(obj){
                        return obj.x - obj.w / 2;
                    })) - (item.x + item.w / 2);
                }else{
                    dx = Math.max.apply(null, collideObjs.map(function(obj){
                        return obj.x + obj.w / 2;
                    })) - (item.x + item.w / 2);
                }
                item.ax = 0;
            }

            if(dx === 0 && dy === 0) return false;

            item.y += dy;
            item.drawY = this.getDrawY(item.y);
            item.x += dx;

            item.fire('moved', item.x, item.y);
        },

        getTimeStamp: function(key, t){
            key = '_t_' + key;
            if(!this[key]) this[key] = t - 16;
            var val = (t - this[key]) / 1000;
            this[key] = t;
            return val;
        }
    }

    global.MapManager = MapManager;
})(window)