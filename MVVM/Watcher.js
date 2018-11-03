function Watcher(vm, exp, cb) {
    //vueSelf是我们自己要实现的vue，exp是vue的data属性的key，cb是notify对应的回调函数；
    this.vm = vm;
    this.exp = exp;
    this.cb = cb;
    //在生成一个Wathcer对象时，也就是Watcher初始化时，需要将它添加为订阅者；
    this.value = this.init();
}


Watcher.prototype = {
    init: function () {
        Dep.target = this;
        var value = this.vm.data[this.exp];
        Dep.target = null;
        return value;
    },

    update: function () {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if(value !== oldVal){
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    }
}