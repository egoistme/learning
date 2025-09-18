# 字节跳动 JavaScript 面试真题集

> **更新时间**: 2024年3月 | **适用岗位**: 前端工程师 (5年+) | **面试轮次**: 1-3轮技术面

## 📊 面试特点分析

### 🎯 考察重点
- **异步编程**：Event Loop、Promise、async/await (必考)
- **性能优化**：防抖节流、内存管理、渲染优化 (高频)
- **工程化能力**：模块系统、构建工具、代码质量 (重点)
- **算法思维**：数据结构、复杂度分析、实际应用 (加分)
- **框架原理**：Vue/React 源码级理解 (深度)

### 📈 难度分布
```
├── 基础概念 (20%) - 原型链、闭包、this绑定
├── 异步编程 (30%) - Promise、Event Loop、并发控制
├── 性能优化 (25%) - 防抖节流、虚拟列表、懒加载
├── 工程实践 (15%) - 模块化、构建优化、错误处理
└── 框架原理 (10%) - 响应式、虚拟DOM、状态管理
```

---

## 🔥 2024年最新真题

### 第一轮：基础知识 + 异步编程

#### 1. 分析代码执行顺序 (必考题)

```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2 start');
    return new Promise((resolve, reject) => {
        console.log('promise');
        resolve();
    });
}

console.log('script start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

async1();

new Promise(resolve => {
    console.log('promise1');
    resolve();
}).then(() => {
    console.log('promise2');
});

console.log('script end');
```

<details>
<summary>👆 点击查看答案解析</summary>

**输出顺序**:
```
script start
async1 start
async2 start
promise
promise1
script end
async1 end
promise2
setTimeout
```

**关键分析**:
1. `async2()`返回的Promise会立即resolve，但`await`会等待
2. `await async2()`后面的代码会作为微任务执行
3. 微任务优先级高于宏任务(`setTimeout`)

**考察点**: Event Loop机制、async/await原理、微任务执行时机
</details>

---

#### 2. 手写 Promise.all 的并发控制版本

```javascript
/**
 * 实现一个支持并发控制的 Promise.all
 * @param {Array} promises Promise数组
 * @param {number} limit 最大并发数
 * @returns {Promise} 返回Promise
 */
function promiseAllWithLimit(promises, limit) {
    // 请实现这个函数
}

// 测试用例
const createPromise = (value, delay) => {
    return () => new Promise(resolve => {
        console.log(`开始执行: ${value}`);
        setTimeout(() => {
            console.log(`完成: ${value}`);
            resolve(value);
        }, delay);
    });
};

const tasks = [
    createPromise('任务1', 1000),
    createPromise('任务2', 500),
    createPromise('任务3', 800),
    createPromise('任务4', 300),
    createPromise('任务5', 600)
];

promiseAllWithLimit(tasks, 2).then(results => {
    console.log('所有任务完成:', results);
});
```

<details>
<summary>👆 点击查看参考实现</summary>

```javascript
function promiseAllWithLimit(promises, limit) {
    return new Promise((resolve, reject) => {
        const results = [];
        let completedCount = 0;
        let currentIndex = 0;

        if (promises.length === 0) {
            return resolve(results);
        }

        async function executeTask() {
            if (currentIndex >= promises.length) return;

            const index = currentIndex++;
            const promise = promises[index];

            try {
                const result = typeof promise === 'function' ? await promise() : await promise;
                results[index] = result;
                completedCount++;

                if (completedCount === promises.length) {
                    resolve(results);
                } else {
                    executeTask(); // 执行下一个任务
                }
            } catch (error) {
                reject(error);
            }
        }

        // 启动初始任务
        for (let i = 0; i < Math.min(limit, promises.length); i++) {
            executeTask();
        }
    });
}
```

**考察点**: 并发控制、Promise应用、异步流程管理
</details>

---

### 第二轮：性能优化 + 实际应用

#### 3. 实现一个高性能的虚拟滚动列表

```javascript
/**
 * 虚拟滚动列表实现
 * 要求：
 * 1. 支持大量数据渲染（10万+）
 * 2. 保持流畅的滚动体验
 * 3. 支持动态高度
 * 4. 内存占用可控
 */

class VirtualScrollList {
    constructor(container, options) {
        this.container = container;
        this.options = {
            itemHeight: 50,
            buffer: 5,
            threshold: 100,
            ...options
        };

        this.data = [];
        this.visibleData = [];
        this.startIndex = 0;
        this.endIndex = 0;

        this.init();
    }

    // 请完善这个类的实现
    init() {
        // 初始化逻辑
    }

    setData(data) {
        // 设置数据
    }

    handleScroll() {
        // 滚动处理
    }

    render() {
        // 渲染逻辑
    }
}
```

