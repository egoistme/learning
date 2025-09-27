# 手写题专项训练

> **面试重要度**: ⭐⭐⭐⭐⭐ (决定成败的关键环节)
> **技术深度**: 5年前端工程师必备的编码实现能力
> **掌握标准**: 限定时间内写出高质量、无bug的代码

## 📖 专项概述

手写题是前端面试中最重要的环节，它不仅考察代码实现能力，更考察编程思维、代码质量和问题解决能力。5年经验的工程师必须能在限定时间内写出高质量、无bug的代码。

## 🎯 题目分类与优先级

### ⭐⭐⭐⭐⭐ 核心必考 (95%+出现率)

| 类别 | 核心题目 | 技术要点 | 时间要求 |
|------|----------|----------|----------|
| **JS基础实现** | call/apply/bind, new, instanceof | this绑定、原型链 | 5-8分钟 |
| **Promise相关** | Promise实现、Promise.all/race | 异步编程、状态机 | 8-12分钟 |
| **工具函数** | 深拷贝、防抖节流、柯里化 | 闭包、递归、参数处理 | 5-10分钟 |
| **数组操作** | 数组去重、扁平化、排序 | 算法思维、边界处理 | 3-8分钟 |

### ⭐⭐⭐⭐ 高频重点 (70%+出现率)

| 类别 | 重点题目 | 技术要点 | 应用场景 |
|------|----------|----------|----------|
| **异步控制** | 并发限制、重试机制、超时控制 | 任务调度、错误处理 | 性能优化 |
| **设计模式** | 观察者模式、发布订阅、单例模式 | 解耦设计、事件系统 | 架构设计 |
| **数据结构** | 栈、队列、链表、树遍历 | 基础算法、递归思维 | 算法基础 |
| **算法实现** | 二分查找、快速排序、动态规划 | 复杂度分析、优化思维 | 问题求解 |

### ⭐⭐⭐ 进阶加分 (40%+出现率)

- 框架原理：简版响应式、虚拟DOM diff、路由实现
- 高级算法：LRU缓存、字符串匹配、图算法
- 性能优化：虚拟列表、图片懒加载、内存池

## 💻 核心必考题目详解

### 1. 手写call/apply/bind (必考⭐⭐⭐⭐⭐)

```javascript
// 手写call实现
Function.prototype.myCall = function(context, ...args) {
    // 处理context为null或undefined的情况
    context = context || globalThis;

    // 确保context是对象类型
    if (typeof context !== 'object') {
        context = Object(context);
    }

    // 创建唯一的属性名，避免覆盖原有属性
    const fnSymbol = Symbol('fn');
    context[fnSymbol] = this;

    // 执行函数并获取结果
    const result = context[fnSymbol](...args);

    // 删除临时属性
    delete context[fnSymbol];

    return result;
};

// 手写bind实现
Function.prototype.myBind = function(context, ...args1) {
    const fn = this;

    const boundFunction = function(...args2) {
        // 如果被当作构造函数调用
        if (new.target) {
            return new fn(...args1, ...args2);
        }
        // 普通函数调用
        return fn.myCall(context, ...args1, ...args2);
    };

    // 维护原型链
    if (fn.prototype) {
        boundFunction.prototype = Object.create(fn.prototype);
    }

    return boundFunction;
};
```

