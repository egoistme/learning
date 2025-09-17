# ⚛️ React 高频考点全解析

> 🎯 **适用对象**: React面试准备、技术提升、项目实战
> 📊 **考点分级**: 🔥高频 🟡中频 🟢低频
> 🚀 **版本覆盖**: React 16.8 - React 19

---

## 📋 目录导航

1. [基础概念考点](#1-基础概念考点) (15个核心概念)
2. [Hooks深度解析](#2-hooks深度解析) (10个常用Hooks)
3. [性能优化专题](#3-性能优化专题) (8个优化技巧)
4. [状态管理考点](#4-状态管理考点) (5种方案对比)
5. [React 19新特性](#5-react-19新特性) (6个重要更新)
6. [实战场景题](#6-实战场景题) (10个经典场景)
7. [源码原理解析](#7-源码原理解析) (5个核心原理)
8. [面试真题集锦](#8-面试真题集锦) (大厂真题)

---

## 1. 基础概念考点

### 🔥 1.1 虚拟DOM原理和优势

**🤔 面试问题**: 什么是虚拟DOM？它解决了什么问题？

**💡 核心答案**:
虚拟DOM是React在JavaScript内存中维护的一个对象树，用来描述真实DOM的结构。

```javascript
// 虚拟DOM示例
const vNode = {
  type: 'div',
  props: {
    className: 'container',
    children: [
      {
        type: 'h1',
        props: { children: 'Hello World' }
      }
    ]
  }
};

// 对应的真实DOM
<div className="container">
  <h1>Hello World</h1>
</div>
```

**🎯 优势分析**:
1. **性能优化**: 通过diff算法减少DOM操作
2. **跨浏览器兼容**: 抽象化DOM操作
3. **可预测性**: 声明式编程，状态驱动
4. **批量更新**: 多个状态变更合并成一次DOM更新

**📊 性能对比**:
```javascript
// 传统DOM操作 - 性能差
for(let i = 0; i < 1000; i++) {
  document.getElementById('list').appendChild(createItem(i));
}

// React虚拟DOM - 性能好
function ItemList({ items }) {
  return (
    <div id="list">
      {items.map(item => <Item key={item.id} data={item} />)}
    </div>
  );
}
```

---

### 🔥 1.2 JSX本质和转换机制

**🤔 面试问题**: JSX是什么？它是如何被转换的？

**💡 核心答案**:
JSX是JavaScript的语法扩展，最终会被转换成`React.createElement()`调用。

```javascript
// JSX语法
const element = <h1 className="greeting">Hello, world!</h1>;

// Babel转换后（React 17之前）
const element = React.createElement(
  'h1',
  { className: 'greeting' },
  'Hello, world!'
);

// React 17+新的JSX转换
import { jsx as _jsx } from 'react/jsx-runtime';
const element = _jsx('h1', {
  className: 'greeting',
  children: 'Hello, world!'
});
```

**🎯 JSX规则总结**:
```javascript
// 1. 必须有一个根元素
function App() {
  return (
    <div>  {/* 根元素 */}
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// 2. 使用Fragment避免额外DOM
function App() {
  return (
    <>  {/* React.Fragment的简写 */}
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
}

// 3. 条件渲染
function UserGreeting({ user }) {
  return (
    <div>
      {user ? (
        <h1>Welcome back, {user.name}!</h1>
      ) : (
        <h1>Please sign up.</h1>
      )}
    </div>
  );
}

// 4. 列表渲染需要key
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

---

### 🔥 1.3 组件生命周期详解

**🤔 面试问题**: React组件的生命周期有哪些阶段？各阶段的作用是什么？

**💡 类组件生命周期**:

```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log('1. constructor - 组件初始化');
    this.state = { count: 0 };
  }

  static getDerivedStateFromProps(props, state) {
    console.log('2. getDerivedStateFromProps - 从props派生state');
    return null; // 返回新state或null
  }

  componentDidMount() {
    console.log('3. componentDidMount - 组件挂载完成');
    // 适合：API调用、订阅事件、设置定时器
    this.timer = setInterval(() => {
      this.setState(state => ({ count: state.count + 1 }));
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('4. shouldComponentUpdate - 是否需要更新');
    // 性能优化：阻止不必要的渲染
    return nextState.count !== this.state.count;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log('5. getSnapshotBeforeUpdate - 更新前的快照');
    // 获取更新前的DOM信息
    return { scrollTop: window.pageYOffset };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('6. componentDidUpdate - 组件更新完成');
    if (snapshot) {
      console.log('Previous scroll position:', snapshot.scrollTop);
    }
  }

  componentWillUnmount() {
    console.log('7. componentWillUnmount - 组件即将卸载');
    // 清理：取消订阅、清除定时器、取消网络请求
    clearInterval(this.timer);
  }

  render() {
    console.log('render - 渲染组件');
    return <div>Count: {this.state.count}</div>;
  }
}
```

**💡 函数组件的生命周期对应**:

```javascript
import { useState, useEffect, useRef } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  const timerRef = useRef();

  // componentDidMount + componentDidUpdate
  useEffect(() => {
    console.log('组件挂载或count更新');
  }, [count]);

  // componentDidMount
  useEffect(() => {
    console.log('组件挂载完成');
    timerRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // componentWillUnmount
    return () => {
      console.log('组件即将卸载');
      clearInterval(timerRef.current);
    };
  }, []); // 空依赖数组表示只在挂载时执行

  return <div>Count: {count}</div>;
}
```

---

### 🔥 1.4 Props vs State 深度对比

**🤔 面试问题**: Props和State的区别是什么？什么时候使用哪个？

**📊 详细对比表**:

| 特性 | Props | State |
|------|-------|-------|
| **数据源** | 父组件传递 | 组件内部管理 |
| **可变性** | 不可变（只读） | 可变（通过setState更新） |
| **触发渲染** | 父组件重新渲染时 | setState调用时 |
| **作用域** | 从外部传入 | 组件内部私有 |
| **用途** | 组件间通信 | 组件内部状态管理 |

**💡 实际应用示例**:

```javascript
// 父组件 - 管理共享状态
function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserSelect = (user) => {
    setSelectedUser(user);  // State - 内部状态
  };

  return (
    <div>
      <UserList
        users={users}              // Props - 传递数据
        onUserSelect={handleUserSelect}  // Props - 传递回调
      />
      <UserDetail user={selectedUser} />  {/* Props - 传递数据 */}
    </div>
  );
}

// 子组件 - 接收props，管理内部状态
function UserList({ users, onUserSelect }) {
  const [filter, setFilter] = useState('');  // State - 内部筛选状态

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <input
        value={filter}  // State - 受控组件
        onChange={(e) => setFilter(e.target.value)}
        placeholder="搜索用户..."
      />
      {filteredUsers.map(user => (
        <div
          key={user.id}
          onClick={() => onUserSelect(user)}  // Props - 调用父组件回调
        >
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

**🎯 最佳实践**:
1. **Props用于**: 父子组件通信、配置组件行为、传递回调函数
2. **State用于**: 表单输入、开关状态、列表筛选、加载状态

---

### 🔥 1.5 单向数据流原理

**🤔 面试问题**: 什么是单向数据流？它有什么好处？

**💡 核心概念**:
数据从父组件流向子组件，子组件不能直接修改props，只能通过回调函数通知父组件。

```javascript
// ✅ 正确的单向数据流
function Parent() {
  const [count, setCount] = useState(0);

  // 数据向下流动
  return (
    <Child
      count={count}                    // 数据向下
      onIncrement={() => setCount(count + 1)}  // 事件向上
    />
  );
}

function Child({ count, onIncrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>增加</button>
    </div>
  );
}

// ❌ 错误做法 - 直接修改props
function Child({ count }) {
  return (
    <button onClick={() => count++}>  {/* 错误！不能修改props */}
      Count: {count}
    </button>
  );
}
```

**🎯 复杂场景的单向数据流**:

```javascript
// 多层组件的数据流
function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div>
      <TodoForm onAddTodo={addTodo} />      {/* 数据向下，事件向上 */}
      <TodoList todos={todos} onToggleTodo={toggleTodo} />
    </div>
  );
}

function TodoForm({ onAddTodo }) {
  const [input, setInput] = useState('');  // 本地状态

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTodo(input);  // 通过回调向上传递数据
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">添加</button>
    </form>
  );
}

function TodoList({ todos, onToggleTodo }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}                    // 数据继续向下
          onToggle={() => onToggleTodo(todo.id)}  // 事件继续向上
        />
      ))}
    </ul>
  );
}

function TodoItem({ todo, onToggle }) {
  return (
    <li onClick={onToggle} style={{
      textDecoration: todo.completed ? 'line-through' : 'none'
    }}>
      {todo.text}
    </li>
  );
}
```

**📈 好处总结**:
1. **可预测性**: 数据流向清晰，便于调试
2. **可维护性**: 状态变更源头明确
3. **可测试性**: 纯函数组件更容易测试
4. **性能优化**: 更容易实现精确更新

---

### 🔥 1.6 事件系统 - SyntheticEvent

**🤔 面试问题**: React的事件系统有什么特点？和原生事件有什么区别？

**💡 SyntheticEvent特性**:

```javascript
function EventDemo() {
  const handleClick = (e) => {
    console.log('SyntheticEvent:', e);
    console.log('原生事件:', e.nativeEvent);

    // SyntheticEvent提供跨浏览器一致的API
    e.preventDefault();  // 阻止默认行为
    e.stopPropagation(); // 阻止事件冒泡
  };

  const handleMouseMove = (e) => {
    // 所有SyntheticEvent都有统一的API
    console.log(`鼠标位置: (${e.clientX}, ${e.clientY})`);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      <button onClick={handleClick}>点击我</button>
    </div>
  );
}
```

**🎯 事件池机制（React 16及之前）**:

```javascript
// React 16 - 事件对象会被重用
function OldEventHandling() {
  const handleClick = (e) => {
    // ❌ 异步使用事件对象会报错
    setTimeout(() => {
      console.log(e.target); // 错误：事件对象已被重用
    }, 100);

    // ✅ 正确做法1：立即获取需要的值
    const targetValue = e.target.value;
    setTimeout(() => {
      console.log(targetValue); // 正确
    }, 100);

    // ✅ 正确做法2：调用persist()
    e.persist();
    setTimeout(() => {
      console.log(e.target); // 正确
    }, 100);
  };

  return <button onClick={handleClick}>点击</button>;
}

// React 17+ - 不再使用事件池
function NewEventHandling() {
  const handleClick = (e) => {
    // ✅ 可以安全地异步使用事件对象
    setTimeout(() => {
      console.log(e.target); // 正确，不需要persist()
    }, 100);
  };

  return <button onClick={handleClick}>点击</button>;
}
```

**🔄 事件委托机制**:

```javascript
// React将所有事件委托到根元素
// 这样可以减少内存使用，提高性能

function EventDelegation() {
  return (
    <div>
      {/* 这些click事件实际上都委托到根元素 */}
      <button onClick={() => console.log('Button 1')}>按钮1</button>
      <button onClick={() => console.log('Button 2')}>按钮2</button>
      <button onClick={() => console.log('Button 3')}>按钮3</button>
    </div>
  );
}

// 原生事件和React事件的交互
function MixedEvents() {
  const ref = useRef();

  useEffect(() => {
    const handleNativeClick = (e) => {
      console.log('原生事件');
      e.stopPropagation(); // 这不会阻止React事件
    };

    ref.current.addEventListener('click', handleNativeClick);

    return () => {
      ref.current?.removeEventListener('click', handleNativeClick);
    };
  }, []);

  const handleReactClick = (e) => {
    console.log('React事件');
    // 要阻止原生事件，需要在原生事件中阻止
  };

  return (
    <button ref={ref} onClick={handleReactClick}>
      混合事件
    </button>
  );
}
```

---

### 🔥 1.7 条件渲染的最佳实践

**🤔 面试问题**: React中有哪些条件渲染的方式？各有什么优缺点？

**💡 各种条件渲染方式**:

```javascript
function ConditionalRendering({ user, isLoading, error, items }) {

  // 1. 三元运算符 - 适合简单的二选一
  return (
    <div>
      {user ? (
        <WelcomeUser user={user} />
      ) : (
        <LoginPrompt />
      )}
    </div>
  );

  // 2. 逻辑与运算符 - 适合简单的显示/隐藏
  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {items.length > 0 && <ItemList items={items} />}
    </div>
  );

  // 3. 立即执行函数 - 适合复杂逻辑
  return (
    <div>
      {(() => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage error={error} />;
        if (items.length === 0) return <EmptyState />;
        return <ItemList items={items} />;
      })()}
    </div>
  );

  // 4. 提取到变量 - 最清晰的方式
  let content;
  if (isLoading) {
    content = <LoadingSpinner />;
  } else if (error) {
    content = <ErrorMessage error={error} />;
  } else if (items.length === 0) {
    content = <EmptyState />;
  } else {
    content = <ItemList items={items} />;
  }

  return <div>{content}</div>;

  // 5. 自定义Hook - 复用条件逻辑
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    if (items.length === 0) return <EmptyState />;
    return <ItemList items={items} />;
  };

  return <div>{renderContent()}</div>;
}
```

**⚠️ 常见陷阱和解决方案**:

```javascript
function ConditionalRenderingTraps({ items, count }) {

  // ❌ 陷阱1：数字0会被渲染
  return (
    <div>
      {count && <div>数量: {count}</div>}  {/* count为0时会显示0 */}
    </div>
  );

  // ✅ 解决方案：明确的布尔判断
  return (
    <div>
      {count > 0 && <div>数量: {count}</div>}
      {Boolean(count) && <div>数量: {count}</div>}
      {!!count && <div>数量: {count}</div>}
    </div>
  );

  // ❌ 陷阱2：空字符串和NaN的问题
  const searchTerm = '';
  return (
    <div>
      {searchTerm && <SearchResults term={searchTerm} />}  {/* 空字符串是falsy */}
    </div>
  );

  // ✅ 解决方案：具体的条件检查
  return (
    <div>
      {searchTerm.trim() !== '' && <SearchResults term={searchTerm} />}
    </div>
  );

  // ❌ 陷阱3：未定义的数组长度
  return (
    <div>
      {items && items.length && <ItemList items={items} />}
    </div>
  );

  // ✅ 解决方案：安全的检查
  return (
    <div>
      {items && items.length > 0 && <ItemList items={items} />}
      {Array.isArray(items) && items.length > 0 && <ItemList items={items} />}
    </div>
  );
}
```

**🎯 性能优化的条件渲染**:

```javascript
// 使用useMemo避免不必要的计算
function OptimizedConditionalRendering({ items, filter }) {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.category === filter);
  }, [items, filter]);

  // 条件渲染结合memo
  const MemoizedItemList = memo(({ items }) => (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  ));

  return (
    <div>
      {filteredItems.length > 0 ? (
        <MemoizedItemList items={filteredItems} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
```

---

### 🔥 1.8 列表渲染和Key的重要性

**🤔 面试问题**: 为什么React列表需要key？key的选择有什么原则？

**💡 Key的作用机制**:

```javascript
// React使用key来识别哪些元素发生了变化
// 没有key时，React会按索引匹配，可能导致性能问题

// ❌ 错误示例：没有key
function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>{item.name}</li>  {/* 缺少key */}
      ))}
    </ul>
  );
}

// ❌ 错误示例：使用索引作为key
function BadIndexKey({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>  {/* 索引作为key有问题 */}
      ))}
    </ul>
  );
}

// ✅ 正确示例：使用唯一且稳定的key
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>  {/* 使用唯一ID */}
      ))}
    </ul>
  );
}
```

**🎯 Key选择的最佳实践**:

```javascript
// 1. 使用数据的唯一标识符
function UserList({ users }) {
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} />  // 数据库ID
      ))}
    </div>
  );
}

// 2. 组合多个字段创建唯一key
function OrderItems({ items }) {
  return (
    <div>
      {items.map(item => (
        <ItemCard
          key={`${item.productId}-${item.size}-${item.color}`}  // 组合key
          item={item}
        />
      ))}
    </div>
  );
}

// 3. 使用crypto.randomUUID()为动态创建的项目生成key
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    const newTodo = {
      id: crypto.randomUUID(),  // 生成唯一ID
      text,
      completed: false
    };
    setTodos([...todos, newTodo]);
  };

  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}

// 4. 特殊情况：当数据本身就是key时
function TagList({ tags }) {
  return (
    <div>
      {tags.map(tag => (
        <span key={tag} className="tag">{tag}</span>  // 标签文本作为key
      ))}
    </div>
  );
}
```

**⚠️ 索引作为Key的问题演示**:

```javascript
// 问题演示：为什么不能用索引作为key
function IndexKeyProblem() {
  const [items, setItems] = useState([
    { id: 1, name: 'Apple', favorite: false },
    { id: 2, name: 'Banana', favorite: false },
    { id: 3, name: 'Cherry', favorite: false }
  ]);

  const removeFirst = () => {
    setItems(items.slice(1));
  };

  return (
    <div>
      <button onClick={removeFirst}>删除第一项</button>

      {/* ❌ 用索引作为key - 会导致状态混乱 */}
      <div>
        <h3>错误示例（索引作为key）：</h3>
        {items.map((item, index) => (
          <ItemWithState key={index} item={item} />
        ))}
      </div>

      {/* ✅ 用ID作为key - 状态正确 */}
      <div>
        <h3>正确示例（ID作为key）：</h3>
        {items.map(item => (
          <ItemWithState key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ItemWithState({ item }) {
  const [favorite, setFavorite] = useState(item.favorite);

  return (
    <div>
      <span>{item.name}</span>
      <button
        onClick={() => setFavorite(!favorite)}
        style={{ color: favorite ? 'red' : 'gray' }}
      >
        ♥
      </button>
    </div>
  );
}
```

**🚀 性能优化：稳定的Key策略**:

```javascript
// 列表项目的内存化
const MemoizedListItem = memo(function ListItem({ item, onToggle, onDelete }) {
  console.log(`渲染项目: ${item.id}`);  // 用于观察重渲染

  return (
    <div>
      <span>{item.name}</span>
      <button onClick={() => onToggle(item.id)}>切换</button>
      <button onClick={() => onDelete(item.id)}>删除</button>
    </div>
  );
});

function OptimizedList({ items }) {
  const [list, setList] = useState(items);

  // 使用useCallback确保函数引用稳定
  const handleToggle = useCallback((id) => {
    setList(prev => prev.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  }, []);

  const handleDelete = useCallback((id) => {
    setList(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div>
      {list.map(item => (
        <MemoizedListItem
          key={item.id}  // 稳定的key确保memo生效
          item={item}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
```

---

### 🟡 1.9 Ref的使用场景和最佳实践

**🤔 面试问题**: 什么时候需要使用ref？ref的不同类型有什么区别？

**💡 Ref的三种使用方式**:

```javascript
import { useRef, createRef, forwardRef, useImperativeHandle } from 'react';

// 1. useRef - 函数组件中使用
function FunctionComponentRef() {
  const inputRef = useRef(null);
  const countRef = useRef(0);  // 存储不触发重渲染的值

  const focusInput = () => {
    inputRef.current.focus();
  };

  const incrementSilent = () => {
    countRef.current += 1;  // 不会触发重渲染
    console.log('Silent count:', countRef.current);
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>聚焦输入框</button>
      <button onClick={incrementSilent}>静默计数</button>
    </div>
  );
}

// 2. createRef - 类组件中使用
class ClassComponentRef extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
  }

  focusInput = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.inputRef} />
        <button onClick={this.focusInput}>聚焦输入框</button>
      </div>
    );
  }
}

// 3. forwardRef - 转发ref到子组件
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return (
    <div className="fancy-input">
      <input ref={ref} {...props} />
    </div>
  );
});

function Parent() {
  const inputRef = useRef();

  return (
    <div>
      <FancyInput ref={inputRef} placeholder="转发的ref" />
      <button onClick={() => inputRef.current.focus()}>
        聚焦子组件输入框
      </button>
    </div>
  );
}
```

**🎯 Ref的典型使用场景**:

```javascript
// 1. DOM操作：聚焦、滚动、测量
function DOMOperations() {
  const scrollRef = useRef();
  const measureRef = useRef();

  const scrollToTop = () => {
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const measureElement = () => {
    const rect = measureRef.current.getBoundingClientRect();
    console.log('Element size:', rect.width, rect.height);
  };

  return (
    <div>
      <div ref={scrollRef} style={{ height: 200, overflow: 'auto' }}>
        <div style={{ height: 1000 }}>很长的内容...</div>
      </div>
      <button onClick={scrollToTop}>滚动到顶部</button>

      <div ref={measureRef}>测量这个元素</div>
      <button onClick={measureElement}>获取尺寸</button>
    </div>
  );
}

// 2. 第三方库集成
function ThirdPartyIntegration() {
  const chartRef = useRef();

  useEffect(() => {
    // 初始化第三方图表库
    const chart = new SomeChartLibrary(chartRef.current);
    chart.render(data);

    return () => {
      chart.destroy();  // 清理
    };
  }, []);

  return <div ref={chartRef} />;
}

// 3. 保存不触发重渲染的值
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef();

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);  // 清理
  }, []);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}

// 4. 缓存昂贵的计算结果
function ExpensiveComputation({ input }) {
  const cacheRef = useRef(new Map());

  const result = useMemo(() => {
    const cache = cacheRef.current;

    if (cache.has(input)) {
      return cache.get(input);
    }

    const computed = expensiveFunction(input);
    cache.set(input, computed);
    return computed;
  }, [input]);

  return <div>结果: {result}</div>;
}
```

**🔥 useImperativeHandle高级用法**:

```javascript
// 自定义ref暴露的接口
const CustomInput = forwardRef(function CustomInput(props, ref) {
  const inputRef = useRef();
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    // 只暴露特定的方法，不是整个DOM元素
    focus: () => inputRef.current.focus(),
    clear: () => setValue(''),
    getValue: () => value,
    setValue: (newValue) => setValue(newValue)
  }), [value]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
});

function App() {
  const customInputRef = useRef();

  const handleOperations = () => {
    customInputRef.current.focus();
    console.log('Current value:', customInputRef.current.getValue());
    customInputRef.current.setValue('Hello World');
    setTimeout(() => {
      customInputRef.current.clear();
    }, 2000);
  };

  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={handleOperations}>执行操作</button>
    </div>
  );
}
```

**⚠️ Ref使用注意事项**:

```javascript
// ❌ 错误用法
function RefMistakes() {
  const [items, setItems] = useState([]);
  const itemRefs = useRef([]);  // 错误：不应该存储refs数组

  // ❌ 在渲染过程中设置ref
  return (
    <div>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={el => itemRefs.current[index] = el}  // 可能有问题
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

// ✅ 正确用法
function RefBestPractices() {
  const [items, setItems] = useState([]);
  const itemRefs = useRef(new Map());  // 使用Map存储refs

  const setItemRef = (id, element) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  };

  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          ref={el => setItemRef(item.id, el)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

---

### 🟡 1.10 Context API深度解析

**🤔 面试问题**: Context API的工作原理是什么？什么时候使用Context？

**💡 Context的基本用法**:

```javascript
import { createContext, useContext, useState, useReducer } from 'react';

// 1. 创建Context
const ThemeContext = createContext();
const UserContext = createContext();

// 2. 创建Provider组件
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. 创建自定义Hook
function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

// 4. 使用Context
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Header />
        <MainContent />
        <Footer />
      </UserProvider>
    </ThemeProvider>
  );
}

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`header ${theme}`}>
      <h1>我的应用</h1>
      <button onClick={toggleTheme}>
        切换到{theme === 'light' ? '深色' : '浅色'}主题
      </button>
    </header>
  );
}
```

**🎯 复杂状态管理的Context模式**:

```javascript
// 使用useReducer管理复杂状态
const AppStateContext = createContext();
const AppDispatchContext = createContext();

const initialState = {
  user: null,
  loading: false,
  error: null,
  notifications: []
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    default:
      return state;
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

// 自定义Hook提供便捷的API
function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context;
}

// 高级Hook：封装业务逻辑
function useAuth() {
  const { user, loading, error } = useAppState();
  const dispatch = useAppDispatch();

  const login = async (credentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const user = await authAPI.login(credentials);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: { id: Date.now(), message: '登录成功', type: 'success' }
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id: Date.now(), message: '已退出登录', type: 'info' }
    });
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
}
```

**🚀 性能优化策略**:

```javascript
// 1. 拆分Context避免不必要的重渲染
const UserContext = createContext();
const UIContext = createContext();

// 分离不常变化的数据和经常变化的数据
function OptimizedApp() {
  const [user, setUser] = useState(null);  // 不常变化
  const [uiState, setUIState] = useState({ loading: false });  // 经常变化

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <UIContext.Provider value={{ uiState, setUIState }}>
        <AppContent />
      </UIContext.Provider>
    </UserContext.Provider>
  );
}

// 2. 使用memo防止不必要的重渲染
const ExpensiveComponent = memo(function ExpensiveComponent() {
  const { user } = useContext(UserContext);  // 只订阅用户数据

  return <div>用户: {user?.name}</div>;
});

// 3. Context值的memoization
function ProviderWithMemo({ children }) {
  const [state, setState] = useState(initialState);

  // 使用useMemo缓存context值
  const contextValue = useMemo(() => ({
    state,
    updateState: (newState) => setState(prev => ({ ...prev, ...newState }))
  }), [state]);

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

// 4. 选择性订阅模式
function useAppStateSelector(selector) {
  const state = useAppState();
  return useMemo(() => selector(state), [state, selector]);
}

// 使用：只在特定数据变化时重渲染
function UserProfile() {
  const userName = useAppStateSelector(state => state.user?.name);

  return <div>用户名: {userName}</div>;
}
```

**⚠️ Context使用注意事项**:

```javascript
// ❌ 过度使用Context
function OveruseContext() {
  // 不要为了避免prop drilling就什么都放到Context
  return (
    <ColorContext.Provider value={color}>
      <SizeContext.Provider value={size}>
        <StyleContext.Provider value={style}>
          <AnimationContext.Provider value={animation}>
            {/* 太多Context嵌套 */}
          </AnimationContext.Provider>
        </StyleContext.Provider>
      </SizeContext.Provider>
    </ColorContext.Provider>
  );
}

// ✅ 合理使用Context
function ReasonableContext() {
  // 只为真正需要全局访问的数据使用Context
  // 如：用户信息、主题、语言设置、认证状态

  return (
    <AuthProvider>      {/* 认证状态 - 需要全局访问 */}
      <ThemeProvider>    {/* 主题设置 - 需要全局访问 */}
        <AppContent />   {/* 其他数据通过props传递 */}
      </ThemeProvider>
    </AuthProvider>
  );
}

// Context vs Props的选择标准
// 使用Context：
// - 数据需要被多个层级的组件访问
// - 数据变化频率较低
// - 避免深层的prop drilling

// 使用Props：
// - 数据只在几个相邻组件间传递
// - 数据变化频率较高
// - 组件关系简单清晰
```

---

### 🟡 1.11 错误边界 (Error Boundaries)

**🤔 面试问题**: 什么是错误边界？如何在React中处理组件错误？

**💡 错误边界的基本实现**:

```javascript
// 类组件错误边界（目前唯一方式）
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // 更新state，显示错误UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    // 发送错误到监控服务
    this.logErrorToService(error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  logErrorToService = (error, errorInfo) => {
    // 发送到错误监控服务（如Sentry）
    if (typeof window !== 'undefined') {
      // Sentry.captureException(error, { extra: errorInfo });
    }
  };

  render() {
    if (this.state.hasError) {
      // 自定义错误UI
      return (
        <div className="error-boundary">
          <h2>😵 出现了一些问题</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>错误详情</summary>
            <p><strong>错误:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>堆栈:</strong> {this.state.errorInfo.componentStack}</p>
          </details>
          <button onClick={() => window.location.reload()}>
            重新加载页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用错误边界
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <ErrorBoundary>  {/* 嵌套错误边界，更精确的错误处理 */}
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  );
}
```

**🎯 高级错误边界模式**:

```javascript
// 可配置的错误边界
class ConfigurableErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const { onError, enableLogging = true } = this.props;

    if (enableLogging) {
      console.error('Error in component:', error);
    }

    if (onError) {
      onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback, children } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} />;
      }

      return (
        <div className="default-error-ui">
          <h3>组件加载失败</h3>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 错误回退组件
function ErrorFallback({ error }) {
  return (
    <div role="alert" className="error-fallback">
      <h2>出错了!</h2>
      <pre>{error.message}</pre>
      <button onClick={() => window.location.reload()}>
        刷新页面
      </button>
    </div>
  );
}

// 使用配置化错误边界
function AdvancedApp() {
  const handleError = (error, errorInfo) => {
    // 发送到错误监控
    analytics.track('component_error', {
      error: error.toString(),
      componentStack: errorInfo.componentStack
    });
  };

  return (
    <ConfigurableErrorBoundary
      fallback={ErrorFallback}
      onError={handleError}
      enableLogging={process.env.NODE_ENV === 'development'}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <ConfigurableErrorBoundary fallback={ProfileErrorFallback}>
              <Profile />
            </ConfigurableErrorBoundary>
          } />
        </Routes>
      </Router>
    </ConfigurableErrorBoundary>
  );
}
```

**🔄 函数组件中的错误处理**:

```javascript
// 自定义Hook处理异步错误
function useErrorHandler() {
  const [error, setError] = useState(null);

  const resetError = () => setError(null);

  const captureError = useCallback((error) => {
    setError(error);
    console.error('Captured error:', error);
  }, []);

  // 如果有错误就抛出，让错误边界捕获
  if (error) {
    throw error;
  }

  return { captureError, resetError };
}

// 使用错误处理Hook
function AsyncComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { captureError } = useErrorHandler();

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/data');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      captureError(error);  // 将错误传递给错误边界
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>加载中...</div>;

  return <div>{JSON.stringify(data)}</div>;
}

// React Query的错误处理
function ReactQueryErrorHandling() {
  const { data, error, isLoading } = useQuery(
    'userData',
    fetchUserData,
    {
      retry: 3,
      retryDelay: 1000,
      onError: (error) => {
        // 本地错误处理
        console.error('Query failed:', error);
      }
    }
  );

  // 抛出错误让错误边界处理
  if (error) {
    throw error;
  }

  if (isLoading) return <div>加载中...</div>;

  return <div>{data.name}</div>;
}
```

**🛡️ 全局错误处理策略**:

```javascript
// 全局错误处理器
class GlobalErrorHandler {
  static instance = null;

  constructor() {
    if (GlobalErrorHandler.instance) {
      return GlobalErrorHandler.instance;
    }

    this.errorQueue = [];
    this.setupGlobalHandlers();
    GlobalErrorHandler.instance = this;
  }

  setupGlobalHandlers() {
    // 捕获未处理的Promise rejection
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(new Error(event.reason), 'unhandledrejection');
    });

    // 捕获全局JavaScript错误
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error, 'global');
    });
  }

  handleError(error, source) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this.errorQueue.push(errorData);
    this.sendErrorToService(errorData);
  }

  sendErrorToService(errorData) {
    // 发送到错误监控服务
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData)
    }).catch(err => {
      console.error('Failed to send error to service:', err);
    });
  }
}

