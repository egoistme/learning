# 🌟 Vue 高频考点全解析

> 🎯 **适用对象**: Vue面试准备、技术提升、项目实战
> 📊 **考点分级**: 🔥高频 🟡中频 🟢低频
> 🚀 **版本覆盖**: Vue 3.0 - Vue 3.4+

---

## 📋 目录导航

1. [响应式原理深度解析](#1-响应式原理深度解析) (8个核心考点)
2. [组合式API完全指南](#2-组合式api完全指南) (12个Hooks详解)
3. [虚拟DOM与diff算法](#3-虚拟dom与diff算法) (6个核心原理)
4. [性能优化专题](#4-性能优化专题) (10个优化技巧)
5. [组件通信全解](#5-组件通信全解) (8种通信方式)
6. [Vue Router深度考点](#6-vue-router深度考点) (7个路由专题)
7. [状态管理专题](#7-状态管理专题) (Pinia vs Vuex对比)
8. [Vue 3新特性](#8-vue-3新特性) (6个重要更新)
9. [源码原理解析](#9-源码原理解析) (5个核心原理)
10. [实战场景题](#10-实战场景题) (12个经典场景)
11. [面试真题集锦](#11-面试真题集锦) (大厂真题)

---

## 1. 响应式原理深度解析

### 🔥 1.1 Proxy vs Object.defineProperty 深度对比

**🤔 面试问题**: Vue 3 为什么用 Proxy 替代 Object.defineProperty？性能提升体现在哪里？

**核心答案**：
Proxy 比 Object.defineProperty 有以下优势：

1. **可以监听数组变化**
2. **可以监听属性的添加和删除**
3. **可以监听 Map、Set、WeakMap、WeakSet**
4. **性能更好**（懒代理，只有访问时才代理子对象）

```javascript
// Vue 2 的限制
const data = { name: 'Vue' }
// ❌ 无法检测新增属性
data.age = 18  // 不会触发更新

// ❌ 无法检测数组索引和长度变化
const arr = [1, 2, 3]
arr[0] = 100    // 不会触发更新
arr.length = 0  // 不会触发更新

// Vue 3 的解决方案
const reactiveData = new Proxy(data, {
  get(target, key) {
    track(target, key)  // 依赖收集
    return Reflect.get(target, key)
  },
  set(target, key, value) {
    const result = Reflect.set(target, key, value)
    trigger(target, key)  // 派发更新
    return result
  },
  has(target, key) {
    track(target, key)
    return Reflect.has(target, key)
  },
  deleteProperty(target, key) {
    const result = Reflect.deleteProperty(target, key)
    trigger(target, key)
    return result
  }
})
```

**深入理解**：
- Object.defineProperty 只能监听已存在的属性
- Proxy 可以监听整个对象的所有操作
- Vue 2 需要 $set、$delete 等特殊方法，Vue 3 不再需要

---

### ❓ 考点2：Vue 3 依赖收集的完整流程是什么？

**核心答案**：
Vue 3 使用 **WeakMap → Map → Set** 三层结构进行依赖收集：

```javascript
// 全局依赖收集容器
const targetMap = new WeakMap()  // target -> depsMap
let activeEffect = null

// 1. 依赖收集函数
function track(target, key) {
  if (!activeEffect) return

  // 获取当前对象的依赖映射
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  // 获取当前属性的依赖集合
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  // 建立双向连接
  dep.add(activeEffect)
  activeEffect.deps.push(dep)
}

// 2. 派发更新函数
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (dep) {
    // 避免无限循环
    const effects = [...dep]
    effects.forEach(effect => {
      if (effect !== activeEffect) {
        effect()
      }
    })
  }
}

// 3. 副作用函数
function effect(fn) {
  const effectFn = () => {
    try {
      activeEffect = effectFn
      return fn()  // 执行副作用函数，触发依赖收集
    } finally {
      activeEffect = null
    }
  }

  effectFn.deps = []  // 存储依赖的集合
  effectFn()  // 立即执行一次
}
```

**流程解析**：
1. **effect 执行** → 设置 activeEffect
2. **访问响应式数据** → 触发 get 拦截器
3. **执行 track** → 建立依赖关系
4. **数据变更** → 触发 set 拦截器
5. **执行 trigger** → 重新执行相关 effect

---

### ❓ 考点3：ref 和 reactive 的区别及使用场景？

**核心对比**：

| 特性 | ref | reactive |
|------|-----|----------|
| 支持数据类型 | 任意类型 | 对象类型 |
| 访问方式 | .value | 直接访问 |
| 模板自动解包 | ✅ | ✅ |
| 解构响应性 | ❌ 失去响应性 | ❌ 失去响应性 |
| 嵌套对象 | 深度响应式 | 深度响应式 |
| 性能 | 每次 .value 有小开销 | 相对更优 |

```javascript
import { ref, reactive, toRefs, toRef } from 'vue'

// ref 适用场景
const count = ref(0)                    // ✅ 基本类型
const loading = ref(false)              // ✅ 布尔值
const user = ref({ name: 'Vue' })       // ✅ 对象包装

// reactive 适用场景
const state = reactive({                // ✅ 状态集合
  count: 0,
  user: { name: 'Vue' },
  list: []
})

// 响应性保持问题
const { count } = state                 // ❌ 失去响应性
const { count } = toRefs(state)         // ✅ 保持响应性
const count = toRef(state, 'count')     // ✅ 单个属性响应性

// 使用建议
// 1. 基本类型 → ref
const message = ref('')
const isVisible = ref(true)

// 2. 对象集合 → reactive
const formData = reactive({
  name: '',
  email: '',
  preferences: []
})

// 3. 组合使用
const userRef = ref(null)               // 可能为 null
const userInfo = reactive({             // 确定的对象结构
  profile: {},
  settings: {}
})
```

---

### 🔥 1.4 响应式数据的边界情况处理

**🤔 面试问题**: 在什么情况下会丢失响应性？如何避免？

**💡 核心答案**:
响应性丢失的主要场景及解决方案：

```javascript
import { ref, reactive, toRefs, toRef, unref, isRef } from 'vue'

// 1. 解构丢失响应性
const state = reactive({ count: 0, name: 'Vue' })

// ❌ 直接解构会丢失响应性
const { count, name } = state
count++  // 不会触发更新

// ✅ 使用 toRefs 保持响应性
const { count: reactiveCount, name: reactiveName } = toRefs(state)
reactiveCount.value++  // 会触发更新

// ✅ 使用 toRef 获取单个响应式属性
const countRef = toRef(state, 'count')
countRef.value++  // 会触发更新

// 2. 传参丢失响应性
const num = ref(10)

// ❌ 传递 .value 会丢失响应性
function processNumber(value) {
  // value 是普通数值，修改不会触发更新
  return value * 2
}
processNumber(num.value)

// ✅ 传递整个 ref 对象
function processRef(refObj) {
  // 可以通过 .value 修改并触发更新
  refObj.value *= 2
}
processRef(num)

// ✅ 使用 unref 和 isRef 处理可能的 ref
function flexibleProcess(maybeRef) {
  const value = unref(maybeRef)  // 自动解包
  if (isRef(maybeRef)) {
    maybeRef.value = value * 2   // 保持响应性
  }
  return value * 2
}

// 3. 数组和对象的响应性陷阱
const list = ref([1, 2, 3])

// ❌ 替换整个数组会断开引用
let currentList = list.value
currentList = [4, 5, 6]  // list.value 仍然是 [1, 2, 3]

// ✅ 修改原数组或重新赋值给 .value
list.value.push(4)       // 触发更新
list.value = [4, 5, 6]   // 触发更新

// 4. 计算属性中的响应性依赖
const user = reactive({
  firstName: 'John',
  lastName: 'Doe',
  profile: { age: 25 }
})

// ❌ 访问深层属性时可能丢失依赖
const fullName = computed(() => {
  const { firstName, lastName } = user  // 丢失响应性
  return `${firstName} ${lastName}`
})

// ✅ 直接访问响应式对象属性
const fullNameCorrect = computed(() => {
  return `${user.firstName} ${user.lastName}`
})
```

**🎯 响应性检测工具**:
```javascript
import { isReactive, isRef, isProxy, isReadonly } from 'vue'

// 响应性检测函数
function checkReactivity(value, name) {
  console.log(`${name}:`, {
    isRef: isRef(value),
    isReactive: isReactive(value),
    isProxy: isProxy(value),
    isReadonly: isReadonly(value)
  })
}

const refValue = ref(1)
const reactiveValue = reactive({ count: 1 })
const readonlyValue = readonly({ count: 1 })

checkReactivity(refValue, 'ref')           // isRef: true
checkReactivity(reactiveValue, 'reactive') // isReactive: true
checkReactivity(readonlyValue, 'readonly') // isReadonly: true
```

---

### 🟡 1.5 shallowRef 和 shallowReactive 的使用场景

**🤔 面试问题**: 什么时候使用 shallow 版本的响应式API？性能优势在哪里？

**💡 核心答案**:
Shallow APIs 只对第一层属性进行响应式处理，适用于性能敏感场景：

```javascript
import { ref, shallowRef, reactive, shallowReactive, triggerRef } from 'vue'

// 1. shallowRef - 只有 .value 的赋值是响应式的
const normalRef = ref({
  count: 0,
  nested: { value: 1 }
})

const shallowRefValue = shallowRef({
  count: 0,
  nested: { value: 1 }
})

// 深层修改
normalRef.value.count++         // ✅ 触发更新
shallowRefValue.value.count++   // ❌ 不触发更新

// 整体替换
normalRef.value = { count: 1, nested: { value: 2 } }      // ✅ 触发更新
shallowRefValue.value = { count: 1, nested: { value: 2 } } // ✅ 触发更新

// 手动触发更新
shallowRefValue.value.count++
triggerRef(shallowRefValue)  // 手动触发更新

// 2. shallowReactive - 只有根级别属性是响应式的
const normalReactive = reactive({
  count: 0,
  nested: { value: 1, deep: { level: 2 } }
})

const shallowReactiveValue = shallowReactive({
  count: 0,
  nested: { value: 1, deep: { level: 2 } }
})

normalReactive.count++                    // ✅ 触发更新
normalReactive.nested.value++             // ✅ 触发更新
normalReactive.nested.deep.level++        // ✅ 触发更新

shallowReactiveValue.count++              // ✅ 触发更新
shallowReactiveValue.nested.value++       // ❌ 不触发更新
shallowReactiveValue.nested = { value: 2 } // ✅ 触发更新（根级别）

// 3. 使用场景示例
// 场景1：大型不可变数据结构
const largeDataset = shallowRef({
  users: new Array(10000).fill(null).map((_, id) => ({
    id, name: `User ${id}`, settings: { /* 大量配置 */ }
  })),
  metadata: { total: 10000, lastUpdate: Date.now() }
})

// 只在需要时替换整个数据集
function updateDataset(newData) {
  largeDataset.value = newData  // 高效的整体更新
}

// 场景2：第三方库集成
const chartInstance = shallowRef(null)

onMounted(() => {
  chartInstance.value = new Chart(canvas, config)
})

// 场景3：性能敏感的状态
const gameState = shallowReactive({
  score: 0,           // 频繁更新
  level: 1,           // 偶尔更新
  playerData: {}      // 复杂对象，手动管理
})

// 手动控制深层更新
function updatePlayerData(newData) {
  gameState.playerData = { ...gameState.playerData, ...newData }
}
```

**⚡ 性能对比**:
```javascript
// 性能测试：创建大量响应式对象
const createLargeReactive = () => {
  console.time('reactive')
  const data = reactive({
    items: new Array(1000).fill(null).map((_, i) => ({
      id: i,
      data: new Array(100).fill(i)
    }))
  })
  console.timeEnd('reactive')  // ~15ms
  return data
}

const createLargeShallow = () => {
  console.time('shallowReactive')
  const data = shallowReactive({
    items: new Array(1000).fill(null).map((_, i) => ({
      id: i,
      data: new Array(100).fill(i)
    }))
  })
  console.timeEnd('shallowReactive')  // ~2ms
  return data
}
```

---

### 🟡 1.6 watchEffect 与 watch 的区别及最佳实践

**🤔 面试问题**: watchEffect 和 watch 的使用场景有什么不同？如何选择？

**💡 核心答案**:
两者都用于响应式数据变化的副作用处理，但使用场景不同：

```javascript
import { ref, reactive, watch, watchEffect, computed } from 'vue'

const count = ref(0)
const user = reactive({ name: 'Vue', age: 3 })

// 1. watch - 显式指定依赖，可以获取新旧值
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})

// 监听多个源
watch([count, () => user.name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('Multiple sources changed')
})

// 监听响应式对象
watch(user, (newUser, oldUser) => {
  console.log('User object changed')
}, { deep: true })  // 深度监听

// 2. watchEffect - 自动收集依赖，立即执行
watchEffect(() => {
  // 自动追踪函数内使用的响应式数据
  console.log(`Current count: ${count.value}, user: ${user.name}`)
})

// 3. 使用场景对比
// 场景1：需要新旧值对比 - 使用 watch
const searchTerm = ref('')
const searchResults = ref([])

watch(searchTerm, async (newTerm, oldTerm) => {
  if (newTerm !== oldTerm && newTerm.length > 2) {
    searchResults.value = await searchAPI(newTerm)
  }
})

// 场景2：副作用清理 - watchEffect 更简洁
const url = ref('https://api.example.com/data')

watchEffect((onCleanup) => {
  const controller = new AbortController()

  fetch(url.value, { signal: controller.signal })
    .then(response => response.json())
    .then(data => {
      // 处理数据
    })

  // 清理函数
  onCleanup(() => {
    controller.abort()
  })
})

// 场景3：计算属性无法满足的复杂逻辑
const items = ref([])
const filteredItems = ref([])
const sortOrder = ref('asc')
const filterText = ref('')

watchEffect(() => {
  let result = items.value.filter(item =>
    item.name.includes(filterText.value)
  )

  if (sortOrder.value === 'asc') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    result.sort((a, b) => b.name.localeCompare(a.name))
  }

  filteredItems.value = result
})

// 4. 高级用法 - 停止监听
const stopWatcher = watchEffect(() => {
  console.log(`Count: ${count.value}`)
})

// 条件停止
if (count.value > 10) {
  stopWatcher()
}

// 5. 刷新时机控制
watchEffect(() => {
  // DOM 更新前执行
  console.log('Before DOM update')
}, { flush: 'pre' })

watchEffect(() => {
  // DOM 更新后执行
  console.log('After DOM update')
}, { flush: 'post' })

watchEffect(() => {
  // 同步执行
  console.log('Sync execution')
}, { flush: 'sync' })
```

**📊 选择指南**:

| 场景 | 推荐使用 | 原因 |
|------|----------|------|
| 需要新旧值对比 | watch | 提供明确的新旧值参数 |
| 自动依赖收集 | watchEffect | 无需手动指定依赖 |
| 条件执行 | watch | 可以在回调中添加条件判断 |
| 立即执行 | watchEffect | 默认立即执行一次 |
| 性能优化 | watch | 精确控制监听范围 |
| 副作用清理 | watchEffect | onCleanup 更优雅 |

---

## 2. 组合式API完全指南

### 🔥 2.1 生命周期Hooks完全解析

**🤔 面试问题**: Vue 3 生命周期Hooks的执行顺序是什么？与Options API有什么区别？

**标准答案**：

```
组件创建阶段：
setup() → beforeCreate → created → beforeMount → mounted

更新阶段：
beforeUpdate → updated

销毁阶段：
beforeUnmount → unmounted

父子组件执行顺序：
创建：父 beforeCreate → 父 created → 父 beforeMount → 子 beforeCreate → 子 created → 子 beforeMount → 子 mounted → 父 mounted

销毁：父 beforeUnmount → 子 beforeUnmount → 子 unmounted → 父 unmounted
```

```vue
<script setup>
import { onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'

// setup 相当于 beforeCreate + created
console.log('1. setup 执行')

onBeforeMount(() => {
  console.log('2. onBeforeMount - DOM 挂载前')
  // 此时模板编译完成，但未挂载到页面
})

onMounted(() => {
  console.log('3. onMounted - DOM 挂载完成')
  // 此时可以访问 DOM，进行 DOM 操作
  // 适合：发起 AJAX 请求、初始化第三方库、设置定时器
})

onBeforeUpdate(() => {
  console.log('4. onBeforeUpdate - 数据更新前')
  // 响应式数据更新，但 DOM 未更新
})

onUpdated(() => {
  console.log('5. onUpdated - DOM 更新完成')
  // DOM 已经根据响应式数据的变化进行了更新
})

onBeforeUnmount(() => {
  console.log('6. onBeforeUnmount - 组件卸载前')
  // 适合：清理定时器、移除事件监听、取消网络请求
})

onUnmounted(() => {
  console.log('7. onUnmounted - 组件已卸载')
  // 组件完全销毁，清理工作已完成
})
</script>
```

**面试重点**：
- setup() 在 beforeCreate 和 created 之间执行
- mounted 不保证所有子组件都已挂载，需要 nextTick
- updated 不能保证所有子组件都已更新

---

### ❓ 考点5：什么时候使用哪个生命周期？

**实用指南**：

```javascript
export default {
  setup() {
    // ✅ 数据初始化、computed、watch 设置
    const count = ref(0)

    onMounted(() => {
      // ✅ DOM 操作、AJAX 请求、第三方库初始化
      fetchUserData()
      initChart()
      window.addEventListener('resize', handleResize)
    })

    onBeforeUpdate(() => {
      // ✅ 获取更新前的 DOM 状态
      const scrollTop = document.documentElement.scrollTop
    })

    onUpdated(() => {
      // ✅ DOM 更新后的操作（慎用，避免无限循环）
      // 注意：不要在这里修改响应式数据
    })

    onBeforeUnmount(() => {
      // ✅ 清理工作：移除事件监听、清除定时器、取消请求
      window.removeEventListener('resize', handleResize)
      clearInterval(timer)
      abortController.abort()
    })

    return { count }
  }
}
```

---

### 🔥 2.2 computed 深度解析与最佳实践

**🤔 面试问题**: computed 的缓存机制是怎样的？什么时候重新计算？

**💡 核心答案**:
computed 基于响应式依赖进行缓存，只有依赖变化时才重新计算：

```javascript
import { ref, computed, watch } from 'vue'

const count = ref(0)
const doubleCount = computed(() => {
  console.log('computed 重新计算')  // 只有 count 变化时才执行
  return count.value * 2
})

// 1. 缓存机制演示
console.log(doubleCount.value)  // 第一次计算: "computed 重新计算"
console.log(doubleCount.value)  // 缓存结果，不再计算
console.log(doubleCount.value)  // 缓存结果，不再计算

count.value++                   // 触发重新计算
console.log(doubleCount.value)  // "computed 重新计算"

// 2. 可写 computed
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

fullName.value = 'Jane Smith'  // 触发 setter
console.log(firstName.value)   // 'Jane'
console.log(lastName.value)    // 'Smith'

// 3. 复杂计算场景
const todos = ref([
  { id: 1, text: '学习 Vue', completed: false },
  { id: 2, text: '写项目', completed: true },
  { id: 3, text: '面试准备', completed: false }
])

// 基础计算
const completedTodos = computed(() =>
  todos.value.filter(todo => todo.completed)
)

const pendingTodos = computed(() =>
  todos.value.filter(todo => !todo.completed)
)

// 链式计算
const completedCount = computed(() => completedTodos.value.length)
const pendingCount = computed(() => pendingTodos.value.length)
const progress = computed(() =>
  completedCount.value / todos.value.length * 100
)

// 4. 计算属性 vs 方法对比
// 方法：每次调用都执行
const getDoubleCountMethod = () => {
  console.log('方法执行')
  return count.value * 2
}

// 计算属性：依赖未变化时使用缓存
const doubleCountComputed = computed(() => {
  console.log('计算属性执行')
  return count.value * 2
})

// 5. 异步计算属性模拟
const asyncComputedValue = ref(null)
const isLoading = ref(false)

const asyncData = computed(() => {
  // 注意：computed 本身不支持异步
  // 需要配合 watch 实现异步效果
  return asyncComputedValue.value
})

watch(count, async (newCount) => {
  isLoading.value = true
  try {
    // 模拟异步操作
    const result = await new Promise(resolve =>
      setTimeout(() => resolve(newCount * 3), 1000)
    )
    asyncComputedValue.value = result
  } finally {
    isLoading.value = false
  }
}, { immediate: true })
```

**🎯 使用场景指南**:

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 简单数据转换 | computed | 自动缓存，性能好 |
| 异步数据处理 | watch + ref | computed 不支持异步 |
| 频繁调用的计算 | computed | 避免重复计算 |
| 事件处理逻辑 | methods | 每次执行不同逻辑 |
| 双向绑定 | computed with getter/setter | 提供完整的双向绑定 |

---

### 🔥 2.3 自定义Hooks设计模式

**🤔 面试问题**: 如何设计一个可复用的自定义Hook？有哪些最佳实践？

**💡 核心答案**:
自定义Hooks是Vue 3组合式API的核心优势，用于逻辑复用：

```javascript
// 1. 基础Hook：网络请求状态管理
import { ref, isRef, unref } from 'vue'

function useRequest(url, options = {}) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const execute = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const requestUrl = isRef(url) ? unref(url) : url
      const response = await fetch(requestUrl, {
        ...options,
        ...params
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // 支持立即执行
  if (options.immediate !== false) {
    execute()
  }

  return {
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    execute,
    refresh: () => execute()
  }
}

// 使用示例
const { data: userList, loading, error, refresh } = useRequest('/api/users')

// 2. 高级Hook：本地存储同步
function useLocalStorage(key, defaultValue = null) {
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue

  const value = ref(initialValue)

  // 监听值变化，同步到 localStorage
  watch(value, (newValue) => {
    if (newValue === null || newValue === undefined) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(newValue))
    }
  }, { deep: true })

  // 监听其他标签页的变化
  const handleStorageChange = (e) => {
    if (e.key === key) {
      value.value = e.newValue ? JSON.parse(e.newValue) : defaultValue
    }
  }

  onMounted(() => {
    window.addEventListener('storage', handleStorageChange)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange)
  })

  return value
}

// 使用示例
const theme = useLocalStorage('app-theme', 'light')
const userPreferences = useLocalStorage('user-preferences', {})

// 3. 组合Hook：表单管理
function useForm(initialValues = {}, validationRules = {}) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})
  const isSubmitting = ref(false)

  // 验证单个字段
  const validateField = (field) => {
    const rule = validationRules[field]
    if (!rule) return true

    const value = values[field]
    const result = rule(value)

    if (result === true) {
      delete errors[field]
      return true
    } else {
      errors[field] = result
      return false
    }
  }

  // 验证所有字段
  const validateAll = () => {
    const fields = Object.keys(validationRules)
    return fields.every(field => validateField(field))
  }

  // 字段变化处理
  const handleChange = (field, value) => {
    values[field] = value
    touched[field] = true

    // 实时验证
    if (touched[field]) {
      validateField(field)
    }
  }

  // 表单提交
  const handleSubmit = async (submitFn) => {
    // 标记所有字段为已触摸
    Object.keys(validationRules).forEach(field => {
      touched[field] = true
    })

    if (!validateAll()) {
      return false
    }

    isSubmitting.value = true
    try {
      await submitFn(values)
      return true
    } catch (error) {
      console.error('Submit error:', error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // 重置表单
  const reset = () => {
    Object.assign(values, initialValues)
    Object.keys(errors).forEach(key => delete errors[key])
    Object.keys(touched).forEach(key => delete touched[key])
  }

  const isValid = computed(() => Object.keys(errors).length === 0)
  const isDirty = computed(() => Object.keys(touched).length > 0)

  return {
    values,
    errors: readonly(errors),
    touched: readonly(touched),
    isSubmitting: readonly(isSubmitting),
    isValid,
    isDirty,
    handleChange,
    handleSubmit,
    validateField,
    validateAll,
    reset
  }
}

// 使用示例
const { values, errors, isValid, handleChange, handleSubmit } = useForm(
  { name: '', email: '' },
  {
    name: (value) => !value ? '姓名必填' : value.length < 2 ? '姓名至少2个字符' : true,
    email: (value) => !/\S+@\S+\.\S+/.test(value) ? '邮箱格式不正确' : true
  }
)

// 4. 工具Hook：防抖和节流
function useDebounce(value, delay) {
  const debouncedValue = ref(value.value)

  watch(value, () => {
    const timer = setTimeout(() => {
      debouncedValue.value = value.value
    }, delay)

    // 返回清理函数
    return () => clearTimeout(timer)
  })

  return debouncedValue
}

function useThrottle(fn, delay) {
  const throttling = ref(false)

  const throttledFn = (...args) => {
    if (throttling.value) return

    throttling.value = true
    fn.apply(this, args)

    setTimeout(() => {
      throttling.value = false
    }, delay)
  }

  return { throttledFn, isThrottling: readonly(throttling) }
}
```

**📋 Hook设计原则**:
1. **单一职责**: 每个Hook专注一个功能
2. **可组合性**: Hook之间可以相互组合
3. **响应式**: 充分利用Vue的响应式系统
4. **清理资源**: 在卸载时清理副作用
5. **类型安全**: 提供完整的TypeScript支持

---

### 🟡 2.4 provide/inject 深度应用

**🤔 面试问题**: provide/inject 的使用场景是什么？如何避免prop drilling？

**💡 核心答案**:
provide/inject 用于跨组件层级的数据传递，避免层层传递props：

```javascript
// 1. 基础用法
// 祖先组件
const app = createApp({
  setup() {
    const theme = ref('dark')
    const user = reactive({
      name: 'Vue Developer',
      role: 'admin'
    })

    // 提供响应式数据
    provide('theme', theme)
    provide('user', readonly(user))  // 只读保护

    // 提供方法
    const updateTheme = (newTheme) => {
      theme.value = newTheme
    }
    provide('updateTheme', updateTheme)

    return { theme, user }
  }
})

// 后代组件
export default {
  setup() {
    const theme = inject('theme')
    const user = inject('user')
    const updateTheme = inject('updateTheme')

    // 默认值
    const config = inject('config', { api: '/api/v1' })

    // 函数式默认值
    const settings = inject('settings', () => ({ locale: 'zh-CN' }))

    return { theme, user, updateTheme, config, settings }
  }
}

// 2. 高级模式：创建应用级状态管理
// store.js
const StoreSymbol = Symbol('app-store')

export function createStore() {
  const state = reactive({
    user: null,
    loading: false,
    error: null
  })

  const actions = {
    async login(credentials) {
      state.loading = true
      try {
        const user = await api.login(credentials)
        state.user = user
      } catch (error) {
        state.error = error.message
      } finally {
        state.loading = false
      }
    },

    logout() {
      state.user = null
      state.error = null
    },

    clearError() {
      state.error = null
    }
  }

  const getters = {
    isLoggedIn: computed(() => !!state.user),
    userName: computed(() => state.user?.name || 'Guest'),
    hasError: computed(() => !!state.error)
  }

  return {
    state: readonly(state),
    ...actions,
    ...getters
  }
}

export function provideStore() {
  const store = createStore()
  provide(StoreSymbol, store)
  return store
}

export function useStore() {
  const store = inject(StoreSymbol)
  if (!store) {
    throw new Error('useStore must be used within a provider')
  }
  return store
}

// App.vue
export default {
  setup() {
    const store = provideStore()
    return { store }
  }
}

// 任意子组件
export default {
  setup() {
    const { state, login, logout, isLoggedIn } = useStore()
    return { state, login, logout, isLoggedIn }
  }
}

// 3. 主题系统实现
const ThemeSymbol = Symbol('theme')

// 主题提供者
export function useThemeProvider() {
  const currentTheme = ref('light')
  const themes = reactive({
    light: {
      primary: '#007bff',
      background: '#ffffff',
      text: '#333333'
    },
    dark: {
      primary: '#0d6efd',
      background: '#121212',
      text: '#ffffff'
    }
  })

  const themeConfig = computed(() => themes[currentTheme.value])

  const setTheme = (theme) => {
    if (themes[theme]) {
      currentTheme.value = theme
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  provide(ThemeSymbol, {
    currentTheme: readonly(currentTheme),
    themeConfig: readonly(themeConfig),
    setTheme
  })

  return { currentTheme, themeConfig, setTheme }
}

// 主题消费者
export function useTheme() {
  const theme = inject(ThemeSymbol)
  if (!theme) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return theme
}

// 4. 权限系统
const PermissionSymbol = Symbol('permissions')

export function usePermissionProvider(user) {
  const permissions = computed(() => user.value?.permissions || [])
  const roles = computed(() => user.value?.roles || [])

  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  const hasRole = (role) => {
    return roles.value.includes(role)
  }

  const hasAnyPermission = (...perms) => {
    return perms.some(p => hasPermission(p))
  }

  provide(PermissionSymbol, {
    permissions,
    roles,
    hasPermission,
    hasRole,
    hasAnyPermission
  })

  return { hasPermission, hasRole, hasAnyPermission }
}

export function usePermission() {
  return inject(PermissionSymbol)
}
```

**⚡ 性能优化技巧**:
```javascript
// 1. 避免提供大对象，使用计算属性
const largeData = reactive({ /* 大量数据 */ })

// ❌ 提供整个对象
provide('data', largeData)

// ✅ 只提供需要的部分
provide('userInfo', computed(() => ({
  id: largeData.user.id,
  name: largeData.user.name
})))

// 2. 使用 readonly 保护数据
provide('config', readonly(config))

// 3. 提供更新方法而不是直接暴露响应式对象
const updateConfig = (key, value) => {
  config[key] = value
}
provide('updateConfig', updateConfig)
```

---

## 3. 虚拟DOM与diff算法

### 🔥 3.1 Vue 3编译优化核心原理

**🤔 面试问题**: Vue 3在编译时做了哪些优化？静态提升和补丁标记的作用是什么？

**💡 核心答案**:
Vue 3的编译器在构建时进行了大量优化，显著提升运行时性能：

```javascript
// 1. 静态提升 (Static Hoisting)
// 编译前的模板
<template>
  <div>
    <h1>静态标题</h1>  <!-- 静态节点 -->
    <p>{{ message }}</p>  <!-- 动态节点 -->
    <span>另一个静态文本</span>  <!-- 静态节点 -->
  </div>
</template>

// 编译后的渲染函数
import { createVNode as _createVNode, toDisplayString as _toDisplayString } from 'vue'

// 静态节点被提升到渲染函数外部，只创建一次
const _hoisted_1 = _createVNode("h1", null, "静态标题")
const _hoisted_2 = _createVNode("span", null, "另一个静态文本")

export function render(_ctx, _cache) {
  return _createVNode("div", null, [
    _hoisted_1,  // 复用静态节点
    _createVNode("p", null, _toDisplayString(_ctx.message), 1 /* TEXT */),
    _hoisted_2   // 复用静态节点
  ])
}

// 2. 补丁标记 (Patch Flags)
const PatchFlags = {
  TEXT: 1,                    // 动态文本内容
  CLASS: 1 << 1,              // 动态 class (2)
  STYLE: 1 << 2,              // 动态 style (4)
  PROPS: 1 << 3,              // 动态 props (8)
  FULL_PROPS: 1 << 4,         // 有 key，需要完整 diff (16)
  HYDRATE_EVENTS: 1 << 5,     // 有事件监听器 (32)
  STABLE_FRAGMENT: 1 << 6,    // 稳定的 fragment (64)
  KEYED_FRAGMENT: 1 << 7,     // 有 key 的 fragment (128)
  UNKEYED_FRAGMENT: 1 << 8,   // 无 key 的 fragment (256)
  NEED_PATCH: 1 << 9,         // 需要 patch (512)
  DYNAMIC_SLOTS: 1 << 10,     // 动态插槽 (1024)
  DEV_ROOT_FRAGMENT: 1 << 11  // 开发模式根 fragment (2048)
}

// 具体的补丁标记示例
function render() {
  return createVNode("div", null, [
    // 只有文本内容是动态的，标记为 TEXT (1)
    createVNode("span", null, message, 1 /* TEXT */),

    // 只有 class 是动态的，标记为 CLASS (2)
    createVNode("div", { class: dynamicClass }, "content", 2 /* CLASS */),

    // 文本和 class 都是动态的，组合标记 (1 | 2 = 3)
    createVNode("p", { class: dynamicClass }, dynamicText, 3 /* TEXT, CLASS */),

    // 完全静态的节点，无标记
    createVNode("footer", null, "静态内容")
  ])
}

// 3. 块级优化 (Block)
// Vue 3 将模板分解为静态和动态的"块"
function renderWithBlocks() {
  return (openBlock(), createBlock("div", null, [
    // 静态部分
    createVNode("header", null, "Header"),

    // 动态块
    (openBlock(), createBlock("section", null, [
      (openBlock(true), createBlock(Fragment, null,
        renderList(items, (item) => {
          return (openBlock(), createBlock("div", { key: item.id }, [
            createVNode("span", null, toDisplayString(item.name), 1 /* TEXT */)
          ]))
        }), 256 /* UNKEYED_FRAGMENT */))
    ])),

    // 静态部分
    createVNode("footer", null, "Footer")
  ]))
}

// 4. 树摇优化 (Tree-shaking)
// 只有使用的特性才会被包含在最终bundle中
import {
  createApp,      // 必需
  ref,           // 使用了，会被包含
  reactive,      // 使用了，会被包含
  // computed,   // 未使用，会被移除
  // watch,      // 未使用，会被移除
} from 'vue'

// 5. 内联组件props优化
// 编译时优化的组件props传递
<template>
  <MyComponent
    :static-prop="'constant'"     <!-- 编译时常量 -->
    :dynamic-prop="variable"      <!-- 运行时绑定 -->
    static-attr="value"           <!-- 静态属性 -->
  />
</template>

// 编译后
createVNode(MyComponent, {
  "static-attr": "value",         // 静态属性直接内联
  "static-prop": "constant",      // 编译时常量
  "dynamic-prop": _ctx.variable   // 动态绑定
}, null, 8 /* PROPS */)
```

**📊 性能对比**:
```javascript
// Vue 2 vs Vue 3 性能对比
const performanceTest = {
  // Vue 2: 每次都要遍历整个模板
  vue2Render() {
    // 所有节点都参与diff算法
    return h('div', [
      h('h1', 'Title'),           // 每次都检查
      h('p', this.message),       // 每次都检查
      h('span', 'Footer')         // 每次都检查
    ])
  },

  // Vue 3: 只检查有补丁标记的节点
  vue3Render() {
    return (openBlock(), createBlock('div', null, [
      _hoisted_1,                 // 静态节点，跳过
      createVNode('p', null, message, 1 /* TEXT */), // 只检查文本
      _hoisted_2                  // 静态节点，跳过
    ]))
  }
}

// 结果：Vue 3 在大型应用中性能提升 50-100%
```

---

### 🔥 3.2 Diff算法深度解析

**🤔 面试问题**: Vue 3的diff算法相比Vue 2有什么改进？最长递增子序列的作用是什么？

**💡 核心答案**:
Vue 3采用了更高效的diff算法，特别是在处理列表时：

```javascript
// Vue 3 diff算法核心实现
function patchKeyedChildren(
  oldChildren,
  newChildren,
  container,
  parentAnchor
) {
  let i = 0
  const oldLength = oldChildren.length
  const newLength = newChildren.length
  let oldEnd = oldLength - 1
  let newEnd = newLength - 1

  // 1. 从前往后对比相同的节点
  while (i <= oldEnd && i <= newEnd) {
    const oldVNode = oldChildren[i]
    const newVNode = newChildren[i]

    if (isSameVNodeType(oldVNode, newVNode)) {
      patch(oldVNode, newVNode, container, null)
      i++
    } else {
      break
    }
  }

  // 2. 从后往前对比相同的节点
  while (i <= oldEnd && i <= newEnd) {
    const oldVNode = oldChildren[oldEnd]
    const newVNode = newChildren[newEnd]

    if (isSameVNodeType(oldVNode, newVNode)) {
      patch(oldVNode, newVNode, container, null)
      oldEnd--
      newEnd--
    } else {
      break
    }
  }

  // 3. 处理新增节点
  if (i > oldEnd) {
    if (i <= newEnd) {
      const nextPos = newEnd + 1
      const anchor = nextPos < newLength ? newChildren[nextPos].el : parentAnchor

      while (i <= newEnd) {
        patch(null, newChildren[i], container, anchor)
        i++
      }
    }
  }
  // 4. 处理删除节点
  else if (i > newEnd) {
    while (i <= oldEnd) {
      unmount(oldChildren[i])
      i++
    }
  }
  // 5. 处理复杂情况：需要移动的节点
  else {
    const oldStart = i
    const newStart = i

    // 建立新节点的key -> index映射
    const keyToNewIndexMap = new Map()
    for (i = newStart; i <= newEnd; i++) {
      const nextChild = newChildren[i]
      if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i)
      }
    }

    // 需要patch的节点数量
    const toBePatched = newEnd - newStart + 1
    let patched = 0

    // 新索引到旧索引的映射数组
    const newIndexToOldIndexMap = new Array(toBePatched)
    for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

    let moved = false
    let maxNewIndexSoFar = 0

    // 遍历旧节点，尝试patch和记录位置
    for (i = oldStart; i <= oldEnd; i++) {
      const prevChild = oldChildren[i]

      if (patched >= toBePatched) {
        // 所有新节点都已经patch，剩余的旧节点删除
        unmount(prevChild)
        continue
      }

      let newIndex
      if (prevChild.key != null) {
        newIndex = keyToNewIndexMap.get(prevChild.key)
      } else {
        // 没有key，线性查找
        for (let j = newStart; j <= newEnd; j++) {
          if (newIndexToOldIndexMap[j - newStart] === 0 &&
              isSameVNodeType(prevChild, newChildren[j])) {
            newIndex = j
            break
          }
        }
      }

      if (newIndex === undefined) {
        // 在新列表中找不到，删除
        unmount(prevChild)
      } else {
        // 记录新旧索引映射
        newIndexToOldIndexMap[newIndex - newStart] = i + 1

        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }

        patch(prevChild, newChildren[newIndex], container, null)
        patched++
      }
    }

    // 6. 生成最长递增子序列
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : []

    // 从后往前遍历，移动和插入节点
    let j = increasingNewIndexSequence.length - 1

    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = newStart + i
      const nextChild = newChildren[nextIndex]
      const anchor = nextIndex + 1 < newLength
        ? newChildren[nextIndex + 1].el
        : parentAnchor

      if (newIndexToOldIndexMap[i] === 0) {
        // 新节点，需要挂载
        patch(null, nextChild, container, anchor)
      } else if (moved) {
        // 需要移动
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
          move(nextChild, container, anchor)
        } else {
          j--
        }
      }
    }
  }
}

// 最长递增子序列算法
function getSequence(arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length

  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) {
          u = c + 1
        } else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1]
        }
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}

// 使用示例：列表变化的优化处理
const oldList = [
  { key: 'a', value: 1 },
  { key: 'b', value: 2 },
  { key: 'c', value: 3 },
  { key: 'd', value: 4 }
]

const newList = [
  { key: 'a', value: 1 },
  { key: 'c', value: 3 },
  { key: 'b', value: 2 },
  { key: 'e', value: 5 },
  { key: 'd', value: 4 }
]

// Vue 3 diff过程：
// 1. 前序对比：a相同，i=1
// 2. 后序对比：d相同，oldEnd=2, newEnd=3
// 3. 复杂情况处理：[b,c] -> [c,b,e]
// 4. 最长递增子序列：找到[c]不需要移动
// 5. 只需要移动b和插入e，最小化DOM操作
```

**🎯 算法优势对比**:

| 特性 | Vue 2 | Vue 3 |
|------|-------|-------|
| 双端比较 | ✅ | ✅ |
| 最长递增子序列 | ❌ | ✅ |
| 静态标记 | ❌ | ✅ |
| 预处理优化 | 基础 | 深度优化 |
| 时间复杂度 | O(n²) 最坏情况 | O(n log n) 平均情况 |

---

### 🟡 3.3 key的作用机制详解

**🤔 面试问题**: 为什么v-for必须绑定key？key的选择有什么原则？

**💡 核心答案**:
key是Vue diff算法的核心标识，影响节点复用和渲染性能：

```javascript
// 1. 没有key的问题演示
// 列表：['Alice', 'Bob', 'Charlie']
<template>
  <div v-for="name in names">
    <input :placeholder="name" />
    <span>{{ name }}</span>
  </div>
</template>

// 当删除'Alice'后，列表变为：['Bob', 'Charlie']
// Vue不知道哪个节点对应哪个数据，可能错误复用DOM

// 2. 正确使用key
<template>
  <div v-for="(user, index) in users" :key="user.id">
    <input :placeholder="user.name" />
    <span>{{ user.name }}</span>
  </div>
</template>

// 3. key选择的最佳实践
const todoList = ref([
  { id: 1, text: '学习Vue', completed: false },
  { id: 2, text: '写代码', completed: true },
  { id: 3, text: '面试', completed: false }
])

// ✅ 使用唯一且稳定的id
<template>
  <div v-for="todo in todoList" :key="todo.id">
    <input
      type="checkbox"
      v-model="todo.completed"
    />
    <span>{{ todo.text }}</span>
  </div>
</template>

// ❌ 不要使用数组索引作为key
<template>
  <div v-for="(todo, index) in todoList" :key="index">
    <!-- 当列表顺序改变时会有问题 -->
  </div>
</template>

// ❌ 不要使用随机数作为key
<template>
  <div v-for="todo in todoList" :key="Math.random()">
    <!-- 每次都会重新创建，失去复用优势 -->
  </div>
</template>

// 4. 复杂场景下的key策略
// 场景1：嵌套列表
const categories = ref([
  {
    id: 1,
    name: '前端',
    items: [
      { id: 101, name: 'Vue' },
      { id: 102, name: 'React' }
    ]
  },
  {
    id: 2,
    name: '后端',
    items: [
      { id: 201, name: 'Node.js' },
      { id: 202, name: 'Python' }
    ]
  }
])

<template>
  <div v-for="category in categories" :key="category.id">
    <h3>{{ category.name }}</h3>
    <ul>
      <li v-for="item in category.items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

// 场景2：动态组件列表
const components = ref([
  { id: 1, type: 'UserCard', props: { userId: 1 } },
  { id: 2, type: 'ProductCard', props: { productId: 2 } },
  { id: 3, type: 'UserCard', props: { userId: 3 } }
])

<template>
  <component
    v-for="comp in components"
    :key="comp.id"
    :is="comp.type"
    v-bind="comp.props"
  />
</template>

// 场景3：条件渲染的key
const showType = ref('list') // 'list' | 'grid' | 'table'

<template>
  <!-- 强制重新渲染不同的组件 -->
  <ListView v-if="showType === 'list'" :key="'list'" />
  <GridView v-else-if="showType === 'grid'" :key="'grid'" />
  <TableView v-else :key="'table'" />
</template>

// 5. key对性能的影响测试
const measureDiffPerformance = () => {
  const oldList = Array.from({ length: 1000 }, (_, i) => ({ id: i, value: i }))
  const newList = oldList.slice().reverse() // 反转列表

  // 有key的情况
  console.time('with-key')
  // diff算法可以正确识别节点移动，只需要移动DOM
  diffWithKey(oldList, newList)
  console.timeEnd('with-key') // ~2ms

  // 无key的情况
  console.time('without-key')
  // diff算法无法识别，需要重新创建所有DOM
  diffWithoutKey(oldList, newList)
  console.timeEnd('without-key') // ~15ms
}

// 6. 特殊情况下的key处理
// 动态key组合
const generateKey = (item, context) => {
  if (item.type === 'user') {
    return `user-${item.id}`
  } else if (item.type === 'product') {
    return `product-${item.id}-${context.category}`
  }
  return `generic-${item.id}`
}

// 临时key处理
const tempItems = ref([])
const addTempItem = () => {
  tempItems.value.push({
    tempId: Date.now(), // 临时ID
    text: '新项目'
  })
}

<template>
  <div v-for="item in tempItems" :key="item.tempId">
    <!-- 使用临时ID作为key，直到获得真实ID -->
  </div>
</template>
```

**📋 Key选择原则**:
1. **唯一性**: 在同一列表中必须唯一
2. **稳定性**: 不应该随渲染改变
3. **可预测性**: 相同数据应该有相同key
4. **简单性**: 避免复杂的计算生成key

---

## 5. 组件通信全解

**完整答案**：

#### 1. Props / Emit（父子通信）
```vue
<!-- 父组件 -->
<Child :message="parentMsg" @update="handleUpdate" />

<!-- 子组件 -->
<script setup>
const props = defineProps(['message'])
const emit = defineEmits(['update'])

const handleClick = () => {
  emit('update', 'new data')
}
</script>
```

#### 2. v-model（双向绑定）
```vue
<!-- 父组件 -->
<CustomInput v-model="inputValue" />

<!-- 子组件 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>
```

#### 3. $refs（直接引用）
```vue
<script setup>
const childRef = ref()

onMounted(() => {
  childRef.value.childMethod()  // 调用子组件方法
})
</script>

<template>
  <Child ref="childRef" />
</template>
```

#### 4. provide / inject（跨级通信）
```javascript
// 祖先组件
provide('theme', 'dark')

// 后代组件
const theme = inject('theme', 'light')  // 默认值
```

#### 5. Event Bus（兄弟通信）
```javascript
// Vue 3 需要第三方库或自实现
import mitt from 'mitt'
const emitter = mitt()

// 发送
emitter.emit('custom-event', data)

// 接收
emitter.on('custom-event', handleEvent)
```

#### 6. Vuex / Pinia（全局状态）
```javascript
// Pinia
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++

  return { count, increment }
})
```

#### 7. $attrs / $slots（属性和插槽透传）
```vue
<script setup>
import { useAttrs, useSlots } from 'vue'

const attrs = useAttrs()   // 非 prop 属性
const slots = useSlots()   // 插槽
</script>
```

#### 8. expose（子向父暴露）
```vue
<!-- 子组件 -->
<script setup>
const count = ref(0)
const increment = () => count.value++

// 暴露给父组件
defineExpose({
  count,
  increment
})
</script>

<!-- 父组件 -->
<script setup>
const childRef = ref()

const handleClick = () => {
  console.log(childRef.value.count)      // 访问子组件数据
  childRef.value.increment()             // 调用子组件方法
}
</script>
```

---

## 🎯 Vue 3 新特性考题

### ❓ 考点7：组合式 API 相比选项式 API 有什么优势？

**核心优势**：

1. **更好的逻辑复用**
2. **更好的类型推断**
3. **更灵活的代码组织**
4. **更小的打包体积**（tree-shaking）

```javascript
// 选项式 API 的问题
export default {
  data() {
    return {
      // 用户相关
      user: null,
      userLoading: false,

      // 商品相关
      products: [],
      productLoading: false
    }
  },
  methods: {
    // 用户方法
    fetchUser() { /* ... */ },
    updateUser() { /* ... */ },

    // 商品方法
    fetchProducts() { /* ... */ },
    addProduct() { /* ... */ }
  },
  mounted() {
    this.fetchUser()      // 用户逻辑
    this.fetchProducts()  // 商品逻辑
  }
}

// 组合式 API 的解决方案
function useUser() {
  const user = ref(null)
  const loading = ref(false)

  const fetchUser = async () => {
    loading.value = true
    // 获取用户数据
    loading.value = false
  }

  return { user, loading, fetchUser }
}

function useProducts() {
  const products = ref([])
  const loading = ref(false)

  const fetchProducts = async () => {
    loading.value = true
    // 获取商品数据
    loading.value = false
  }

  return { products, loading, fetchProducts }
}

export default {
  setup() {
    // 逻辑清晰分离
    const userData = useUser()
    const productData = useProducts()

    onMounted(() => {
      userData.fetchUser()
      productData.fetchProducts()
    })

    return {
      ...userData,
      ...productData
    }
  }
}
```

---

### ❓ 考点8：Teleport 的使用场景和原理？

**核心概念**：
Teleport 可以将组件的 HTML 渲染到 DOM 树的任意位置，而逻辑仍然属于当前组件。

```vue
<template>
  <div class="container">
    <h1>页面内容</h1>

    <!-- 将模态框渲染到 body 下 -->
    <teleport to="body">
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <p>我被渲染到了 body 下</p>
          <button @click="showModal = false">关闭</button>
        </div>
      </div>
    </teleport>

    <button @click="showModal = true">显示模态框</button>
  </div>
</template>

<script setup>
const showModal = ref(false)
</script>
```

**使用场景**：
1. **模态框**：避免 z-index 问题
2. **通知/Toast**：渲染到页面顶层
3. **全屏组件**：如图片预览
4. **第三方容器**：渲染到指定 DOM 节点

**实现原理**：
```javascript
// 简化版 Teleport 实现
function teleport(vnode, container) {
  if (typeof container === 'string') {
    container = document.querySelector(container)
  }

  if (container) {
    // 将 vnode 渲染到指定容器
    render(vnode, container)
  }
}
```

---

### ❓ 考点9：Fragment（多根节点）带来了什么变化？

**Vue 2 限制**：
```vue
<!-- 必须有单一根节点 -->
<template>
  <div>  <!-- 包装元素 -->
    <h1>标题</h1>
    <p>内容</p>
  </div>
</template>
```

**Vue 3 改进**：
```vue
<!-- 支持多个根节点 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
  <footer>页脚</footer>
</template>
```

**带来的变化**：
1. **更简洁的模板**：无需额外包装元素
2. **更好的语义化**：减少无意义的 div
3. **属性透传变化**：需要显式指定属性接收者

```vue
<!-- 属性透传问题 -->
<template>
  <h1>标题</h1>
  <p>内容</p>
</template>

<!-- 使用时 -->
<MyComponent class="my-class" />
<!-- class 会被应用到哪个元素？需要手动指定 -->

<script setup>
import { useAttrs } from 'vue'

const attrs = useAttrs()
</script>

<template>
  <h1 v-bind="attrs">标题</h1>  <!-- 手动绑定属性 -->
  <p>内容</p>
</template>
```

---

## ⚡ 虚拟 DOM 和性能优化考题

### ❓ 考点10：Vue 3 的 diff 算法相比 Vue 2 有什么优化？

**核心优化**：

#### 1. 静态提升（Static Hoisting）
```vue
<template>
  <div>
    <h1>静态标题</h1>  <!-- 会被提升 -->
    <p>{{ message }}</p>  <!-- 动态内容 -->
  </div>
</template>

<!-- 编译后 -->
<script>
// 静态节点被提升到渲染函数外部
const _hoisted_1 = createVNode("h1", null, "静态标题")

function render() {
  return createVNode("div", null, [
    _hoisted_1,  // 复用静态节点
    createVNode("p", null, message)
  ])
}
</script>
```

#### 2. 补丁标记（Patch Flags）
```javascript
// 为动态节点添加标记
const PatchFlags = {
  TEXT: 1,          // 动态文本内容
  CLASS: 1 << 1,    // 动态 class
  STYLE: 1 << 2,    // 动态 style
  PROPS: 1 << 3,    // 动态 props
  FULL_PROPS: 1 << 4, // 有 key，需要完整 diff
  HYDRATE_EVENTS: 1 << 5, // 有事件监听器
  STABLE_FRAGMENT: 1 << 6, // 稳定的 fragment
  KEYED_FRAGMENT: 1 << 7,  // 有 key 的 fragment
  UNKEYED_FRAGMENT: 1 << 8, // 无 key 的 fragment
  NEED_PATCH: 1 << 9,      // 需要 patch
  DYNAMIC_SLOTS: 1 << 10,  // 动态插槽
  DEV_ROOT_FRAGMENT: 1 << 11 // 开发模式根 fragment
}

// 编译后的渲染函数
function render() {
  return createVNode("div", null, [
    createVNode("span", null, message, 1 /* TEXT */),
    createVNode("span", { class: className }, null, 2 /* CLASS */),
    createVNode("span", { style: styles }, null, 4 /* STYLE */)
  ])
}
```

#### 3. 最长递增子序列算法
```javascript
// Vue 3 diff 算法优化
function patchKeyedChildren(oldChildren, newChildren) {
  // 1. 预处理：从前往后对比相同节点
  let i = 0
  let oldEnd = oldChildren.length - 1
  let newEnd = newChildren.length - 1

  // 从前往后
  while (i <= oldEnd && i <= newEnd) {
    if (isSameVNodeType(oldChildren[i], newChildren[i])) {
      patch(oldChildren[i], newChildren[i])
      i++
    } else {
      break
    }
  }

  // 2. 从后往前
  while (i <= oldEnd && i <= newEnd) {
    if (isSameVNodeType(oldChildren[oldEnd], newChildren[newEnd])) {
      patch(oldChildren[oldEnd], newChildren[newEnd])
      oldEnd--
      newEnd--
    } else {
      break
    }
  }

  // 3. 处理剩余节点：使用最长递增子序列算法
  if (i > oldEnd && i <= newEnd) {
    // 新增节点
    for (let j = i; j <= newEnd; j++) {
      mount(newChildren[j])
    }
  } else if (i > newEnd && i <= oldEnd) {
    // 删除节点
    for (let j = i; j <= oldEnd; j++) {
      unmount(oldChildren[j])
    }
  } else {
    // 复杂情况：使用最长递增子序列算法
    const toBePatched = newEnd - i + 1
    const keyToNewIndexMap = new Map()

    // 建立 key -> index 映射
    for (let j = i; j <= newEnd; j++) {
      keyToNewIndexMap.set(newChildren[j].key, j)
    }

    // 找到最长递增子序列，减少移动操作
    const newIndexToOldIndexMap = new Array(toBePatched).fill(0)
    let moved = false
    let maxNewIndexSoFar = 0

    for (let j = i; j <= oldEnd; j++) {
      const oldChild = oldChildren[j]
      const newIndex = keyToNewIndexMap.get(oldChild.key)

      if (newIndex !== undefined) {
        newIndexToOldIndexMap[newIndex - i] = j + 1
        if (newIndex >= maxNewIndexSoFar) {
          maxNewIndexSoFar = newIndex
        } else {
          moved = true
        }
        patch(oldChild, newChildren[newIndex])
      } else {
        unmount(oldChild)
      }
    }

    // 生成最长递增子序列
    const increasingNewIndexSequence = moved
      ? getSequence(newIndexToOldIndexMap)
      : []

    // 根据子序列移动节点
    // ...移动和插入逻辑
  }
}
```

**性能提升**：
- **编译时优化**：减少运行时计算
- **靶向更新**：只更新变化的部分
- **减少移动**：最长递增子序列算法

---

### ❓ 考点11：nextTick 的原理和使用？

**核心概念**：
nextTick 让你可以在 DOM 更新完成后执行回调函数。

```javascript
import { nextTick } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const elementRef = ref()

    const updateCount = async () => {
      count.value++

      // 此时 DOM 还未更新
      console.log(elementRef.value.textContent) // 旧值

      // 等待 DOM 更新
      await nextTick()
      console.log(elementRef.value.textContent) // 新值
    }

    return { count, elementRef, updateCount }
  }
}
```

**实现原理**：
```javascript
// Vue 3 nextTick 简化实现
const resolvedPromise = Promise.resolve()
let currentFlushPromise = null

function nextTick(fn) {
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(fn) : p
}

// 批量更新机制
let isFlushing = false
let isFlushPending = false
const queue = []

function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

function flushJobs() {
  isFlushPending = false
  isFlushing = true

  // 按组件树顺序排序
  queue.sort((a, b) => a.id - b.id)

  try {
    for (let i = 0; i < queue.length; i++) {
      queue[i]()
    }
  } finally {
    queue.length = 0
    isFlushing = false
    currentFlushPromise = null
  }
}
```

**使用场景**：
1. **DOM 更新后获取元素尺寸**
2. **滚动到新添加的元素**
3. **第三方库需要 DOM 完全渲染**

---

## 🛠️ 状态管理考题

### ❓ 考点12：Pinia 相比 Vuex 的优势？

**核心对比**：

| 特性 | Vuex 4 | Pinia |
|------|--------|-------|
| TypeScript 支持 | 需要额外配置 | 原生支持 |
| 代码分割 | 手动管理模块 | 自动代码分割 |
| DevTools 支持 | 好 | 更好 |
| 热更新 | 支持 | 更好的支持 |
| 学习曲线 | 相对复杂 | 更简单 |

```javascript
// Vuex 4 写法
const store = createStore({
  state: {
    count: 0,
    user: null
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    }
  },
  actions: {
    async fetchUser({ commit }, id) {
      const user = await api.getUser(id)
      commit('SET_USER', user)
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
})

// Pinia 写法
export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const user = ref(null)

  // getters
  const doubleCount = computed(() => count.value * 2)

  // actions
  const increment = () => {
    count.value++
  }

  const fetchUser = async (id) => {
    user.value = await api.getUser(id)
  }

  return { count, user, doubleCount, increment, fetchUser }
})

// 使用
const counter = useCounterStore()
counter.increment()
```

**Pinia 的优势**：
1. **去掉了 mutations**：actions 支持同步和异步
2. **更好的 TypeScript 推断**
3. **模块化更简单**：每个 store 都是独立的
4. **支持插件系统**

---

## 🎯 实战场景考题

### ❓ 考点13：如何实现一个通用的权限控制系统？

**完整方案**：

```javascript
// 1. 权限store
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const permissions = ref([])
  const roles = ref([])

  const hasPermission = (permission) => {
    return permissions.value.includes(permission)
  }

  const hasRole = (role) => {
    return roles.value.includes(role)
  }

  const hasAnyPermission = (perms) => {
    return perms.some(perm => hasPermission(perm))
  }

  const hasAllPermissions = (perms) => {
    return perms.every(perm => hasPermission(perm))
  }

  return {
    user, permissions, roles,
    hasPermission, hasRole, hasAnyPermission, hasAllPermissions
  }
})

// 2. 权限指令
app.directive('permission', {
  mounted(el, binding) {
    const { value } = binding
    const authStore = useAuthStore()

    if (value && !authStore.hasPermission(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  },
  updated(el, binding) {
    const { value, oldValue } = binding
    if (value !== oldValue) {
      const authStore = useAuthStore()
      if (!authStore.hasPermission(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
})

// 3. 权限组件
const PermissionGuard = {
  props: {
    permission: [String, Array],
    role: [String, Array],
    mode: {
      type: String,
      default: 'any' // any | all
    }
  },
  setup(props, { slots }) {
    const authStore = useAuthStore()

    const hasAccess = computed(() => {
      if (props.permission) {
        const perms = Array.isArray(props.permission) ? props.permission : [props.permission]
        return props.mode === 'all'
          ? authStore.hasAllPermissions(perms)
          : authStore.hasAnyPermission(perms)
      }

      if (props.role) {
        const roles = Array.isArray(props.role) ? props.role : [props.role]
        return roles.some(role => authStore.hasRole(role))
      }

      return false
    })

    return () => hasAccess.value ? slots.default?.() : null
  }
}

// 4. 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
    return
  }

  if (to.meta.permissions) {
    const hasPermission = authStore.hasAnyPermission(to.meta.permissions)
    if (!hasPermission) {
      next('/403')
      return
    }
  }

  next()
})

// 5. 使用示例
// 模板中使用
<template>
  <!-- 指令方式 -->
  <button v-permission="'user:create'">新增用户</button>

  <!-- 组件方式 -->
  <PermissionGuard :permission="['user:edit', 'user:delete']">
    <button>编辑用户</button>
  </PermissionGuard>

  <PermissionGuard role="admin">
    <AdminPanel />
  </PermissionGuard>
</template>
```

---

### ❓ 考点14：大列表性能优化方案？

**核心方案**：

#### 1. 虚拟滚动
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll" ref="listRef">
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${startOffset}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="virtual-list-item"
        :style="{ height: itemHeight + 'px' }"
      >
        <slot :item="item" :index="item.index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 },
  visibleCount: { type: Number, default: 10 },
  buffer: { type: Number, default: 5 }
})

const listRef = ref()
const scrollTop = ref(0)

// 计算属性
const totalHeight = computed(() => props.items.length * props.itemHeight)

const startIndex = computed(() => {
  return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
})

const endIndex = computed(() => {
  return Math.min(
    props.items.length - 1,
    startIndex.value + props.visibleCount + props.buffer * 2
  )
})

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1).map((item, index) => ({
    ...item,
    index: startIndex.value + index
  }))
})

const startOffset = computed(() => startIndex.value * props.itemHeight)

// 滚动处理
const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}

// 滚动到指定项
const scrollToItem = (index) => {
  listRef.value.scrollTop = index * props.itemHeight
}

defineExpose({ scrollToItem })
</script>
```

#### 2. 分页加载
```vue
<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 20

const loadData = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const response = await api.getList({
      page: page.value,
      pageSize
    })

    if (page.value === 1) {
      items.value = response.data
    } else {
      items.value.push(...response.data)
    }

    hasMore.value = response.data.length === pageSize
    page.value++
  } finally {
    loading.value = false
  }
}

// 无限滚动
const handleScroll = (e) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadData()
  }
}

onMounted(() => {
  loadData()
})
</script>
```

#### 3. 列表项优化
```vue
<script setup>
import { shallowRef, markRaw } from 'vue'

// 使用 shallowRef 避免深度响应
const items = shallowRef([])

// 对于不需要响应式的数据使用 markRaw
const processItems = (rawItems) => {
  return rawItems.map(item => markRaw({
    ...item,
    // 只有需要响应式的字段才保持响应式
    selected: ref(false)
  }))
}

// 使用 Object.freeze 冻结不变数据
const staticData = Object.freeze({
  // 静态配置数据
})
</script>

<template>
  <div class="list">
    <div
      v-for="item in items"
      :key="item.id"
      class="list-item"
      v-memo="[item.id, item.selected]"
    >
      <!-- 使用 v-memo 缓存渲染结果 -->
      <span>{{ item.name }}</span>
      <button @click="item.selected = !item.selected">
        {{ item.selected ? '取消选择' : '选择' }}
      </button>
    </div>
  </div>
</template>
```

---

### ❓ 考点15：keep-alive 的原理和使用场景？

**核心原理**：
keep-alive 是一个抽象组件，用于缓存内部组件实例。

```javascript
// keep-alive 简化实现
const KeepAlive = {
  name: 'KeepAlive',
  abstract: true, // 抽象组件
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: Number
  },

  setup(props, { slots }) {
    const cache = new Map()
    const keys = new Set()

    const pruneCache = (filter) => {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type)
        if (name && !filter(name)) {
          pruneCacheEntry(key)
        }
      })
    }

    const pruneCacheEntry = (key) => {
      const cached = cache.get(key)
      if (cached) {
        // 卸载组件
        unmount(cached)
      }
      cache.delete(key)
      keys.delete(key)
    }

    // 监听 include/exclude 变化
    watch(() => [props.include, props.exclude], ([include, exclude]) => {
      include && pruneCache(name => matches(include, name))
      exclude && pruneCache(name => !matches(exclude, name))
    }, { flush: 'post', deep: true })

    return () => {
      const children = slots.default()
      const vnode = children[0]

      if (!vnode || !vnode.type) {
        return children
      }

      const name = getComponentName(vnode.type)
      const { include, exclude, max } = props

      // 检查是否需要缓存
      if ((include && !matches(include, name)) ||
          (exclude && matches(exclude, name))) {
        return vnode
      }

      const key = vnode.key || vnode.type
      const cached = cache.get(key)

      if (cached) {
        // 命中缓存，复用组件实例
        vnode.component = cached.component
        vnode.shapeFlag |= ShapeFlags.COMPONENT_KEPT_ALIVE
        // 更新 key 顺序
        keys.delete(key)
        keys.add(key)
      } else {
        // 缓存新实例
        cache.set(key, vnode)
        keys.add(key)

        // 超过最大缓存数，删除最旧的
        if (max && keys.size > parseInt(max)) {
          const oldest = keys.values().next().value
          pruneCacheEntry(oldest)
        }
      }

      // 标记为需要缓存
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE

      return vnode
    }
  }
}
```

**使用场景**：

```vue
<template>
  <!-- 1. 基础使用 -->
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>

  <!-- 2. 条件缓存 -->
  <keep-alive :include="['ComponentA', 'ComponentB']">
    <router-view />
  </keep-alive>

  <!-- 3. 排除某些组件 -->
  <keep-alive :exclude="['NoCache']">
    <router-view />
  </keep-alive>

  <!-- 4. 限制缓存数量 -->
  <keep-alive :max="5">
    <router-view />
  </keep-alive>

  <!-- 5. 动态控制 -->
  <keep-alive v-if="shouldCache">
    <my-component />
  </keep-alive>
  <my-component v-else />
