(function(global){
    var slice = Array.prototype.slice;

    var Util = {
        getTime: Date.now,

        each: function(arr, callback){
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
        toArray: function(arrLike, count){
            return slice.call(arrLike, count);
        }
    };

    global.Util = Util;
})(window);