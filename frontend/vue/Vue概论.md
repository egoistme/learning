# Vue 概论

## 🎯 什么是 Vue？

Vue.js 是一个**渐进式 JavaScript 框架**，用于构建用户界面。它由尤雨溪（Evan You）创建，设计理念是"**渐进增强**"，可以逐步应用到项目中，而不需要全盘重写。

### 🌟 Vue 的核心特性

- **声明式渲染**：通过模板语法声明式地描述状态和 DOM 的映射
- **组件系统**：构建大型应用的基础，组件是 Vue 最强大的功能之一
- **响应式数据**：数据驱动视图，自动追踪依赖并更新 DOM
- **虚拟 DOM**：高效的 DOM 更新机制
- **渐进式**：可以在现有项目中逐步引入，学习成本低

## 🚀 Vue 3 vs Vue 2：重大革新

### 🔄 响应式系统升级

Vue 3 最重要的变化是响应式系统从 Object.defineProperty 升级到 Proxy。

#### Vue 2 的响应式原理
```javascript
// Vue 2 使用 Object.defineProperty
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      // 依赖收集
      depend()
      return val
    },
    set(newVal) {
      if (newVal === val) return
      val = newVal
      // 派发更新
      notify()
    }
  })
}

// Vue 2 的局限性
const data = { name: 'Vue' }
// ❌ 无法检测属性的添加
data.age = 18  // 不会触发更新
// ❌ 无法检测数组长度变化
arr.length = 0  // 不会触发更新
// ❌ 无法检测数组索引赋值
arr[0] = 'new'  // 不会触发更新
```

#### Vue 3 的响应式原理
```javascript
// Vue 3 使用 Proxy
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      // 依赖收集
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver)
      // 派发更新
      trigger(target, key)
      return result
    }
  })
}

// Vue 3 的优势
const data = reactive({ name: 'Vue' })
// ✅ 可以检测属性的添加
data.age = 18  // 会触发更新
// ✅ 可以检测数组的所有操作
arr.length = 0  // 会触发更新
arr[0] = 'new'  // 会触发更新
```

### 🎨 组合式 API vs 选项式 API

Vue 3 引入了组合式 API，提供了更灵活的逻辑组织方式。

#### 选项式 API（Vue 2 风格）
```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    console.log('组件已挂载')
  }
}
</script>
```

#### 组合式 API（Vue 3 推荐）
```vue
<template>
  <div>
    <p>{{ count }}</p>
    <p>{{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const count = ref(0)

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>
```

### 💡 组合式 API 的优势

1. **更好的逻辑复用**：通过组合函数（Composables）
2. **更好的 TypeScript 支持**：类型推断更准确
3. **更清晰的代码组织**：相关逻辑可以聚合在一起
4. **更小的包体积**：未使用的功能可以被 tree-shaking

```javascript
// 可复用的组合函数
import { ref, onMounted, onUnmounted } from 'vue'

// 鼠标位置跟踪的组合函数
export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

// 在组件中使用
export default {
  setup() {
    const { x, y } = useMouse()
    return { x, y }
  }
}
```

## 🧠 Vue 3 响应式系统深度剖析

### 📊 响应式 API 详解

Vue 3 提供了多个响应式 API，适应不同场景：

```javascript
import {
  ref, reactive, readonly, computed, watch, watchEffect
} from 'vue'

// 1. ref - 包装基本类型和对象
const count = ref(0)
const user = ref({ name: 'Vue', age: 3 })

console.log(count.value)  // 需要 .value 访问
console.log(user.value.name)  // 对象也需要 .value

// 2. reactive - 深层响应式对象
const state = reactive({
  count: 0,
  user: {
    name: 'Vue',
    age: 3
  }
})

console.log(state.count)  // 直接访问，无需 .value
console.log(state.user.name)  // 嵌套对象也是响应式的

// 3. readonly - 只读代理
const original = reactive({ count: 0 })
const copy = readonly(original)

// original.count++ // ✅ 可以修改
// copy.count++ // ❌ 警告！无法修改只读属性

// 4. computed - 计算属性
const doubleCount = computed(() => count.value * 2)

// 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

// 5. watch - 侦听器
watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变为 ${newValue}`)
})

// 侦听多个源
watch([count, user], ([newCount, newUser], [oldCount, oldUser]) => {
  console.log('count 或 user 发生了变化')
})