</template>

<script setup>
// 组件内感知缓存状态
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('组件被激活')
  // 刷新数据、恢复状态
})

onDeactivated(() => {
  console.log('组件被缓存')
  // 清理定时器、暂停请求
})
</script>
```

**最佳实践**：
1. **合理使用 include/exclude**：避免缓存过多组件
2. **设置 max 限制**：防止内存泄漏
3. **处理缓存组件的生命周期**：activated/deactivated
4. **清理副作用**：在 deactivated 中清理定时器等

---

## 4. 性能优化专题

### 🔥 4.1 v-memo 与性能优化

**🤔 面试问题**: v-memo 的工作原理是什么？在什么场景下使用？

**💡 核心答案**:
v-memo 是 Vue 3.2+ 新增的指令，用于缓存模板的一部分：

```vue
<template>
  <!-- 基础用法：只有 user.id 或 user.name 变化时才重新渲染 -->
  <div v-memo="[user.id, user.name]">
    <h1>{{ user.name }}</h1>
    <p>{{ user.profile.bio }}</p>
    <ExpensiveComponent :data="user.data" />
  </div>

  <!-- 大列表优化 -->
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
    <div class="item">
      <span>{{ item.name }}</span>
      <span>{{ expensiveCalculation(item) }}</span>
    </div>
  </div>

  <!-- 条件渲染优化 -->
  <div v-if="showDetails" v-memo="[user.lastUpdate]">
    <UserDetails :user="user" />
  </div>
