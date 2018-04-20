(function(){
    var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global) ||
    this || {};
   
    function EventEmitter(){
        this._events={};
    }
    var proto=EventEmitter.prototype;

   function isValidListener(listener){
       if(typeof listener === 'function' || listener instanceof RegExp){
           return true;
       }else if(listener &&typeof listener === 'object'){
           return isValidListener(listener.listener);
       }else{
           return false;
       }
   }
    function indexOfListener(listeners,listener){
       for(var i=0;i<listeners.length;i++){
           if(listeners[i].listener === listener){
               return i;
           }
       }
       return -1;
        
    }

    proto.on=function(evt,listener){
        if(!isValidListener(listener)){
            throw new TypeError('listener must be a function');
        }

        var events=this._events;

        var listeners=events[evt]=events[evt] || [];
        var listenerIsWrapped=typeof listener === 'object';
        if(indexOfListener(listeners,listener) === -1){
            listeners.push(listenerIsWrapped ? listener : {
                listener:listener,
                once:false
            })
        }
        return this;

    }
    proto.once=function(evt,listener){
          return this.on(evt,{
              listener:listener,
              once:true
          })
    }
   proto.remove=function(evt,listener){
    var events=this._events;

    var listeners=events[evt];
    var index;
    for(var i=0,len=listeners.length;i<len;i++){
        if(listeners[i] && listeners[i].listener === listener){
            index=i;
            break;
        }
    }
    if(typeof index !=='undefined'){
        listeners.splice(index,1,null);
    }
    return this;
   }

   proto.emit=function(evt,args){
    var events=this._events;

    var listeners=events[evt];
    for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        if (listener) {
            listener.listener.apply(this, args || []);
            if (listener.once) {
                this.remove(evt, listener.listener)
            }
        }

    }

    return this;


   }
   if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = EventEmitter;
    }
    exports.EventEmitter = EventEmitter;
} else {
    root.EventEmitter = EventEmitter;
}

}());