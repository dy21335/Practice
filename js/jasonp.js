
function jsonp(url) {
    let script = document.createElement('script');
    script.src = url;
    script.setAttribute("type","text/javascript");
    document.body.appendChild(script);
}

function cb(data) {
    //由于该网址返回的就是一个对象，所有不用在解析啦
    //var obj = JSON.parse(data);

    console.log(data.result[0]);
}


window.onload = function (ev) {
    var url = 'http://suggest.taobao.com/sug?code=utf-8&q=' + '卫衣' +'&callback=cb';
    jsonp(url);
}
