# React 概论

## 什么是 React？

React 是由 Meta 开发的用于构建用户界面的 JavaScript 库。它专注于高效、声明式地创建交互式 UI，特别适合构建复杂的单页应用程序（SPA）。React 19 引入了许多革命性的特性，包括编译器优化、Actions、新的 Hooks 等。

## 🎯 React 核心理念

### 1. 声明式 UI

React 采用声明式编程范式，你只需要描述 UI 在不同状态下应该长什么样，而不用关心如何操作 DOM。

```jsx
// 声明式：描述想要的结果
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}
```

### 2. 组件化思想

一切皆组件。React 应用由组件树构成，每个组件负责渲染 UI 的一部分。

```jsx
// 组件组合
function App() {
  return (
    <div>
      <Header />
      <main>
        <Sidebar />
        <Content />
      </main>
      <Footer />
    </div>
  );
}
```

### 3. 单向数据流

数据从父组件流向子组件，通过 props 传递。子组件通过回调函数与父组件通信。

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <Child
      count={count}
      onIncrement={() => setCount(count + 1)}
    />
  );
}

function Child({ count, onIncrement }) {
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={onIncrement}>增加</button>
    </div>
  );
}
```

## ⚡ React 19 新特性

### 1. React 编译器

React 19 引入了全新的编译器，自动优化组件性能，无需手动使用 `useMemo`、`useCallback` 等。

```jsx
// React 19 - 编译器自动优化
function ExpensiveComponent({ items, multiplier }) {
  // 编译器自动识别并优化这个计算
  const processedItems = items.map(item => ({
    ...item,
    value: item.value * multiplier,
    formatted: new Intl.NumberFormat().format(item.value * multiplier)
  }));

  // 编译器自动缓存这个函数
  const handleClick = (id) => {
    console.log('Clicked:', id);
  };

  return (
    <div>
      {processedItems.map(item => (
        <div key={item.id} onClick={() => handleClick(item.id)}>
          {item.formatted}
        </div>
      ))}
    </div>
  );
}
```

### 2. Actions - 异步状态管理

Actions 提供了内置的异步状态管理，简化了 pending、error 状态的处理。

```jsx
import { useActionState } from 'react';

// 服务器 Action（也可以是客户端异步函数）
async function updateProfile(prevState, formData) {
  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      return { error: '更新失败' };
    }

    return { success: '更新成功' };
  } catch (error) {
    return { error: error.message };
  }
}

function ProfileForm() {
  const [state, action, isPending] = useActionState(updateProfile, null);

  return (
    <form action={action}>
      <input name="name" placeholder="姓名" />
      <input name="email" placeholder="邮箱" />

      <button type="submit" disabled={isPending}>
        {isPending ? '更新中...' : '更新资料'}
      </button>

      {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      {state?.success && <p style={{ color: 'green' }}>{state.success}</p>}
    </form>
  );
}
```

### 3. 新的 Hooks

React 19 引入了多个新的 Hooks，简化常见的开发模式。

```jsx
import { use, useOptimistic, useFormStatus } from 'react';

// use Hook - 读取 Promise 和 Context
function UserProfile({ userPromise }) {
  // 直接使用 Promise，Suspense 会处理 pending 状态
  const user = use(userPromise);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// useOptimistic - 乐观更新
function TodoList({ todos, addTodo }) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo) => [...state, { ...newTodo, id: Date.now(), sending: true }]
  );

  const handleSubmit = async (formData) => {
    const todoText = formData.get('todo');

    // 立即显示乐观更新
    addOptimisticTodo({ text: todoText });

    // 发送到服务器
    await addTodo(todoText);
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input name="todo" placeholder="新任务" />
        <SubmitButton />
      </form>

      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

// useFormStatus - 表单状态
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '添加中...' : '添加任务'}
    </button>
  );
}
```

### 4. Server Components 集成

React 19 完善了 Server Components 的支持，实现真正的服务端渲染。

```jsx
// 服务器组件 - 在服务器上运行
async function UserList() {
  // 直接在服务器上获取数据
  const users = await fetch('https://api.example.com/users').then(r => r.json());

  return (
    <div>
      <h2>用户列表</h2>
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

// 客户端组件 - 需要交互性
'use client';

function UserCard({ user }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <h3>{user.name}</h3>
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '收起' : '展开'}
      </button>
      {isExpanded && (
        <div>
          <p>邮箱: {user.email}</p>
          <p>电话: {user.phone}</p>
        </div>
      )}
    </div>
  );
}
```

### 5. 改进的 Concurrent Features

React 19 进一步完善了并发特性，编译器自动处理许多优化。

```jsx
import { startTransition, useDeferredValue } from 'react';

