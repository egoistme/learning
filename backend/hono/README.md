# ⚡ Hono 现代 Web 框架

Hono 是下一代 Web 框架！它轻量、快速，专为现代边缘运行时设计，是 Web API 开发的新选择。

## 🌟 Hono 的革命性特点

### 💡 为什么选择 Hono？
- **超高性能**：比 Express 快数倍
- **边缘优先**：天生支持 Cloudflare Workers、Deno、Bun
- **TypeScript 原生**：完美的类型推导
- **极简设计**：API 简洁直观

### 🔄 Hono vs Express 对比
```typescript
// Express 传统写法
const express = require('express');
const app = express();

app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  res.json({ id, message: 'Hello' });
});

// Hono 现代写法
import { Hono } from 'hono';
const app = new Hono();

app.get('/api/users/:id', (c) => {
  const id = c.req.param('id');
  return c.json({ id, message: 'Hello' });
});
```

## 🎯 学习重点

### 🌟 核心概念
- **Context 对象**：统一的请求响应处理
- **中间件系统**：简洁的中间件设计
- **路由系统**：灵活的路由定义
- **边缘运行时**：多平台部署支持

### 🚀 基础 API 使用
```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

const app = new Hono();

// 中间件
app.use('*', cors());
app.use('*', logger());

// 路由处理
app.get('/', (c) => c.text('欢迎使用 Hono!'));

app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.json({ message: `Hello, ${name}!` });
});

app.post('/api/users', async (c) => {
  const body = await c.req.json();
  // 处理用户创建逻辑
  return c.json({ success: true, user: body }, 201);
});

// 错误处理
app.notFound((c) => c.json({ error: 'Not Found' }, 404));

export default app;
```

### 🔥 高级特性
```typescript
// 1. 类型安全的路由
type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get('/users', async (c) => {
  const dbUrl = c.env.DATABASE_URL; // 类型安全
  // 数据库操作
});

// 2. 路由组合
const api = new Hono();
api.get('/users', getUsersHandler);
api.post('/users', createUserHandler);

const app = new Hono();
app.route('/api', api);

// 3. 验证中间件
import { validator } from 'hono/validator';

app.post('/api/users', 
  validator('json', (value, c) => {
    const parsed = userSchema.safeParse(value);
    if (!parsed.success) {
      return c.text('Invalid input', 400);
    }
    return parsed.data;
  }),
  async (c) => {
    const data = c.req.valid('json');
    // 使用验证后的数据
  }
);
```

## 📚 学习路径

### 🎪 推荐学习顺序
```
1. Hono 基础 → 2. 路由与中间件 → 3. 请求处理
     ↓            ↓              ↓
4. 验证器使用 → 5. 错误处理 → 6. 边缘部署
     ↓            ↓              ↓
7. 数据库集成 → 8. 认证授权 → 9. 实战项目
     ↓            ↓              ↓
10. 性能优化 → 11. 监控日志 → 12. 生产部署
```

### 💡 核心 API 对比

| API | Express | Hono |
|-----|---------|------|
| **请求参数** | `req.params.id` | `c.req.param('id')` |
| **查询参数** | `req.query.page` | `c.req.query('page')` |
| **请求体** | `req.body` | `await c.req.json()` |
| **响应** | `res.json(data)` | `c.json(data)` |
| **状态码** | `res.status(201)` | `c.json(data, 201)` |

## 🛠️ 实践项目

### ✅ 入门项目：待办事项 API
```typescript
import { Hono } from 'hono';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

let todos: Todo[] = [];
let nextId = 1;

const app = new Hono();

// 获取所有待办
app.get('/todos', (c) => c.json(todos));

// 创建待办
app.post('/todos', async (c) => {
  const { title } = await c.req.json();
  const todo: Todo = {
    id: nextId++,
    title,
    completed: false
  };
  todos.push(todo);
  return c.json(todo, 201);
});

// 更新待办
app.put('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const { title, completed } = await c.req.json();
  
  const todo = todos.find(t => t.id === id);
  if (!todo) return c.json({ error: 'Todo not found' }, 404);
  
  todo.title = title ?? todo.title;
  todo.completed = completed ?? todo.completed;
  
  return c.json(todo);
});

// 删除待办
app.delete('/todos/:id', (c) => {
  const id = Number(c.req.param('id'));
  const index = todos.findIndex(t => t.id === id);
  
  if (index === -1) return c.json({ error: 'Todo not found' }, 404);
  
  todos.splice(index, 1);
  return c.json({ message: 'Todo deleted' });
});

export default app;
```

