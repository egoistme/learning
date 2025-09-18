# 防抖节流实现与优化 - 性能优化必考题

> **难度**: ⭐⭐⭐⭐ | **出现频率**: 85% | **重要程度**: 高频必考

## 📋 题目清单

### 🔥 基础实现题

#### 1. 手写防抖函数 (debounce) - 各大厂必考

**考察点**: 闭包应用、定时器管理、this绑定、参数传递

**基础版防抖**:
```javascript
/**
 * 防抖函数 - 在事件触发n秒后执行，如果在n秒内再次触发则重新计时
 * @param {Function} func 要执行的函数
 * @param {number} delay 延迟时间(ms)
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
    let timerId;

    return function(...args) {
        // 清除之前的定时器
        clearTimeout(timerId);

        // 设置新的定时器
        timerId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 使用示例
const handleInput = debounce((value) => {
    console.log('搜索:', value);
}, 500);

// 模拟用户快速输入
handleInput('a');      // 被取消
handleInput('ab');     // 被取消
handleInput('abc');    // 500ms后执行
```

**进阶版防抖（支持立即执行）**:
```javascript
/**
 * 增强版防抖函数
 * @param {Function} func 要执行的函数
 * @param {number} delay 延迟时间
 * @param {boolean} immediate 是否立即执行
 */
function debounce(func, delay, immediate = false) {
    let timerId;

    return function(...args) {
        const callNow = immediate && !timerId;

        clearTimeout(timerId);

        timerId = setTimeout(() => {
            timerId = null;
            if (!immediate) {
                func.apply(this, args);
            }
        }, delay);

        if (callNow) {
            func.apply(this, args);
        }
    };
}

// 立即执行示例
const handleClick = debounce(() => {
    console.log('按钮被点击');
}, 1000, true);

handleClick(); // 立即执行
handleClick(); // 被忽略（1秒内）
handleClick(); // 被忽略（1秒内）
// 1秒后才能再次立即执行
```

---

#### 2. 手写节流函数 (throttle) - 字节/腾讯高频

**考察点**: 时间控制、状态管理、性能优化

**时间戳版节流**:
```javascript
/**
 * 节流函数 - 时间戳版本（首次立即执行）
 * @param {Function} func 要执行的函数
 * @param {number} delay 节流间隔时间
 */
function throttle(func, delay) {
    let lastTime = 0;

    return function(...args) {
        const now = Date.now();

        if (now - lastTime >= delay) {
            lastTime = now;
            func.apply(this, args);
        }
    };
}

// 使用示例
const handleScroll = throttle(() => {
    console.log('页面滚动', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

**定时器版节流**:
```javascript
/**
 * 节流函数 - 定时器版本（末次触发执行）
 * @param {Function} func 要执行的函数
 * @param {number} delay 节流间隔时间
 */
function throttle(func, delay) {
    let timerId;

    return function(...args) {
        if (!timerId) {
            timerId = setTimeout(() => {
                func.apply(this, args);
                timerId = null;
            }, delay);
        }
    };
}
```

**完整版节流（首尾都执行）**:
```javascript
/**
 * 完整版节流函数 - 结合时间戳和定时器
 * @param {Function} func 要执行的函数
 * @param {number} delay 节流间隔时间
 * @param {Object} options 配置选项
 * @param {boolean} options.leading 是否首次立即执行
 * @param {boolean} options.trailing 是否末次延迟执行
 */
function throttle(func, delay, options = {}) {
    let timerId;
    let lastTime = 0;
    let { leading = true, trailing = true } = options;

    return function(...args) {
        const now = Date.now();

        // 第一次触发且不需要立即执行
        if (!lastTime && !leading) {
            lastTime = now;
        }

        // 计算剩余时间
        const remaining = delay - (now - lastTime);

        if (remaining <= 0 || remaining > delay) {
            // 可以执行
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
            lastTime = now;
            func.apply(this, args);
        } else if (!timerId && trailing) {
            // 设置末次执行
            timerId = setTimeout(() => {
                lastTime = leading ? Date.now() : 0;
                timerId = null;
                func.apply(this, args);
            }, remaining);
        }
    };
}

