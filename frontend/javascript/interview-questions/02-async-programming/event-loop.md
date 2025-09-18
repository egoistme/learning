# Event Loop 事件循环 - 异步编程核心

> **难度**: ⭐⭐⭐⭐⭐ | **出现频率**: 95% | **重要程度**: 核心必考

## 📋 题目清单

### 🔥 基础概念题

#### 1. 什么是Event Loop？请详细解释其工作原理

**考察点**: JavaScript单线程机制、任务队列、微任务与宏任务

**参考答案**:

Event Loop是JavaScript运行时的核心机制，负责协调执行栈、任务队列和微任务队列的执行顺序。

**工作原理**:
```javascript
// Event Loop执行顺序示例
console.log('1'); // 同步任务，直接执行

setTimeout(() => {
    console.log('2'); // 宏任务，放入宏任务队列
}, 0);

Promise.resolve().then(() => {
    console.log('3'); // 微任务，放入微任务队列
});

console.log('4'); // 同步任务，直接执行

// 输出顺序: 1 4 3 2
```

**执行机制**:
1. 执行栈中的同步代码
2. 检查微任务队列，全部执行完
3. 取一个宏任务执行
4. 重复步骤2-3

---

#### 2. 微任务和宏任务有哪些？它们的执行优先级是什么？

**考察点**: 任务分类、优先级理解

**宏任务(MacroTask)**:
- `setTimeout`、`setInterval`
- `setImmediate` (Node.js)
- I/O操作
- UI渲染
- `MessageChannel`

**微任务(MicroTask)**:
- `Promise.then/catch/finally`
- `queueMicrotask`
- `MutationObserver`
- `process.nextTick` (Node.js，优先级最高)

```javascript
// 优先级验证
console.log('start');

setTimeout(() => console.log('timer1'), 0);
setTimeout(() => console.log('timer2'), 0);

Promise.resolve().then(() => console.log('promise1'));
Promise.resolve().then(() => console.log('promise2'));

console.log('end');

// 输出: start end promise1 promise2 timer1 timer2
```

---

### 🔥 复杂执行顺序题

#### 3. 分析下面代码的执行顺序 (字节跳动真题)

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(function() {
    console.log('setTimeout');
}, 0);

async1();

new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    console.log('promise2');
});

console.log('script end');
```

**详细分析**:

```javascript
// 执行步骤分析：

// 1. 同步代码执行
console.log('script start');      // 输出: script start

// 2. setTimeout 宏任务入队
setTimeout(function() {
    console.log('setTimeout');
}, 0);

// 3. 调用async1()
async function async1() {
    console.log('async1 start');   // 输出: async1 start
    await async2();                // await后面的代码相当于.then()，是微任务
    console.log('async1 end');     // 微任务
}

// 4. 调用async2()
async function async2() {
    console.log('async2');         // 输出: async2
}

// 5. Promise构造函数同步执行
new Promise(function(resolve) {
    console.log('promise1');       // 输出: promise1
    resolve();
}).then(function() {
    console.log('promise2');       // 微任务
});

// 6. 同步代码继续
console.log('script end');        // 输出: script end

// 最终输出顺序:
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

---

#### 4. Node.js中的Event Loop差异 (腾讯真题)

**考察点**: Node.js与浏览器Event Loop的区别、process.nextTick

```javascript
// Node.js特有的执行顺序
console.log('start');

setTimeout(() => console.log('timer1'), 0);
setTimeout(() => console.log('timer2'), 0);

setImmediate(() => console.log('immediate1'));
setImmediate(() => console.log('immediate2'));

process.nextTick(() => console.log('nextTick1'));
process.nextTick(() => console.log('nextTick2'));

Promise.resolve().then(() => console.log('promise1'));
Promise.resolve().then(() => console.log('promise2'));

console.log('end');

// Node.js输出（可能的顺序）:
// start
// end
// nextTick1
// nextTick2
// promise1
// promise2
// timer1
// timer2
// immediate1
// immediate2
```

