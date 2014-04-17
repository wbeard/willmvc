(function(global) {

  function Promise(fn) {
    var callback = null;
    this.then = function(cb) {
      callback = cb;
    }
    function resolve(value) {
      callback(value);
    }
    fn(resolve);
  }

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
        node.src = path + ".js";
        return node;
      },
      attachNode = function(node) {
        try {
          global.document.head.appendChild(node);
        } catch(ex) {
          global.document.head.remove(node);
        }
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
            loaded[name].status = 0;
            loaded[name].id = counter;
            loaded[name].path  = name + ".js";
            loaded[name].deps = deps;
            loaded[name].fn = fn;
            counter++;
          },
          get: function(name) {
            return loaded[name] || null;
          }
        };
      }()),
      load = function(moduleName) {
        var node = makeNode(moduleName);
        attachNode(node);
      };

  global.define = function(name, deps, fn) {
    var moduleCallbackArray = [];

    if(isFunction(deps)) {
      fn = deps;
      deps = null;
    }

    each(deps, function(dep) {
      load(dep)
    });

    modules.add(name, deps, fn);

    modules.get(name).status = "loaded";
  };

  global.require = function(deps) {

    var callback = null, callBackArray = [];

    if(isFunction(deps)) {
      fn = deps;
      deps = null;
    }
  
    if(typeof deps === "string") {
      var tempArray = [];
      tempArray.push(deps);
      deps = tempArray;
    }

    deps.forEach(function(module) {
      if(!modules.get(module)) {
        load(module);
      }
    });

    function resolve(value) {
      callback(value);
    }

    return {
      then: function(cb) {
        deps.forEach(function(module) {
          callBackArray.push(modules.get(module).fn);
        });
        cb(callBackArray);
      }
    };

  };

  global.getModule = function(module) {
    return modules.get(module);
  }

}(window));