<details>
<summary>👆 点击查看完整实现</summary>

```javascript
class VirtualScrollList {
    constructor(container, options) {
        this.container = container;
        this.options = {
            itemHeight: 50,
            buffer: 5,
            estimatedItemHeight: 50,
            ...options
        };

        this.data = [];
        this.visibleData = [];
        this.startIndex = 0;
        this.endIndex = 0;
        this.scrollTop = 0;
        this.containerHeight = 0;
        this.itemHeights = new Map(); // 缓存实际高度

        this.init();
    }

    init() {
        this.containerHeight = this.container.clientHeight;

        // 创建滚动容器
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.style.cssText = `
            height: 100%;
            overflow-y: auto;
            position: relative;
        `;

        // 创建内容容器
        this.contentContainer = document.createElement('div');
        this.contentContainer.style.position = 'relative';

        this.scrollContainer.appendChild(this.contentContainer);
        this.container.appendChild(this.scrollContainer);

        // 绑定滚动事件（使用节流优化）
        this.throttledHandleScroll = this.throttle(this.handleScroll.bind(this), 16);
        this.scrollContainer.addEventListener('scroll', this.throttledHandleScroll);

        // 监听容器大小变化
        this.resizeObserver = new ResizeObserver(() => {
            this.containerHeight = this.container.clientHeight;
            this.calculateVisibleRange();
            this.render();
        });
        this.resizeObserver.observe(this.container);
    }

    setData(data) {
        this.data = data;
        this.itemHeights.clear();
        this.calculateVisibleRange();
        this.render();
    }

    calculateVisibleRange() {
        const visibleCount = Math.ceil(this.containerHeight / this.options.itemHeight);
        const bufferCount = this.options.buffer;

        this.startIndex = Math.max(0,
            Math.floor(this.scrollTop / this.options.itemHeight) - bufferCount
        );
        this.endIndex = Math.min(
            this.data.length - 1,
            this.startIndex + visibleCount + 2 * bufferCount
        );

        this.visibleData = this.data.slice(this.startIndex, this.endIndex + 1);
    }

    handleScroll() {
        const scrollTop = this.scrollContainer.scrollTop;
        const delta = Math.abs(scrollTop - this.scrollTop);

        // 滚动距离足够大时才重新计算
        if (delta > this.options.threshold) {
            this.scrollTop = scrollTop;
            this.calculateVisibleRange();
            this.render();
        }
    }

    render() {
        // 计算总高度
        const totalHeight = this.data.length * this.options.itemHeight;

        // 更新容器高度
        this.contentContainer.style.height = `${totalHeight}px`;

        // 清空当前内容
        this.contentContainer.innerHTML = '';

        // 渲染可见项
        this.visibleData.forEach((item, index) => {
            const realIndex = this.startIndex + index;
            const itemElement = this.createItemElement(item, realIndex);

            // 设置位置
            itemElement.style.position = 'absolute';
            itemElement.style.top = `${realIndex * this.options.itemHeight}px`;
            itemElement.style.width = '100%';
            itemElement.style.height = `${this.options.itemHeight}px`;

            this.contentContainer.appendChild(itemElement);
        });
    }

    createItemElement(item, index) {
        const element = document.createElement('div');
        element.className = 'virtual-list-item';
        element.style.cssText = `
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
            box-sizing: border-box;
        `;

        // 自定义渲染函数
        if (this.options.renderItem) {
            element.innerHTML = this.options.renderItem(item, index);
        } else {
            element.textContent = `Item ${index}: ${JSON.stringify(item)}`;
        }

        return element;
    }

    throttle(func, delay) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                func.apply(this, args);
            }
        };
    }

    destroy() {
        this.scrollContainer.removeEventListener('scroll', this.throttledHandleScroll);
        this.resizeObserver.disconnect();
        this.container.innerHTML = '';
    }
}

// 使用示例
const container = document.getElementById('list-container');
const virtualList = new VirtualScrollList(container, {
    itemHeight: 60,
    buffer: 3,
    renderItem: (item, index) => `
        <div style="font-weight: bold;">第 ${index + 1} 项</div>
        <div>${item.name}</div>
    `
});

// 生成大量测试数据
const testData = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    name: `用户 ${i + 1}`,
    email: `user${i + 1}@example.com`
}));

virtualList.setData(testData);
```