</template>
```

**📊 性能对比**:
```javascript
// 1000个复杂列表项的渲染测试
const performanceTest = {
  withoutMemo: {
    renderTime: '~45ms',
    memoryUsage: 'high',
    reRenderCount: 1000
  },
  withMemo: {
    renderTime: '~8ms',
    memoryUsage: 'medium',
    reRenderCount: 50  // 只重新渲染变化的项
  }
}
```

---

### 🔥 4.2 异步组件与代码分割

**🤔 面试问题**: 如何实现组件的懒加载？Suspense 的使用场景是什么？

**💡 核心答案**:
Vue 3 提供了多种异步组件加载方式：

```javascript
// 1. 基础异步组件
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() =>
  import('./components/AsyncComponent.vue')
)

// 2. 高级异步组件配置
const AsyncComponentAdvanced = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),

  // 加载中显示的组件
  loadingComponent: LoadingSpinner,

  // 加载失败显示的组件
  errorComponent: ErrorComponent,

  // 显示加载组件之前的延迟时间，默认 200ms
  delay: 200,

  // 定义组件为超时的时间，默认值是 Infinity
  timeout: 3000,

  // 如果提供了一个 suspensible 选项，它将表明该组件可以被 Suspense 控制
  suspensible: false,

  /**
   * @param {*} error 错误信息对象
   * @param {number} retry 一个函数，用于指示当 promise 加载器 reject 时，加载器是否应该重试
   * @param {*} fail  一个函数，指示加载程序结束退出
   * @param {number} attempts 记录尝试的次数
   */
  onError(error, retry, fail, attempts) {
    if (error.message.match(/fetch/) && attempts <= 3) {
      // 请求发生错误时重试，最多可尝试 3 次
      retry()
    } else {
      // 注意，retry/fail 就像 promise 的 resolve/reject 一样：
      // 必须调用其中一个才能继续错误处理。
      fail()
    }
  }
})

