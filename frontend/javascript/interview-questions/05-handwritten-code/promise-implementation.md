# 手写Promise完整实现 - 大厂必考手写题

> **难度**: ⭐⭐⭐⭐⭐ | **出现频率**: 90% | **重要程度**: 核心必考

## 📋 题目清单

### 🔥 基础实现题

#### 1. 手写一个完整的Promise (字节跳动/腾讯/阿里共同考察)

**考察点**: Promise/A+规范、状态管理、异步处理、链式调用

```javascript
// Promise/A+规范完整实现
class MyPromise {
    static PENDING = 'pending';
    static FULFILLED = 'fulfilled';
    static REJECTED = 'rejected';

    constructor(executor) {
        this.state = MyPromise.PENDING;
        this.value = undefined;
        this.reason = undefined;

        // 存储成功和失败的回调函数
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        // resolve函数
        const resolve = (value) => {
            if (this.state === MyPromise.PENDING) {
                this.state = MyPromise.FULFILLED;
                this.value = value;

                // 执行所有成功回调
                this.onFulfilledCallbacks.forEach(callback => {
                    callback(value);
                });
            }
        };

        // reject函数
        const reject = (reason) => {
            if (this.state === MyPromise.PENDING) {
                this.state = MyPromise.REJECTED;
                this.reason = reason;

                // 执行所有失败回调
                this.onRejectedCallbacks.forEach(callback => {
                    callback(reason);
                });
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    // then方法实现
    then(onFulfilled, onRejected) {
        // 处理参数默认值
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

        // 返回新的Promise实现链式调用
        return new MyPromise((resolve, reject) => {
            // 封装fulfilled状态处理逻辑
            const handleFulfilled = (value) => {
                try {
                    const result = onFulfilled(value);
                    this.resolvePromise(result, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            };

            // 封装rejected状态处理逻辑
            const handleRejected = (reason) => {
                try {
                    const result = onRejected(reason);
                    this.resolvePromise(result, resolve, reject);
                } catch (error) {
                    reject(error);
                }
            };

            if (this.state === MyPromise.FULFILLED) {
                // 使用微任务确保异步执行
                queueMicrotask(() => handleFulfilled(this.value));
            } else if (this.state === MyPromise.REJECTED) {
                queueMicrotask(() => handleRejected(this.reason));
            } else {
                // pending状态，将回调存储起来
                this.onFulfilledCallbacks.push(() => {
                    queueMicrotask(() => handleFulfilled(this.value));
                });
                this.onRejectedCallbacks.push(() => {
                    queueMicrotask(() => handleRejected(this.reason));
                });
            }
        });
    }

    // 处理Promise解析逻辑
    resolvePromise(result, resolve, reject) {
        // 防止循环引用
        if (result === this) {
            return reject(new TypeError('Chaining cycle detected for promise'));
        }

        if (result instanceof MyPromise) {
            // 如果返回的是Promise，等待其完成
            result.then(resolve, reject);
        } else if (result !== null && (typeof result === 'object' || typeof result === 'function')) {
            // 处理thenable对象
            let then;
            try {
                then = result.then;
                if (typeof then === 'function') {
                    let called = false;
                    try {
                        then.call(
                            result,
                            (value) => {
                                if (called) return;
                                called = true;
                                this.resolvePromise(value, resolve, reject);
                            },
                            (reason) => {
                                if (called) return;
                                called = true;
                                reject(reason);
                            }
                        );
                    } catch (error) {
                        if (called) return;
                        reject(error);
                    }
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        } else {
            // 普通值直接resolve
            resolve(result);
        }
    }

    // catch方法实现
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    // finally方法实现
    finally(onFinally) {
        return this.then(
            value => MyPromise.resolve(onFinally()).then(() => value),
            reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
        );
    }

    // 静态方法：resolve
    static resolve(value) {
        if (value instanceof MyPromise) {
            return value;
        }
        return new MyPromise(resolve => resolve(value));
    }

    // 静态方法：reject
    static reject(reason) {
        return new MyPromise((resolve, reject) => reject(reason));
    }
}

// 测试用例
console.log('=== 基础功能测试 ===');

const promise1 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('成功1');
    }, 1000);
});

promise1
    .then(value => {
        console.log('第一个then:', value);
        return '成功2';
    })
    .then(value => {
        console.log('第二个then:', value);
        throw new Error('抛出错误');
    })
    .catch(error => {
        console.log('catch捕获:', error.message);
        return '恢复成功';
    })
    .then(value => {
        console.log('最后的then:', value);
    });
```

---

#### 2. 手写Promise.all (美团/滴滴高频考察)

**考察点**: 并发控制、错误处理、顺序保持