### 2. 手写Promise (核心必考⭐⭐⭐⭐⭐)

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.forEach(callback => callback());
            }
        };

        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.onRejectedCallbacks.forEach(callback => callback());
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };

        const promise2 = new MyPromise((resolve, reject) => {
            const handleFulfilled = () => {
                queueMicrotask(() => {
                    try {
                        const x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };

            const handleRejected = () => {
                queueMicrotask(() => {
                    try {
                        const x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            };

            if (this.state === 'fulfilled') {
                handleFulfilled();
            } else if (this.state === 'rejected') {
                handleRejected();
            } else {
                this.onFulfilledCallbacks.push(handleFulfilled);
                this.onRejectedCallbacks.push(handleRejected);
            }
        });

        return promise2;
    }

    static all(promises) {
        return new MyPromise((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Argument must be an array'));
            }

            const results = [];
            let completedCount = 0;

            if (promises.length === 0) {
                return resolve(results);
            }

            promises.forEach((promise, index) => {
                MyPromise.resolve(promise).then(
                    value => {
                        results[index] = value;
                        completedCount++;
                        if (completedCount === promises.length) {
                            resolve(results);
                        }
                    },
                    reason => reject(reason)
                );
            });
        });
    }
}
```

### 3. 手写深拷贝 (必考⭐⭐⭐⭐⭐)

```javascript
function deepClone(obj, cache = new WeakMap()) {
    // 处理基本类型和null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // 处理Date对象
    if (obj instanceof Date) {
        return new Date(obj);
    }

    // 处理RegExp对象
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }

    // 处理函数
    if (typeof obj === 'function') {
        return obj;
    }

    // 处理循环引用
    if (cache.has(obj)) {
        return cache.get(obj);
    }

    // 创建新对象，保持原型链
    let cloned;
    if (obj instanceof Array) {
        cloned = [];
    } else if (obj instanceof Set) {
        cloned = new Set();
    } else if (obj instanceof Map) {
        cloned = new Map();
    } else {
        cloned = Object.create(Object.getPrototypeOf(obj));
    }

    // 缓存当前对象
    cache.set(obj, cloned);

    // 处理Set
    if (obj instanceof Set) {
        obj.forEach(item => {
            cloned.add(deepClone(item, cache));
        });
        return cloned;
    }

    // 处理Map
    if (obj instanceof Map) {
        obj.forEach((value, key) => {
            cloned.set(deepClone(key, cache), deepClone(value, cache));
        });
        return cloned;
    }

    // 处理对象和数组
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key], cache);
        }
    }

    return cloned;
}
```

### 4. 手写防抖节流 (必考⭐⭐⭐⭐⭐)

```javascript
// 防抖：延迟执行，重新触发则重新计时
function debounce(func, delay, immediate = false) {
    let timerId = null;
    let result;

    const debounced = function(...args) {
        const callNow = immediate && !timerId;

        clearTimeout(timerId);

        timerId = setTimeout(() => {
            timerId = null;
            if (!immediate) {
                result = func.apply(this, args);
            }
        }, delay);

        if (callNow) {
            result = func.apply(this, args);
        }

        return result;
    };

    debounced.cancel = function() {
        clearTimeout(timerId);
        timerId = null;
    };

    debounced.flush = function(...args) {
        clearTimeout(timerId);
        timerId = null;
        return func.apply(this, args);
    };

    return debounced;
}

// 节流：固定时间间隔执行
function throttle(func, delay, options = {}) {
    let timerId = null;
    let lastCallTime = 0;
    let lastResult;

    const { leading = true, trailing = true } = options;

    const throttled = function(...args) {
        const now = Date.now();

        if (!leading && lastCallTime === 0) {
            lastCallTime = now;
        }

        const remaining = delay - (now - lastCallTime);

        if (remaining <= 0 || remaining > delay) {
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }

            lastCallTime = now;
            lastResult = func.apply(this, args);
        } else if (!timerId && trailing) {
            timerId = setTimeout(() => {
                lastCallTime = Date.now();
                timerId = null;
                lastResult = func.apply(this, args);
            }, remaining);
        }

        return lastResult;
    };

    throttled.cancel = function() {
        clearTimeout(timerId);
        timerId = null;
        lastCallTime = 0;
    };

    return throttled;
}
```

## 🧠 答题技巧与策略

### 标准答题流程 (10-15分钟)

```javascript
// 1. 理解题意 (1-2分钟)
- 确认输入输出格式
- 询问边界条件和特殊情况
- 明确性能要求

// 2. 设计思路 (2-3分钟)
- 说明算法思路和时间复杂度
- 选择合适的数据结构
- 考虑优化方案

// 3. 编码实现 (5-8分钟)
- 先写核心逻辑
- 再处理边界条件
- 添加错误处理