// 3. Suspense 使用
<template>
  <Suspense>
    <!-- 具有深层异步依赖的组件 -->
    <template #default>
      <Dashboard />
    </template>

    <!-- 在 #fallback 插槽中放置 "正在加载中" 状态 -->
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>

// 4. 路由级别的代码分割
const routes = [
  {
    path: '/dashboard',
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/profile',
    component: () => import('./views/Profile.vue')
  }
]

// 5. 条件异步加载
const ConditionalComponent = computed(() => {
  if (userType.value === 'admin') {
    return defineAsyncComponent(() => import('./AdminPanel.vue'))
  } else {
    return defineAsyncComponent(() => import('./UserPanel.vue'))
  }
})
```

---

## 6. Vue Router深度考点

### 🔥 6.1 导航守卫执行顺序

**🤔 面试问题**: Vue Router的导航守卫有哪些？执行顺序是什么？

**💡 核心答案**:
完整的导航解析流程：

```javascript
// 1. 全局前置守卫
router.beforeEach((to, from, next) => {
  console.log('1. 全局前置守卫')
  // 权限验证、登录检查等
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next('/login')
  } else {
    next()
  }
})

// 2. 全局解析守卫
router.beforeResolve((to, from, next) => {
  console.log('8. 全局解析守卫')
  // 在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后调用
  next()
})