// 在应用启动时初始化
function App() {
  useEffect(() => {
    new GlobalErrorHandler();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* 路由配置 */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

**📋 错误边界最佳实践总结**:

1. **错误边界无法捕获的错误**:
   - 事件处理器中的错误
   - 异步代码中的错误
   - 服务端渲染中的错误
   - 错误边界自身的错误

2. **错误边界的放置策略**:
   - 在路由层级设置错误边界
   - 在重要组件周围设置错误边界
   - 避免过度嵌套错误边界

3. **错误信息收集**:
   - 收集完整的错误堆栈
   - 记录用户操作路径
   - 包含环境信息
   - 实现错误分类和去重

---

### 🟡 1.12 高阶组件 (HOC) 设计模式

**🤔 面试问题**: 什么是高阶组件？和Hooks相比有什么优缺点？

**💡 HOC基本概念和实现**:

```javascript
// HOC是一个函数，接受组件作为参数，返回增强后的组件
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div>加载中...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

// 使用HOC
const UserList = ({ users }) => (
  <ul>
    {users.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
);

const UserListWithLoading = withLoading(UserList);

// 在父组件中使用
function App() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <UserListWithLoading
      users={users}
      isLoading={isLoading}
    />
  );
}
```

**🎯 常用HOC模式**:

```javascript
// 1. 认证HOC
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <LoginPrompt />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}

// 2. 权限HOC
function withPermission(permission) {
  return function(WrappedComponent) {
    return function PermissionComponent(props) {
      const { hasPermission } = usePermissions();

      if (!hasPermission(permission)) {
        return <div>权限不足</div>;
      }

      return <WrappedComponent {...props} />;
    };
  };
}

// 3. 数据获取HOC
function withData(fetchFn, dataName) {
  return function(WrappedComponent) {
    return function DataComponent(props) {
      const [data, setData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const loadData = async () => {
          try {
            setLoading(true);
            const result = await fetchFn(props);
            setData(result);
          } catch (err) {
            setError(err);
          } finally {
            setLoading(false);
          }
        };

        loadData();
      }, []);

      const injectedProps = {
        [dataName]: data,
        [`${dataName}Loading`]: loading,
        [`${dataName}Error`]: error,
        [`reload${dataName}`]: () => loadData()
      };

      return <WrappedComponent {...props} {...injectedProps} />;
    };
  };
}

// 4. 生命周期HOC
function withLifecycle(lifecycleMethods) {
  return function(WrappedComponent) {
    return function LifecycleComponent(props) {
      useEffect(() => {
        lifecycleMethods.onMount?.(props);

        return () => {
          lifecycleMethods.onUnmount?.(props);
        };
      }, []);

      useEffect(() => {
        lifecycleMethods.onUpdate?.(props);
      });

      return <WrappedComponent {...props} />;
    };
  };
}

// 使用示例
const EnhancedUserProfile = withAuth(
  withPermission('user:read')(
    withData(fetchUserProfile, 'profile')(
      withLifecycle({
        onMount: () => console.log('Profile mounted'),
        onUnmount: () => console.log('Profile unmounted')
      })(UserProfile)
    )
  )
);
```

**🔧 HOC组合和优化**:

```javascript
// HOC组合工具
function compose(...hocs) {
  return function(WrappedComponent) {
    return hocs.reduceRight((acc, hoc) => hoc(acc), WrappedComponent);
  };
}

// 使用compose简化HOC组合
const EnhancedComponent = compose(
  withAuth,
  withPermission('admin'),
  withLoading,
  withErrorBoundary
)(MyComponent);

// 带配置的HOC工厂
function createDataHOC(config) {
  const { fetchFn, dataName, cacheKey, refetchInterval } = config;

  return function(WrappedComponent) {
    return function DataHOC(props) {
      const [data, setData] = useState(() => {
        // 从缓存中获取初始数据
        return cacheKey ? getFromCache(cacheKey) : null;
      });

      const [loading, setLoading] = useState(!data);
      const [error, setError] = useState(null);

      const fetchData = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);

          const result = await fetchFn(props);
          setData(result);

          if (cacheKey) {
            setCache(cacheKey, result);
          }
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      }, [props]);

      useEffect(() => {
        fetchData();

        if (refetchInterval) {
          const interval = setInterval(fetchData, refetchInterval);
          return () => clearInterval(interval);
        }
      }, [fetchData, refetchInterval]);

      return (
        <WrappedComponent
          {...props}
          {...{
            [dataName]: data,
            [`${dataName}Loading`]: loading,
            [`${dataName}Error`]: error,
            [`refresh${capitalizeFirst(dataName)}`]: fetchData
          }}
        />
      );
    };
  };
}

// 使用配置化HOC
const withUserData = createDataHOC({
  fetchFn: (props) => fetchUser(props.userId),
  dataName: 'user',
  cacheKey: 'user',
  refetchInterval: 30000
});

const UserProfile = withUserData(({ user, userLoading, userError, refreshUser }) => {
  if (userLoading) return <div>加载中...</div>;
  if (userError) return <div>错误: {userError.message}</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={refreshUser}>刷新</button>
    </div>
  );
});
```

**🆚 HOC vs Hooks 对比**:

```javascript
// HOC方式
const withCounter = (WrappedComponent) => {
  return function CounterHOC(props) {
    const [count, setCount] = useState(0);

    return (
      <WrappedComponent
        {...props}
        count={count}
        increment={() => setCount(c => c + 1)}
        decrement={() => setCount(c => c - 1)}
      />
    );
  };
};

const CounterDisplay = withCounter(({ count, increment, decrement }) => (
  <div>
    <p>Count: {count}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
));

// Hooks方式
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset };
}

function CounterDisplay() {
  const { count, increment, decrement } = useCounter();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

**📊 HOC vs Hooks 比较表**:

| 特性 | HOC | Hooks |
|------|-----|-------|
| **复用性** | 组件级复用 | 逻辑级复用 |
| **嵌套问题** | 容易产生wrapper hell | 无嵌套问题 |
| **类型推导** | TypeScript支持较差 | TypeScript支持很好 |
| **props污染** | 可能覆盖props | 不会污染props |
| **调试** | 组件层级复杂 | 调试清晰 |
| **渲染性能** | 额外的组件层级 | 无额外开销 |
| **学习成本** | 概念较复杂 | 更直观 |

**🎯 HOC最佳实践**:

```javascript
// 1. 使用displayName便于调试
function withLogging(WrappedComponent) {
  const ComponentWithLogging = (props) => {
    useEffect(() => {
      console.log(`${WrappedComponent.name} mounted`);
    }, []);

    return <WrappedComponent {...props} />;
  };

  ComponentWithLogging.displayName = `withLogging(${WrappedComponent.displayName || WrappedComponent.name})`;

  return ComponentWithLogging;
}

// 2. 复制静态方法
function withEnhancement(WrappedComponent) {
  const EnhancedComponent = (props) => {
    return <WrappedComponent {...props} />;
  };

  // 复制静态方法
  hoistNonReactStatics(EnhancedComponent, WrappedComponent);

  return EnhancedComponent;
}

// 3. 不要在render中使用HOC
function App() {
  // ❌ 错误：每次render都会创建新组件
  const EnhancedComponent = withLoading(MyComponent);

  return <EnhancedComponent />;
}

// ✅ 正确：在组件外部创建
const EnhancedComponent = withLoading(MyComponent);

function App() {
  return <EnhancedComponent />;
}
```

---

### 🟡 1.13 Render Props模式

**🤔 面试问题**: 什么是Render Props？它解决了什么问题？

**💡 Render Props基本概念**:

```javascript
// Render Props是一种在组件间共享代码的技术
// 通过props传递一个函数来告诉组件渲染什么

// 基本Render Props组件
function Mouse({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return render(position);  // 调用render prop
}

// 使用Render Props
function App() {
  return (
    <div>
      <h1>鼠标追踪</h1>
      <Mouse render={({ x, y }) => (
        <p>鼠标位置: ({x}, {y})</p>
      )} />

      {/* 同样的逻辑，不同的UI */}
      <Mouse render={({ x, y }) => (
        <div
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 10,
            height: 10,
            background: 'red',
            borderRadius: '50%'
          }}
        />
      )} />
    </div>
  );
}
```

**🎯 Render Props的高级模式**:

```javascript
// 1. Children作为函数
function DataProvider({ url, children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  // children是一个函数
  return children({ data, loading, error });
}

// 使用children函数
function UserList() {
  return (
    <DataProvider url="/api/users">
      {({ data, loading, error }) => {
        if (loading) return <div>加载中...</div>;
        if (error) return <div>错误: {error.message}</div>;

        return (
          <ul>
            {data.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        );
      }}
    </DataProvider>
  );
}

// 2. 多个render props
function WindowSize({
  renderDesktop,
  renderTablet,
  renderMobile
}) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { width } = windowSize;

  if (width >= 1024) {
    return renderDesktop(windowSize);
  } else if (width >= 768) {
    return renderTablet(windowSize);
  } else {
    return renderMobile(windowSize);
  }
}

// 使用多个render props
function ResponsiveApp() {
  return (
    <WindowSize
      renderDesktop={(size) => (
        <div>桌面版 - {size.width}x{size.height}</div>
      )}
      renderTablet={(size) => (
        <div>平板版 - {size.width}x{size.height}</div>
      )}
      renderMobile={(size) => (
        <div>手机版 - {size.width}x{size.height}</div>
      )}
    />
  );
}

// 3. 组合多个Render Props
function FormProvider({ initialValues, onSubmit, children }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // 清除该字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(error.fieldErrors || {});
    }
  };

  return children({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  });
}

// 嵌套使用
function LoginForm() {
  return (
    <FormProvider
      initialValues={{ email: '', password: '' }}
      onSubmit={handleLogin}
    >
      {({ values, errors, handleChange, handleSubmit }) => (
        <DataProvider url="/api/auth/config">
          {({ data: config, loading }) => (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={values.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="邮箱"
              />
              {errors.email && <span>{errors.email}</span>}

              <input
                type="password"
                value={values.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="密码"
              />
              {errors.password && <span>{errors.password}</span>}

              <button type="submit" disabled={loading}>
                {loading ? '登录中...' : '登录'}
              </button>
            </form>
          )}
        </DataProvider>
      )}
    </FormProvider>
  );
}
```

**🔄 Render Props vs HOC vs Hooks**:

```javascript
// 同一个功能的三种实现方式

// 1. Render Props方式
function ToggleRP({ children }) {
  const [isOn, setIsOn] = useState(false);

  return children({
    isOn,
    toggle: () => setIsOn(!isOn)
  });
}

function App1() {
  return (
    <ToggleRP>
      {({ isOn, toggle }) => (
        <button onClick={toggle}>
          {isOn ? 'ON' : 'OFF'}
        </button>
      )}
    </ToggleRP>
  );
}

// 2. HOC方式
function withToggle(WrappedComponent) {
  return function ToggleHOC(props) {
    const [isOn, setIsOn] = useState(false);

    return (
      <WrappedComponent
        {...props}
        isOn={isOn}
        toggle={() => setIsOn(!isOn)}
      />
    );
  };
}

const ToggleButton = withToggle(({ isOn, toggle }) => (
  <button onClick={toggle}>
    {isOn ? 'ON' : 'OFF'}
  </button>
));

function App2() {
  return <ToggleButton />;
}

// 3. Hooks方式
function useToggle(initialValue = false) {
  const [isOn, setIsOn] = useState(initialValue);

  const toggle = useCallback(() => setIsOn(prev => !prev), []);

  return [isOn, toggle];
}

function App3() {
  const [isOn, toggle] = useToggle();

  return (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
```

**🎯 Render Props最佳实践**:

```javascript
// 1. 提供默认的render函数
function List({ items, render = (item) => <div>{item.name}</div> }) {
  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id || index}>
          {render(item, index)}
        </div>
      ))}
    </div>
  );
}

