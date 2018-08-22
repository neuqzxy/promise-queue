const PromiseQueue = require('../index');

let promiseQueue = new PromiseQueue(5, {timeout: 1000, refuse: true});
promiseQueue.on('full', (data) => {
  console.log(data);
});
promiseQueue.on('achieve', () => {
  console.log('完成');
});
promiseQueue.on('timeout', () => {
  console.log('超时');
});

for (let i = 0; i < 100; i++) {
  let time = parseInt(Math.random() * 2000);
  promiseQueue.push(() => new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(i);
      resolve();
    }, time)
  }))
}