// 4. 测试验证 (2分钟)
- 写测试用例
- 验证边界情况
- 说明时间空间复杂度
```

### 代码质量要求

```javascript
// ✅ 好的实现标准
✓ 参数验证完整
✓ 边界条件处理
✓ 变量命名清晰
✓ 代码结构清晰
✓ 错误处理完善
✓ 性能考虑周全

// ❌ 常见失分点
✗ 忘记参数验证
✗ 没有处理边界条件
✗ 变量命名不清晰
✗ 没有考虑性能优化
✗ 代码逻辑混乱
✗ 语法错误
```

## 📊 高频算法题型

### 数组操作类
```javascript
// 数组去重
const uniqueArray = arr => [...new Set(arr)];

// 数组扁平化
const flattenArray = arr => arr.flat(Infinity);

// 数组排序
const quickSort = (arr) => {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    const left = arr.filter(x => x < pivot);
    const right = arr.filter(x => x > pivot);
    const middle = arr.filter(x => x === pivot);
    return [...quickSort(left), ...middle, ...quickSort(right)];
};
```

### 字符串处理类
```javascript
// 字符串翻转
const reverseString = str => str.split('').reverse().join('');

// 回文判断
const isPalindrome = str => {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
};
```

### 数据结构实现类
```javascript
// 栈实现
class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }
}
```

## 📚 学习路径建议

### 第1阶段：基础手写题 (1-2周)
- JavaScript基础实现类
- 工具函数实现类
- 数组操作类

### 第2阶段：异步编程类 (1周)
- Promise相关实现
- 异步控制类
- 并发处理类

### 第3阶段：算法数据结构 (2-3周)
- 基础算法实现
- 数据结构实现
- 查找排序算法

### 第4阶段：设计模式类 (1周)
- 观察者模式
- 单例模式
- 工厂模式

### 第5阶段：框架原理类 (2周)
- 响应式系统
- 虚拟DOM
- 路由实现

## 🎯 备考建议

### 练习策略
```javascript
1. 每日练习: 2-3道手写题
2. 分类突破: 按题型集中练习
3. 限时训练: 模拟面试环境
4. 代码优化: 追求最优解
5. 复盘总结: 归纳解题思路
```

### 面试技巧
```javascript
1. 思路清晰: 先说思路再编码
2. 边界考虑: 主动处理边界情况
3. 代码整洁: 变量命名规范
4. 测试意识: 主动写测试用例
5. 优化思维: 分析时间空间复杂度
```

## 📖 相关资源链接

- [LeetCode刷题指南](https://leetcode.cn/)
- [JavaScript手写题集合](待补充)
- [算法与数据结构](待补充)

## 🚧 待补充内容

> **注意**: 当前为概述版本，后续将补充以下详细内容：

- [ ] 100道高频手写题完整实现
- [ ] 每道题的多种解法对比
- [ ] 面试官常问追问题汇总
- [ ] 代码优化技巧详解
- [ ] 算法复杂度分析方法
- [ ] 边界条件处理模板
- [ ] 测试用例设计指南
- [ ] 手写题答题模板
- [ ] 常见错误及避免方法
- [ ] 框架原理手写题专项
- [ ] 性能优化手写题专项
- [ ] 模拟面试题库

## 🏆 终极检验

### 5分钟快速检验
```javascript
// 能在5分钟内完成吗？
1. 手写防抖函数（支持立即执行）
2. 手写数组去重（多种方法）
3. 手写深拷贝（处理循环引用）
4. 手写Promise.all
5. 手写二分查找
```

### 15分钟综合挑战
```javascript
// 能在15分钟内完成吗？
1. 手写完整的Promise实现
2. 手写虚拟列表组件
3. 手写LRU缓存
4. 手写并发控制器
5. 手写简版Vue响应式系统
```

---

**💡 成功秘诀**: 手写题成功的关键在于大量练习和反复总结。建议每天坚持练习，注重代码质量和思维过程，面试时才能从容应对！