// 2. 使用PropTypes定义render prop类型
import PropTypes from 'prop-types';

function DataFetcher({ url, render }) {
  // ... 数据获取逻辑

  return render({ data, loading, error });
}

DataFetcher.propTypes = {
  url: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired
};

// 3. 优化性能 - 避免在render中创建函数
function App() {
  // ❌ 每次render都创建新函数
  return (
    <Mouse render={({ x, y }) => (
      <p>Position: {x}, {y}</p>
    )} />
  );
}

// ✅ 提取到组件外部或使用useCallback
const MouseDisplay = ({ x, y }) => <p>Position: {x}, {y}</p>;

function App() {
  return <Mouse render={MouseDisplay} />;
}

// 或使用useCallback
function App() {
  const renderMouse = useCallback(({ x, y }) => (
    <p>Position: {x}, {y}</p>
  ), []);

  return <Mouse render={renderMouse} />;
}

// 4. 错误处理
function SafeRenderProp({ render, fallback = null }) {
  try {
    return render();
  } catch (error) {
    console.error('Render prop error:', error);
    return fallback;
  }
}
```

**📊 三种模式的对比总结**:

| 特性 | Render Props | HOC | Hooks |
|------|-------------|-----|-------|
| **灵活性** | 很高 | 中等 | 很高 |
| **复用性** | 高 | 高 | 最高 |
| **嵌套问题** | 可能有 | 容易有 | 无 |
| **类型安全** | 好 | 一般 | 最好 |
| **性能** | 一般 | 一般 | 最好 |
| **学习成本** | 中等 | 中等 | 低 |
| **推荐度** | 中等 | 低 | 高 |

现在的React开发中，**Hooks是首选**，Render Props和HOC主要用于：
- 维护老代码
- 特定的库设计
- 需要在类组件中复用逻辑的场景

---

### 🟡 1.14 Portals传送门

**🤔 面试问题**: 什么是React Portals？它解决了什么问题？

**💡 Portals基本概念和用法**:

```javascript
import { createPortal } from 'react-dom';

// Portal允许将子节点渲染到DOM树中的不同位置
function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  // 将Modal渲染到body下，而不是当前组件的DOM位置
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>关闭</button>
      </div>
    </div>,
    document.body  // 渲染目标
  );
}

// 使用Modal
function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <h1>主应用</h1>
      <button onClick={() => setShowModal(true)}>
        打开模态框
      </button>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>模态框内容</h2>
        <p>这个模态框通过Portal渲染到body下</p>
      </Modal>
    </div>
  );
}
```

**🎯 Portal的高级应用场景**:

```javascript
// 1. 自定义Portal容器
function createPortalRoot(id) {
  let element = document.getElementById(id);

  if (!element) {
    element = document.createElement('div');
    element.id = id;
    document.body.appendChild(element);
  }

  return element;
}

// 可重用的Portal组件
function Portal({ children, target = 'portal-root' }) {
  const [portalRoot] = useState(() => createPortalRoot(target));

  return createPortal(children, portalRoot);
}

// 2. 吐司通知系统
const ToastContext = createContext();

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type, duration };

    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <Portal target="toast-container">
        <div className="toast-container">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onRemove={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
}

function Toast({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(onRemove, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <div className={`toast toast-${toast.type}`} onClick={onRemove}>
      {toast.message}
    </div>
  );
}

// 使用Toast
function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

function MyComponent() {
  const { addToast } = useToast();

  return (
    <button onClick={() => addToast('操作成功!', 'success')}>
      显示成功消息
    </button>
  );
}

// 3. 下拉菜单 - 避免z-index和overflow问题
function Dropdown({ trigger, children, isOpen, onClose }) {
  const triggerRef = useRef();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (event) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  return (
    <div ref={triggerRef}>
      {trigger}
      {isOpen && (
        <Portal>
          <div
            className="dropdown-menu"
            style={{
              position: 'absolute',
              top: position.top,
              left: position.left,
              zIndex: 9999
            }}
          >
            {children}
          </div>
        </Portal>
      )}
    </div>
  );
}

// 4. 全屏组件
function Fullscreen({ children, isFullscreen, onExit }) {
  useEffect(() => {
    if (isFullscreen) {
      // 锁定body滚动
      document.body.style.overflow = 'hidden';

      // ESC键退出
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onExit();
        }
      };

      document.addEventListener('keydown', handleEsc);

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isFullscreen, onExit]);

  if (!isFullscreen) return null;

  return createPortal(
    <div className="fullscreen-overlay">
      <div className="fullscreen-content">
        <button className="fullscreen-close" onClick={onExit}>
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
```

**🔧 Portal的事件处理特性**:

```javascript
// Portal中的事件仍会按React组件树冒泡，不是DOM树
function EventBubblingDemo() {
  const handleDivClick = () => {
    console.log('Div clicked (React tree)');
  };

  const handleBodyClick = () => {
    console.log('Body clicked (DOM tree)');
  };

  useEffect(() => {
    document.body.addEventListener('click', handleBodyClick);
    return () => document.body.removeEventListener('click', handleBodyClick);
  }, []);

  return (
    <div onClick={handleDivClick}>
      <p>点击按钮看事件冒泡</p>

      {/* 这个按钮通过Portal渲染到body，但事件仍会冒泡到div */}
      <Portal>
        <button
          style={{
            position: 'fixed',
            top: 100,
            right: 100,
            zIndex: 9999
          }}
          onClick={() => console.log('Button clicked')}
        >
          Portal按钮
        </button>
      </Portal>
    </div>
  );
}

// 点击按钮的输出顺序：
// 1. "Button clicked"
// 2. "Div clicked (React tree)" - React事件冒泡
// 3. "Body clicked (DOM tree)" - DOM事件冒泡
```

**🎯 Portal最佳实践**:

```javascript
// 1. 清理Portal容器
function usePortal(id) {
  const [portalElement] = useState(() => {
    const element = document.createElement('div');
    element.id = id;
    return element;
  });

  useEffect(() => {
    document.body.appendChild(portalElement);

    return () => {
      if (document.body.contains(portalElement)) {
        document.body.removeChild(portalElement);
      }
    };
  }, [portalElement]);

  return portalElement;
}

// 2. 条件渲染优化
function ConditionalPortal({ children, when, target = document.body }) {
  if (!when) return null;

  return createPortal(children, target);
}

// 3. 服务端渲染兼容
function SSRSafePortal({ children, target }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;  // 服务端渲染时不渲染Portal
  }

  return createPortal(children, target);
}

// 4. Portal管理器
class PortalManager {
  constructor() {
    this.portals = new Map();
  }

  createPortal(id, containerSelector = 'body') {
    if (this.portals.has(id)) {
      return this.portals.get(id);
    }

    const container = document.querySelector(containerSelector);
    const element = document.createElement('div');
    element.id = `portal-${id}`;
    container.appendChild(element);

    this.portals.set(id, element);
    return element;
  }

  removePortal(id) {
    const element = this.portals.get(id);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      this.portals.delete(id);
    }
  }

  removeAllPortals() {
    this.portals.forEach((element, id) => {
      this.removePortal(id);
    });
  }
}

