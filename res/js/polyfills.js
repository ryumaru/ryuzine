/* 	POLYFILLS & PROTOTYPES
	=======================
	Adds support for various
	javascript methods for
	older browsers and new
	methods. Load this AFTER
	the Ryuzine javascripts!

*/

// we need to over-ride the usual compatibility check...
RYU.is_supported = function() {
	return true;
}

// Extend string to return CamelCase
String.prototype.toCamelCase = function(){
	return this.toLowerCase().replace(/^(.)|\s(.)|\#(.)/g, function (letter) { return letter.toUpperCase(); });
};

// Object.keys Polyfill
if (!Object.keys) Object.keys = function(o) {
  if (o !== Object(o))
    throw new TypeError('Object.keys called on a non-object');
  var k=[],p;
  for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
  return k;
}
// Array.isArray Polyfill
if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// Production steps of ECMA-262, Edition 5, 15.4.4.14
// Reference: http://es5.github.io/#x15.4.4.14
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
// getElementsByClassName --> querySelectorAll
(function() {
if (!document.getElementsByClassName) {
    var indexOf = [].indexOf || function(prop) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === prop) return i;
        }
        return -1;
    };
    getElementsByClassName = function(className, context) {
        var elems = document.querySelectorAll ? context.querySelectorAll("." + className) : (function() {
            var all = context.getElementsByTagName("*"),
                elements = [],
                i = 0;
            for (; i < all.length; i++) {
                if (all[i].className && (" " + all[i].className + " ").indexOf(" " + className + " ") > -1 && indexOf.call(elements, all[i]) === -1) elements.push(all[i]);
            }
            return elements;
        })();
        return elems;
    };
    document.getElementsByClassName = function(className) {
        return getElementsByClassName(className, document);
    };

    if(Element) {
        Element.prototype.getElementsByClassName = function(className) {
            return getElementsByClassName(className, this);
        };
    }
}
})();
// addEventListener/removeEventListener --> addEvent/removeEvent
(function (window, document, listeners_prop_name) {
    if ((!window.addEventListener || !window.removeEventListener) && window.attachEvent && window.detachEvent) {
        var is_callable = function (value) {
            return typeof value === 'function';
        };
        var listener_get = function (self, listener) {
            var listeners = listener[listeners_prop_name];
            if (listeners) {
                var lis;
                var i = listeners.length;
                while (i--) {
                    lis = listeners[i];
                    if (lis[0] === self) {
                        return lis[1];
                    }
                }
            }
        };
        var listener_set = function (self, listener, callback) {
            var listeners = listener[listeners_prop_name] || (listener[listeners_prop_name] = []);
            return listener_get(self, listener) || (listeners[listeners.length] = [self, callback], callback);
        };
        var docHijack = function (methodName) {
            var old = document[methodName];
            document[methodName] = function (v) {
                return addListen(old(v));
            };
        };
        var addEvent = function (type, listener, useCapture) {
            if (is_callable(listener)) {
                var self = this;
                self.attachEvent(
                    'on' + type,
                    listener_set(self, listener, function (e) {
                        e = e || window.event;
                        e.preventDefault = e.preventDefault || function () { e.returnValue = false };
                        e.stopPropagation = e.stopPropagation || function () { e.cancelBubble = true };
                        e.target = e.target || e.srcElement || document.documentElement;
                        e.currentTarget = e.currentTarget || self;
                        e.timeStamp = e.timeStamp || (new Date()).getTime();
                        listener.call(self, e);
                    })
                );
            }
        };
        var removeEvent = function (type, listener, useCapture) {
            if (is_callable(listener)) {
                var self = this;
                var lis = listener_get(self, listener);
                if (lis) {
                    self.detachEvent('on' + type, lis);
                }
            }
        };
        var addListen = function (obj) {
            var i = obj.length;
            if (i) {
                while (i--) {
                    obj[i].addEventListener = addEvent;
                    obj[i].removeEventListener = removeEvent;
                }
            } else {
                obj.addEventListener = addEvent;
                obj.removeEventListener = removeEvent;
            }
            return obj;
        };
		// IE8
        addListen([document, window]);
        if ('Element' in window) {
            var element = window.Element;
            element.prototype.addEventListener = addEvent;
            element.prototype.removeEventListener = removeEvent;
        } else {
        // IE < 8
            document.attachEvent('onreadystatechange', function () { addListen(document.all) });
            docHijack('getElementsByTagName');
            docHijack('getElementById');
            docHijack('createElement');
            addListen(document.all);
        }
    }
})(window, document, 'x-ms-event-listeners');