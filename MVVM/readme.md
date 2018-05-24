## 基于vue实现的双向数据绑定

- 数据劫持+订阅者-发布者模式；
- 运用Object.defineProperty；
- 每当初次获取vue的data某个属性时，将它（它是一个watcher订阅者）添加为这个属性的订阅者，当data的这个属性改变时，调用每个订阅者的update方法；



## Show Time

#### 前话

+  vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过`Object.defineProperty()`来劫持各个属性的`setter`，`getter`，在数据变动时，在setter里发布消息给订阅者，触发相应的监听回调。
+ 关于订阅者发布者模式在前面那篇mvc的文章里有讲，就不赘述啦～





####这篇博文讲的还不错，以下是对他的代码进行的一些注释，以及自己的理解

http://www.cnblogs.com/canfoo/p/6891868.html

#### 首先看下observe.js文件

+ Observer类的构造函数需要传入一个data对象（vue的data属性），把data的属性都变成响应式；
+ Observer类的作用就是把传入data对象每个属性都变成一个发布者，设置属性的getter和setter，来添加订阅者，和让发布者知道何时通知订阅者；
+ 比如有些楼盘要开卖，有些人想买，他们在售楼小姐处做好想买哪个登记后，售楼小姐在楼盘开卖的时候通知他们；售楼小姐就相当于这个Observer啦～接下来的Dep类就相当于那张登记表，里面记录了顾客的联系方式；data的属性就相当于那些楼盘；
+ Observer类提供两个方法，walk方法调用defineReactive方法，设置data各个属性的getter和setter，并将为每个属性生成一个发布者；
+ Dep类也就是发布者-订阅者里的发布者类了，他有两个方法，addSub和notify方法，分别用于增加订阅者和通知所有订阅者；

```javascript
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var self = this;
        Object.keys(data).forEach(function(key) {
            self.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val);
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: function() {
                if (Dep.target) {
                    //判断订阅者是否是第一次调用get，如果是第一次，将它添加到发布者数组里；
                    dep.addSub(Dep.target);
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                dep.notify();
            }
        });
    }
};

function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }
    return new Observer(value);
};

function Dep () {
    this.subs = [];
}
Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};
Dep.target = null;
```



#### watcher.js文件

+ Watcher类用于定义一个订阅者类；
+ 构造函数需要传入的参数为一个vue对象，一个data的属性（这个属性作为发布者），一个回调函数cb；
+ update是发布者的notify方法会调用的回调函数。
+ update方法调用run方法，run方法会调用cb方法。
+ get方法用于初始化一个Watcher对象时，就将Watcher对象添加进data属性的订阅者；

```javascript
function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    this.value = this.get();  // 将自己添加到订阅器的操作
}

Watcher.prototype = {
    update: function() {
        this.run();
    },
    run: function() {
        var value = this.vm.data[this.exp];
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal);
        }
    },
    get: function() {
        Dep.target = this;  // 缓存自己
        var value = this.vm.data[this.exp]  // 执行监听器里的get函数，把自己添加为订阅者
        Dep.target = null;  // 释放自己
        return value;
    }
};
```





#### index.js文件

+ SelfVue类就是自己实现的Vue啦～
+ proxyKeys(key)用于实现 vm.xxx -> vm._data.xxx；

```javascript
function SelfVue (options) {
    var self = this;
    this.vm = this;
    this.data = options.data;

    Object.keys(this.data).forEach(function(key) {
        self.proxyKeys(key);
    });

    observe(this.data);
    new Compile(options.el, this.vm);
    return this;
}

SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}
```





#### compile.js

+ compile.js用于将我们的vue语句编译成html节点；

+ 首先构造函数会找到vue的el属性绑定的html节点；

+ nodeToFragment方法：将这个节点内容移动到fragment中；

+ compileModel方法用于编译v-model指令

  + 其中

  `new Watcher(this.vm, exp, function (value) {   self.modelUpdater(node, value);});`将自己添加为监听者；

  + `node.addEventListener('input', function(e) {...self.vm[exp] = newValue;...})`实现从输入框的值改变到data属性值的过程；

