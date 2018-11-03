setTimeout(()=>console.log("one"),0);

console.log("two");
Promise.resolve().then(()=>{
    console.log("three")
})
setTimeout(()=>console.log("four"),0)
console.log("five");



//结果为：2，5，3，1，4 promise和setTimeout队列的时间循环的优先级不一样？

var a = void (0);
var b = void (1);
console.log(a,b)