// 6. watchEffect - 立即执行并追踪依赖
watchEffect(() => {
  console.log(`count 的值是: ${count.value}`)
  // 会在 count 变化时自动重新执行
})
```

### 🔍 依赖收集和派发更新原理

Vue 3 的响应式系统基于以下核心概念：

```javascript
// 简化版的响应式实现
let activeEffect = null

// 依赖收集容器
const targetMap = new WeakMap()

// 1. 依赖收集函数
function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }

  dep.add(activeEffect)
}

// 2. 派发更新函数
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const dep = depsMap.get(key)
  if (dep) {
    dep.forEach(effect => effect())
  }
}

// 3. 创建响应式对象
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)  // 收集依赖
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)  // 触发更新
      return true
    }
  })
}

// 4. 副作用函数
function effect(fn) {
  activeEffect = fn
  fn()  // 首次执行，触发依赖收集
  activeEffect = null
}
```

### 🎯 ref vs reactive 的选择

| 特性 | ref | reactive |
|------|-----|----------|
| 支持类型 | 任何类型 | 只支持对象 |
| 访问方式 | 需要 .value | 直接访问 |
| 解构保持响应性 | ❌ | ❌ |
| 模板中自动解包 | ✅ | ✅ |
| 适用场景 | 基本类型、单一值 | 复杂对象、状态集合 |

```javascript
// 使用建议
// ✅ 基本类型用 ref
const count = ref(0)
const isLoading = ref(false)
const message = ref('')

// ✅ 对象用 reactive
const user = reactive({
  name: '',
  age: 0,
  hobbies: []
})

// ✅ 保持解构响应性用 toRefs
const { name, age } = toRefs(user)

// 或者整体用 ref
const user = ref({
  name: '',
  age: 0,
  hobbies: []
})
```

## 🎨 虚拟 DOM 和编译优化

### 🌐 虚拟 DOM 概念

虚拟 DOM 是一个 JavaScript 对象，描述真实 DOM 的结构：

```javascript
// 真实 DOM
<div class="container">
  <h1>{{ title }}</h1>
  <p>{{ content }}</p>
</div>

// 对应的虚拟 DOM
const vnode = {
  type: 'div',
  props: { class: 'container' },
  children: [
    { type: 'h1', children: title },
    { type: 'p', children: content }
  ]
}
```

### ⚡ Vue 3 编译优化

Vue 3 引入了多项编译优化技术：

#### 1. 静态提升（Hoisting）
```javascript
// 编译前
<div>
  <span>静态内容</span>
  <span>{{ dynamic }}</span>
</div>

// 编译后 - 静态节点被提升
const hoisted = createVNode('span', null, '静态内容')
function render() {
  return createVNode('div', null, [
    hoisted,  // 复用静态节点
    createVNode('span', null, dynamic)
  ])
}
```

#### 2. 补丁标记（Patch Flags）
```javascript
// 编译前
<div>
  <span>{{ message }}</span>
  <span :class="className">{{ text }}</span>
</div>

// 编译后 - 添加补丁标记
function render() {
  return createVNode('div', null, [
    createVNode('span', null, message, 1 /* TEXT */),
    createVNode('span', { class: className }, text, 3 /* TEXT | CLASS */)
  ])
}
```

#### 3. 树摇优化（Tree Shaking）
```javascript
// Vue 3 支持按需导入
import { ref, computed } from 'vue'  // 只导入需要的功能

// 而不是
// import Vue from 'vue'  // Vue 2 必须导入整个库
```

### 🔄 Diff 算法优化

Vue 3 的 diff 算法相比 Vue 2 有显著提升：

```javascript
// Vue 3 的快速路径优化
function patchChildren(oldChildren, newChildren) {
  // 1. 快速路径：相同节点直接跳过
  if (oldChildren === newChildren) return

  // 2. 处理简单情况
  if (!oldChildren.length) {
    // 旧列表为空，挂载所有新节点
    mountChildren(newChildren)
    return
  }

  if (!newChildren.length) {
    // 新列表为空，卸载所有旧节点
    unmountChildren(oldChildren)
    return
  }

  // 3. 复杂情况：使用最长递增子序列算法
  patchKeyedChildren(oldChildren, newChildren)
}
```

## 🔄 Vue 3 生命周期详解

### 📅 选项式 API 生命周期
```javascript
export default {
  beforeCreate() {
    // 实例初始化之后，数据观测之前调用
    console.log('beforeCreate')
  },
  created() {
    // 实例创建完成后调用，可以访问 data、methods
    console.log('created')
  },
  beforeMount() {
    // 挂载开始之前调用
    console.log('beforeMount')
  },
  mounted() {
    // 实例被挂载后调用，可以访问 DOM
    console.log('mounted')
  },
  beforeUpdate() {
    // 数据更新时调用，发生在虚拟 DOM 重新渲染之前
    console.log('beforeUpdate')
  },
  updated() {
    // 数据更新后调用，DOM 已经更新
    console.log('updated')
  },
  beforeUnmount() {
    // 实例卸载之前调用
    console.log('beforeUnmount')
  },
  unmounted() {
    // 实例卸载后调用
    console.log('unmounted')
  }
}
```

### 🎯 组合式 API 生命周期
```javascript
import {
  onBeforeMount, onMounted,
  onBeforeUpdate, onUpdated,
  onBeforeUnmount, onUnmounted
} from 'vue'