**考察点**: 性能优化、DOM操作、滚动事件处理、内存管理
</details>

---

#### 4. 实现一个智能的图片懒加载

```javascript
/**
 * 智能图片懒加载实现
 * 要求：
 * 1. 支持 Intersection Observer
 * 2. 提供降级方案
 * 3. 支持预加载策略
 * 4. 错误重试机制
 * 5. 加载状态管理
 */

class SmartLazyLoad {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
            retry: 3,
            retryDelay: 1000,
            preload: 2, // 预加载下2张
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
            ...options
        };

        this.images = new Map();
        this.loadingQueue = [];
        this.observer = null;

        this.init();
    }

    // 请完善实现
}
```

<details>
<summary>👆 点击查看完整实现</summary>

```javascript
class SmartLazyLoad {
    constructor(options = {}) {
        this.options = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1,
            retry: 3,
            retryDelay: 1000,
            preload: 2,
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
            ...options
        };

        this.images = new Map();
        this.loadingQueue = [];
        this.preloadQueue = [];

        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                this.handleIntersection.bind(this),
                {
                    root: this.options.root,
                    rootMargin: this.options.rootMargin,
                    threshold: this.options.threshold
                }
            );
        } else {
            // 降级到scroll事件
            this.initScrollFallback();
        }
    }

    observe(img) {
        if (!img.dataset.src) return;

        const imageData = {
            element: img,
            src: img.dataset.src,
            retryCount: 0,
            status: 'pending' // pending, loading, loaded, error
        };

        this.images.set(img, imageData);

        // 设置占位图
        if (!img.src) {
            img.src = this.options.placeholder;
        }

        if (this.observer) {
            this.observer.observe(img);
        } else {
            // 降级方案
            this.checkScrollPosition();
        }
    }

    unobserve(img) {
        if (this.observer) {
            this.observer.observe(img);
        }
        this.images.delete(img);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const imageData = this.images.get(img);

                if (imageData && imageData.status === 'pending') {
                    this.loadImage(img);

                    // 预加载后续图片
                    this.preloadNext(img);
                }
            }
        });
    }

    async loadImage(img) {
        const imageData = this.images.get(img);
        if (!imageData || imageData.status === 'loading') return;

        imageData.status = 'loading';
        img.classList.add('lazy-loading');

        try {
            await this.loadImagePromise(imageData.src);

            // 加载成功
            img.src = imageData.src;
            imageData.status = 'loaded';
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');

            // 触发自定义事件
            this.dispatchEvent(img, 'lazyloaded');

            // 停止观察
            if (this.observer) {
                this.observer.unobserve(img);
            }

        } catch (error) {
            // 加载失败，尝试重试
            imageData.retryCount++;

            if (imageData.retryCount < this.options.retry) {
                console.log(`图片加载失败，${this.options.retryDelay}ms后重试`);
                setTimeout(() => {
                    this.loadImage(img);
                }, this.options.retryDelay * imageData.retryCount);
            } else {
                imageData.status = 'error';
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-error');
                this.dispatchEvent(img, 'lazyerror');
            }
        }
    }

    loadImagePromise(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }

    preloadNext(currentImg) {
        const allImages = Array.from(this.images.keys());
        const currentIndex = allImages.indexOf(currentImg);

        for (let i = 1; i <= this.options.preload; i++) {
            const nextImg = allImages[currentIndex + i];
            if (nextImg) {
                const imageData = this.images.get(nextImg);
                if (imageData && imageData.status === 'pending') {
                    // 添加到预加载队列
                    this.preloadQueue.push(nextImg);
                }
            }
        }

        // 异步处理预加载队列
        this.processPreloadQueue();
    }

    async processPreloadQueue() {
        if (this.preloadQueue.length === 0) return;

        const img = this.preloadQueue.shift();
        const imageData = this.images.get(img);

        if (imageData && imageData.status === 'pending') {
            try {
                await this.loadImagePromise(imageData.src);
                // 预加载成功，等待真正需要时再设置src
                imageData.preloaded = true;
            } catch (error) {
                console.log('预加载失败:', error);
            }
        }

        // 继续处理队列
        if (this.preloadQueue.length > 0) {
            setTimeout(() => this.processPreloadQueue(), 100);
        }
    }

    initScrollFallback() {
        this.throttledCheckScroll = this.throttle(() => {
            this.checkScrollPosition();
        }, 200);

        window.addEventListener('scroll', this.throttledCheckScroll);
        window.addEventListener('resize', this.throttledCheckScroll);
    }

    checkScrollPosition() {
        this.images.forEach((imageData, img) => {
            if (imageData.status === 'pending' && this.isInViewport(img)) {
                this.loadImage(img);
            }
        });
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.top <= windowHeight + parseInt(this.options.rootMargin) &&
            rect.bottom >= -parseInt(this.options.rootMargin) &&
            rect.left <= windowWidth &&
            rect.right >= 0
        );
    }

    dispatchEvent(element, eventName) {
        const event = new CustomEvent(eventName, {
            detail: { element }
        });
        element.dispatchEvent(event);
    }

    throttle(func, delay) {
        let lastTime = 0;
        return function(...args) {
            const now = Date.now();
            if (now - lastTime >= delay) {
                lastTime = now;
                func.apply(this, args);
            }
        };
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }

        if (this.throttledCheckScroll) {
            window.removeEventListener('scroll', this.throttledCheckScroll);
            window.removeEventListener('resize', this.throttledCheckScroll);
        }

        this.images.clear();
        this.loadingQueue = [];
        this.preloadQueue = [];
    }
}

// 使用示例
const lazyLoad = new SmartLazyLoad({
    rootMargin: '100px',
    retry: 2,
    preload: 3
});

// 批量观察图片
document.querySelectorAll('img[data-src]').forEach(img => {
    lazyLoad.observe(img);
});

// 监听加载事件
document.addEventListener('lazyloaded', (e) => {
    console.log('图片加载完成:', e.detail.element);
});
```