function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);

  // React 19 编译器自动优化这个搜索逻辑
  const results = useSearch(deferredQuery);

  return (
    <div>
      {results.map(result => (
        <SearchItem key={result.id} item={result} />
      ))}
    </div>
  );
}

function App() {
  const [query, setQuery] = useState('');

  // 编译器自动识别这个函数可以缓存
  const handleSearch = (value) => {
    startTransition(() => {
      setQuery(value);
    });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />
      <SearchResults query={query} />
    </div>
  );
}
```

### 6. 改进的 Suspense 与错误边界

Suspense 用于处理异步数据加载，错误边界用于捕获组件错误。

```jsx
import { Suspense } from 'react';

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>出现了错误</h1>;
    }

    return this.props.children;
  }
}

// 使用 Suspense
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>加载中...</div>}>
        <UserProfile userId="123" />
        <PostList />
      </Suspense>
    </ErrorBoundary>
  );
}
```

## 🗄️ 状态管理

### 1. 本地状态管理

使用 `useState` 和 `useReducer` 管理组件内部状态。

```jsx
// 简单状态
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// 复杂状态
function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, { todos: [] });

  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: { text } });
  };

  return (
    <div>
      <TodoForm onSubmit={addTodo} />
      <TodoList todos={state.todos} dispatch={dispatch} />
    </div>
  );
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload.text,
          completed: false
        }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };
    default:
      return state;
  }
}
```

### 2. Context API

用于跨组件共享状态，避免 prop drilling。

```jsx
// 创建 Context
const ThemeContext = createContext();
const UserContext = createContext();

// 提供者组件
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ user, setUser }}>
        <MainApp />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

// 消费 Context
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  return (
    <header className={`header ${theme}`}>
      <h1>欢迎, {user?.name || '游客'}</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </header>
  );
}
```

### 3. 现代状态管理解决方案

```jsx
// Zustand - 轻量级状态管理
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

function Counter() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>重置</button>
    </div>
  );
}
```

## ⚡ React 19 性能优化

### 1. 编译器自动优化

React 19 的编译器自动处理大部分性能优化，无需手动使用 memo、useMemo、useCallback。

```jsx
// React 19 - 编译器自动优化
function DataProcessor({ items, filter }) {
  // 编译器自动识别并缓存这个计算
  const processedData = items
    .filter(item => item.category === filter)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(item => ({ ...item, processed: true }));

  // 编译器自动缓存这个函数
  const handleItemClick = (itemId) => {
    console.log('点击项目:', itemId);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item
          key={item.id}
          data={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  );
}

// 子组件也会被编译器自动优化
function Item({ data, onClick }) {
  return (
    <div onClick={() => onClick(data.id)}>
      {data.name}
    </div>
  );
}
```

### 2. 手动优化（仅在需要时）

对于编译器无法优化的场景，仍可使用传统方法。

```jsx
// 复杂场景下的手动优化
const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data,
  onUpdate,
  complexConfig
}) {
  // 编译器可能无法优化的复杂逻辑
  const processedData = useMemo(() => {
    return complexDataProcessing(data, complexConfig);
  }, [data, complexConfig.version]); // 只依赖特定属性

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id} onClick={() => onUpdate(item.id)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较逻辑（编译器无法自动处理的场景）
  return (
    prevProps.data === nextProps.data &&
    prevProps.complexConfig.version === nextProps.complexConfig.version
  );
});
```

### 3. 代码分割

使用动态导入实现组件懒加载。

```jsx
import { lazy, Suspense } from 'react';

// 懒加载组件
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));
const Settings = lazy(() => import('./Settings'));

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setCurrentPage('dashboard')}>仪表盘</button>
        <button onClick={() => setCurrentPage('profile')}>个人资料</button>
        <button onClick={() => setCurrentPage('settings')}>设置</button>
      </nav>

      <main>
        <Suspense fallback={<div>页面加载中...</div>}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}
```

## 🛠️ 开发生态

### 1. 现代构建工具

```bash
# Vite - 快速的构建工具
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev

# Next.js - 全栈 React 框架
npx create-next-app@latest my-app --typescript --tailwind --eslint
cd my-app
npm run dev
```

### 2. 路由方案

```jsx
// React Router v7 - 基于 Vite 的文件路由
// 文件结构:
// routes/
//   _index.tsx          -> /
//   about.tsx           -> /about
//   users._index.tsx    -> /users
//   users.$userId.tsx   -> /users/:userId
//   users.new.tsx       -> /users/new