export default {
  setup() {
    // 注意：没有 onBeforeCreate 和 onCreated
    // 因为 setup() 就是在这两个时机之间执行的

    console.log('setup 相当于 beforeCreate + created')

    onBeforeMount(() => {
      console.log('onBeforeMount')
    })

    onMounted(() => {
      console.log('onMounted')
    })

    onBeforeUpdate(() => {
      console.log('onBeforeUpdate')
    })

    onUpdated(() => {
      console.log('onUpdated')
    })

    onBeforeUnmount(() => {
      console.log('onBeforeUnmount')
    })

    onUnmounted(() => {
      console.log('onUnmounted')
    })
  }
}
```

### 🔗 生命周期执行顺序
```
父组件 beforeCreate
父组件 created
父组件 beforeMount
  子组件 beforeCreate
  子组件 created
  子组件 beforeMount
  子组件 mounted
父组件 mounted

更新时：
父组件 beforeUpdate
  子组件 beforeUpdate
  子组件 updated
父组件 updated

销毁时：
父组件 beforeUnmount
  子组件 beforeUnmount
  子组件 unmounted
父组件 unmounted
```

## 📡 Vue 3 内置指令系统

### 🎯 常用指令详解

```vue
<template>
  <!-- 1. v-if/v-else-if/v-else 条件渲染 -->
  <div v-if="type === 'A'">A</div>
  <div v-else-if="type === 'B'">B</div>
  <div v-else>Neither A nor B</div>

  <!-- 2. v-show 条件显示（CSS display） -->
  <div v-show="visible">显示或隐藏</div>

  <!-- 3. v-for 列表渲染 -->
  <ul>
    <li v-for="(item, index) in items" :key="item.id">
      {{ index }} - {{ item.name }}
    </li>
  </ul>

  <!-- 4. v-model 双向绑定 -->
  <input v-model="message" placeholder="输入消息">

  <!-- 5. v-bind 属性绑定 -->
  <img :src="imageSrc" :alt="imageAlt">
  <div :class="{ active: isActive, disabled: isDisabled }">动态类名</div>
  <div :style="{ color: textColor, fontSize: fontSize + 'px' }">动态样式</div>

  <!-- 6. v-on 事件监听 -->
  <button @click="handleClick">点击</button>
  <button @click="handleClick($event, 'param')">带参数</button>

  <!-- 7. v-slot 插槽 -->
  <child-component>
    <template #header>
      <h1>标题</h1>
    </template>
    <template #default="slotProps">
      <p>{{ slotProps.text }}</p>
    </template>
  </child-component>

  <!-- 8. v-pre 跳过编译 -->
  <span v-pre>{{ 这里不会被编译 }}</span>

  <!-- 9. v-once 只渲染一次 -->
  <div v-once>{{ message }}</div>

  <!-- 10. v-memo 记忆化渲染（Vue 3.2+） -->
  <div v-memo="[valueA, valueB]">
    <!-- 只有当 valueA 或 valueB 改变时才重新渲染 -->
  </div>
</template>
```

### 🎨 自定义指令

```javascript
// 全局注册
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// 局部注册
export default {
  directives: {
    focus: {
      mounted(el) {
        el.focus()
      }
    }
  }
}

