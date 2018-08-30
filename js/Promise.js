// const timeout = ms => new Promise((resolve, reject) => {
//     setTimeout(() => {
//     resolve();
// }, ms);
// });
//
// const ajax1 = () => timeout(2000).then(() => {
//     console.log('1');
// return 1;
// });
//
// const ajax2 = () => timeout(1000).then(() => {
//     console.log('2');
// return 2;
// });
//
// const ajax3 = () => timeout(2000).then(() => {
//     console.log('3');
// return 3;
// });
//
// const mergePromise = ajaxArray => {
//     // 在这里实现你的代码
//     var data = [];
//     var resArr = Promise.resolve();
//     ajaxArray.forEach(function (value) {
//         resArr = resArr.then(value).then(function (value2) {
//             data.push(value2)
//             return data
//         })
//     })
//     return resArr;
// };
//
// mergePromise([ajax1, ajax2, ajax3]).then(data => {
//     console.log('done');
// console.log(data); // data 为 [1, 2, 3]
// });
//
// // 分别输出
// // 1
// // 2
// // 3
// // done
// // [1, 2, 3]
//
//


function fn1(){
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            console.log('1')
            resolve();
        }, 2000);
    })
}

function fn2() {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            console.log('2')
            resolve();
        }, 1000);
    })
}

function fn3() {
    return new Promise((resolve, reject)=> {
        setTimeout(() => {
            console.log('3')
            resolve();
        }, 3000);
    })
}


console.log(fn1().then(fn2).then(fn3))


//输出结果:
//1
//2
//3







