const portalManager = new PortalManager();

function ManagedPortal({ id, children, containerSelector }) {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    const element = portalManager.createPortal(id, containerSelector);
    setPortalElement(element);

    return () => {
      portalManager.removePortal(id);
    };
  }, [id, containerSelector]);

  if (!portalElement) return null;

  return createPortal(children, portalElement);
}
```

**📋 Portal使用场景总结**:

1. **模态框和对话框**: 避免z-index层级问题
2. **下拉菜单**: 避免父容器overflow限制
3. **吐司通知**: 全局消息提示
4. **工具提示**: 悬浮提示信息
5. **全屏组件**: 全屏展示内容
6. **拖拽预览**: 拖拽操作的视觉反馈

Portal是React中处理"逃离"当前组件树约束的重要工具，特别适用于需要在视觉上脱离父组件限制的UI组件。

---

### 🟡 1.15 Suspense和异步组件

**🤔 面试问题**: Suspense是如何工作的？它解决了什么问题？

**💡 Suspense基本用法**:

```javascript
import { Suspense, lazy } from 'react';

// 1. 代码分割 - 懒加载组件
const LazyComponent = lazy(() => import('./LazyComponent'));
const UserProfile = lazy(() => import('./UserProfile'));
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <div>
      <h1>主应用</h1>

      {/* Suspense包裹懒加载组件 */}
      <Suspense fallback={<div>组件加载中...</div>}>
        <LazyComponent />
      </Suspense>

      {/* 多个懒加载组件共享一个Suspense */}
      <Suspense fallback={<LoadingSpinner />}>
        <UserProfile userId="123" />
        <Dashboard />
      </Suspense>
    </div>
  );
}

// 懒加载组件的实现
// LazyComponent.js
function LazyComponent() {
  return (
    <div>
      <h2>这是一个懒加载的组件</h2>
      <p>只有在需要时才会被加载</p>
    </div>
  );
}

export default LazyComponent;
```

**🎯 Suspense的高级用法**:

```javascript
// 1. 嵌套Suspense - 精细控制加载状态
function NestedSuspenseExample() {
  return (
    <div>
      <h1>应用标题</h1>

      {/* 外层Suspense - 页面级加载 */}
      <Suspense fallback={<PageSkeleton />}>
        <MainLayout>

          {/* 内层Suspense - 组件级加载 */}
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>

          <main>
            <Suspense fallback={<ContentSkeleton />}>
              <Content />
            </Suspense>
          </main>

        </MainLayout>
      </Suspense>
    </div>
  );
}

// 2. 条件Suspense
function ConditionalSuspense({ showAdvanced }) {
  return (
    <div>
      <BasicContent />

      {showAdvanced && (
        <Suspense fallback={<div>加载高级功能...</div>}>
          <AdvancedFeatures />
        </Suspense>
      )}
    </div>
  );
}

// 3. 路由级别的Suspense
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function AppRouter() {
  return (
    <Router>
      <Suspense fallback={<RouteLoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
```

**🔥 数据获取与Suspense（React 18+）**:

```javascript
// 注意：这是实验性功能，展示概念
// 实际开发中建议使用React Query等成熟方案

// 创建可挂起的资源
function createResource(promise) {
  let status = 'pending';
  let result;

  let suspender = promise.then(
    (response) => {
      status = 'success';
      result = response;
    },
    (error) => {
      status = 'error';
      result = error;
    }
  );

  return {
    read() {
      if (status === 'pending') {
        throw suspender;  // 抛出Promise让Suspense捕获
      } else if (status === 'error') {
        throw result;     // 抛出错误让ErrorBoundary捕获
      } else if (status === 'success') {
        return result;    // 返回数据
      }
    }
  };
}

// 数据获取Hook
function useUserData(userId) {
  const [resource] = useState(() =>
    createResource(fetch(`/api/users/${userId}`).then(r => r.json()))
  );

  return resource.read();
}

// 使用数据获取的组件
function UserProfile({ userId }) {
  const user = useUserData(userId);  // 可能会suspend

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// 使用Suspense包裹
function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile userId="123" />
      </Suspense>
    </ErrorBoundary>
  );
}
```

**🚀 实用的Suspense模式**:

```javascript
// 1. 带超时的Suspense
function SuspenseWithTimeout({
  children,
  fallback,
  timeout = 5000,
  timeoutFallback = <div>加载超时，请重试</div>
}) {
  const [isTimeout, setIsTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (isTimeout) {
    return timeoutFallback;
  }

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// 2. 渐进式加载
function ProgressiveLoading() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep(prev => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* 第一步：基础内容 */}
      <BasicContent />

      {/* 第二步：增强功能 */}
      {step >= 2 && (
        <Suspense fallback={<div>加载增强功能...</div>}>
          <EnhancedFeatures />
        </Suspense>
      )}

      {/* 第三步：高级功能 */}
      {step >= 3 && (
        <Suspense fallback={<div>加载高级功能...</div>}>
          <AdvancedFeatures />
        </Suspense>
      )}
    </div>
  );
}

// 3. 智能预加载
function SmartPreloading() {
  const [shouldPreload, setShouldPreload] = useState(false);

  // 用户交互时预加载
  const handleUserInteraction = () => {
    setShouldPreload(true);
  };

  return (
    <div>
      <button
        onClick={handleUserInteraction}
        onMouseEnter={() => setShouldPreload(true)}  // 悬停预加载
      >
        打开高级功能
      </button>

      {shouldPreload && (
        <div style={{ display: 'none' }}>
          <Suspense fallback={null}>
            <AdvancedFeatures />  {/* 后台预加载 */}
          </Suspense>
        </div>
      )}
    </div>
  );
}

// 4. 骨架屏组件
function LoadingSkeleton({ type = 'default' }) {
  const skeletons = {
    card: (
      <div className="skeleton-card">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text-lines">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-subtitle"></div>
        </div>
      </div>
    ),

    list: (
      <div className="skeleton-list">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="skeleton-list-item">
            <div className="skeleton-line"></div>
          </div>
        ))}
      </div>
    ),

    default: (
      <div className="skeleton-default">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    )
  };

  return skeletons[type] || skeletons.default;
}
```

**🎯 实际项目中的Suspense策略**:

```javascript
// 1. 基于路由的代码分割
const routes = [
  {
    path: '/',
    component: lazy(() => import('./pages/Home')),
    fallback: <LoadingSkeleton type="page" />
  },
  {
    path: '/users',
    component: lazy(() => import('./pages/Users')),
    fallback: <LoadingSkeleton type="list" />
  },
  {
    path: '/profile',
    component: lazy(() => import('./pages/Profile')),
    fallback: <LoadingSkeleton type="card" />
  }
];

function AppRouter() {
  return (
    <Router>
      <Routes>
        {routes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <Suspense fallback={route.fallback}>
                <route.component />
              </Suspense>
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

// 2. 功能模块的懒加载
function FeatureToggle({ feature, children }) {
  const isEnabled = useFeatureFlag(feature);

  if (!isEnabled) return null;

  return (
    <Suspense fallback={<div>加载功能模块...</div>}>
      {children}
    </Suspense>
  );
}

// 使用功能开关
function Dashboard() {
  return (
    <div>
      <h1>仪表板</h1>

      <FeatureToggle feature="analytics">
        <AnalyticsModule />
      </FeatureToggle>

      <FeatureToggle feature="reporting">
        <ReportingModule />
      </FeatureToggle>
    </div>
  );
}

// 3. 性能监控
function SuspenseWithMetrics({ name, children, fallback }) {
  const startTime = useRef();

  const trackLoadStart = () => {
    startTime.current = performance.now();
    analytics.track('component_load_start', { component: name });
  };

  const trackLoadEnd = () => {
    const duration = performance.now() - startTime.current;
    analytics.track('component_load_end', {
      component: name,
      duration
    });
  };

  return (
    <Suspense
      fallback={
        <div>
          {trackLoadStart()}
          {fallback}
        </div>
      }
    >
      <div>
        {trackLoadEnd()}
        {children}
      </div>
    </Suspense>
  );
}
```

**📋 Suspense最佳实践总结**:

1. **合理的加载粒度**: 不要过度分割，避免加载闪烁
2. **优质的骨架屏**: 提供与实际内容结构相似的占位符
3. **错误边界配合**: 处理加载失败的情况
4. **预加载策略**: 在用户可能需要时提前加载
5. **性能监控**: 跟踪加载时间和用户体验
6. **渐进式增强**: 先展示基础功能，再加载高级功能

Suspense为React应用提供了强大的异步加载能力，是现代React应用性能优化的重要工具。

---

## 2. Hooks深度解析

### 🔥 2.1 useState深度解析

**🤔 面试问题**: useState的工作原理是什么？有哪些使用技巧？

**💡 useState基础和进阶用法**:

```javascript
// 1. 基础用法
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

// 2. 函数式更新 - 避免闭包陷阱
function CounterWithCallback() {
  const [count, setCount] = useState(0);

  const handleMultipleUpdates = () => {
    // ❌ 错误：基于当前值的多次更新
    setCount(count + 1);
    setCount(count + 1);  // 仍然是基于初始count值
    setCount(count + 1);  // 最终只增加1

    // ✅ 正确：使用函数式更新
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);  // 最终增加3
  };

  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={handleMultipleUpdates}>增加3</button>
    </div>
  );
}

// 3. 对象和数组状态的正确更新
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      language: 'zh'
    }
  });

  const [todos, setTodos] = useState([]);

  // 更新对象状态
  const updateUserName = (name) => {
    setUser(prev => ({
      ...prev,  // 保持其他属性
      name
    }));
  };

  // 更新嵌套对象
  const updateTheme = (theme) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme
      }
    }));
  };

  // 数组操作
  const addTodo = (text) => {
    setTodos(prev => [
      ...prev,
      { id: Date.now(), text, completed: false }
    ]);
  };

  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const removeTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  return (
    <div>
      <input
        value={user.name}
        onChange={(e) => updateUserName(e.target.value)}
        placeholder="姓名"
      />

      <select
        value={user.preferences.theme}
        onChange={(e) => updateTheme(e.target.value)}
      >
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>

      {/* Todo列表 */}
      {todos.map(todo => (
        <div key={todo.id}>
          <span
            style={{
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
            onClick={() => toggleTodo(todo.id)}
          >
            {todo.text}
          </span>
          <button onClick={() => removeTodo(todo.id)}>删除</button>
        </div>
      ))}
    </div>
  );
}

// 4. 延迟初始化 - 优化性能
function ExpensiveComponent() {
  // ❌ 每次渲染都会执行昂贵的计算
  const [data, setData] = useState(expensiveCalculation());

  // ✅ 只在初始化时执行一次
  const [data, setData] = useState(() => expensiveCalculation());

  // 延迟初始化的实际应用
  const [config, setConfig] = useState(() => {
    // 从localStorage读取配置（只在初始化时执行）
    const saved = localStorage.getItem('userConfig');
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  return <div>{/* 组件内容 */}</div>;
}

// 5. 状态批处理（React 18自动批处理）
function BatchingExample() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  const handleClick = () => {
    // React 18中，这些更新会自动批处理
    setCount(c => c + 1);
    setFlag(f => !f);

    // 强制同步更新（不推荐）
    flushSync(() => {
      setCount(c => c + 1);
    });
  };

  console.log('重新渲染'); // React 18中只打印一次

  return (
    <div>
      <p>Count: {count}, Flag: {flag.toString()}</p>
      <button onClick={handleClick}>更新状态</button>
    </div>
  );
}
```

**🎯 useState高级模式**:

```javascript
// 1. 状态管理Hook封装
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, { toggle, setTrue, setFalse }];
}

// 使用自定义Hook
function ToggleExample() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle();

  return (
    <div>
      <p>状态: {isOpen ? '开' : '关'}</p>
      <button onClick={toggle}>切换</button>
      <button onClick={setTrue}>打开</button>
      <button onClick={setFalse}>关闭</button>
    </div>
  );
}

// 2. 复杂状态的useReducer替代方案
function useComplexState(initialState) {
  const [state, setState] = useState(initialState);

  const actions = useMemo(() => ({
    updateField: (field, value) => {
      setState(prev => ({ ...prev, [field]: value }));
    },

    updateNestedField: (path, value) => {
      setState(prev => {
        const newState = { ...prev };
        let current = newState;
        const keys = path.split('.');

        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return newState;
      });
    },

    reset: () => setState(initialState),

    merge: (updates) => {
      setState(prev => ({ ...prev, ...updates }));
    }
  }), [initialState]);

  return [state, actions];
}

// 3. 状态同步到localStorage
function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }, [key, state]);

  return [state, setValue];
}

// 使用localStorage同步的状态
function SettingsPanel() {
  const [settings, setSettings] = useLocalStorageState('userSettings', {
    theme: 'light',
    language: 'zh',
    notifications: true
  });

  return (
    <div>
      <select
        value={settings.theme}
        onChange={(e) => setSettings(prev => ({
          ...prev,
          theme: e.target.value
        }))}
      >
        <option value="light">浅色</option>
        <option value="dark">深色</option>
      </select>
    </div>
  );
}
```

---

### 🔥 2.2 useEffect全面掌握

**🤔 面试问题**: useEffect的执行时机是什么？依赖数组有什么作用？

**💡 useEffect的基础和高级用法**:

```javascript
// 1. 基础用法和执行时机
function EffectBasics() {
  const [count, setCount] = useState(0);

  // 无依赖 - 每次渲染后执行
  useEffect(() => {
    console.log('每次渲染后执行');
  });

  // 空依赖数组 - 只在挂载时执行
  useEffect(() => {
    console.log('只在挂载时执行');
  }, []);

  // 有依赖 - 依赖变化时执行
  useEffect(() => {
    console.log('count变化时执行:', count);
  }, [count]);

  // 带清理函数 - 重要！
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);

    // 清理函数：在组件卸载或依赖变化前执行
    return () => {
      clearInterval(timer);
    };
  }, []); // 空依赖确保定时器只创建一次

  return <div>Count: {count}</div>;
}