// 完整的指令钩子
const myDirective = {
  // 在绑定元素的父组件挂载之前调用
  beforeMount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件挂载之后调用
  mounted(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件更新之前调用
  beforeUpdate(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件更新之后调用
  updated(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件卸载之前调用
  beforeUnmount(el, binding, vnode, prevVnode) {},
  // 在绑定元素的父组件卸载之后调用
  unmounted(el, binding, vnode, prevVnode) {}
}

// 使用示例
<input v-focus>
<div v-my-directive:arg.modifier="value">
```

## 🔗 组件通信的多种方式

### 1. Props / Emit（父子通信）
```vue
<!-- 父组件 -->
<template>
  <child-component
    :title="parentTitle"
    @update-title="handleTitleUpdate"
  />
</template>

<script setup>
const parentTitle = ref('父组件标题')

const handleTitleUpdate = (newTitle) => {
  parentTitle.value = newTitle
}
</script>

<!-- 子组件 -->
<template>
  <div>
    <h2>{{ title }}</h2>
    <button @click="updateTitle">更新标题</button>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update-title'])

const updateTitle = () => {
  emit('update-title', '新标题')
}
</script>
```

### 2. v-model（双向绑定）
```vue
<!-- 父组件 -->
<template>
  <custom-input v-model="inputValue" />
  <!-- 等价于 -->
  <custom-input
    :modelValue="inputValue"
    @update:modelValue="inputValue = $event"
  />
</template>

<!-- 子组件 -->
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateValue"
  />
</template>
```

### 3. Provide / Inject（跨层级通信）
```javascript
// 祖先组件
import { provide, ref } from 'vue'

export default {
  setup() {
    const theme = ref('dark')
    const updateTheme = (newTheme) => {
      theme.value = newTheme
    }

    provide('theme', {
      theme,
      updateTheme
    })
  }
}

// 后代组件
import { inject } from 'vue'

export default {
  setup() {
    const { theme, updateTheme } = inject('theme')

    return {
      theme,
      updateTheme
    }
  }
}
```

### 4. Teleport（传送门）
```vue
<template>
  <!-- 将模态框传送到 body -->
  <teleport to="body">
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>模态框标题</h3>
        <p>模态框内容</p>
        <button @click="showModal = false">关闭</button>
      </div>
    </div>
  </teleport>
</template>
```

## 🎪 插槽系统详解

### 🎯 基础插槽
```vue
<!-- 子组件 BaseCard.vue -->
<template>
  <div class="card">
    <header class="card-header">
      <slot name="header">默认标题</slot>
    </header>
    <main class="card-body">
      <slot>默认内容</slot>
    </main>
    <footer class="card-footer">
      <slot name="footer">默认页脚</slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<template>
  <base-card>
    <template #header>
      <h1>自定义标题</h1>
    </template>

    <p>这是主要内容</p>

    <template #footer>
      <button>确定</button>
      <button>取消</button>
    </template>
  </base-card>
</template>
```

### 🎨 作用域插槽
```vue
<!-- 子组件 TodoList.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="item.id">
        <!-- 默认内容 -->
        {{ item.name }}
      </slot>
    </li>
  </ul>
</template>

<!-- 父组件使用 -->
<template>
  <todo-list :items="todos">
    <template #default="{ item, index }">
      <span :class="{ completed: item.done }">
        {{ index }}. {{ item.name }}
      </span>
      <button @click="toggleItem(item)">
        {{ item.done ? '恢复' : '完成' }}
      </button>
    </template>
  </todo-list>
</template>
```

## 🆕 Vue 3 新特性深入

### 🌟 Suspense 异步组件
```vue
<template>
  <div>
    <suspense>
      <!-- 异步组件 -->
      <template #default>
        <async-component />
      </template>

      <!-- 加载时显示的内容 -->
      <template #fallback>
        <div>加载中...</div>
      </template>
    </suspense>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

// 异步组件定义
const AsyncComponent = defineAsyncComponent(async () => {
  const response = await fetch('/api/data')
  const data = await response.json()

  return {
    template: `<div>{{ data }}</div>`,
    data() {
      return { data }
    }
  }
})
</script>
```

### 🎯 Fragment（多根节点）
```vue
<!-- Vue 2 必须有单一根节点 -->
<template>
  <div>
    <header>标题</header>
    <main>内容</main>
    <footer>页脚</footer>
  </div>
</template>

<!-- Vue 3 支持多个根节点 -->
<template>
  <header>标题</header>
  <main>内容</main>
  <footer>页脚</footer>
</template>
```

### 🔧 创建全局属性
```javascript
// Vue 2
Vue.prototype.$http = axios
Vue.prototype.$message = Message

// Vue 3
const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.globalProperties.$message = Message

// 在组合式 API 中使用
import { getCurrentInstance } from 'vue'

export default {
  setup() {
    const { proxy } = getCurrentInstance()

    const fetchData = async () => {
      const response = await proxy.$http.get('/api/data')
      proxy.$message.success('获取成功')
    }

    return { fetchData }
  }
}
```

## 🛠️ TypeScript 集成

Vue 3 对 TypeScript 提供了一流的支持：

```typescript
// 组件 Props 类型定义
interface Props {
  title: string
  count?: number
  tags: string[]
}

// 使用 defineProps 与 TypeScript
const props = defineProps<Props>()

// 或者使用默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  tags: () => []
})

// Emit 事件类型定义
interface Emits {
  (e: 'update:count', value: number): void
  (e: 'submit', data: { name: string; age: number }): void
}

const emit = defineEmits<Emits>()

// ref 类型推断
const count = ref(0)  // number
const message = ref('')  // string
const user = ref<User | null>(null)  // User | null

// reactive 类型推断
interface State {
  count: number
  user: User
}

const state = reactive<State>({
  count: 0,
  user: {
    name: '',
    age: 0
  }
})

// 计算属性类型推断
const doubleCount = computed(() => count.value * 2)  // ComputedRef<number>

// 模板引用类型
const inputRef = ref<HTMLInputElement>()

onMounted(() => {
  inputRef.value?.focus()
})
```

## ⚡ 性能优化技巧

### 🎯 编译时优化
```vue
<template>
  <!-- 1. 使用 v-memo 减少重复计算 -->
  <div v-memo="[user.id, user.name]">
    <expensive-component :user="user" />
  </div>

  <!-- 2. 合理使用 v-once -->
  <div v-once>
    <!-- 只渲染一次的内容 -->
    {{ expensiveCalculation() }}
  </div>

  <!-- 3. 条件渲染优化 -->
  <!-- v-if vs v-show -->
  <div v-if="shouldRender">条件渲染 - 完全销毁/创建</div>
  <div v-show="shouldShow">条件显示 - 仅切换 display</div>
</template>

<script setup>
// 4. 使用 shallowRef 避免深度响应
const largeObject = shallowRef({
  // 大量数据...
})

// 5. 使用 markRaw 标记非响应式数据
const nonReactiveData = markRaw({
  // 不需要响应式的数据
})

// 6. 异步组件和代码分割
const AsyncComponent = defineAsyncComponent(() =>
  import('./HeavyComponent.vue')
)
</script>
```

### 🚀 运行时优化
```javascript
// 1. 批量更新
import { nextTick } from 'vue'

async function batchUpdate() {
  // 多个状态更新会被批量处理
  count.value++
  message.value = 'updated'
  user.name = 'new name'

  // 等待 DOM 更新完成
  await nextTick()
  console.log('DOM 已更新')
}

// 2. 防抖和节流
import { debounce, throttle } from 'lodash-es'

const debouncedSearch = debounce((query) => {
  // 搜索逻辑
}, 300)

const throttledScroll = throttle((event) => {
  // 滚动处理
}, 100)

// 3. 虚拟列表（大数据渲染）
import { VirtualList } from '@tanstack/vue-virtual'

const VirtualizedList = {
  components: { VirtualList },
  template: `
    <VirtualList
      :items="items"
      :height="400"
      :item-height="50"
      v-slot="{ item, index }"
    >
      <div>{{ index }}: {{ item.name }}</div>
    </VirtualList>
  `
}
```

## 🎓 总结

Vue 3 带来了革命性的变化，主要体现在：

### 🎯 核心改进
- **响应式系统**：Proxy 带来更好的性能和功能
- **组合式 API**：更好的逻辑复用和类型支持
- **编译优化**：静态提升、补丁标记、树摇等
- **TypeScript**：一流的 TypeScript 支持

### 💡 开发体验
- **更小的包体积**：按需导入，树摇优化
- **更好的性能**：编译时和运行时优化
- **更强的扩展性**：插件系统和自定义渲染器
- **向后兼容**：支持 Vue 2 的选项式 API

Vue 3 不仅仅是版本升级，而是前端开发思维的转变。从选项式到组合式，从对象到函数，从运行时到编译时，每一个改变都体现了现代前端开发的最佳实践。

学习 Vue 3，需要转变思维模式，拥抱函数式编程思想，理解响应式系统的本质，掌握组合式 API 的精髓。这样才能真正发挥 Vue 3 的强大潜力！🚀