// 3. 全局后置钩子
router.afterEach((to, from) => {
  console.log('9. 全局后置钩子')
  // 更改页面标题、发送分析数据等
  document.title = to.meta.title || 'App'
})

// 4. 路由独享守卫
const routes = [
  {
    path: '/admin',
    component: AdminPanel,
    beforeEnter: (to, from, next) => {
      console.log('2. 路由独享守卫')
      // 只在进入该路由时触发
      if (hasAdminPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]

// 5. 组件内守卫
export default {
  beforeRouteEnter(to, from, next) {
    console.log('3. beforeRouteEnter')
    // 在渲染该组件的对应路由被确认前调用
    // 不能获取组件实例 `this`！因为当前守卫执行前，组件实例还没被创建
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.fetchData()
    })
  },

  beforeRouteUpdate(to, from, next) {
    console.log('4. beforeRouteUpdate')
    // 在当前路由改变，但是该组件被复用时调用
    // 比如对于一个动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候
    this.fetchData(to.params.id)
    next()
  },

  beforeRouteLeave(to, from, next) {
    console.log('5. beforeRouteLeave')
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (this.hasUnsavedChanges) {
      const answer = window.confirm('你有未保存的更改，确定要离开吗？')
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}

// Composition API 中的守卫
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

export default {
  setup() {
    onBeforeRouteLeave((to, from) => {
      console.log('离开当前路由')
      const answer = window.confirm('确定要离开吗？')
      if (!answer) return false
    })

    onBeforeRouteUpdate(async (to, from) => {
      console.log('路由更新')
      if (to.params.id !== from.params.id) {
        await fetchData(to.params.id)
      }
    })
  }
}
```

**📋 完整执行顺序**:
1. beforeRouteLeave (组件内)
2. beforeEach (全局)
3. beforeRouteUpdate (组件内，如果路由复用)
4. beforeEnter (路由配置)
5. beforeRouteEnter (组件内)
6. beforeResolve (全局)
7. afterEach (全局)

---

### 🔥 6.2 动态路由与路由传参

**🤔 面试问题**: 动态路由参数有几种传递方式？props模式的优势是什么？

**💡 核心答案**:
Vue Router 提供了多种参数传递方式：

```javascript
// 1. 路径参数 (params)
const routes = [
  {
    path: '/user/:id',
    component: User,
    // props 解耦组件和路由
    props: true
  },
  {
    path: '/user/:id/post/:postId',
    component: Post,
    props: route => ({
      id: Number(route.params.id),
      postId: Number(route.params.postId),
      // 可以添加额外的 props
      version: '2.0'
    })
  }
]

// 2. 查询参数 (query)
// /search?q=vue&category=tutorial
{
  path: '/search',
  component: SearchResults,
  props: route => ({
    query: route.query.q,
    category: route.query.category
  })
}

// 3. 命名路由传参
router.push({
  name: 'user',
  params: { id: 123 },
  query: { tab: 'profile' }
})

// 4. 编程式导航的参数传递
// 字符串路径
router.push('/user/123')

// 对象
router.push({ path: '/user/123' })

// 命名的路由，并加上参数，让路由建立 url
router.push({ name: 'user', params: { id: 123 } })

// 带查询参数，结果是 /user/123?plan=private
router.push({ path: '/user/123', query: { plan: 'private' } })

// 带 hash，结果是 /user/123#team
router.push({ path: '/user/123', hash: '#team' })

// 5. 组件中接收参数
// Option API
export default {
  props: ['id'], // 通过 props 接收路由参数

  created() {
    // 通过 $route 访问
    console.log(this.$route.params.id)
    console.log(this.$route.query.tab)
  },

  watch: {
    // 监听路由变化
    '$route'(to, from) {
      this.fetchData(to.params.id)
    },

    // 只监听参数变化
    '$route.params.id'(newId) {
      this.fetchData(newId)
    }
  }
}

// Composition API
import { useRoute, useRouter } from 'vue-router'

export default {
  props: ['id'],

  setup(props) {
    const route = useRoute()
    const router = useRouter()

    // 响应式的路由参数
    const userId = computed(() => route.params.id)
    const currentTab = computed(() => route.query.tab || 'profile')

    // 监听路由变化
    watch(() => route.params.id, (newId, oldId) => {
      if (newId !== oldId) {
        fetchUserData(newId)
      }
    })

    const navigateToProfile = () => {
      router.push({
        name: 'user',
        params: { id: props.id },
        query: { tab: 'profile' }
      })
    }

    return {
      userId,
      currentTab,
      navigateToProfile
    }
  }
}

// 6. 高级路由配置
const routes = [
  {
    path: '/users/:id(\\d+)', // 只匹配数字
    component: User
  },
  {
    path: '/articles/:slug([a-z0-9-]+)', // 只匹配小写字母、数字和连字符
    component: Article
  },
  {
    path: '/files/:filepath(.*)', // 匹配任意路径
    component: FileViewer
  },
  {
    // 可选参数
    path: '/posts/:id?',
    component: PostList // 既匹配 /posts 也匹配 /posts/123
  },
  {
    // 重复参数
    path: '/categories/:category+', // 匹配 /categories/tech 和 /categories/tech/vue
    component: CategoryView
  }
]

// 7. 路由元信息与权限控制
const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    meta: {
      requiresAuth: true,
      roles: ['admin', 'super-admin'],
      title: '管理后台'
    },
    children: [
      {
        path: 'users',
        component: UserManagement,
        meta: {
          permissions: ['user:read', 'user:write']
        }
      }
    ]
  }
]

// 权限检查守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要认证
  if (to.meta.requiresAuth && !store.state.user.isAuthenticated) {
    next('/login')
    return
  }

  // 检查角色权限
  if (to.meta.roles && !to.meta.roles.some(role =>
    store.state.user.roles.includes(role)
  )) {
    next('/403')
    return
  }

  // 检查细粒度权限
  if (to.meta.permissions && !to.meta.permissions.every(permission =>
    store.state.user.permissions.includes(permission)
  )) {
    next('/403')
    return
  }

  next()
})
```

---

## 7. 状态管理专题

### 🔥 7.1 Pinia vs Vuex 4 深度对比

**🤔 面试问题**: Pinia 相比 Vuex 4 有什么优势？如何选择状态管理方案？

**💡 核心答案**:
Pinia 是 Vue 官方推荐的新一代状态管理库：

```javascript
// Vuex 4 写法
const store = createStore({
  state: {
    count: 0,
    user: null,
    todos: []
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USER(state, user) {
      state.user = user
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo)
    }
  },
  actions: {
    async fetchUser({ commit }, id) {
      try {
        const user = await api.getUser(id)
        commit('SET_USER', user)
      } catch (error) {
        console.error('获取用户失败:', error)
      }
    },

    async addTodo({ commit }, todoText) {
      const todo = {
        id: Date.now(),
        text: todoText,
        completed: false
      }
      commit('ADD_TODO', todo)
    }
  },
  getters: {
    doubleCount: state => state.count * 2,
    completedTodos: state => state.todos.filter(todo => todo.completed),
    userName: state => state.user?.name || 'Guest'
  },
  modules: {
    // 模块管理较为复杂
    cart: {
      namespaced: true,
      state: {},
      mutations: {},
      actions: {},
      getters: {}
    }
  }
})