```javascript
function Compile(el, vm) {
    this.vm = vm;
    this.el = document.querySelector(el);
    this.fragment = null;
    this.init();
}

Compile.prototype = {
    init: function () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el);
            this.compileElement(this.fragment);
            this.el.appendChild(this.fragment);
        } else {
            console.log('Dom元素不存在');
        }
    },
    nodeToFragment: function (el) {
        var fragment = document.createDocumentFragment();
        var child = el.firstChild;
        while (child) {
            // 将Dom元素移入fragment中
            fragment.appendChild(child);
            child = el.firstChild
        }
        return fragment;
    },
    compileElement: function (el) {
        var childNodes = el.childNodes;
        var self = this;
        [].slice.call(childNodes).forEach(function(node) {
            var reg = /\{\{(.*)\}\}/;
            var text = node.textContent;

            if (self.isElementNode(node)) {  
                self.compile(node);
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, reg.exec(text)[1]);
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node);
            }
        });
    },
    compile: function(node) {
        var nodeAttrs = node.attributes;
        var self = this;
        Array.prototype.forEach.call(nodeAttrs, function(attr) {
            var attrName = attr.name;
            if (self.isDirective(attrName)) {
                var exp = attr.value;
                var dir = attrName.substring(2);
                if (self.isEventDirective(dir)) {  // 事件指令
                    self.compileEvent(node, self.vm, exp, dir);
                } else {  // v-model 指令
                    self.compileModel(node, self.vm, exp, dir);
                }
                node.removeAttribute(attrName);
            }
        });
    },
    compileText: function(node, exp) {
        var self = this;
        var initText = this.vm[exp];
        this.updateText(node, initText);
        new Watcher(this.vm, exp, function (value) {
            self.updateText(node, value);
        });
    },
    compileEvent: function (node, vm, exp, dir) {
        var eventType = dir.split(':')[1];
        var cb = vm.methods && vm.methods[exp];

        if (eventType && cb) {
            node.addEventListener(eventType, cb.bind(vm), false);
        }
    },
    compileModel: function (node, vm, exp, dir) {
        var self = this;
        var val = this.vm[exp];
        this.modelUpdater(node, val);
        new Watcher(this.vm, exp, function (value) {
            self.modelUpdater(node, value);
        });

        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }
            self.vm[exp] = newValue;
            val = newValue;
        });
    },
    updateText: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    },
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on:') === 0;
    },
    isElementNode: function (node) {
        return node.nodeType == 1;
    },
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
}

```



+ 这里说下有个坑：

  ```javascript
  var child = el.firstChild;
          while (child) {
              // 将Dom元素移入fragment中
              fragment.appendChild(child);
              child = el.firstChild
          }
  ```

  一开始不知道为什么这个while循环可以生效，查了一下mdn才知道：

  **appendChild（）的用法**

  > The `Node.appendChild()` method adds a node to the end of the list of children of a specified parent node.If the given child is a reference to an existing node in the document, `appendChild()` moves it from its current position to the new position (there is no requirement to remove the node from its parent node before appending it to some other node).

如果这个给定的要插入的child是document中已存在的节点中的引用，那么appendChild（）方法会把它从它现在的位置转移到新的位置，相当于一个剪切的效果；

+ [].slice.call(childNodes)可以将类数组对象转换成数组对象；

+ ```
  当一个文本节点前面和后面有换行符的时候，都只当做一个文本节点。
  ```





## vue.js

```javascript
function SelfVue (options) {
    var self = this;
    this.vm = this;
    this.data = options.data;

    Object.keys(this.data).forEach(function(key) {
        self.proxyKeys(key);
    });

    observe(this.data);
    new Compile(options.el, this.vm);
    return this;
}

SelfVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function proxyGetter() {
                return self.data[key];
            },
            set: function proxySetter(newVal) {
                self.data[key] = newVal;
            }
        });
    }
}
```



## 自己实现的效果～

最后楼主也根据以上代码，自己实现了一遍：

![](https://raw.githubusercontent.com/dy21335/Practice/master/MVVM/vue.gif)
