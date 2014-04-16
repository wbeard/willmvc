(function(global) {

  var isBrowser = global.document ? true : {},
      isArray = function(arr) {
        return Object.prototype.toString.call(arr) === '[object Array]';
      },
      isFunction = function(arr) {
        return Object.prototype.toString.call(arr) === '[object Function]';
      },
      isUndefined = function(obj) {
        return typeof obj === "undefined";
      },
      each = function(arr, func) {
        if(arr) {
          var i, length = arr.length;
          for(i = 0; i < length; i+=1) {
            if(arr[i] && func(arr[i], i, arr)) {
              break;
            }
          }
        }
      },
      makeNode = function(path) {
        var node = document.createElement("script");
        node.type = 'text/javascript';
        node.async = true;
        node.src = path + ".js";
        return node;
      },
      attachNode = function(node) {
        global.document.head.appendChild(node);
      },
      modules = (function() {
        var counter = 0,
            loaded = {},
            moduleExists = function(name) {
              return loaded[name];
            };
        return {
          add: function(name, deps, fn) {
            loaded[name] = {};
            loaded[name].id = counter;
            loaded[name].path  = name + ".js";
            loaded[name].fn = fn;
            counter++;
          },
          get: function(name) {
            return loaded[name] || null;
          }
        };
      }());

  global.define = function(name, deps, fn) {
    var moduleCallbackArray = [];

    if(isFunction(deps)) {
      fn = deps;
      deps = null;
    }

    modules.add(name, deps, fn);

  };

  global.require = function(deps, fn) {
    var scriptFragment;

    if(isFunction(deps)) {
      fn = deps;
      deps = null;
    }

    if(typeof deps === "string") {
      scriptFragment = makeNode(deps);
      attachNode(scriptFragment);
    }

    /*else {
      scriptFragment = global.createDocumentFragment();
      deps.forEach(function(module) {
        if(modules.add(module)) {
          var script = makeNode(modules.get(deps).path);
          scriptFragment.appendChild(script);
        }
      });
    }*/



    if(fn) {
      fn();
    }

  };

}(window));