// 使用 Vuex
export default {
  computed: {
    ...mapState(['count', 'user']),
    ...mapGetters(['doubleCount', 'userName'])
  },
  methods: {
    ...mapActions(['fetchUser', 'addTodo']),
    increment() {
      this.$store.commit('INCREMENT')
    }
  }
}

// Pinia 写法 - 组合式风格
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const user = ref(null)
  const todos = ref([])

  // getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const completedTodos = computed(() =>
    todos.value.filter(todo => todo.completed)
  )
  const userName = computed(() => user.value?.name || 'Guest')

  // actions
  const increment = () => {
    count.value++
  }

  const fetchUser = async (id) => {
    try {
      user.value = await api.getUser(id)
    } catch (error) {
      console.error('获取用户失败:', error)
      throw error // 保持错误传播
    }
  }

  const addTodo = (todoText) => {
    todos.value.push({
      id: Date.now(),
      text: todoText,
      completed: false
    })
  }

  // 可选：重置状态
  const $reset = () => {
    count.value = 0
    user.value = null
    todos.value = []
  }

  return {
    // state
    count,
    user,
    todos,
    // getters
    doubleCount,
    completedTodos,
    userName,
    // actions
    increment,
    fetchUser,
    addTodo,
    $reset
  }
})

// Pinia 写法 - 选项式风格
export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    email: '',
    avatar: ''
  }),

  getters: {
    displayName: (state) => state.name || state.email.split('@')[0],
    initials: (state) => {
      const parts = state.name.split(' ')
      return parts.map(part => part[0]).join('').toUpperCase()
    }
  },

  actions: {
    updateProfile(profile) {
      this.name = profile.name
      this.email = profile.email
      this.avatar = profile.avatar
    },

    async uploadAvatar(file) {
      try {
        const url = await api.uploadFile(file)
        this.avatar = url
        return url
      } catch (error) {
        console.error('头像上传失败:', error)
        throw error
      }
    }
  }
})