// 2. 数据获取的最佳实践
function DataFetching({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 使用AbortController处理竞态条件
    const abortController = new AbortController();

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/users/${userId}`, {
          signal: abortController.signal  // 支持取消请求
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const userData = await response.json();

        // 检查请求是否被取消
        if (!abortController.signal.aborted) {
          setUser(userData);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // 清理函数：取消未完成的请求
    return () => {
      abortController.abort();
    };
  }, [userId]); // userId变化时重新获取

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!user) return <div>用户不存在</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// 3. 事件监听和DOM操作
function WindowSizeTracker() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // 添加事件监听
    window.addEventListener('resize', handleResize);

    // 清理事件监听
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空依赖，只设置一次

  return (
    <div>
      窗口尺寸: {windowSize.width} x {windowSize.height}
    </div>
  );
}

// 4. 复杂依赖的处理
function ComplexDependencies({ searchTerm, filters, sortBy }) {
  const [results, setResults] = useState([]);

  // 使用useCallback避免不必要的effect执行
  const searchConfig = useMemo(() => ({
    term: searchTerm,
    filters,
    sort: sortBy
  }), [searchTerm, filters, sortBy]);

  useEffect(() => {
    const search = async () => {
      const results = await searchAPI(searchConfig);
      setResults(results);
    };

    search();
  }, [searchConfig]); // 依赖优化后的配置对象

  return (
    <div>
      {results.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}

// 5. 条件性Effect
function ConditionalEffect({ shouldFetch, url }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!shouldFetch || !url) return;

    const fetchData = async () => {
      const response = await fetch(url);
      const result = await response.json();
      setData(result);
    };

    fetchData();
  }, [shouldFetch, url]);

  return <div>{data ? JSON.stringify(data) : '暂无数据'}</div>;
}
```

**🎯 useEffect的高级模式**:

```javascript
// 1. 自定义数据获取Hook
function useAsyncData(url, dependencies = []) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!url) return;

    const abortController = new AbortController();

    const fetchData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(url, {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!abortController.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setState(prev => ({ ...prev, loading: false, error: error.message }));
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, [url, ...dependencies]);

  const refetch = useCallback(() => {
    if (url) {
      setState(prev => ({ ...prev, loading: true }));
    }
  }, [url]);

  return { ...state, refetch };
}

// 2. useEffect的调试Hook
function useWhyDidYouUpdate(name, props) {
  const previous = useRef();

  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps = {};

      allKeys.forEach(key => {
        if (previous.current[key] !== props[key]) {
          changedProps[key] = {
            from: previous.current[key],
            to: props[key]
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }

    previous.current = props;
  });
}

// 使用调试Hook
function MyComponent(props) {
  useWhyDidYouUpdate('MyComponent', props);

  return <div>{/* 组件内容 */}</div>;
}

// 3. 生命周期模拟Hook
function useLifecycle({
  onMount,
  onUnmount,
  onUpdate
}) {
  const mountedRef = useRef(false);

  // componentDidMount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      onMount?.();
    }
  }, [onMount]);

  // componentWillUnmount
  useEffect(() => {
    return () => {
      onUnmount?.();
    };
  }, [onUnmount]);

  // componentDidUpdate
  useEffect(() => {
    if (mountedRef.current) {
      onUpdate?.();
    }
  });
}

// 4. 防抖Effect Hook
function useDebouncedEffect(callback, delay, deps) {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
}

// 使用防抖Effect
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // 防抖搜索：用户停止输入500ms后才搜索
  useDebouncedEffect(() => {
    if (searchTerm) {
      searchAPI(searchTerm).then(setResults);
    }
  }, 500, [searchTerm]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="搜索..."
      />
      {/* 显示搜索结果 */}
    </div>
  );
}

// 5. Effect依赖优化
function useStableCallback(callback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
}

// 避免Effect过度执行
function OptimizedComponent({ onDataChange }) {
  const [data, setData] = useState([]);

  // 稳定的回调引用
  const stableOnDataChange = useStableCallback(onDataChange);

  useEffect(() => {
    // 这个effect不会因为onDataChange的变化而重新执行
    stableOnDataChange(data);
  }, [data, stableOnDataChange]);

  return <div>{/* 组件内容 */}</div>;
}
```

**⚠️ useEffect常见陷阱**:

```javascript
// 1. 无限循环陷阱
function InfiniteLoopTrap() {
  const [user, setUser] = useState(null);

  // ❌ 错误：缺少依赖数组，导致无限循环
  useEffect(() => {
    fetchUser().then(setUser);
  }); // 缺少依赖数组

  // ❌ 错误：依赖中包含会变化的对象
  useEffect(() => {
    fetchUser().then(setUser);
  }, [user]); // user变化会导致重新获取，形成循环

  // ✅ 正确：合适的依赖
  useEffect(() => {
    fetchUser().then(setUser);
  }, []); // 只在挂载时获取
}

// 2. 闭包陷阱
function ClosureTrap() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // ❌ 错误：闭包捕获了初始的count值（0）
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // 空依赖导致count永远是0

  // ✅ 解决方案1：使用函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);  // 使用前一个值
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ 解决方案2：添加依赖（会重新创建定时器）
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  return <div>Count: {count}</div>;
}

// 3. 异步清理陷阱
function AsyncCleanupTrap() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();

        // ❌ 错误：没有检查组件是否已卸载
        setData(result);

        // ✅ 正确：检查取消标志
        if (!cancelled) {
          setData(result);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;  // 设置取消标志
    };
  }, []);

  return <div>{data ? JSON.stringify(data) : '加载中...'}</div>;
}
```

---

### 🔥 2.3 useContext深度应用

**🤔 面试问题**: useContext和Context API配合使用有什么最佳实践？

**💡 useContext高级应用模式**:

```javascript
// 1. 类型安全的Context Hook
function createSafeContext(displayName) {
  const Context = createContext(null);
  Context.displayName = displayName;

  function useContext() {
    const context = React.useContext(Context);
    if (context === null) {
      throw new Error(
        `use${displayName} must be used within a ${displayName}Provider`
      );
    }
    return context;
  }

  return [Context.Provider, useContext, Context];
}

// 使用安全Context
const [AuthProvider, useAuth] = createSafeContext('Auth');

function AuthProviderComponent({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const user = await authAPI.login(credentials);
      setUser(user);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    authAPI.logout();
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout
  }), [user, loading, login, logout]);

  return <AuthProvider value={value}>{children}</AuthProvider>;
}

// 2. 选择性订阅模式
function createSelectiveContext(defaultValue) {
  const Context = createContext(defaultValue);

  // 创建选择器Hook
  function useSelector(selector = (state) => state) {
    const context = useContext(Context);
    const selectedValue = useMemo(() => selector(context), [context, selector]);

    return selectedValue;
  }

  return [Context.Provider, useSelector, Context];
}

// 应用状态管理
const [AppStateProvider, useAppState] = createSelectiveContext({
  user: null,
  theme: 'light',
  language: 'zh',
  notifications: []
});

function UserInfo() {
  // 只订阅用户信息，其他状态变化不会触发重渲染
  const user = useAppState(state => state.user);

  return <div>{user?.name}</div>;
}

function ThemeToggle() {
  // 只订阅主题信息
  const theme = useAppState(state => state.theme);

  return <div>当前主题: {theme}</div>;
}

// 3. 组合多个Context
function MultiContextProvider({ children }) {
  return (
    <AuthProviderComponent>
      <ThemeProvider>
        <LanguageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProviderComponent>
  );
}

// 组合Context Hook
function useAppContext() {
  const auth = useAuth();
  const theme = useTheme();
  const language = useLanguage();
  const notifications = useNotifications();

  return {
    auth,
    theme,
    language,
    notifications
  };
}

// 4. 带缓存的Context
function createCachedContext(defaultValue) {
  const Context = createContext(defaultValue);
  const cache = new Map();

  function CachedProvider({ children, value }) {
    const cacheKey = JSON.stringify(value);

    // 缓存value以避免不必要的重渲染
    const cachedValue = useMemo(() => {
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      cache.set(cacheKey, value);
      return value;
    }, [cacheKey, value]);

    return (
      <Context.Provider value={cachedValue}>
        {children}
      </Context.Provider>
    );
  }

  function useContext() {
    return React.useContext(Context);
  }

  return [CachedProvider, useContext];
}

// 5. 动态Context注入
function createDynamicContext() {
  const contexts = new Map();

  function getContext(key) {
    if (!contexts.has(key)) {
      contexts.set(key, createContext());
    }
    return contexts.get(key);
  }

  function DynamicProvider({ contextKey, value, children }) {
    const Context = getContext(contextKey);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useDynamicContext(key) {
    const Context = getContext(key);
    return React.useContext(Context);
  }

  return [DynamicProvider, useDynamicContext];
}
```

**🎯 Context性能优化策略**:

```javascript
// 1. 分离读写Context
const StateContext = createContext();
const DispatchContext = createContext();

function StateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useAppState() {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppState must be used within StateProvider');
  }
  return context;
}

function useAppDispatch() {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within StateProvider');
  }
  return context;
}

// 2. Context值的memo化
function OptimizedProvider({ children }) {
  const [state, setState] = useState(initialState);

  // memo化actions
  const actions = useMemo(() => ({
    updateUser: (user) => setState(prev => ({ ...prev, user })),
    updateTheme: (theme) => setState(prev => ({ ...prev, theme })),
    reset: () => setState(initialState)
  }), []);

  // memo化整个context值
  const contextValue = useMemo(() => ({
    state,
    actions
  }), [state, actions]);

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}

// 3. 防止Context Provider地狱
function createProviderComposer(...providers) {
  return function ProviderComposer({ children }) {
    return providers.reduceRight((acc, Provider) => {
      return <Provider>{acc}</Provider>;
    }, children);
  };
}

// 使用Provider组合器
const AppProviders = createProviderComposer(
  AuthProvider,
  ThemeProvider,
  LanguageProvider,
  NotificationProvider
);

function App() {
  return (
    <AppProviders>
      <Router>
        <Routes>
          {/* 路由配置 */}
        </Routes>
      </Router>
    </AppProviders>
  );
}

// 4. Context调试工具
function useContextDebugger(contextName, contextValue) {
  const renderCount = useRef(0);
  const previousValue = useRef(contextValue);

  useEffect(() => {
    renderCount.current += 1;

    if (previousValue.current !== contextValue) {
      console.log(`${contextName} context changed:`, {
        renderCount: renderCount.current,
        previousValue: previousValue.current,
        currentValue: contextValue
      });

      previousValue.current = contextValue;
    }
  });
}

function DebuggableProvider({ children }) {
  const [state, setState] = useState(initialState);

  // 调试Context变化
  useContextDebugger('AppState', state);

  return (
    <MyContext.Provider value={state}>
      {children}
    </MyContext.Provider>
  );
}
```

---

### 🔥 2.4 useReducer状态管理

**🤔 面试问题**: useReducer相比useState有什么优势？什么时候使用useReducer？

**💡 useReducer基础和进阶用法**:

```javascript
// 1. 基础useReducer用法
const initialState = {
  count: 0,
  step: 1
};

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step };

    case 'decrement':
      return { ...state, count: state.count - state.step };

    case 'setStep':
      return { ...state, step: action.payload };

    case 'reset':
      return initialState;

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Step: {state.step}</p>

      <button onClick={() => dispatch({ type: 'increment' })}>
        +{state.step}
      </button>

      <button onClick={() => dispatch({ type: 'decrement' })}>
        -{state.step}
      </button>

      <input
        type="number"
        value={state.step}
        onChange={(e) => dispatch({
          type: 'setStep',
          payload: parseInt(e.target.value) || 1
        })}
      />

      <button onClick={() => dispatch({ type: 'reset' })}>
        重置
      </button>
    </div>
  );
}

// 2. 复杂状态管理 - Todo应用
const todoInitialState = {
  todos: [],
  filter: 'all', // 'all' | 'active' | 'completed'
  nextId: 1
};

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: state.nextId,
            text: action.payload.text,
            completed: false,
            createdAt: new Date().toISOString()
          }
        ],
        nextId: state.nextId + 1
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

    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload.id)
      };

    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, text: action.payload.text }
            : todo
        )
      };

    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload.filter
      };

    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    case 'LOAD_TODOS':
      return {
        ...state,
        todos: action.payload.todos
      };

    default:
      return state;
  }
}

// 3. Action Creators - 更好的可维护性
const todoActions = {
  addTodo: (text) => ({
    type: 'ADD_TODO',
    payload: { text }
  }),

  toggleTodo: (id) => ({
    type: 'TOGGLE_TODO',
    payload: { id }
  }),

  deleteTodo: (id) => ({
    type: 'DELETE_TODO',
    payload: { id }
  }),

  editTodo: (id, text) => ({
    type: 'EDIT_TODO',
    payload: { id, text }
  }),

  setFilter: (filter) => ({
    type: 'SET_FILTER',
    payload: { filter }
  }),

  clearCompleted: () => ({
    type: 'CLEAR_COMPLETED'
  }),

  loadTodos: (todos) => ({
    type: 'LOAD_TODOS',
    payload: { todos }
  })
};

// 4. 带中间件的useReducer
function useReducerWithMiddleware(reducer, initialState, middleware = []) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = useCallback((action) => {
    // 执行中间件
    const chain = middleware.map(middleware => middleware(state));
    const composedDispatch = chain.reduce((dispatch, middleware) =>
      middleware(dispatch), dispatch
    );

    composedDispatch(action);
  }, [state, middleware]);

  return [state, enhancedDispatch];
}

// 日志中间件
const loggerMiddleware = (state) => (next) => (action) => {
  console.group(`Action: ${action.type}`);
  console.log('Previous State:', state);
  console.log('Action:', action);
  const result = next(action);
  console.log('Next State:', result);
  console.groupEnd();
  return result;
};

// 异步中间件
const thunkMiddleware = (state) => (next) => (action) => {
  if (typeof action === 'function') {
    return action(next, () => state);
  }
  return next(action);
};

// 5. 自定义useReducer Hook
function useAsyncReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const asyncDispatch = useCallback(async (action) => {
    if (typeof action === 'function') {
      // 异步action
      try {
        const result = await action(dispatch, () => state);
        return result;
      } catch (error) {
        dispatch({ type: 'ERROR', payload: { error: error.message } });
      }
    } else {
      // 同步action
      dispatch(action);
    }
  }, [state]);

  return [state, asyncDispatch];
}

// 异步actions
const asyncTodoActions = {
  loadTodosAsync: async (dispatch) => {
    dispatch({ type: 'SET_LOADING', payload: { loading: true } });

    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      dispatch(todoActions.loadTodos(todos));
    } catch (error) {
      dispatch({ type: 'ERROR', payload: { error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { loading: false } });
    }
  },

  saveTodoAsync: (todo) => async (dispatch) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });

      const savedTodo = await response.json();
      dispatch(todoActions.addTodo(savedTodo.text));
    } catch (error) {
      dispatch({ type: 'ERROR', payload: { error: error.message } });
    }
  }
};
```

**🎯 useReducer高级模式**:

```javascript
// 1. 状态机模式
const machineStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const machineInitialState = {
  status: machineStates.IDLE,
  data: null,
  error: null
};

function machineReducer(state, action) {
  switch (state.status) {
    case machineStates.IDLE:
      switch (action.type) {
        case 'FETCH_START':
          return { ...state, status: machineStates.LOADING };
        default:
          return state;
      }

    case machineStates.LOADING:
      switch (action.type) {
        case 'FETCH_SUCCESS':
          return {
            status: machineStates.SUCCESS,
            data: action.payload.data,
            error: null
          };
        case 'FETCH_ERROR':
          return {
            status: machineStates.ERROR,
            data: null,
            error: action.payload.error
          };
        default:
          return state;
      }

    case machineStates.SUCCESS:
    case machineStates.ERROR:
      switch (action.type) {
        case 'RESET':
          return machineInitialState;
        case 'FETCH_START':
          return { ...state, status: machineStates.LOADING };
        default:
          return state;
      }

    default:
      return state;
  }
}

// 2. 组合reducer
function combineReducers(reducers) {
  return function combinedReducer(state, action) {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

// 使用组合reducer
const rootReducer = combineReducers({
  todos: todoReducer,
  user: userReducer,
  ui: uiReducer
});

function App() {
  const [state, dispatch] = useReducer(rootReducer, {
    todos: todoInitialState,
    user: userInitialState,
    ui: uiInitialState
  });

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <TodoApp />
    </AppContext.Provider>
  );
}

// 3. 撤销/重做功能
function useUndoReducer(reducer, initialState) {
  const undoInitialState = {
    past: [],
    present: initialState,
    future: []
  };

  const undoReducer = (state, action) => {
    const { past, present, future } = state;

    switch (action.type) {
      case 'UNDO':
        if (past.length === 0) return state;

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        };

      case 'REDO':
        if (future.length === 0) return state;

        const next = future[0];
        const newFuture = future.slice(1);

        return {
          past: [...past, present],
          present: next,
          future: newFuture
        };

      case 'CLEAR_HISTORY':
        return {
          past: [],
          present: present,
          future: []
        };

      default:
        const newPresent = reducer(present, action);

        if (present === newPresent) return state;

        return {
          past: [...past, present],
          present: newPresent,
          future: []
        };
    }
  };

  const [state, dispatch] = useReducer(undoReducer, undoInitialState);

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
  const clearHistory = useCallback(() => dispatch({ type: 'CLEAR_HISTORY' }), []);

  return {
    state: state.present,
    dispatch,
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory
  };
}

// 4. 持久化reducer
function usePersistentReducer(reducer, initialState, storageKey) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state, storageKey]);

  return [state, dispatch];
}
```

**📊 useReducer vs useState 对比**:

| 场景 | useState | useReducer |
|------|---------|------------|
| **简单状态** | ✅ 更简洁 | ❌ 过度设计 |
| **复杂状态** | ❌ 难以管理 | ✅ 更清晰 |
| **状态逻辑复杂** | ❌ 逻辑分散 | ✅ 集中管理 |
| **测试** | ❌ 难以测试 | ✅ 易于测试 |
| **类型安全** | ❌ 类型推导困难 | ✅ 更好的类型支持 |
| **性能** | ✅ 较好 | ✅ 较好 |
| **调试** | ❌ 难以追踪 | ✅ 易于追踪 |

**使用建议**:
- **简单状态**：布尔值、字符串、数字 → 使用 `useState`
- **复杂状态**：对象、数组、多个相关状态 → 使用 `useReducer`
- **状态转换复杂**：多种操作、状态机 → 使用 `useReducer`

---

### 🔥 2.5 useMemo和useCallback优化

**🤔 面试问题**: useMemo和useCallback的区别是什么？什么时候使用它们？

**💡 useMemo和useCallback基础用法**:

```javascript
// 1. useMemo - 缓存计算结果
function ExpensiveComponent({ items, multiplier }) {
  // ❌ 每次渲染都会重新计算
  const expensiveValue = items.reduce((sum, item) => sum + item.value * multiplier, 0);

  // ✅ 只在依赖变化时重新计算
  const expensiveValue = useMemo(() => {
    console.log('重新计算expensive value');
    return items.reduce((sum, item) => sum + item.value * multiplier, 0);
  }, [items, multiplier]);

  return <div>总值: {expensiveValue}</div>;
}

// 2. useCallback - 缓存函数引用
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  // ❌ 每次渲染都创建新函数，子组件会重新渲染
  const handleClick = () => {
    setCount(count + 1);
  };

  // ✅ 缓存函数引用
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []); // 空依赖，函数引用永远不变

  const handleNameChange = useCallback((newName) => {
    setName(newName);
  }, []);

  return (
    <div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ChildComponent onClick={handleClick} />
    </div>
  );
}

// memo化的子组件
const ChildComponent = memo(({ onClick }) => {
  console.log('ChildComponent rendered');
  return <button onClick={onClick}>点击</button>;
});

// 3. 复杂的useMemo应用
function DataVisualization({ rawData, filters, sortConfig }) {
  // 过滤数据
  const filteredData = useMemo(() => {
    return rawData.filter(item => {
      return filters.every(filter => filter.apply(item));
    });
  }, [rawData, filters]);

  // 排序数据
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // 统计信息
  const statistics = useMemo(() => {
    return {
      total: sortedData.length,
      sum: sortedData.reduce((sum, item) => sum + item.value, 0),
      average: sortedData.length > 0
        ? sortedData.reduce((sum, item) => sum + item.value, 0) / sortedData.length
        : 0,
      max: Math.max(...sortedData.map(item => item.value)),
      min: Math.min(...sortedData.map(item => item.value))
    };
  }, [sortedData]);

  return (
    <div>
      <DataChart data={sortedData} />
      <Statistics stats={statistics} />
    </div>
  );
}

// 4. useCallback的复杂场景
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (!term.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await searchAPI(term);
        setResults(response.data);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [] // 空依赖，防抖函数引用永不变化
  );

  // 搜索处理函数
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
  }, []);

  return (
    <div>
      <SearchInput
        value={searchTerm}
        onChange={handleSearch}
        onClear={clearSearch}
      />
      <SearchResults results={results} loading={loading} />
    </div>
  );
}
```

**🎯 性能优化的高级模式**:

```javascript
// 1. 选择性memo化
function useSelectiveMemo(fn, deps, compareFn) {
  const ref = useRef();

  if (!ref.current || !compareFn(ref.current.deps, deps)) {
    ref.current = {
      value: fn(),
      deps
    };
  }

  return ref.current.value;
}

// 深度比较的memo
function useDeepMemo(fn, deps) {
  return useSelectiveMemo(fn, deps, (prevDeps, nextDeps) => {
    return deepEqual(prevDeps, nextDeps);
  });
}

// 使用深度memo
function ComplexComponent({ complexObject }) {
  const processedData = useDeepMemo(() => {
    return expensiveProcessing(complexObject);
  }, [complexObject]);

  return <div>{/* 使用processedData */}</div>;
}

// 2. 条件性memo化
function useConditionalMemo(fn, deps, condition) {
  const memoizedValue = useMemo(fn, deps);
  const fallbackValue = useMemo(fn, []);

  return condition ? memoizedValue : fallbackValue;
}

// 3. 自动依赖检测
function useAutoMemo(fn) {
  const dependencies = useRef([]);
  const lastResult = useRef();

  // 自动收集依赖（简化版本）
  const result = useMemo(() => {
    const currentDeps = getCurrentDependencies(); // 假设有这个函数
    const depsChanged = !shallowEqual(dependencies.current, currentDeps);

    if (depsChanged || !lastResult.current) {
      lastResult.current = fn();
      dependencies.current = currentDeps;
    }

    return lastResult.current;
  }, [fn]);

  return result;
}

// 4. 带超时的memo
function useTimedMemo(fn, deps, timeout = 5000) {
  const timeoutRef = useRef();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, timeout);

    return () => clearTimeout(timeoutRef.current);
  }, deps);

  return useMemo(fn, [...deps, forceUpdate]);
}

// 5. 批量callback优化
function useBatchedCallbacks(callbacks) {
  return useMemo(() => {
    const batchedCallbacks = {};

    Object.keys(callbacks).forEach(key => {
      batchedCallbacks[key] = useCallback(callbacks[key], []);
    });

    return batchedCallbacks;
  }, [callbacks]);
}

// 使用批量callbacks
function FormComponent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const callbacks = useBatchedCallbacks({
    updateName: (name) => setFormData(prev => ({ ...prev, name })),
    updateEmail: (email) => setFormData(prev => ({ ...prev, email })),
    updatePhone: (phone) => setFormData(prev => ({ ...prev, phone })),
    reset: () => setFormData({ name: '', email: '', phone: '' })
  });

  return (
    <form>
      <input onChange={(e) => callbacks.updateName(e.target.value)} />
      <input onChange={(e) => callbacks.updateEmail(e.target.value)} />
      <input onChange={(e) => callbacks.updatePhone(e.target.value)} />
      <button type="button" onClick={callbacks.reset}>重置</button>
    </form>
  );
}
```

**⚠️ 常见陷阱和误区**:

```javascript
// 1. 过度使用memo化
function OverOptimized() {
  // ❌ 对简单计算过度memo化
  const simpleValue = useMemo(() => {
    return a + b; // 简单计算，memo化反而增加开销
  }, [a, b]);

  // ❌ 对每次都变化的值memo化
  const randomValue = useMemo(() => {
    return Math.random(); // 每次都变化，memo化无意义
  }, []);

  // ❌ 内联对象作为依赖
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(config);
  }, [{ option: 'value' }]); // 每次都是新对象

  // ✅ 正确的依赖
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(config);
  }, [config.option]); // 使用具体的值
}

// 2. useCallback的依赖陷阱
function CallbackTrap() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // ❌ 错误：遗漏依赖
  const handleClick = useCallback(() => {
    setCount(count + 1); // count没有在依赖中
  }, []); // ESLint会警告

  // ✅ 解决方案1：添加依赖
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  // ✅ 解决方案2：使用函数式更新
  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  // ❌ 错误：依赖中包含对象/数组
  const handleAddItem = useCallback(() => {
    setItems([...items, newItem]);
  }, [items]); // items变化会重新创建函数

  // ✅ 正确：使用函数式更新
  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, newItem]);
  }, []);
}

// 3. memo组件的比较函数陷阱
const ProblematicComponent = memo(({ data, config }) => {
  return <div>{/* 组件内容 */}</div>;
}, (prevProps, nextProps) => {
  // ❌ 错误：浅比较对象
  return prevProps.data === nextProps.data &&
         prevProps.config === nextProps.config;
});

// ✅ 正确：深度比较或比较特定属性
const OptimizedComponent = memo(({ data, config }) => {
  return <div>{/* 组件内容 */}</div>;
}, (prevProps, nextProps) => {
  return prevProps.data.id === nextProps.data.id &&
         prevProps.config.version === nextProps.config.version;
});

// 4. 条件性hooks使用错误
function ConditionalHooksMistake({ shouldOptimize }) {
  // ❌ 错误：条件性使用hooks
  const expensiveValue = shouldOptimize
    ? useMemo(() => expensiveCalculation(), [])
    : expensiveCalculation();

  // ✅ 正确：始终使用hooks
  const expensiveValue = useMemo(() => {
    return shouldOptimize ? expensiveCalculation() : expensiveCalculation();
  }, [shouldOptimize]);
}
```

**📋 优化决策指南**:

```javascript
// 什么时候使用useMemo？
// 1. 计算成本高
// 2. 依赖变化频率低
// 3. 计算结果被多次使用

// 什么时候使用useCallback？
// 1. 函数传递给memo化的子组件
// 2. 函数作为其他hooks的依赖
// 3. 避免子组件不必要的重渲染

// 性能测量工具
function usePerformanceMeasure(name) {
  useEffect(() => {
    performance.mark(`${name}-start`);

    return () => {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    };
  });
}

// 渲染次数统计
function useRenderCount(componentName) {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} rendered ${renderCount.current} times`);
  });

  return renderCount.current;
}