**考察点**: Intersection Observer API、性能优化、错误处理、事件机制
</details>

---

### 第三轮：框架原理 + 工程实践

#### 5. 实现一个简化版的 Vue 响应式系统

```javascript
/**
 * 实现Vue 3风格的响应式系统
 * 要求：
 * 1. 支持 reactive 和 ref
 * 2. 实现 effect 副作用函数
 * 3. 支持嵌套对象
 * 4. 处理数组操作
 * 5. 避免无限循环
 */

// 请实现以下API
function reactive(target) {
    // 将对象转换为响应式
}

function ref(value) {
    // 创建响应式引用
}

function effect(fn) {
    // 注册副作用函数
}

// 测试用例
const state = reactive({
    count: 0,
    user: {
        name: 'Tom',
        age: 18
    },
    items: [1, 2, 3]
});

const countRef = ref(0);

effect(() => {
    console.log('count changed:', state.count);
});

effect(() => {
    console.log('user name:', state.user.name);
});

effect(() => {
    console.log('countRef:', countRef.value);
});

state.count++; // 应该触发第一个effect
state.user.name = 'Jerry'; // 应该触发第二个effect
countRef.value = 10; // 应该触发第三个effect
```

<details>
<summary>👆 点击查看参考实现</summary>

```javascript
// 响应式系统实现
let activeEffect = null;
const effectStack = [];
const targetMap = new WeakMap();

// 依赖收集
function track(target, key) {
    if (!activeEffect) return;

    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()));
    }

    let dep = depsMap.get(key);
    if (!dep) {
        depsMap.set(key, (dep = new Set()));
    }

    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

// 触发更新
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;

    const dep = depsMap.get(key);
    if (!dep) return;

    const effectsToRun = new Set();

    dep.forEach(effect => {
        if (effect !== activeEffect) {
            effectsToRun.add(effect);
        }
    });

    effectsToRun.forEach(effect => {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect();
        }
    });
}

// 响应式对象
function reactive(target) {
    if (typeof target !== 'object' || target === null) {
        return target;
    }

    return new Proxy(target, {
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver);

            // 依赖收集
            track(target, key);

            // 嵌套对象也要转为响应式
            if (typeof result === 'object' && result !== null) {
                return reactive(result);
            }

            return result;
        },

        set(target, key, value, receiver) {
            const oldValue = target[key];
            const result = Reflect.set(target, key, value, receiver);

            // 值发生变化时触发更新
            if (oldValue !== value) {
                trigger(target, key);
            }

            return result;
        }
    });
}

// 响应式引用
function ref(value) {
    const wrapper = {
        value
    };

    // 使用Symbol标识ref对象
    Object.defineProperty(wrapper, '__v_isRef', {
        value: true
    });

    return reactive(wrapper);
}

// 副作用函数
function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn;
        effectStack.push(effectFn);

        try {
            return fn();
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
        }
    };

    effectFn.deps = [];
    effectFn.scheduler = options.scheduler;

    if (!options.lazy) {
        effectFn();
    }

    return effectFn;
}

// 清理依赖
function cleanup(effectFn) {
    effectFn.deps.forEach(dep => {
        dep.delete(effectFn);
    });
    effectFn.deps.length = 0;
}

// 计算属性
function computed(getter) {
    let value;
    let dirty = true;

    const effectFn = effect(getter, {
        lazy: true,
        scheduler() {
            dirty = true;
            trigger(obj, 'value');
        }
    });

    const obj = {
        get value() {
            if (dirty) {
                value = effectFn();
                dirty = false;
            }
            track(obj, 'value');
            return value;
        }
    };

    return obj;
}

// 监听器
function watch(source, callback, options = {}) {
    let getter;

    if (typeof source === 'function') {
        getter = source;
    } else {
        getter = () => traverse(source);
    }

    let oldValue, newValue;

    const job = () => {
        newValue = effectFn();
        callback(newValue, oldValue);
        oldValue = newValue;
    };

    const effectFn = effect(getter, {
        lazy: true,
        scheduler: job
    });

    if (options.immediate) {
        job();
    } else {
        oldValue = effectFn();
    }
}

// 深度遍历
function traverse(value, seen = new Set()) {
    if (typeof value !== 'object' || value === null || seen.has(value)) {
        return value;
    }

    seen.add(value);

    for (const k in value) {
        traverse(value[k], seen);
    }

    return value;
}

// 测试代码
console.log('=== 响应式系统测试 ===');

const state = reactive({
    count: 0,
    user: {
        name: 'Tom',
        age: 18
    },
    items: [1, 2, 3]
});

const countRef = ref(0);

effect(() => {
    console.log('count changed:', state.count);
});

effect(() => {
    console.log('user name:', state.user.name);
});

effect(() => {
    console.log('countRef:', countRef.value);
});

const sum = computed(() => {
    console.log('计算sum');
    return state.count + countRef.value;
});

effect(() => {
    console.log('computed sum:', sum.value);
});

// 测试更新
console.log('\n=== 触发更新 ===');
state.count++; // 输出: count changed: 1, computed sum: 1
state.user.name = 'Jerry'; // 输出: user name: Jerry
countRef.value = 10; // 输出: countRef: 10, computed sum: 11
```