// 使用 Pinia (更简洁)
export default {
  setup() {
    const counterStore = useCounterStore()
    const userStore = useUserStore()

    // 直接使用，自动解包
    const handleIncrement = () => {
      counterStore.increment()
    }

    // 响应式解构
    const { count, doubleCount } = storeToRefs(counterStore)

    return {
      // store
      counterStore,
      userStore,
      // 解构的响应式数据
      count,
      doubleCount,
      // 方法
      handleIncrement
    }
  }
}
```

**📊 深度对比分析**:

| 特性 | Vuex 4 | Pinia |
|------|--------|-------|
| TypeScript 支持 | 需要复杂配置 | 原生完美支持 |
| 代码分割 | 手动管理模块 | 自动按 store 分割 |
| DevTools 支持 | 好 | 更好（时间旅行、热更新） |
| 学习曲线 | 较陡峭 | 平缓（类似 Composition API） |
| 样板代码 | 多（mutations必需） | 少（无需 mutations） |
| 模块化 | 复杂的嵌套模块 | 扁平化 store 设计 |
| SSR 支持 | 好 | 更好 |
| 包大小 | ~2.5kb | ~1.5kb |

**🎯 选择建议**:
- **新项目**: 直接选择 Pinia
- **Vue 3 项目**: 推荐 Pinia
- **现有 Vuex 项目**: 可以渐进式迁移
- **简单状态**: 考虑 provide/inject
- **复杂应用**: Pinia + 自定义 hooks

---

## 🎓 总结

这些高频考点涵盖了 Vue 3 的核心概念和实际应用场景。掌握这些知识点，不仅能够应对面试，更重要的是能够在实际项目中游刃有余地使用 Vue 3。

### 📚 重点掌握

#### 🎯 核心技能矩阵
1. **响应式系统深度理解**
   - Proxy vs Object.defineProperty 优势对比
   - 依赖收集和派发更新机制
   - 响应式丢失场景和解决方案
   - shallowRef/shallowReactive 性能优化

2. **组合式API完全掌握**
   - 所有核心Hooks的使用场景和最佳实践
   - 自定义Hooks设计模式和复用策略
   - provide/inject 深度应用和状态管理
   - 生命周期Hooks与Options API的对比

3. **虚拟DOM与性能优化**
   - Vue 3编译时优化：静态提升、补丁标记、块优化
   - Diff算法改进：最长递增子序列算法
   - key的作用机制和选择原则
   - v-memo、异步组件、代码分割等性能优化技巧

4. **组件通信与架构设计**
   - 8种组件通信方式的适用场景
   - 大型应用的组件解耦策略
   - 跨层级通信的最佳实践

5. **Vue Router高级应用**
   - 导航守卫的完整执行流程
   - 动态路由和参数传递的多种方式
   - 路由级代码分割和懒加载

6. **状态管理现代化**
   - Pinia vs Vuex 4 深度对比和选择策略
   - 现代状态管理模式和最佳实践
   - 大型应用的状态架构设计

### 💡 面试策略指南

#### 📊 回答层次结构
1. **概念解释** (20%): 简洁准确地说明是什么
2. **原理阐述** (40%): 深入解释为什么这样设计，如何工作
3. **实践应用** (30%): 结合项目经验说明使用场景
4. **优化思考** (10%): 提及性能优化和最佳实践

#### 🎯 高分回答技巧
- **结构化表达**: 使用"首先、其次、最后"等逻辑连接词
- **对比分析**: 主动对比Vue 2/3、Vuex/Pinia等技术差异
- **代码展示**: 用简洁的代码示例证明理解深度
- **场景结合**: 联系实际项目场景，体现解决问题的能力
- **前瞻思考**: 适当提及技术发展趋势和新特性

#### 🚀 进阶发挥点
- **源码层面**: 能够简单描述关键实现原理
- **性能视角**: 从性能角度分析技术选择
- **工程化思维**: 结合构建工具、开发流程讨论
- **生态系统**: 了解Vue生态的发展和最新动态

### 🎪 实战提升建议

#### 📝 知识巩固
1. **手写核心实现**: 尝试实现简化版的响应式系统、虚拟DOM
2. **源码阅读**: 深入阅读Vue 3核心模块源码
3. **项目实践**: 在实际项目中应用高级特性和优化技巧
4. **技术分享**: 通过博客、技术分享加深理解

#### 🔧 工具掌握
- **Vue DevTools**: 熟练使用调试工具
- **Vite**: 掌握现代构建工具配置和优化
- **TypeScript**: 在Vue项目中的最佳实践
- **测试工具**: Vue Test Utils、Vitest等测试框架

#### 📚 持续学习
- 关注Vue RFC和官方博客获取最新特性
- 参与开源项目贡献代码
- 学习相关技术栈：React、Node.js、微前端等
- 关注性能监控和用户体验优化

---

**🎉 结语**: Vue 3作为现代前端框架的代表，不仅在技术上有重大突破，更在开发体验和性能上达到了新高度。掌握这些核心考点，不仅能在面试中脱颖而出，更能在实际开发中游刃有余，构建高质量的前端应用。

**💪 最终建议**: 技术面试考察的不仅是知识点的记忆，更是**理解深度、解决问题的能力和技术视野**。通过系统学习、实践应用和持续思考，才能真正成为Vue技术专家！