// app/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// React Router v7 自动生成路由配置
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "about",
        element: <About />
      },
      {
        path: "users",
        element: <UsersLayout />,
        children: [
          {
            index: true,
            element: <UserList />
          },
          {
            path: ":userId",
            element: <UserDetail />,
            loader: async ({ params }) => {
              // 数据预加载
              return fetch(`/api/users/${params.userId}`);
            }
          }
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

// routes/_layout.tsx - 根布局
function RootLayout() {
  return (
    <div>
      <nav>
        <NavLink to="/">首页</NavLink>
        <NavLink to="/about">关于</NavLink>
        <NavLink to="/users">用户</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

// routes/users.$userId.tsx - 动态路由
import { useLoaderData, useActionData } from 'react-router-dom';

export async function loader({ params }) {
  const user = await fetch(`/api/users/${params.userId}`);
  return user.json();
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const response = await fetch(`/api/users/${params.userId}`, {
    method: 'PUT',
    body: formData
  });
  return response.json();
}

export default function UserDetail() {
  const user = useLoaderData();
  const actionData = useActionData();

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>

      <Form method="post">
        <input name="name" defaultValue={user.name} />
        <button type="submit">更新</button>
      </Form>

      {actionData?.success && <p>更新成功!</p>}
    </div>
  );
}
```

### 3. 样式解决方案

```jsx
// CSS Modules
import styles from './Button.module.css';

function Button({ children, variant = 'primary' }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}

// Styled Components
import styled from 'styled-components';

const StyledButton = styled.button`
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

// Tailwind CSS
function Button({ children, primary }) {
  const classes = `
    px-4 py-2 rounded font-medium transition-colors
    ${primary
      ? 'bg-blue-500 hover:bg-blue-600 text-white'
      : 'bg-gray-500 hover:bg-gray-600 text-white'
    }
  `;

  return <button className={classes}>{children}</button>;
}
```

## 🎓 最佳实践

### 1. 组件设计原则

- **单一职责**：每个组件只做一件事
- **可复用**：通过 props 配置不同行为
- **可测试**：逻辑清晰，易于编写测试

```jsx
// 好的组件设计
function SearchInput({
  value,
  onChange,
  placeholder = "搜索...",
  disabled = false,
  onClear
}) {
  return (
    <div className="search-input">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
      {value && (
        <button onClick={onClear} className="clear-button">
          ×
        </button>
      )}
    </div>
  );
}
```

### 2. Hooks 使用规范

- **只在顶层调用**：不要在循环、条件或嵌套函数中调用
- **自定义 Hooks**：复用状态逻辑

```jsx
// 自定义 Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setStoredValue = useCallback((value) => {
    try {
      setValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key]);

  return [value, setStoredValue];
}

// 使用自定义 Hook
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'zh');

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

### 3. 错误处理

```jsx
// 错误边界 Hook
function useErrorHandler() {
  return useCallback((error, errorInfo) => {
    console.error('组件错误:', error);
    // 发送错误到监控服务
    // reportError(error, errorInfo);
  }, []);
}

// 数据获取的错误处理
function useAsyncData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
```

## 🚀 React 19 总结

React 19 的革命性变化：

### 🎯 核心突破
1. **React 编译器** - 自动性能优化，告别手动 memo/useMemo
2. **Actions** - 内置异步状态管理，简化表单和数据处理
3. **新 Hooks** - use、useOptimistic、useActionState 等现代化工具
4. **Server Components** - 真正的服务端渲染集成

### ⚡ 开发体验提升
- **自动优化**: 编译器处理性能问题，专注业务逻辑
- **简化异步**: Actions 和新 Hooks 让异步处理更直观
- **类型安全**: TypeScript 集成更深入，错误提示更准确
- **现代工具**: Vite、Next.js 15 等工具完美支持

### 🛠️ 迁移指南
```jsx
// React 18 → React 19
// 1. 移除大部分 useMemo/useCallback
// 2. 用 useActionState 替代复杂的异步状态管理
// 3. 利用 use Hook 简化 Promise 处理
// 4. 考虑 Server Components 优化首屏性能
```

### 📚 学习路径建议
1. **基础概念**: 声明式 UI、组件化、单向数据流
2. **新特性掌握**: Actions、新 Hooks、编译器理解
3. **生态工具**: React Router v7、现代构建工具
4. **最佳实践**: 组件设计、错误处理、性能监控
5. **高级特性**: Server Components、Streaming SSR

React 19 标志着 React 进入了编译器时代，开发体验和性能都有质的飞跃。建议重点学习新的心智模型：信任编译器，专注业务逻辑，拥抱声明式开发！🎉