**考察点**: Proxy、依赖收集、响应式原理、Vue源码理解
</details>

---

## 💡 字节面试特色与技巧

### 🎯 面试风格特点

1. **重视基础原理**
   - 不仅要会用，更要理解原理
   - 经常问"为什么"和"如何实现"
   - 喜欢让候选人手写核心功能

2. **强调性能优化**
   - 关注代码执行效率
   - 重视用户体验优化
   - 考察大数据量处理能力

3. **注重工程实践**
   - 代码质量和可维护性
   - 错误处理和边界情况
   - 实际项目问题解决

### 🎯 答题策略

1. **思路清晰，步骤明确**
   ```
   1. 理解题目要求
   2. 分析技术要点
   3. 设计整体方案
   4. 实现核心逻辑
   5. 考虑优化和边界
   ```

2. **主动展示技术深度**
   - 主动提及相关技术原理
   - 对比不同实现方案
   - 分析性能和权衡

3. **结合实际项目经验**
   - 举例说明实际应用
   - 分享踩坑和解决经验
   - 展示问题解决能力

### 🎯 常见追问方向

- **性能优化**: "如何进一步优化性能？"
- **边界处理**: "还有哪些边界情况需要考虑？"
- **工程实践**: "在实际项目中如何应用？"
- **技术选型**: "为什么选择这种实现方式？"

---

## 🔗 更多字节面试资源

- [字节跳动前端面试官方指南](https://job.bytedance.com/society)
- [技术博客 - 字节跳动技术团队](https://tech.bytedance.net/)
- [开源项目 - ByteDance GitHub](https://github.com/bytedance)

**💪 加油！希望这些真题能帮助你在字节的面试中取得好成绩！**