define("modules/PubSub", function() {
  return {
    subscribe: function(scope, channel, callback) {
      (this.listeners[channel] || (this.listeners[channel] = [])).push({
        "scope": scope,
        "fn": callback
      });
    },
    publish: function(channel, data) {
      var subscribers = this.listeners[channel];
      for(var key in subscribers) {
        if(subscribers.hasOwnProperty(key)) {
          subscribers[key].fn.apply(subscribers[key].scope, data || {});
        }
      }
    }
  };
});