**Node.js Event Loop阶段**:
```javascript
// Node.js Event Loop六个阶段
const phases = {
    'Timer': 'setTimeout, setInterval',
    'Pending callbacks': 'I/O回调',
    'Idle, prepare': '内部使用',
    'Poll': '获取新的I/O事件',
    'Check': 'setImmediate回调',
    'Close callbacks': '关闭回调'
};

// process.nextTick和Promise微任务在每个阶段结束后执行
// process.nextTick优先级高于Promise
```

---

### 🔥 实际应用题

#### 5. 实现一个任务调度器，控制并发数量 (阿里真题)

**考察点**: Event Loop应用、并发控制、异步编程实践

```javascript
class TaskScheduler {
    constructor(concurrency = 2) {
        this.concurrency = concurrency;    // 最大并发数
        this.running = 0;                  // 当前运行数
        this.queue = [];                   // 任务队列
    }

    // 添加任务
    addTask(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                task,
                resolve,
                reject
            });
            this.process();
        });
    }

    // 处理任务队列
    async process() {
        if (this.running >= this.concurrency || this.queue.length === 0) {
            return;
        }

        this.running++;
        const { task, resolve, reject } = this.queue.shift();

        try {
            const result = await task();
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.running--;
            // 使用微任务确保在当前宏任务结束后继续处理
            queueMicrotask(() => this.process());
        }
    }
}

// 使用示例
const scheduler = new TaskScheduler(2);

// 创建任务函数
const createTask = (name, delay) => {
    return () => new Promise(resolve => {
        console.log(`${name} started`);
        setTimeout(() => {
            console.log(`${name} finished`);
            resolve(name);
        }, delay);
    });
};

// 添加多个任务
const tasks = [
    scheduler.addTask(createTask('Task1', 1000)),
    scheduler.addTask(createTask('Task2', 500)),
    scheduler.addTask(createTask('Task3', 300)),
    scheduler.addTask(createTask('Task4', 400)),
];

Promise.all(tasks).then(results => {
    console.log('All tasks completed:', results);
});

// 输出顺序（大致）:
// Task1 started
// Task2 started
// Task2 finished
// Task3 started
// Task3 finished
// Task4 started
// Task1 finished
// Task4 finished
// All tasks completed: ['Task1', 'Task2', 'Task3', 'Task4']
```

---

#### 6. 手写一个基于Event Loop的防抖函数

**考察点**: 利用Event Loop特性优化性能、宏任务与微任务选择

```javascript
// 基于宏任务的防抖
function debounce(func, delay) {
    let timerId;

    return function(...args) {
        clearTimeout(timerId);

        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 基于微任务的立即执行防抖
function debounceImmediate(func, delay) {
    let timerId;
    let canRun = true;

    return function(...args) {
        if (canRun) {
            func.apply(this, args);
            canRun = false;

            // 使用微任务重置状态
            Promise.resolve().then(() => {
                setTimeout(() => {
                    canRun = true;
                }, delay);
            });
        }
    };
}

// 高级防抖：支持取消和立即执行
function advancedDebounce(func, delay, immediate = false) {
    let timerId;
    let cancelled = false;

    const debounced = function(...args) {
        if (cancelled) return;

        const callNow = immediate && !timerId;

        clearTimeout(timerId);

        timerId = setTimeout(() => {
            timerId = null;
            if (!immediate && !cancelled) {
                func.apply(this, args);
            }
        }, delay);

        if (callNow) {
            func.apply(this, args);
        }
    };

    // 取消防抖
    debounced.cancel = function() {
        clearTimeout(timerId);
        cancelled = true;
    };

    // 立即执行
    debounced.flush = function(...args) {
        clearTimeout(timerId);
        func.apply(this, args);
    };

    return debounced;
}

// 测试用例
const debouncedLog = advancedDebounce(console.log, 1000, true);

debouncedLog('第1次调用');  // 立即执行
debouncedLog('第2次调用');  // 被防抖
debouncedLog('第3次调用');  // 被防抖

setTimeout(() => {
    debouncedLog('第4次调用');  // 1秒后立即执行
}, 1500);
```

---

### 🔥 综合考察题

#### 7. 实现一个异步任务重试机制 (美团真题)

**考察点**: Promise、async/await、Event Loop、错误处理

