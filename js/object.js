function Father(name) {
    this.name = name;
    this.a = ['a','b','c'];
}

Father.prototype.sayName = function () {
    console.log(this.name)
}

function Son(name) {
    //继承属性
    Father.call(this,name);//第一次调用父类构造函数
    this.sontest = 'i am son property'
}

//继承方法
Son.prototype = Father.prototype;//第二次调用父类构造函数
son1 = new Son('haha');
son2 = new Son('haha2');
son1.sayName();
son2.sayName();
console.log(son1.constructor);



// function Father() {
//     this.v = "father";
//     this.a = ['a','b','c'];
// }
//
// Father.prototype.sayName = function () {
//     console.log(this.name)
// }
//
// function Son() {
//     Father.call(this);
// }
//
// var son1 = new Son();
// var father1 = new Father();
// son1.a.push("d");
// console.log(son1.a); //[ 'a', 'b', 'c', 'd' ]
// console.log(father1.a); //[ 'a', 'b', 'c' ]

// function Father(name) {
//     this.name = name;
//     this.a = ['a','b','c'];
// }
//
// Father.prototype.sayName = function () {
//     console.log(this.name)
// }
//
// function Son(name) {
//     //继承属性
//     Father.call(this,name);
// }
//
// //继承方法
// Son.prototype = new Father();
// Son.prototype.constructor = Father;
//
// var son1 = new Son("son");
// son1.a.push("d");
//
// console.log(son1.a);
// console.log(son1.a);


