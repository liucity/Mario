(function(global){
    var EventHandler = global.EventHandler;

    var ResourceManager = function(){
        this.images = {};
        this.sounds = {};
        this.total = 0;
        this.count = 0;
        this.basePath = '';
    }

    ResourceManager.prototype = new EventHandler({
        addImage: function(name, src){
            if(!this.images[name]){
                var self = this;
                var image = new Image();
                image.onload = function(){
                    self.onLoad(image);
                };
                image.src = this.basePath + src;
                this.images[name] = image;
                this.total += 1; 
            }
            return this;
        },
        addAudio: function(name, src){
            var self = this;
            var audio = new Audio();
            audio.addEventListener('loadeddata', function(){
                self.onLoad(audio);
            })
            audio.src = this.basePath + src;
            this.sounds[name] = audio;
            this.total += 1; 
            return this;
        },
        getImage: function(name){
            return this.images[name];
        },
        cacheImage: function(name, canvas){
            if(!this.images[name]){
                var img = new Image();
                img.src = canvas.toDataURL();
                this.images[name] = img;
                this.count += 1;
                this.total += 1; 
            }
            return this;
        },
        onLoad: function(item){
            this.count += 1;
            this.fire('onLoad', this.count, this.total);
            if(this.count === this.total){
                this.fire('onAllLoaded');
            }
        }
    });

    global.ResourceManager = ResourceManager;
})(window);