```javascript
// Promise.all完整实现
MyPromise.all = function(promises) {
    return new MyPromise((resolve, reject) => {
        // 参数校验
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }

        const length = promises.length;
        const results = new Array(length);
        let completedCount = 0;

        // 空数组直接resolve
        if (length === 0) {
            return resolve(results);
        }

        promises.forEach((promise, index) => {
            // 确保每个元素都是Promise
            MyPromise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completedCount++;

                    // 所有Promise都完成时resolve
                    if (completedCount === length) {
                        resolve(results);
                    }
                })
                .catch(error => {
                    // 任何一个Promise失败就reject
                    reject(error);
                });
        });
    });
};

// 使用示例
const testPromises = [
    MyPromise.resolve(1),
    new MyPromise(resolve => setTimeout(() => resolve(2), 100)),
    MyPromise.resolve(3),
    new MyPromise(resolve => setTimeout(() => resolve(4), 50))
];

MyPromise.all(testPromises)
    .then(results => {
        console.log('Promise.all结果:', results); // [1, 2, 3, 4]
    })
    .catch(error => {
        console.error('Promise.all错误:', error);
    });
```

---

#### 3. 手写Promise.race (腾讯/字节真题)

**考察点**: 竞态条件、最快响应处理

```javascript
// Promise.race完整实现
MyPromise.race = function(promises) {
    return new MyPromise((resolve, reject) => {
        // 参数校验
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }

        // 空数组返回永远pending的Promise
        if (promises.length === 0) {
            return; // 永远不resolve也不reject
        }

        promises.forEach(promise => {
            // 确保每个元素都是Promise
            MyPromise.resolve(promise)
                .then(resolve, reject); // 第一个完成的决定结果
        });
    });
};

// 测试竞态
const raceTest = [
    new MyPromise(resolve => setTimeout(() => resolve('慢速'), 200)),
    new MyPromise(resolve => setTimeout(() => resolve('快速'), 100)),
    new MyPromise((resolve, reject) => setTimeout(() => reject('错误'), 150))
];

MyPromise.race(raceTest)
    .then(result => {
        console.log('race获胜者:', result); // '快速'
    })
    .catch(error => {
        console.error('race错误:', error);
    });
```

---

#### 4. 手写Promise.allSettled (阿里/美团考察)

**考察点**: 全部结果收集、状态区分

```javascript
// Promise.allSettled实现
MyPromise.allSettled = function(promises) {
    return new MyPromise((resolve) => {
        // 参数校验
        if (!Array.isArray(promises)) {
            return resolve([]);
        }

        const length = promises.length;
        const results = new Array(length);
        let settledCount = 0;

        // 空数组直接resolve
        if (length === 0) {
            return resolve(results);
        }

        promises.forEach((promise, index) => {
            MyPromise.resolve(promise)
                .then(
                    value => {
                        results[index] = {
                            status: 'fulfilled',
                            value: value
                        };
                    },
                    reason => {
                        results[index] = {
                            status: 'rejected',
                            reason: reason
                        };
                    }
                )
                .finally(() => {
                    settledCount++;
                    if (settledCount === length) {
                        resolve(results);
                    }
                });
        });
    });
};

// 测试allSettled
const settledTest = [
    MyPromise.resolve('成功1'),
    MyPromise.reject('失败1'),
    new MyPromise(resolve => setTimeout(() => resolve('成功2'), 100)),
    MyPromise.reject('失败2')
];

MyPromise.allSettled(settledTest)
    .then(results => {
        console.log('allSettled结果:', results);
        // [
        //   { status: 'fulfilled', value: '成功1' },
        //   { status: 'rejected', reason: '失败1' },
        //   { status: 'fulfilled', value: '成功2' },
        //   { status: 'rejected', reason: '失败2' }
        // ]
    });
```

---

### 🔥 进阶实现题

#### 5. 手写Promise.any (ES2021新特性)

**考察点**: 第一个成功的Promise、AggregateError处理

```javascript
// Promise.any实现
MyPromise.any = function(promises) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }

        const length = promises.length;

        if (length === 0) {
            return reject(new AggregateError([], 'All promises were rejected'));
        }

        const errors = new Array(length);
        let rejectedCount = 0;

        promises.forEach((promise, index) => {
            MyPromise.resolve(promise)
                .then(value => {
                    // 第一个成功的直接resolve
                    resolve(value);
                })
                .catch(error => {
                    errors[index] = error;
                    rejectedCount++;

                    // 所有都失败时reject
                    if (rejectedCount === length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                });
        });
    });
};

// AggregateError实现（如果环境不支持）
if (typeof AggregateError === 'undefined') {
    window.AggregateError = class AggregateError extends Error {
        constructor(errors, message) {
            super(message);
            this.name = 'AggregateError';
            this.errors = errors;
        }
    };
}
```

---

#### 6. 实现带并发控制的Promise.all

**考察点**: 并发控制、资源管理、实际应用场景