```javascript
class RetryHandler {
    static async retry(
        asyncFn,
        maxRetries = 3,
        delay = 1000,
        backoff = 1.5
    ) {
        let lastError;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                console.log(`尝试第 ${attempt + 1} 次`);
                const result = await asyncFn();
                console.log(`第 ${attempt + 1} 次尝试成功`);
                return result;
            } catch (error) {
                lastError = error;
                console.log(`第 ${attempt + 1} 次尝试失败:`, error.message);

                // 如果不是最后一次尝试，则等待后重试
                if (attempt < maxRetries) {
                    const waitTime = delay * Math.pow(backoff, attempt);
                    console.log(`等待 ${waitTime}ms 后重试...`);

                    await new Promise(resolve => {
                        setTimeout(resolve, waitTime);
                    });
                }
            }
        }

        throw new Error(`重试 ${maxRetries + 1} 次后仍然失败: ${lastError.message}`);
    }

    // 支持取消的重试
    static createCancellableRetry() {
        let cancelled = false;

        const retry = async (asyncFn, maxRetries = 3, delay = 1000, backoff = 1.5) => {
            if (cancelled) throw new Error('操作已取消');

            let lastError;

            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                if (cancelled) throw new Error('操作已取消');

                try {
                    const result = await asyncFn();
                    return result;
                } catch (error) {
                    lastError = error;

                    if (attempt < maxRetries && !cancelled) {
                        const waitTime = delay * Math.pow(backoff, attempt);

                        // 可取消的延迟
                        await new Promise((resolve, reject) => {
                            const timerId = setTimeout(resolve, waitTime);

                            // 检查取消状态
                            const checkCancelled = () => {
                                if (cancelled) {
                                    clearTimeout(timerId);
                                    reject(new Error('操作已取消'));
                                } else {
                                    // 使用微任务继续检查
                                    queueMicrotask(checkCancelled);
                                }
                            };

                            checkCancelled();
                        });
                    }
                }
            }

            throw lastError;
        };

        const cancel = () => {
            cancelled = true;
        };

        return { retry, cancel };
    }
}

// 测试用例
async function unreliableTask() {
    // 模拟不稳定的网络请求
    const success = Math.random() > 0.7;

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (success) {
                resolve('任务成功完成');
            } else {
                reject(new Error('网络连接失败'));
            }
        }, 500);
    });
}

// 使用重试机制
async function testRetry() {
    try {
        const result = await RetryHandler.retry(unreliableTask, 3, 1000, 1.5);
        console.log('最终结果:', result);
    } catch (error) {
        console.error('最终失败:', error.message);
    }
}

testRetry();
```

---

## 💡 面试技巧

### 🎯 答题要点

1. **基础概念要扎实**
   - 清楚Event Loop的执行机制
   - 区分宏任务和微任务
   - 理解同步/异步代码的执行顺序

2. **实际应用要结合**
   - 防抖节流的实现原理
   - 异步流程控制
   - 性能优化场景

3. **边界情况要考虑**
   - Node.js与浏览器的差异
   - 错误处理机制
   - 内存泄漏防范

### 🎯 常见追问

1. **为什么需要Event Loop？**
   - JavaScript单线程特性
   - 非阻塞I/O实现
   - 用户体验优化

2. **如何避免Event Loop阻塞？**
   - 使用Web Workers
   - 任务分片处理
   - 合理使用异步API

3. **微任务的应用场景？**
   - DOM更新后的操作
   - 状态同步
   - 错误边界处理

### 🎯 性能优化

```javascript
// 任务分片处理大量数据
function processLargeArray(array, chunkSize = 1000) {
    let index = 0;

    function processChunk() {
        const start = index;
        const end = Math.min(index + chunkSize, array.length);

        // 处理当前块
        for (let i = start; i < end; i++) {
            // 处理array[i]
            array[i] = array[i] * 2;
        }

        index = end;

        // 如果还有数据，使用微任务继续处理
        if (index < array.length) {
            queueMicrotask(processChunk);
        } else {
            console.log('处理完成');
        }
    }

    processChunk();
}

// 使用示例
const largeArray = new Array(100000).fill(1);
processLargeArray(largeArray);
```

---

## 🔗 相关面试题

- [Promise深度解析](./promise.md)
- [async/await原理](./async-await.md)
- [防抖节流实现](../04-performance/debounce-throttle.md)
- [异步编程模式](./async-patterns.md)