(function(global){
    var Util = global.Util;
    var toArray = Util.toArray;
    var each = Util.each;
    var filter = Util.filter;
    var push = Array.prototype.push;
    var getNamesReg = /\s*\.\s*/g;
    var getNames = function(name){
        return (name || '').trim().split(getNamesReg);
    }

    var Handler = function(name, callback){
        this.name = name;
        this.callback = callback;
    }

    var EventHandler = function(props){
        Object.assign(this, props);
        this._handler = {};
    }

    EventHandler.prototype = {
        on: function(name){
            var handlers = this.getHandlers(name) || [];
            var args = toArray(arguments, 1);
            each(args, function(callback){
                handlers.push(
                    new Handler(name, callback)
                );
            })
            return this.setHandlers(name, handlers);
        },
        one: function(name){
            name = name + '.once';
            var handlers = this.getHandlers(name) || [];
            var self = this;
            each(toArray(arguments, 1), function(callback){
                var handler = new Handler(name, function(){
                    callback.call(self, arguments);
                    var _handlers = this.getHandlers(name) || [];
                    this.setHandlers(name, filter(_handlers, function(_h){
                        return _h !== handler;
                    }));
                });
                handlers.push(handler);
            })
            return this.setHandlers(name, handlers);
        },
        off: function(name){
            var handlers = this.getHandlers(name) || [];
            var reg = new RegExp('^' + name, 'i');
            handlers = filter(handlers, function(handler){
                return !reg.test(handler.name);
            });
            return this.setHandlers(name, handlers);
        },
        fire: function(name){
            var handlers = this.getHandlers(name) || [];
            var args = toArray(arguments, 1);
            var self = this;
            each(handlers, function(handler){
                return handler.callback.apply(self, args);
            });
            return this;
        },
        getHandlers: function(name){
            var names = getNames(name);
            return this._handler[names[0]];
        },
        setHandlers: function(name, handlers){
            var names = getNames(name);
            this._handler[names[0]] = handlers;
            return this;
        }
    }

    global.EventHandler = EventHandler;
})(window);