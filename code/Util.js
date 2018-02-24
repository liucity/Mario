(function(global){
    var slice = Array.prototype.slice;
    var round = Math.round;

    var toArray = function(arrLike, count) {
        return slice.call(arrLike, count);
    };

    var Util = {
        getTime: Date.now,

        each: function(arr, callback) {
            var l = arr.length, i = 0;
            for(; i < l;i++){
                if(callback.call(arr[i], arr[i], i) === false) break;
            }
        },
        filter: function(arr, callback){
            var l = arr.length, i = 0, item;
            var newArr = [];
            for(; i < l;i++){
                item = arr[i];
                if(callback.call(item, item, i)) {
                    newArr.push(item);
                }
            }
            return newArr;
        },
        toArray: toArray,
        intArgs: function(args){
            toArray(args).forEach(function(arg, i){
                if(typeof(arg) === 'number') args[i] = round(arg);
            });
        }
    };

    global.Util = Util;
})(window);