// 使用性能监控
function MonitoredComponent() {
  usePerformanceMeasure('MonitoredComponent');
  const renderCount = useRenderCount('MonitoredComponent');

  return <div>Render count: {renderCount}</div>;
}
```

**记住**：过早优化是万恶之源。先让代码工作，再通过性能分析工具（React DevTools Profiler）确定真正的性能瓶颈，然后有针对性地使用 `useMemo` 和 `useCallback`。

### 🟡 2.6 useRef和useImperativeHandle

**🤔 面试问题**: useRef除了访问DOM，还有什么用途？useImperativeHandle在什么场景下使用？

**💡 useRef的多种用途**:

```javascript
// 1. DOM元素访问
function FocusInput() {
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={handleFocus}>聚焦输入框</button>
    </div>
  );
}

// 2. 保存可变值（不触发重渲染）
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = () => {
    if (intervalRef.current) return; // 防止重复启动

    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getElapsedTime = () => {
    return startTimeRef.current ? Date.now() - startTimeRef.current : 0;
  };

  useEffect(() => {
    // 组件卸载时清理
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>计数: {count}</p>
      <p>运行时间: {getElapsedTime()}ms</p>
      <button onClick={start}>开始</button>
      <button onClick={stop}>停止</button>
    </div>
  );
}

// 3. 缓存前一个值
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function CounterWithPrevious() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>当前值: {count}</p>
      <p>前一个值: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

// 4. 实例变量替代
function useInstanceVariable(initialValue) {
  const ref = useRef(initialValue);

  // 提供getter和setter
  const getValue = useCallback(() => ref.current, []);
  const setValue = useCallback((value) => {
    ref.current = value;
  }, []);

  return [getValue, setValue];
}

// 5. 避免闭包陷阱
function useLatest(value) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

function DebounceExample() {
  const [value, setValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const latestValue = useLatest(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      // 使用最新的值，避免闭包陷阱
      setDebouncedValue(latestValue.current);
    }, 500);

    return () => clearTimeout(timer);
  }, [value, latestValue]);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="输入内容..."
      />
      <p>防抖值: {debouncedValue}</p>
    </div>
  );
}
```

**🎯 useImperativeHandle深度应用**:

```javascript
// 1. 自定义组件API
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  const [value, setValue] = useState(props.defaultValue || '');
  const [isValid, setIsValid] = useState(true);

  useImperativeHandle(ref, () => ({
    // 暴露的方法
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => setValue(''),
    getValue: () => value,
    setValue: (newValue) => setValue(newValue),
    validate: () => {
      const valid = props.validator ? props.validator(value) : true;
      setIsValid(valid);
      return valid;
    },
    getElement: () => inputRef.current,
    isValid: () => isValid
  }), [value, isValid, props.validator]);

  return (
    <div>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{
          borderColor: isValid ? 'green' : 'red'
        }}
        {...props}
      />
      {!isValid && <span style={{ color: 'red' }}>输入无效</span>}
    </div>
  );
});

// 使用自定义输入框
function FormWithCustomInput() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = () => {
    const emailValid = emailRef.current.validate();
    const passwordValid = passwordRef.current.validate();

    if (emailValid && passwordValid) {
      console.log('Email:', emailRef.current.getValue());
      console.log('Password:', passwordRef.current.getValue());
    }
  };

  const clearForm = () => {
    emailRef.current.clear();
    passwordRef.current.clear();
  };

  return (
    <form>
      <CustomInput
        ref={emailRef}
        placeholder="邮箱"
        validator={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
      />

      <CustomInput
        ref={passwordRef}
        type="password"
        placeholder="密码"
        validator={(value) => value.length >= 6}
      />

      <button type="button" onClick={handleSubmit}>提交</button>
      <button type="button" onClick={clearForm}>清空</button>
    </form>
  );
}

// 2. 复杂组件的命令式API
const VideoPlayer = forwardRef(({ src, ...props }, ref) => {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useImperativeHandle(ref, () => ({
    play: async () => {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('播放失败:', error);
      }
    },

    pause: () => {
      videoRef.current.pause();
      setIsPlaying(false);
    },

    stop: () => {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    },

    seek: (time) => {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    },

    setVolume: (volume) => {
      videoRef.current.volume = Math.max(0, Math.min(1, volume));
    },

    getState: () => ({
      isPlaying,
      currentTime,
      duration,
      volume: videoRef.current?.volume || 0
    }),

    enterFullscreen: () => {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    },

    exitFullscreen: () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }), [isPlaying, currentTime, duration]);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      {...props}
    />
  );
});

// 3. 动画控制API
const AnimatedBox = forwardRef(({ children }, ref) => {
  const boxRef = useRef();
  const animationRef = useRef();

  useImperativeHandle(ref, () => ({
    fadeIn: (duration = 300) => {
      const element = boxRef.current;
      element.style.opacity = '0';

      animationRef.current = element.animate([
        { opacity: 0 },
        { opacity: 1 }
      ], {
        duration,
        fill: 'forwards'
      });

      return animationRef.current.finished;
    },

    fadeOut: (duration = 300) => {
      const element = boxRef.current;

      animationRef.current = element.animate([
        { opacity: 1 },
        { opacity: 0 }
      ], {
        duration,
        fill: 'forwards'
      });

      return animationRef.current.finished;
    },

    slideIn: (direction = 'left', duration = 300) => {
      const element = boxRef.current;
      const transforms = {
        left: ['translateX(-100%)', 'translateX(0)'],
        right: ['translateX(100%)', 'translateX(0)'],
        up: ['translateY(-100%)', 'translateY(0)'],
        down: ['translateY(100%)', 'translateY(0)']
      };

      animationRef.current = element.animate([
        { transform: transforms[direction][0] },
        { transform: transforms[direction][1] }
      ], {
        duration,
        fill: 'forwards'
      });

      return animationRef.current.finished;
    },

    bounce: (intensity = 10, duration = 500) => {
      const element = boxRef.current;

      animationRef.current = element.animate([
        { transform: 'translateY(0)' },
        { transform: `translateY(-${intensity}px)` },
        { transform: 'translateY(0)' }
      ], {
        duration,
        iterations: 3
      });

      return animationRef.current.finished;
    },

    stop: () => {
      if (animationRef.current) {
        animationRef.current.cancel();
      }
    }
  }), []);

  return (
    <div ref={boxRef}>
      {children}
    </div>
  );
});