// 测试不同配置
const options1 = { leading: true, trailing: false };   // 只首次执行
const options2 = { leading: false, trailing: true };   // 只末次执行
const options3 = { leading: true, trailing: true };    // 首尾都执行
```

---

### 🔥 高级优化题

#### 3. 可取消的防抖节流 (美团/阿里真题)

**考察点**: 函数增强、状态管理、清理机制

```javascript
/**
 * 可取消的防抖函数
 */
function debounce(func, delay, immediate = false) {
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

        if (callNow && !cancelled) {
            func.apply(this, args);
        }
    };

    // 取消防抖
    debounced.cancel = function() {
        clearTimeout(timerId);
        timerId = null;
        cancelled = false;
    };

    // 立即执行
    debounced.flush = function(...args) {
        if (cancelled) return;
        clearTimeout(timerId);
        timerId = null;
        func.apply(this, args);
    };

    // 销毁防抖（不可恢复）
    debounced.destroy = function() {
        debounced.cancel();
        cancelled = true;
    };

    return debounced;
}

/**
 * 可取消的节流函数
 */
function throttle(func, delay, options = {}) {
    let timerId;
    let lastTime = 0;
    let cancelled = false;
    let { leading = true, trailing = true } = options;

    const throttled = function(...args) {
        if (cancelled) return;

        const now = Date.now();

        if (!lastTime && !leading) {
            lastTime = now;
        }

        const remaining = delay - (now - lastTime);

        if (remaining <= 0 || remaining > delay) {
            if (timerId) {
                clearTimeout(timerId);
                timerId = null;
            }
            lastTime = now;
            func.apply(this, args);
        } else if (!timerId && trailing) {
            timerId = setTimeout(() => {
                lastTime = leading ? Date.now() : 0;
                timerId = null;
                if (!cancelled) {
                    func.apply(this, args);
                }
            }, remaining);
        }
    };

    throttled.cancel = function() {
        clearTimeout(timerId);
        timerId = null;
        lastTime = 0;
    };

    throttled.destroy = function() {
        throttled.cancel();
        cancelled = true;
    };

    return throttled;
}

// 使用示例
const debouncedSearch = debounce(searchAPI, 500);
const throttledScroll = throttle(updateScrollPosition, 16);

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
    debouncedSearch.destroy();
    throttledScroll.destroy();
});
```

---

#### 4. 基于Promise的防抖节流 (拼多多/滴滴真题)

**考察点**: Promise应用、异步控制、现代JavaScript特性

```javascript
/**
 * 基于Promise的防抖函数
 */
function debouncePromise(func, delay) {
    let timerId;
    let rejectPrevious;

    return function(...args) {
        return new Promise((resolve, reject) => {
            // 取消之前的Promise
            if (rejectPrevious) {
                rejectPrevious(new Error('Debounced'));
            }

            rejectPrevious = reject;

            clearTimeout(timerId);

            timerId = setTimeout(async () => {
                try {
                    const result = await func.apply(this, args);
                    resolve(result);
                    rejectPrevious = null;
                } catch (error) {
                    reject(error);
                    rejectPrevious = null;
                }
            }, delay);
        });
    };
}

/**
 * 基于Promise的节流函数
 */
function throttlePromise(func, delay) {
    let lastExecution = 0;
    let pendingPromise = null;

    return function(...args) {
        const now = Date.now();

        if (now - lastExecution >= delay) {
            lastExecution = now;
            return func.apply(this, args);
        }

        // 如果在节流期间，返回相同的Promise
        if (!pendingPromise) {
            pendingPromise = new Promise(resolve => {
                setTimeout(() => {
                    lastExecution = Date.now();
                    resolve(func.apply(this, args));
                    pendingPromise = null;
                }, delay - (now - lastExecution));
            });
        }

        return pendingPromise;
    };
}

