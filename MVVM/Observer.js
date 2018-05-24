function Observer(data) {
    this.data = data;
    //取出所有属性遍历；
    this.init(data);
}


Observer.prototype = {
    init: function (data) {
        var self = this;
        Object.keys(data).forEach(function (key) {
            self.defineReactive(data, key, data[key]);
        })
    },

    defineReactive: function (data, key, val){
    var dep = new Dep();
    observe(val); //监听子属性
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if(Dep.target){
                dep.addSub(Dep.target);
            }
            return val;
        },
        set: function (newVal) {
            if (val == newVal) return;

            //如果数据发生改变，通知所有订阅者；
            val = newVal;
            dep.notify();
        }
    })
}
};


function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};


function Dep() {
    this.subs = [];

}

Dep.prototype = {
    addSub: function (lis) {
        this.subs.push(lis);
    },

    notify:function () {
        this.subs.forEach(function (value) {
            value.update();
        })
    }
}

Dep.target = null;
