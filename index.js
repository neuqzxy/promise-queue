'use strict';
const EventEmitter = require('events');

module.exports = class PromiseQueue extends EventEmitter {
  constructor(limit = 6, options = {}) {
    super();
    // 并发限制
    this.limit = limit;
    // 当前活跃数
    this.active = 0;
    // 异步队列
    this.queue = [];
    this.options = {
      // 超过并发数时，是否拒绝执行
      refuse: false,
      // 超时时间
      timeout: undefined,
      ratio: 1
    };
    // 合并options，为了兼容，没有使用对象扩展运算符
    let keys = Object.keys(options);
    keys.forEach(item => {
      if (item in this.options) {
        this.options[item] = options[item];
      }
    });
    this.queueLength = parseInt(this.limit * (this.options.ratio || 1))
  }

  push(promiseFac) {
    if (this.queue.length < this.queueLength || !this.options.refuse) {
      this.queue.push(promiseFac);
    }
    this.next();
    return this;
  }
  next() {
    if (this.active >= this.limit || !this.queue.length) {
      if (!this.queue.length && !this.active) {
        this.emit('achieve');
      }
      return null;
    }
    if (this.active === this.limit - 1) {
      this.emit('full', {active: this.active, limit: this.limit});
    }
    this.active++;
    const promiseFac = this.queue.shift();
    let promise = promiseFac();
    let timer;
    if (this.options.timeout) {
      timer = setTimeout(() => {
        this.emit('timeout');
        this.next();
      }, this.options.timeout);
    }
    promise.then(() => {
      this.active--;
      if (timer) {
        clearTimeout(timer);
      }
      this.next();
    }).catch(err => {
      this.emit('error', err)
    })
  }
}