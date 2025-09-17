# Vue 高频考点解析

## 🎯 响应式原理相关考题

### ❓ 考点1：Vue 3 为什么用 Proxy 替代 Object.defineProperty？

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

## 🔄 生命周期相关考题

### ❓ 考点4：Vue 3 生命周期的执行顺序？

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

## 📡 组件通信考题

### ❓ 考点6：Vue 组件通信的 8 种方式？

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

## 🎓 总结

这些高频考点涵盖了 Vue 3 的核心概念和实际应用场景。掌握这些知识点，不仅能够应对面试，更重要的是能够在实际项目中游刃有余地使用 Vue 3。

### 📚 重点掌握
1. **响应式原理**：Proxy 的优势、依赖收集机制
2. **组合式 API**：相比选项式 API 的优势、逻辑复用
3. **组件通信**：8 种通信方式的使用场景
4. **性能优化**：虚拟 DOM、diff 算法、编译优化
5. **新特性应用**：Teleport、Suspense、Fragment 的实际应用

### 💡 面试技巧
- **原理 + 实践**：不仅要知道是什么，还要知道为什么
- **对比分析**：Vue 2 vs Vue 3，Vuex vs Pinia 等
- **场景应用**：结合实际项目经验回答
- **代码示例**：用代码展示理解深度

记住，技术面试不仅考察知识点，更考察解决问题的能力。深入理解原理，结合实际应用，才能在面试中脱颖而出！🚀