// 使用示例
const asyncSearch = debouncePromise(async (query) => {
    const response = await fetch(`/search?q=${query}`);
    return response.json();
}, 500);

// 多次调用，只有最后一次生效
asyncSearch('react')
    .then(result => console.log('搜索结果:', result))
    .catch(err => console.log('被取消:', err.message));

asyncSearch('react hooks')
    .then(result => console.log('搜索结果:', result))
    .catch(err => console.log('被取消:', err.message));
```

---

#### 5. 自适应防抖节流 (字节跳动真题)

**考察点**: 性能监控、动态优化、算法思维

```javascript
/**
 * 自适应防抖函数 - 根据执行频率动态调整延迟
 */
function adaptiveDebounce(func, baseDelay = 300, options = {}) {
    let timerId;
    let callCount = 0;
    let lastCallTime = 0;
    let adaptiveDelay = baseDelay;

    const {
        minDelay = 100,
        maxDelay = 1000,
        adaptiveRatio = 0.1,
        resetThreshold = 5000
    } = options;

    return function(...args) {
        const now = Date.now();

        // 重置统计
        if (now - lastCallTime > resetThreshold) {
            callCount = 0;
            adaptiveDelay = baseDelay;
        }

        callCount++;
        lastCallTime = now;

        // 根据调用频率调整延迟
        const avgInterval = resetThreshold / callCount;
        if (avgInterval < baseDelay) {
            // 调用频繁，增加延迟
            adaptiveDelay = Math.min(
                maxDelay,
                adaptiveDelay + (baseDelay * adaptiveRatio)
            );
        } else {
            // 调用不频繁，减少延迟
            adaptiveDelay = Math.max(
                minDelay,
                adaptiveDelay - (baseDelay * adaptiveRatio)
            );
        }

        clearTimeout(timerId);

        timerId = setTimeout(() => {
            func.apply(this, args);
        }, adaptiveDelay);
    };
}

/**
 * 性能感知的节流函数
 */
function performanceThrottle(func, baseDelay = 16) {
    let lastTime = 0;
    let adaptiveDelay = baseDelay;

    return function(...args) {
        const now = performance.now();

        if (now - lastTime >= adaptiveDelay) {
            const startTime = performance.now();

            func.apply(this, args);

            const executionTime = performance.now() - startTime;

            // 根据执行时间调整间隔
            if (executionTime > adaptiveDelay * 0.8) {
                adaptiveDelay = Math.min(100, adaptiveDelay * 1.2);
            } else if (executionTime < adaptiveDelay * 0.2) {
                adaptiveDelay = Math.max(baseDelay, adaptiveDelay * 0.9);
            }

            lastTime = now;
        }
    };
}

// 使用示例
const adaptiveSearch = adaptiveDebounce((query) => {
    console.log('自适应搜索:', query, '当前延迟:', adaptiveSearch.currentDelay);
}, 300);

const performanceHandler = performanceThrottle(() => {
    // 复杂的DOM操作
    document.querySelectorAll('.item').forEach(item => {
        item.style.transform = `translateY(${Math.random() * 10}px)`;
    });
}, 16);
```

---

### 🔥 实际应用题

#### 6. 解决特定场景的防抖节流问题

**考察点**: 实际业务场景、解决方案设计

```javascript
// 场景1: 搜索建议（防抖 + 缓存 + 请求取消）
class SearchSuggestion {
    constructor(searchAPI, options = {}) {
        this.searchAPI = searchAPI;
        this.cache = new Map();
        this.abortController = null;

        this.options = {
            debounceDelay: 300,
            maxCacheSize: 100,
            cacheExpiry: 5 * 60 * 1000, // 5分钟
            ...options
        };

        this.debouncedSearch = this.createDebouncedSearch();
    }