// 4. 表单验证管理器
const FormManager = forwardRef(({ children, onSubmit }, ref) => {
  const fieldsRef = useRef(new Map());
  const [errors, setErrors] = useState({});

  useImperativeHandle(ref, () => ({
    registerField: (name, validator) => {
      fieldsRef.current.set(name, { validator });
    },

    unregisterField: (name) => {
      fieldsRef.current.delete(name);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    },

    validateField: (name, value) => {
      const field = fieldsRef.current.get(name);
      if (!field) return true;

      const error = field.validator(value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));

      return !error;
    },

    validateAll: (values) => {
      const newErrors = {};
      let isValid = true;

      fieldsRef.current.forEach((field, name) => {
        const error = field.validator(values[name]);
        if (error) {
          newErrors[name] = error;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },

    clearErrors: () => setErrors({}),

    getErrors: () => errors,

    submit: (values) => {
      if (this.validateAll(values)) {
        onSubmit?.(values);
        return true;
      }
      return false;
    }
  }), [errors, onSubmit]);

  return (
    <div>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          formManager: ref.current,
          errors
        })
      )}
    </div>
  );
});
```

**🔧 useRef高级模式**:

```javascript
// 1. 多元素引用管理
function useRefs() {
  const refs = useRef(new Map());

  const setRef = useCallback((key, element) => {
    if (element) {
      refs.current.set(key, element);
    } else {
      refs.current.delete(key);
    }
  }, []);

  const getRef = useCallback((key) => {
    return refs.current.get(key);
  }, []);

  const getAllRefs = useCallback(() => {
    return Array.from(refs.current.values());
  }, []);

  return { setRef, getRef, getAllRefs };
}

// 使用多元素引用
function Gallery({ images }) {
  const { setRef, getRef, getAllRefs } = useRefs();

  const focusImage = (index) => {
    const img = getRef(`image-${index}`);
    img?.scrollIntoView({ behavior: 'smooth' });
  };

  const preloadAllImages = () => {
    getAllRefs().forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  };

  return (
    <div>
      <button onClick={preloadAllImages}>预加载所有图片</button>

      {images.map((image, index) => (
        <div key={index}>
          <img
            ref={(el) => setRef(`image-${index}`, el)}
            src={image.src}
            alt={image.alt}
            onClick={() => focusImage(index)}
          />
        </div>
      ))}
    </div>
  );
}

// 2. 稳定的回调引用
function useStableCallback(callback) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, []);
}

// 3. 强制更新Hook
function useForceUpdate() {
  const updateRef = useRef(0);

  return useCallback(() => {
    updateRef.current += 1;
    // 触发重新渲染的技巧
    setValue(updateRef.current);
  }, []);
}

// 4. 渲染计数器
function useRenderCounter() {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  return renderCount.current;
}

// 5. 组件挂载状态
function useIsMounted() {
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

// 安全的异步操作
function AsyncComponent() {
  const [data, setData] = useState(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getData();

      // 只有在组件仍然挂载时才更新状态
      if (isMounted()) {
        setData(result);
      }
    };

    fetchData();
  }, [isMounted]);

  return <div>{data ? JSON.stringify(data) : '加载中...'}</div>;
}
```

**📋 useRef vs useState 比较**:

| 特性 | useRef | useState |
|------|--------|----------|
| **触发重渲染** | ❌ 否 | ✅ 是 |
| **保持引用** | ✅ 稳定 | ❌ 可能变化 |
| **访问DOM** | ✅ 直接 | ❌ 不适用 |
| **存储可变值** | ✅ 理想 | ❌ 会重渲染 |
| **同步更新** | ✅ 立即 | ❌ 异步 |
| **闭包问题** | ✅ 避免 | ❌ 可能有 |

---

### 🟡 2.7 useLayoutEffect详解

**🤔 面试问题**: useLayoutEffect和useEffect的区别是什么？什么时候使用useLayoutEffect？

**💡 useLayoutEffect vs useEffect**:

```javascript
// 执行时机对比
function TimingComparison() {
  const [count, setCount] = useState(0);

  // useEffect - 在DOM更新后异步执行
  useEffect(() => {
    console.log('useEffect执行，DOM已更新，页面已绘制');
  }, [count]);

  // useLayoutEffect - 在DOM更新后、浏览器绘制前同步执行
  useLayoutEffect(() => {
    console.log('useLayoutEffect执行，DOM已更新，但页面未绘制');
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

// 典型使用场景1：测量DOM尺寸
function ResponsiveComponent() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef();

  useLayoutEffect(() => {
    // 在浏览器绘制前测量尺寸，避免闪烁
    if (ref.current) {
      const { width, height } = ref.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []); // 只在挂载时测量

  return (
    <div ref={ref}>
      <p>宽度: {dimensions.width}px</p>
      <p>高度: {dimensions.height}px</p>
      <div style={{
        width: dimensions.width > 400 ? '100%' : '50%',
        background: 'lightblue'
      }}>
        响应式内容
      </div>
    </div>
  );
}

// 典型使用场景2：DOM操作防闪烁
function ScrollToTop() {
  const containerRef = useRef();

  useLayoutEffect(() => {
    // 在渲染完成但绘制前滚动，避免用户看到滚动过程
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  });

  return (
    <div ref={containerRef} style={{ height: 200, overflow: 'auto' }}>
      {Array.from({ length: 100 }, (_, i) => (
        <div key={i}>项目 {i + 1}</div>
      ))}
    </div>
  );
}

// 典型使用场景3：动态样式调整
function DynamicStyling({ items }) {
  const listRef = useRef();

  useLayoutEffect(() => {
    if (listRef.current) {
      const children = listRef.current.children;

      // 根据内容动态调整样式，防止样式跳动
      Array.from(children).forEach((child, index) => {
        const isEven = index % 2 === 0;
        child.style.backgroundColor = isEven ? '#f0f0f0' : '#ffffff';

        // 如果内容过长，调整字体大小
        if (child.scrollWidth > child.clientWidth) {
          child.style.fontSize = '12px';
        }
      });
    }
  }, [items]);

  return (
    <ul ref={listRef}>
      {items.map((item, index) => (
        <li key={index}>{item.text}</li>
      ))}
    </ul>
  );
}
```

**🎯 useLayoutEffect高级应用**:

```javascript
// 1. 自动调整布局Hook
function useAutoLayout() {
  const ref = useRef();
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
    shouldWrap: false
  });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const { width, height } = element.getBoundingClientRect();
    const shouldWrap = width < 600; // 断点

    setLayout({ width, height, shouldWrap });

    // 根据布局调整子元素
    const children = element.children;
    Array.from(children).forEach(child => {
      if (shouldWrap) {
        child.style.display = 'block';
        child.style.width = '100%';
      } else {
        child.style.display = 'inline-block';
        child.style.width = 'auto';
      }
    });
  });

  return [ref, layout];
}

// 使用自动布局
function ResponsiveGrid({ items }) {
  const [gridRef, layout] = useAutoLayout();

  return (
    <div ref={gridRef} className="grid">
      {items.map((item, index) => (
        <div key={index} className="grid-item">
          {item.content}
        </div>
      ))}
      <div className="layout-info">
        布局: {layout.shouldWrap ? '垂直' : '水平'}
        (宽度: {layout.width}px)
      </div>
    </div>
  );
}

// 2. 滚动同步Hook
function useScrollSync(refs) {
  useLayoutEffect(() => {
    if (!refs.every(ref => ref.current)) return;

    let isScrolling = false;

    const handleScroll = (sourceIndex) => (event) => {
      if (isScrolling) return;

      isScrolling = true;
      const source = event.target;
      const scrollRatio = source.scrollTop / (source.scrollHeight - source.clientHeight);

      refs.forEach((ref, index) => {
        if (index !== sourceIndex && ref.current) {
          const target = ref.current;
          const targetScrollTop = scrollRatio * (target.scrollHeight - target.clientHeight);
          target.scrollTop = targetScrollTop;
        }
      });

      // 重置滚动标志
      requestAnimationFrame(() => {
        isScrolling = false;
      });
    };

    // 为每个容器添加滚动监听
    const listeners = refs.map((ref, index) => {
      const listener = handleScroll(index);
      ref.current.addEventListener('scroll', listener);
      return listener;
    });

    return () => {
      refs.forEach((ref, index) => {
        if (ref.current) {
          ref.current.removeEventListener('scroll', listeners[index]);
        }
      });
    };
  }, [refs]);
}

// 使用滚动同步
function SynchronizedScrollers() {
  const leftRef = useRef();
  const rightRef = useRef();

  useScrollSync([leftRef, rightRef]);

  return (
    <div style={{ display: 'flex' }}>
      <div ref={leftRef} style={{ height: 300, overflow: 'auto', flex: 1 }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i}>左侧项目 {i + 1}</div>
        ))}
      </div>

      <div ref={rightRef} style={{ height: 300, overflow: 'auto', flex: 1 }}>
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i}>右侧项目 {i + 1}</div>
        ))}
      </div>
    </div>
  );
}

// 3. 动画序列控制
function useAnimationSequence(steps, trigger) {
  const elementsRef = useRef([]);

  useLayoutEffect(() => {
    if (!trigger || elementsRef.current.length === 0) return;

    const runSequence = async () => {
      for (const [index, step] of steps.entries()) {
        const element = elementsRef.current[index];
        if (!element) continue;

        // 应用样式
        Object.assign(element.style, step.style);

        // 等待延迟
        if (step.delay) {
          await new Promise(resolve => setTimeout(resolve, step.delay));
        }
      }
    };

    runSequence();
  }, [trigger, steps]);

  const registerElement = useCallback((index, element) => {
    elementsRef.current[index] = element;
  }, []);

  return registerElement;
}

// 使用动画序列
function SequentialAnimation() {
  const [startAnimation, setStartAnimation] = useState(false);

  const animationSteps = [
    { style: { opacity: 1, transform: 'translateY(0)' }, delay: 100 },
    { style: { opacity: 1, transform: 'translateY(0)' }, delay: 100 },
    { style: { opacity: 1, transform: 'translateY(0)' }, delay: 100 }
  ];

  const registerElement = useAnimationSequence(animationSteps, startAnimation);

  return (
    <div>
      <button onClick={() => setStartAnimation(prev => !prev)}>
        开始动画
      </button>

      {[0, 1, 2].map(index => (
        <div
          key={index}
          ref={(el) => registerElement(index, el)}
          style={{
            opacity: 0,
            transform: 'translateY(20px)',
            transition: 'all 0.3s ease',
            padding: '10px',
            margin: '5px',
            background: 'lightblue'
          }}
        >
          动画元素 {index + 1}
        </div>
      ))}
    </div>
  );
}

// 4. 虚拟滚动优化
function useVirtualScroll(items, itemHeight, containerHeight) {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
  const containerRef = useRef();

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateVisibleRange = () => {
      const scrollTop = containerRef.current.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      const visibleCount = Math.ceil(containerHeight / itemHeight);
      const end = Math.min(start + visibleCount + 1, items.length);

      setVisibleRange({ start, end });
    };

    // 初始计算
    updateVisibleRange();

    // 滚动监听
    const handleScroll = () => {
      updateVisibleRange();
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [items.length, itemHeight, containerHeight]);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    visibleRange
  };
}

