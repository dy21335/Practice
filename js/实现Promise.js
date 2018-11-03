var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
function Promise(fn) {
    var self = this;
    self.state = PENDING;
    self.value = null;
    self.handlers = [];
    function fulfill(result) {
        if(self.state === PENDING) {
            self.state = FULFILLED;
            self.value = result;
            for(var i = 0; i<self.handlers.length; i++) {
                self.handlers[i](result);
            }
        }
    }
    function reject(err) {
        if(self.state === PENDING) {
            self.state = REJECTED;
            self.value = err;
        }
    }
    fn && fn(fulfill,reject);
}
Promise.prototype.then = function(onResolved, onRejected) {
    var self = this;
    return new Promise(function(resolve, reject) {
        var onResolvedFade = function(val) {
            var ret = onResolved ? onResolved(val) : val;
            resolve(ret);
        };
        var onRejectedFade = function(val) {
            var ret = onRejected ? onRejected(val) : val;
            reject(ret);
        };
        self.handlers.push(onResolvedFade);
        if(self.state === FULFILLED) {
            onResolvedFade(self.value);
        }
        if(self.state === REJECTED) {
            onRejectedFade(self.value);
        }
    })
}