    createDebouncedSearch() {
        let timerId;

        return (query) => {
            clearTimeout(timerId);

            return new Promise((resolve, reject) => {
                timerId = setTimeout(async () => {
                    try {
                        const result = await this.search(query);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, this.options.debounceDelay);
            });
        };
    }

    async search(query) {
        if (!query.trim()) return [];

        // 检查缓存
        const cached = this.getFromCache(query);
        if (cached) return cached;

        // 取消之前的请求
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
            const result = await this.searchAPI(query, {
                signal: this.abortController.signal
            });

            this.setCache(query, result);
            return result;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Search cancelled');
            }
            throw error;
        }
    }

    getFromCache(query) {
        const item = this.cache.get(query);
        if (item && Date.now() - item.timestamp < this.options.cacheExpiry) {
            return item.data;
        }
        return null;
    }

    setCache(query, data) {
        if (this.cache.size >= this.options.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(query, {
            data,
            timestamp: Date.now()
        });
    }
}

// 场景2: 滚动加载（节流 + 边界检测）
class InfiniteScroll {
    constructor(loadMore, options = {}) {
        this.loadMore = loadMore;
        this.loading = false;
        this.hasMore = true;

        this.options = {
            threshold: 100, // 距离底部100px开始加载
            throttleDelay: 200,
            ...options
        };

        this.throttledCheck = this.createThrottledCheck();
        this.bindEvents();
    }

    createThrottledCheck() {
        let lastTime = 0;

        return () => {
            const now = Date.now();
            if (now - lastTime >= this.options.throttleDelay) {
                lastTime = now;
                this.checkAndLoad();
            }
        };
    }

    checkAndLoad() {
        if (this.loading || !this.hasMore) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - this.options.threshold) {
            this.load();
        }
    }

    async load() {
        this.loading = true;
        try {
            const hasMore = await this.loadMore();
            this.hasMore = hasMore;
        } catch (error) {
            console.error('加载失败:', error);
        } finally {
            this.loading = false;
        }
    }

    bindEvents() {
        window.addEventListener('scroll', this.throttledCheck, { passive: true });
        window.addEventListener('resize', this.throttledCheck, { passive: true });
    }

    destroy() {
        window.removeEventListener('scroll', this.throttledCheck);
        window.removeEventListener('resize', this.throttledCheck);
    }
}

// 使用示例
const searchSuggestion = new SearchSuggestion(async (query) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    return response.json();
});

const infiniteScroll = new InfiniteScroll(async () => {
    // 加载更多数据
    const response = await fetch('/api/more-data');
    const data = await response.json();
    return data.hasMore;
});
```

---

## 💡 面试技巧

### 🎯 核心考察点

1. **基础概念理解**
   - 防抖：延迟执行，重复触发重新计时
   - 节流：固定间隔执行，限制执行频率

2. **实现细节掌握**
   - 闭包保存状态
   - 定时器管理
   - this绑定处理
   - 参数传递

3. **优化和扩展**
   - 立即执行模式
   - 取消和清理机制
   - 性能监控和自适应

### 🎯 答题策略

1. **先分析场景需求**
   ```
   - 搜索框输入 → 防抖（避免频繁请求）
   - 滚动事件 → 节流（限制处理频率）
   - 按钮点击 → 防抖（防止重复提交）
   - 窗口resize → 节流（限制重绘频率）
   ```

2. **逐步完善实现**
   - 基础版本 → 增强版本 → 生产级别
   - 考虑边界情况和错误处理

3. **结合实际应用**
   - 说明使用场景
   - 性能优化效果
   - 用户体验提升

### 🎯 常见追问

1. **防抖和节流的区别？**
   - 执行时机不同
   - 应用场景不同
   - 性能影响不同

2. **如何选择防抖还是节流？**
   - 根据业务需求
   - 考虑用户体验
   - 性能要求权衡

3. **有没有更好的替代方案？**
   - requestAnimationFrame
   - Intersection Observer
   - passive事件监听

---

## 🔗 相关面试题

- [Event Loop事件循环](../02-async-programming/event-loop.md)
- [内存管理与优化](./memory-management.md)
- [Web性能优化](./web-performance.md)
- [函数式编程应用](../05-handwritten-code/functional-programming.md)