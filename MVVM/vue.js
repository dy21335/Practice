
function SelfVue(options) {
    var self = this;
    this.vm = this;
    this.data = options.data;
    this.$options = options;

    //属性代理，实现 vm.xxx -> vm._data.xxx
    Object.keys(this.data).forEach(function (key) {
        self._proxy(key);
    });

    observe(this.data);
    new Compile(options.el, this.vm);
    return this;
}

SelfVue.prototype = {
    _proxy: function (key) {
        var self = this;
        Object.defineProperty(self, key, {
            configurable: true,
            enumerable: false,
            get: function () {
                return self.data[key];
            },
            set:function (v) {
                self.data[key] = v;
            }
        });
    }
}