// 使用虚拟滚动
function VirtualScrollList({ items }) {
  const itemHeight = 50;
  const containerHeight = 300;

  const {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY
  } = useVirtualScroll(items, itemHeight, containerHeight);

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                height: itemHeight,
                padding: '10px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**⚠️ useLayoutEffect注意事项**:

```javascript
// 1. 性能考虑 - 不要滥用
function PerformanceExample() {
  const [items, setItems] = useState([]);

  // ❌ 错误：不必要的useLayoutEffect
  useLayoutEffect(() => {
    // 简单的状态更新不需要useLayoutEffect
    console.log('Items updated:', items.length);
  }, [items]);

  // ✅ 正确：只在需要DOM操作时使用
  useLayoutEffect(() => {
    // 需要测量DOM或防止闪烁时才使用
    if (items.length > 10) {
      // 执行DOM相关操作
    }
  }, [items.length]);

  return <div>{/* 组件内容 */}</div>;
}

// 2. 避免阻塞渲染
function AvoidBlocking() {
  useLayoutEffect(() => {
    // ❌ 错误：耗时操作会阻塞渲染
    for (let i = 0; i < 1000000; i++) {
      // 大量计算
    }

    // ✅ 正确：只做必要的DOM操作
    const element = document.getElementById('target');
    if (element) {
      element.style.transform = 'translateX(100px)';
    }
  }, []);

  return <div id="target">内容</div>;
}

// 3. 条件性执行
function ConditionalLayoutEffect({ shouldMeasure }) {
  const ref = useRef();
  const [dimensions, setDimensions] = useState(null);

  useLayoutEffect(() => {
    if (!shouldMeasure || !ref.current) return;

    const { width, height } = ref.current.getBoundingClientRect();
    setDimensions({ width, height });
  }, [shouldMeasure]);

  return (
    <div ref={ref}>
      {dimensions && (
        <p>尺寸: {dimensions.width} x {dimensions.height}</p>
      )}
    </div>
  );
}
```

**📋 useLayoutEffect最佳实践**:

1. **何时使用**:
   - 需要在浏览器绘制前读取DOM
   - 避免视觉闪烁的关键渲染
   - 动画的初始状态设置
   - 响应式布局调整

2. **避免使用的情况**:
   - 简单的副作用操作
   - 网络请求
   - 订阅事件
   - 日志记录

3. **性能优化**:
   - 保持操作简洁快速
   - 避免复杂计算
   - 条件性执行
   - 合理使用依赖数组

---

## 3. 性能优化专题

### 🔥 3.1 React.memo组件优化

**🤔 面试问题**: React.memo的工作原理是什么？什么时候使用它？

**💡 React.memo基础和进阶用法**:

```javascript
// 1. 基础React.memo用法
const BasicComponent = ({ name, age }) => {
  console.log('BasicComponent rendered');
  return (
    <div>
      <p>姓名: {name}</p>
      <p>年龄: {age}</p>
    </div>
  );
};

// memo化组件 - 浅比较props
const MemoizedBasicComponent = React.memo(BasicComponent);

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState({ name: 'Alice', age: 25 });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>

      {/* 只有user改变时才会重新渲染 */}
      <MemoizedBasicComponent name={user.name} age={user.age} />
    </div>
  );
}

// 2. 自定义比较函数
const CustomCompareComponent = React.memo(({ user, config }) => {
  console.log('CustomCompareComponent rendered');
  return (
    <div>
      <p>用户: {user.name}</p>
      <p>设置: {config.theme}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // 返回true表示props相等，不需要重新渲染
  // 返回false表示props不同，需要重新渲染

  // 只比较我们关心的属性
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.config.theme === nextProps.config.theme
  );
});

// 3. 复杂对象的优化策略
const UserCard = React.memo(({ user, onEdit, onDelete }) => {
  console.log(`UserCard ${user.id} rendered`);

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user.id)}>编辑</button>
      <button onClick={() => onDelete(user.id)}>删除</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // 深度比较用户对象的关键属性
  const userEqual = (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.user.updatedAt === nextProps.user.updatedAt
  );

  // 函数引用比较（需要配合useCallback使用）
  const callbacksEqual = (
    prevProps.onEdit === nextProps.onEdit &&
    prevProps.onDelete === nextProps.onDelete
  );

  return userEqual && callbacksEqual;
});

// 使用优化后的组件
function UserList({ users }) {
  // 使用useCallback确保函数引用稳定
  const handleEdit = useCallback((userId) => {
    console.log('Edit user:', userId);
  }, []);

  const handleDelete = useCallback((userId) => {
    console.log('Delete user:', userId);
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// 4. 条件性memo化
function ConditionalMemo({ shouldOptimize, data }) {
  const Component = shouldOptimize
    ? React.memo(ExpensiveComponent)
    : ExpensiveComponent;

  return <Component data={data} />;
}

// 5. HOC形式的memo优化
function withMemo(Component, compareFunction) {
  const MemoizedComponent = React.memo(Component, compareFunction);

  // 保持displayName以便调试
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;

  return MemoizedComponent;
}

// 使用HOC
const OptimizedUserCard = withMemo(UserCard, (prev, next) => {
  return prev.user.id === next.user.id && prev.user.version === next.user.version;
});
```

**🎯 memo的高级优化模式**:

```javascript
// 1. 智能memo - 自动检测是否需要memo化
function smartMemo(Component, threshold = 5) {
  let renderCount = 0;
  let unnecessaryRenders = 0;

  const WrappedComponent = (props) => {
    renderCount++;

    // 简单的启发式：如果组件渲染次数多但props变化少，应该memo化
    if (renderCount > threshold && unnecessaryRenders > renderCount * 0.3) {
      console.warn(`${Component.name} might benefit from React.memo`);
    }

    return <Component {...props} />;
  };

  const MemoizedComponent = React.memo(WrappedComponent, (prevProps, nextProps) => {
    const areEqual = shallowEqual(prevProps, nextProps);
    if (areEqual) {
      unnecessaryRenders++;
    }
    return areEqual;
  });

  return MemoizedComponent;
}

// 2. 分级memo - 根据重要性选择比较策略
function createTieredMemo(tiers) {
  return function tieredMemo(Component) {
    return React.memo(Component, (prevProps, nextProps) => {
      // 按优先级检查属性
      for (const tier of tiers) {
        for (const prop of tier.props) {
          if (prevProps[prop] !== nextProps[prop]) {
            return false; // 高优先级属性变化，需要重渲染
          }
        }

        // 如果是critical tier且已经相等，可以跳过后续检查
        if (tier.critical) {
          return true;
        }
      }

      return true;
    });
  };
}

// 使用分级memo
const TieredMemoComponent = createTieredMemo([
  { props: ['id', 'status'], critical: true },
  { props: ['name', 'email'], critical: false },
  { props: ['metadata', 'settings'], critical: false }
])(UserProfile);

// 3. 选择性props memo
function selectiveProps(Component, selectedProps) {
  return React.memo(Component, (prevProps, nextProps) => {
    return selectedProps.every(prop => prevProps[prop] === nextProps[prop]);
  });
}

// 只比较特定的props
const SelectiveUserCard = selectiveProps(UserCard, ['user.id', 'user.name']);

// 4. 深度比较memo
function deepMemo(Component) {
  return React.memo(Component, (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  });
}

// 深度比较的工具函数
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 !== 'object') return obj1 === obj2;

  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

// 5. 缓存化memo
function cachedMemo(Component, cacheSize = 10) {
  const cache = new Map();
  let accessOrder = [];

  return React.memo(Component, (prevProps, nextProps) => {
    const cacheKey = JSON.stringify(nextProps);

    if (cache.has(cacheKey)) {
      // 更新访问顺序
      accessOrder = accessOrder.filter(key => key !== cacheKey);
      accessOrder.push(cacheKey);
      return true; // 缓存命中，不需要重新渲染
    }

    // 添加到缓存
    cache.set(cacheKey, true);
    accessOrder.push(cacheKey);

    // 清理老的缓存条目
    if (cache.size > cacheSize) {
      const oldestKey = accessOrder.shift();
      cache.delete(oldestKey);
    }

    return false; // 需要重新渲染
  });
}
```

**⚠️ React.memo的常见陷阱**:

```javascript
// 1. 内联对象和函数陷阱
function BadParent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>

      {/* ❌ 错误：每次都创建新对象 */}
      <MemoChild
        config={{ theme: 'dark', size: 'large' }}
        onClick={() => console.log('clicked')}
      />
    </div>
  );
}

// ✅ 正确的做法
function GoodParent() {
  const [count, setCount] = useState(0);

  // 缓存对象
  const config = useMemo(() => ({
    theme: 'dark',
    size: 'large'
  }), []);

  // 缓存函数
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <MemoChild config={config} onClick={handleClick} />
    </div>
  );
}

// 2. 过度memo化陷阱
// ❌ 错误：对简单组件过度memo化
const OverMemoized = React.memo(({ text }) => <span>{text}</span>);

// ✅ 正确：简单组件不需要memo
const SimpleText = ({ text }) => <span>{text}</span>;

// 3. children prop陷阱
const LayoutComponent = React.memo(({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      <div className="content">{children}</div>
    </div>
  );
});

function BadUsage() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>

      {/* ❌ 错误：children每次都是新的 */}
      <LayoutComponent title="固定标题">
        <div>动态内容: {count}</div>
      </LayoutComponent>
    </div>
  );
}

// ✅ 解决方案：提取children或使用useMemo
function GoodUsage() {
  const [count, setCount] = useState(0);

  const memoizedChildren = useMemo(() => (
    <div>动态内容: {count}</div>
  ), [count]);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <LayoutComponent title="固定标题">
        {memoizedChildren}
      </LayoutComponent>
    </div>
  );
}

// 4. 比较函数的性能陷阱
// ❌ 错误：比较函数比渲染更昂贵
const ExpensiveCompare = React.memo(SimpleComponent, (prevProps, nextProps) => {
  // 昂贵的深度比较
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
});

// ✅ 正确：高效的比较
const EfficientCompare = React.memo(SimpleComponent, (prevProps, nextProps) => {
  // 只比较关键属性
  return prevProps.id === nextProps.id &&
         prevProps.version === nextProps.version;
});
```

**📋 React.memo最佳实践**:

1. **何时使用memo**:
   - 组件经常重新渲染但props很少变化
   - 组件渲染成本较高
   - 组件在列表中使用

2. **何时不使用memo**:
   - 组件很简单（如单个文本节点）
   - props经常变化
   - 比较成本高于渲染成本

3. **优化策略**:
   - 配合useCallback和useMemo使用
   - 提供自定义比较函数
   - 避免内联对象和函数
   - 合理处理children prop

---

### 🔥 3.2 虚拟化和懒加载优化

**🤔 面试问题**: 如何处理大量数据的渲染性能问题？虚拟化的原理是什么？

**💡 虚拟化实现原理**:

```javascript
// 1. 基础虚拟滚动实现
function VirtualizedList({
  items,
  itemHeight,
  containerHeight,
  overscan = 3
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef();

  // 计算可见范围
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    items.length
  );

  // 添加预渲染区域
  const startIndex = Math.max(0, visibleStart - overscan);
  const endIndex = Math.min(items.length, visibleEnd + overscan);

  // 可见项目
  const visibleItems = items.slice(startIndex, endIndex);

  // 总高度和偏移量
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: containerHeight,
        overflow: 'auto',
        border: '1px solid #ccc'
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                borderBottom: '1px solid #eee'
              }}
            >
              <span>#{startIndex + index + 1}</span>
              <span style={{ marginLeft: 16 }}>{item.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. 动态高度虚拟化
function DynamicVirtualizedList({ items, estimatedItemHeight = 50 }) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const itemHeights = useRef(new Map());
  const itemPositions = useRef(new Map());
  const containerRef = useRef();

  // 测量项目高度
  const measureItem = useCallback((index, height) => {
    itemHeights.current.set(index, height);

    // 重新计算位置
    let position = 0;
    for (let i = 0; i <= index; i++) {
      itemPositions.current.set(i, position);
      position += itemHeights.current.get(i) || estimatedItemHeight;
    }
  }, [estimatedItemHeight]);

  // 获取项目位置
  const getItemPosition = useCallback((index) => {
    if (itemPositions.current.has(index)) {
      return itemPositions.current.get(index);
    }

    // 估算位置
    return index * estimatedItemHeight;
  }, [estimatedItemHeight]);

  // 计算可见范围
  const getVisibleRange = useCallback(() => {
    let startIndex = 0;
    let endIndex = items.length;

    // 二分查找起始位置
    let left = 0;
    let right = items.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const position = getItemPosition(mid);

      if (position < scrollTop) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    startIndex = Math.max(0, right);

    // 查找结束位置
    let currentPosition = getItemPosition(startIndex);
    endIndex = startIndex;

    while (currentPosition < scrollTop + containerHeight && endIndex < items.length) {
      const height = itemHeights.current.get(endIndex) || estimatedItemHeight;
      currentPosition += height;
      endIndex++;
    }

    return { startIndex, endIndex };
  }, [scrollTop, containerHeight, items.length, getItemPosition, estimatedItemHeight]);

  const { startIndex, endIndex } = getVisibleRange();
  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      ref={containerRef}
      style={{ height: 400, overflow: 'auto' }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <DynamicItem
            key={startIndex + index}
            item={item}
            index={startIndex + index}
            position={getItemPosition(startIndex + index)}
            onMeasure={measureItem}
          />
        ))}
      </div>
    </div>
  );
}

// 动态高度项目组件
function DynamicItem({ item, index, position, onMeasure }) {
  const ref = useRef();

  useLayoutEffect(() => {
    if (ref.current) {
      const height = ref.current.getBoundingClientRect().height;
      onMeasure(index, height);
    }
  }, [index, onMeasure]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        top: position,
        left: 0,
        right: 0,
        padding: '16px',
        borderBottom: '1px solid #eee'
      }}
    >
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.tags && (
        <div>
          {item.tags.map(tag => (
            <span key={tag} style={{
              background: '#f0f0f0',
              padding: '2px 8px',
              margin: '2px',
              borderRadius: '12px',
              fontSize: '12px'
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// 3. 表格虚拟化
function VirtualizedTable({
  columns,
  data,
  rowHeight = 40,
  headerHeight = 50,
  width = 800,
  height = 400
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const containerRef = useRef();
  const contentHeight = data.length * rowHeight;
  const contentWidth = columns.reduce((sum, col) => sum + col.width, 0);

  // 计算可见行范围
  const visibleRowStart = Math.floor(scrollTop / rowHeight);
  const visibleRowEnd = Math.min(
    visibleRowStart + Math.ceil((height - headerHeight) / rowHeight) + 1,
    data.length
  );

  // 计算可见列范围
  const getVisibleColumns = () => {
    let start = 0;
    let end = columns.length;
    let currentX = 0;

    // 查找起始列
    for (let i = 0; i < columns.length; i++) {
      if (currentX + columns[i].width > scrollLeft) {
        start = i;
        break;
      }
      currentX += columns[i].width;
    }

    // 查找结束列
    currentX = columns.slice(0, start).reduce((sum, col) => sum + col.width, 0);
    for (let i = start; i < columns.length; i++) {
      if (currentX > scrollLeft + width) {
        end = i;
        break;
      }
      currentX += columns[i].width;
    }

    return { start, end };
  };

  const { start: colStart, end: colEnd } = getVisibleColumns();
  const visibleColumns = columns.slice(colStart, colEnd);
  const visibleData = data.slice(visibleRowStart, visibleRowEnd);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
    setScrollLeft(e.target.scrollLeft);
  };

  return (
    <div style={{ width, height, border: '1px solid #ccc' }}>
      {/* 表头 */}
      <div style={{
        height: headerHeight,
        overflow: 'hidden',
        borderBottom: '2px solid #ddd'
      }}>
        <div style={{
          display: 'flex',
          transform: `translateX(-${scrollLeft}px)`,
          width: contentWidth
        }}>
          {columns.map((column, index) => (
            <div
              key={column.key}
              style={{
                width: column.width,
                height: headerHeight,
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                fontWeight: 'bold',
                borderRight: '1px solid #eee',
                background: '#f5f5f5'
              }}
            >
              {column.title}
            </div>
          ))}
        </div>
      </div>

      {/* 表体 */}
      <div
        ref={containerRef}
        style={{
          height: height - headerHeight,
          overflow: 'auto'
        }}
        onScroll={handleScroll}
      >
        <div style={{
          height: contentHeight,
          width: contentWidth,
          position: 'relative'
        }}>
          <div style={{ transform: `translateY(${visibleRowStart * rowHeight}px)` }}>
            {visibleData.map((row, rowIndex) => (
              <div
                key={visibleRowStart + rowIndex}
                style={{
                  display: 'flex',
                  height: rowHeight,
                  borderBottom: '1px solid #eee'
                }}
              >
                {visibleColumns.map((column) => (
                  <div
                    key={column.key}
                    style={{
                      width: column.width,
                      height: rowHeight,
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      borderRight: '1px solid #eee'
                    }}
                  >
                    {column.render
                      ? column.render(row[column.key], row, visibleRowStart + rowIndex)
                      : row[column.key]
                    }
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

**🎯 懒加载优化策略**:

```javascript
// 1. 图片懒加载
function LazyImage({ src, alt, placeholder, threshold = 0.1 }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div ref={imgRef} className="lazy-image-container">
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s'
          }}
        />
      )}
      {!isLoaded && placeholder && (
        <div className="image-placeholder">
          {placeholder}
        </div>
      )}
    </div>
  );
}

// 2. 组件懒加载
function LazyComponent({ loader, fallback = <div>Loading...</div> }) {
  const [Component, setComponent] = useState(null);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && !Component) {
      loader().then(module => {
        setComponent(() => module.default || module);
      });
    }
  }, [isInView, Component, loader]);

  return (
    <div ref={ref}>
      {Component ? <Component /> : fallback}
    </div>
  );
}

// 使用组件懒加载
function App() {
  return (
    <div>
      <div style={{ height: '100vh' }}>顶部内容</div>

      <LazyComponent
        loader={() => import('./HeavyComponent')}
        fallback={<div>正在加载重型组件...</div>}
      />

      <div style={{ height: '100vh' }}>底部内容</div>
    </div>
  );
}

// 3. 数据懒加载
function useLazyData(url, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const triggerLoad = useCallback(() => {
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    if (!shouldLoad || !url) return;

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [shouldLoad, url, ...dependencies]);

  return { data, loading, error, triggerLoad };
}

// 使用数据懒加载
function UserProfile({ userId }) {
  const { data, loading, error, triggerLoad } = useLazyData(
    `/api/users/${userId}/profile`
  );

  return (
    <div>
      <h2>用户资料</h2>
      {!data && !loading && (
        <button onClick={triggerLoad}>加载用户资料</button>
      )}
      {loading && <div>加载中...</div>}
      {error && <div>加载失败: {error.message}</div>}
      {data && (
        <div>
          <p>姓名: {data.name}</p>
          <p>邮箱: {data.email}</p>
        </div>
      )}
    </div>
  );
}

// 4. 分页懒加载
function useInfiniteScroll(fetchMore, hasMore) {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isFetching) return;

    const loadMore = async () => {
      if (hasMore) {
        await fetchMore();
      }
      setIsFetching(false);
    };

    loadMore();
  }, [isFetching, fetchMore, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 // 1000px threshold
      ) {
        setIsFetching(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return [isFetching, setIsFetching];
}

// 使用无限滚动
function InfiniteScrollList() {
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchMore = useCallback(async () => {
    const response = await fetch(`/api/items?page=${page}&limit=20`);
    const newItems = await response.json();

    if (newItems.length === 0) {
      setHasMore(false);
    } else {
      setItems(prev => [...prev, ...newItems]);
      setPage(prev => prev + 1);
    }
  }, [page]);

  const [isFetching] = useInfiniteScroll(fetchMore, hasMore);

  useEffect(() => {
    fetchMore(); // 初始加载
  }, []);

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id} style={{ padding: '16px', border: '1px solid #eee' }}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
      {isFetching && <div>加载更多...</div>}
      {!hasMore && <div>没有更多数据了</div>}
    </div>
  );
}

// 5. 预加载策略
function usePreloader(resources) {
  const [loadedResources, setLoadedResources] = useState(new Set());

  const preloadResource = useCallback(async (resource) => {
    if (loadedResources.has(resource.url)) return;

    try {
      switch (resource.type) {
        case 'image':
          await preloadImage(resource.url);
          break;
        case 'script':
          await preloadScript(resource.url);
          break;
        case 'component':
          await resource.loader();
          break;
        default:
          await fetch(resource.url);
      }

      setLoadedResources(prev => new Set([...prev, resource.url]));
    } catch (error) {
      console.error(`Failed to preload ${resource.url}:`, error);
    }
  }, [loadedResources]);

  const preloadAll = useCallback(() => {
    resources.forEach(preloadResource);
  }, [resources, preloadResource]);

  return { preloadResource, preloadAll, loadedResources };
}

// 预加载工具函数
function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
}

function preloadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = resolve;
    script.onerror = reject;
    script.src = src;
    document.head.appendChild(script);
  });
}
```

**📊 虚拟化性能对比**:

| 场景 | 普通渲染 | 虚拟化渲染 | 性能提升 |
|------|----------|------------|----------|
| **1000行数据** | 较慢 | 快速 | 5-10x |
| **10000行数据** | 很慢 | 快速 | 50-100x |
| **100000行数据** | 卡顿/崩溃 | 正常 | 500-1000x |
| **内存使用** | 线性增长 | 常量 | 显著降低 |

**🎯 最佳实践总结**:

1. **虚拟化适用场景**:
   - 大量数据列表（>100项）
   - 表格数据展示
   - 长页面内容

2. **懒加载适用场景**:
   - 图片密集型页面
   - 大型组件
   - 分页数据加载

3. **实现要点**:
   - 准确计算可见范围
   - 合理设置预渲染区域
   - 处理动态高度
   - 优化滚动性能