### 🎯 进阶项目：用户认证系统
```typescript
import { Hono } from 'hono';
import { jwt } from 'hono/jwt';
import { setCookie, getCookie } from 'hono/cookie';

const app = new Hono();

// JWT 中间件
app.use('/api/protected/*', jwt({ secret: 'your-secret-key' }));

// 登录
app.post('/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  
  // 验证用户身份（实际应用中应查询数据库）
  if (email === 'user@example.com' && password === 'password') {
    const payload = {
      sub: '1',
      email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    };
    
    const token = await jwt.sign(payload, 'your-secret-key');
    
    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
    
    return c.json({ message: '登录成功', token });
  }
  
  return c.json({ error: '用户名或密码错误' }, 401);
});

// 受保护的路由
app.get('/api/protected/profile', (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ message: '这是受保护的内容', user: payload });
});

export default app;
```

## 🌍 边缘部署

### ☁️ Cloudflare Workers
```typescript
// wrangler.toml
name = "my-hono-app"
main = "src/index.ts"
compatibility_date = "2024-01-01"

// src/index.ts
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello from Cloudflare Workers!'));

export default app;
```

```bash
# 部署到 Cloudflare Workers
npm install -g wrangler
wrangler login
wrangler publish
```

### 🚀 其他部署平台
```bash
# Vercel
npm install -g vercel
vercel

# Deno Deploy
deno run --allow-net --allow-read mod.ts

# Bun
bun run index.ts
```

## 🎓 高级话题

### 🔧 性能优化
```typescript
// 1. 请求缓存
import { cache } from 'hono/cache';

app.get('/api/data', 
  cache({
    cacheName: 'api-cache',
    cacheControl: 'max-age=3600',
  }),
  async (c) => {
    // 数据获取逻辑
    return c.json(data);
  }
);

// 2. 流式响应
app.get('/api/stream', (c) => {
  const stream = new ReadableStream({
    start(controller) {
      // 流式发送数据
      controller.enqueue('chunk 1\n');
      setTimeout(() => {
        controller.enqueue('chunk 2\n');
        controller.close();
      }, 1000);
    }
  });
  
  return c.body(stream);
});
```

### 🔐 安全实践
```typescript
// 1. CORS 配置
import { cors } from 'hono/cors';

app.use('*', cors({
  origin: ['https://yourdomain.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// 2. 请求限流
let requests = new Map();

const rateLimit = (limit: number) => async (c: any, next: any) => {
  const ip = c.req.header('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const windowStart = now - 60000; // 1 minute window
  
  if (!requests.has(ip)) requests.set(ip, []);
  
  const userRequests = requests.get(ip).filter((time: number) => time > windowStart);
  
  if (userRequests.length >= limit) {
    return c.text('Too Many Requests', 429);
  }
  
  userRequests.push(now);
  requests.set(ip, userRequests);
  
  await next();
};

app.use('/api/*', rateLimit(100));
```

## 🎯 学习提醒

### ⚡ Hono 的优势
- **现代化**：专为现代运行时设计
- **类型安全**：完整的 TypeScript 支持
- **高性能**：极快的请求处理速度
- **跨平台**：一套代码多端部署

### 🚀 最佳实践
1. **拥抱边缘计算**：让 API 更接近用户
2. **利用类型系统**：减少运行时错误
3. **中间件组合**：构建模块化应用
4. **错误边界**：优雅处理异常情况

记住：Hono 代表了 Web 框架的未来方向——轻量、快速、边缘优先。掌握它，你就走在了技术前沿！

有任何 Hono 相关的问题，随时问我！我会用最现代的方式帮你理解这个优秀框架！⚡🚀