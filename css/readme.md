垂直居中问题一直是面试中的常见问题啦～今天就总结几种垂直居中的方法。

## 先水平居中

本文的栗子是一个div在如何在浏览中垂直居中（父元素为body），居中问题比较好解决，直接给用text-align：center即可；

#### html文件

```html
/*html*/
<body>
<div class="a">
    <h1>Am I centered yet?</h1>
    <p>Center me, please ~</p>
</div>
</body>
</html>
```

#### css文件

为了方便观察，我把一些背景设置那些无关样式，放到了style.css文件中，html文件直接引入；

```css
/*style.css*/
*{
    margin: 0;
    padding: 0;
    background-color: #F39C12 ;
}
.a{
    padding: 20px;
    width: 400px;
    background-color: #808B96;
    margin: 0 auto;
    text-align: center;
}

p,h1{
    background-color: #808B96;
}
```

#### 效果图

![](http://ww1.sinaimg.cn/large/ec07bbd2gy1frelt8v4nnj21ea0vgt9z.jpg)

可见灰色的div元素已经水平居中，接下来就是实现垂直居中啦～





## 1.基于绝对定位



### 1.1使用负外边距

+ 要求已知元素的固定的高度和宽度；

```html
<style>
    .a{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -54px;
        margin-left: -200px;
        width: 400px;
        height: 108px;
    }
</style>
<body>
<div class="a">
    <h1>Am I centered yet?</h1>
    <p>Center me, please ~</p>
</div>

</body>
```



+ 实际上就是把div的左上角放到正中间，再利用负外边距把元素的正中心放置于视口的正中心；



效果如下：

![](http://ww1.sinaimg.cn/large/ec07bbd2gy1frelxeboefj21f818i40a.jpg)





### 1.2使用translate

+ 使用translate就不需要知道div的宽度和高度啦～

```html
<style>
    .a{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
    }
</style>

<body>
<div class="a">
    <h1>Am I centered yet?</h1>
    <p>Center me, please ~</p>
</div>

</body>
```



+ 如上，因为div的height是根据内容自适应的，我们不知道它的大小，但是使用translate依然可以得到如下效果图：



![](http://ww1.sinaimg.cn/large/ec07bbd2gy1frem2zsojyj21f418mgnc.jpg)





## 2.基于Flexbox

+ 给父元素设置dispaly：flex；

+ 注意：align-items必须用在已有高度的元素上。

  + 如果父元素为body，而body的容器高度是未知的，align-items将无效，所以在下面代码中给body设置了一个800px的高度；

    

```html
<style>
    body{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 800px;
    }
    .a{
        width: 400px;
    }
</style>
<body>
<div class="a">
    <h1>Am I centered yet?</h1>
    <p>Center me, please ~</p>
</div>
</body>
```



+ 效果图就如上面结果一样啦～
+ 注意flex可能有浏览器兼容问题，所以有时候需要加上前缀；



## 3.table

+ inline-block + text-align + table-cell + vertical-align
+ 如果父元素是body元素，要给他设置宽度。。

```html
<style>
    body{
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        height: 800px;
        width: 920px;
    }
    .a{
        display: inline-block;
        width: 400px;
    }
</style>
<body>
<div class="a">
    <h1>Am I centered yet?</h1>
    <p>Center me, please ~</p>
</div>

</body>
```





## 结尾

几天就先介绍这三种方法啦～



## 补充一些小tip

+ 关于margin
  +  margin的百分比的值是以父元素的宽度作为解析基准的；
  + margin的left和right 的值，其 auto 计算值取决于可用空间；
  + margin的top和bottom的值，其auto计算值为0；
+ 块级元素的高度自适应，宽度会自适应父类宽度；
+ vm是与视口宽度相关的；
  + 1vm表示视口宽度的1%；
  + 1vh表示视口高度的1%；
