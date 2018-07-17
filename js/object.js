function Father() {
    this.v = "father";
    this.aa = [1,2];
}

function Son() {
    this.a = "son";
}

Son.prototype = new Father();

var son1 = new Son();
var son2 = new Son();
son1.aa.push(3);
console.log(son1.v);//
son1.v = "jo";
console.log(son1.aa);
console.log(son2.aa);
console.log(son1.v);
console.log(son2.v);



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


