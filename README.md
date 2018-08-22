# Promise-queue

一个依赖`Promise`的异步队列模块，可以方便的控制并发量

## 安装

```
npm install --save xz-promise-queue
```

## 如何使用

首先创建一个`promiseQueue`实例
```
const PromiseQueue = require('../index');

let promiseQueue = new PromiseQueue(5 [,options]);
```

> options

传递的参数，是一个对象，包括以下几个键值

```
refuse // 超过并发数时，是否放弃执行剩下的函数
timeout // 超时时间，默认不设置
ratio // 设置队列长度的比率
```

## API

只需要使用一个API，即可方便的控制我们的大量`Promise`异步流

> push

我们只需要提供一个返回`Promise`的函数即可

```
for (let i = 0; i < 100; i++) {
  let time = parseInt(Math.random() * 1000);
  promiseQueue.push(() => new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(i);
      resolve();
    }, time)
  }))
}
```

## 事件

> full

当队列正在排队时会触发，并且每次从队列中执行新函数时再次触发

```
promiseQueue.on('full', (data) => {
  console.log(data);
});
```

> achieve

当所有异步函数都执行完成后，触发`achieve`事件

> error

当执行的`Promise`中发生错误时，会触发`error`事件

> timeout

当有异步函数发生超时的时候，触发`timeout`事件（您必须指定超时时间）

[致敬Bagpipe](https://github.com/JacksonTian/bagpipe)