```javascript
// 带并发控制的Promise.all
MyPromise.allWithConcurrency = function(promises, concurrency = 3) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('参数必须是数组'));
        }

        const length = promises.length;
        const results = new Array(length);
        let completedCount = 0;
        let runningCount = 0;
        let index = 0;

        if (length === 0) {
            return resolve(results);
        }

        const runNext = () => {
            while (runningCount < concurrency && index < length) {
                const currentIndex = index++;
                runningCount++;

                MyPromise.resolve(promises[currentIndex])
                    .then(value => {
                        results[currentIndex] = value;
                        completedCount++;
                        runningCount--;

                        if (completedCount === length) {
                            resolve(results);
                        } else {
                            runNext();
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        };

        runNext();
    });
};

// 测试并发控制
const createDelayedPromise = (value, delay) => {
    return new MyPromise(resolve => {
        console.log(`开始执行任务: ${value}`);
        setTimeout(() => {
            console.log(`完成任务: ${value}`);
            resolve(value);
        }, delay);
    });
};

const concurrencyTest = [
    createDelayedPromise('任务1', 1000),
    createDelayedPromise('任务2', 500),
    createDelayedPromise('任务3', 800),
    createDelayedPromise('任务4', 300),
    createDelayedPromise('任务5', 600),
    createDelayedPromise('任务6', 400)
];

console.log('开始并发控制测试（最大并发数: 2）');
MyPromise.allWithConcurrency(concurrencyTest, 2)
    .then(results => {
        console.log('并发控制结果:', results);
    });
```

---

#### 7. 实现Promise重试机制

**考察点**: 错误恢复、递归思维、实际工程应用

```javascript
// Promise重试实现
MyPromise.retry = function(promiseFactory, maxRetries = 3, delay = 1000) {
    return new MyPromise((resolve, reject) => {
        let attempts = 0;

        const attempt = () => {
            attempts++;
            console.log(`第 ${attempts} 次尝试`);

            promiseFactory()
                .then(resolve)
                .catch(error => {
                    console.log(`第 ${attempts} 次尝试失败:`, error.message);

                    if (attempts >= maxRetries) {
                        reject(new Error(`重试 ${maxRetries} 次后仍然失败: ${error.message}`));
                    } else {
                        // 延迟后重试
                        setTimeout(attempt, delay);
                    }
                });
        };

        attempt();
    });
};

// 指数退避重试
MyPromise.retryWithBackoff = function(promiseFactory, maxRetries = 3, baseDelay = 1000, backoffFactor = 2) {
    return new MyPromise((resolve, reject) => {
        let attempts = 0;

        const attempt = () => {
            attempts++;

            promiseFactory()
                .then(resolve)
                .catch(error => {
                    if (attempts >= maxRetries) {
                        reject(error);
                    } else {
                        const delay = baseDelay * Math.pow(backoffFactor, attempts - 1);
                        console.log(`第 ${attempts} 次尝试失败，${delay}ms 后重试`);
                        setTimeout(attempt, delay);
                    }
                });
        };

        attempt();
    });
};

// 测试重试机制
let retryCount = 0;
const unreliableTask = () => {
    return new MyPromise((resolve, reject) => {
        retryCount++;
        // 前2次失败，第3次成功
        if (retryCount < 3) {
            reject(new Error('网络错误'));
        } else {
            resolve('任务成功');
        }
    });
};

MyPromise.retry(unreliableTask, 3, 500)
    .then(result => {
        console.log('重试成功:', result);
    })
    .catch(error => {
        console.error('重试失败:', error.message);
    });
```

---

## 💡 面试技巧

### 🎯 核心考察点

1. **Promise/A+规范理解**
   - 三种状态及转换规则
   - then方法的链式调用
   - 错误处理机制

2. **异步编程掌握**
   - 微任务队列原理
   - 回调函数管理
   - 状态同步处理

3. **边界情况处理**
   - 循环引用检测
   - 参数类型验证
   - 错误传播机制

### 🎯 答题策略

1. **先说思路再写代码**
   ```
   1. 状态管理（pending/fulfilled/rejected）
   2. 回调队列维护
   3. then方法返回新Promise
   4. 错误处理和传播
   ```

2. **重点说明关键点**
   - 为什么使用微任务
   - 如何处理thenable对象
   - 循环引用的检测方法

3. **展示实际应用**
   - 网络请求重试
   - 并发控制
   - 错误恢复机制

### 🎯 常见追问

1. **Promise与async/await的关系？**
   - async/await是Promise的语法糖
   - 底层实现基于Generator

2. **如何处理Promise内存泄漏？**
   - 及时清理回调引用
   - 避免长期持有大对象

3. **Promise的性能优化？**
   - 合理控制并发数
   - 使用Promise.all并行处理
   - 避免不必要的链式调用

---

## 🔗 相关面试题

- [Event Loop事件循环](../02-async-programming/event-loop.md)
- [async/await原理](../02-async-programming/async-await.md)
- [异步编程模式](../02-async-programming/async-patterns.md)
- [Generator函数应用](../02-async-programming/generators.md)