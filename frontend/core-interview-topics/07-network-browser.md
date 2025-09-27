# 计算机基础与网络

> **面试重要度**: ⭐⭐⭐ (基础 - 70%出现率)
> **技术深度**: 前端工程师必备的计算机基础知识
> **掌握标准**: 理解底层原理 + 能分析实际问题

## 📖 领域概述

计算机基础与网络知识是前端工程师的基石，体现技术深度和问题分析能力。5年经验的前端工程师需要具备扎实的计算机基础，能够从底层原理角度分析和解决前端问题。

## 🌐 网络协议深度理解

### HTTP/HTTPS 核心机制 (70%出现率)

| 协议技术 | 掌握深度 | 面试要点 | 实际应用 |
|----------|----------|----------|----------|
| **HTTP协议** | 请求响应机制 | 状态码、缓存策略 | 性能优化方案 |
| **HTTPS加密** | TLS握手过程 | 证书验证机制 | 安全防护策略 |
| **HTTP/2** | 多路复用原理 | 服务端推送 | 性能提升效果 |
| **WebSocket** | 全双工通信 | 心跳检测机制 | 实时应用场景 |

### HTTP 请求响应机制
```javascript
// HTTP请求结构
GET /api/users HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer token123
Cache-Control: no-cache

// HTTP响应结构
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 1234
Cache-Control: max-age=3600
Set-Cookie: sessionId=abc123

{
  "users": [...]
}
```

### HTTPS 加密过程
```javascript
// TLS握手简化流程
1. Client Hello: 客户端发送支持的加密算法
2. Server Hello: 服务器选择加密算法，发送证书
3. Certificate Verify: 客户端验证服务器证书
4. Key Exchange: 交换密钥材料
5. Finished: 握手完成，开始加密通信

// 对称加密 vs 非对称加密
非对称加密: 用于密钥交换(RSA, ECDHE)
对称加密: 用于数据传输(AES)
数字签名: 用于身份验证(RSA, ECDSA)
```

### HTTP 缓存策略
```javascript
// 强缓存
Cache-Control: max-age=31536000  // 1年
Expires: Wed, 21 Oct 2025 07:28:00 GMT

// 协商缓存
ETag: "33a64df551425fcc"
Last-Modified: Wed, 21 Oct 2020 07:28:00 GMT

// 缓存验证
If-None-Match: "33a64df551425fcc"
If-Modified-Since: Wed, 21 Oct 2020 07:28:00 GMT

// 缓存控制
Cache-Control: no-cache    // 每次验证
Cache-Control: no-store    // 不缓存
Cache-Control: private     // 仅客户端缓存
Cache-Control: public      // 代理也可缓存
```

## 🌍 浏览器运行机制

### 浏览器渲染流程 (必考知识点)

| 渲染阶段 | 核心处理 | 性能影响 | 优化方向 |
|----------|----------|----------|----------|
| **HTML解析** | DOM树构建 | 首屏渲染时间 | HTML结构优化 |
| **CSS解析** | CSSOM树构建 | 样式计算时间 | CSS选择器优化 |
| **布局计算** | 几何信息计算 | 重排性能 | 减少布局抖动 |
| **绘制渲染** | 像素填充 | 重绘性能 | 减少绘制区域 |

### 浏览器渲染核心流程
```javascript
// 关键渲染路径
1. HTML解析 → DOM树
2. CSS解析 → CSSOM树
3. DOM + CSSOM → 渲染树
4. 布局(Layout/Reflow) → 几何计算
5. 绘制(Paint) → 像素填充
6. 合成(Composite) → 图层合成

// 性能优化关键点
- 减少关键资源数量
- 缩短关键路径长度
- 减少关键资源大小
```

### 重排重绘机制
```javascript
// 触发重排的操作
✗ element.style.width = '100px'
✗ element.offsetWidth
✗ window.getComputedStyle(element)
✗ element.scrollTop

// 避免重排的方法
✓ 批量DOM操作
✓ 使用DocumentFragment
✓ 使用transform代替position
✓ 使用visibility代替display

// 重排优化示例
// 错误做法
for (let i = 0; i < 1000; i++) {
    element.style.left = i + 'px';  // 触发1000次重排
}

// 正确做法
element.style.left = '1000px';      // 只触发1次重排

// 或者使用transform
element.style.transform = 'translateX(1000px)';  // 不触发重排
```

## 🔒 Web 安全机制

### 常见安全威胁与防护 (重要知识点)

| 安全威胁 | 攻击原理 | 防护策略 | 实现方案 |
|----------|----------|----------|----------|
| **XSS攻击** | 恶意脚本注入 | 输入过滤、输出编码 | CSP策略 |
| **CSRF攻击** | 跨站请求伪造 | Token验证 | SameSite Cookie |
| **点击劫持** | 透明iframe覆盖 | X-Frame-Options | frame-ancestors |
| **SQL注入** | 恶意SQL语句 | 参数化查询 | 输入验证 |

### XSS 防护实现
```javascript
// 输入过滤
function sanitizeInput(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

// CSP策略配置
Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://api.example.com;

// 安全的DOM操作
// 危险操作
element.innerHTML = userInput;  // 可能导致XSS

// 安全操作
element.textContent = userInput;  // 自动转义
element.innerHTML = DOMPurify.sanitize(userInput);  // 使用安全库
```

### CSRF 防护机制
```javascript
// CSRF Token实现
// 1. 服务端生成token
const csrfToken = crypto.randomBytes(32).toString('hex');
res.cookie('csrf-token', csrfToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
});

// 2. 客户端请求携带token
fetch('/api/transfer', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});

// 3. 服务端验证token
if (req.headers['x-csrf-token'] !== req.cookies['csrf-token']) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
}
```

## 🌐 TCP/IP 网络基础

### TCP 三次握手与四次挥手
```javascript
// TCP三次握手
1. SYN: 客户端请求连接 (seq=x)
2. SYN+ACK: 服务端确认连接 (seq=y, ack=x+1)
3. ACK: 客户端确认 (ack=y+1)

// TCP四次挥手
1. FIN: 客户端请求断开 (seq=u)
2. ACK: 服务端确认 (ack=u+1)
3. FIN: 服务端请求断开 (seq=v)
4. ACK: 客户端确认 (ack=v+1)

// 状态变化
CLOSED → SYN_SENT → ESTABLISHED → FIN_WAIT → CLOSED
```

### 网络性能优化
```javascript
// DNS优化
dns-prefetch: 预解析DNS
<link rel="dns-prefetch" href="//example.com">

// 连接优化
preconnect: 预建立连接
<link rel="preconnect" href="https://fonts.googleapis.com">

// 资源优化
prefetch: 预加载资源
<link rel="prefetch" href="/next-page.js">

preload: 优先加载
<link rel="preload" href="/critical.css" as="style">
```

## 📊 性能监控指标

### Core Web Vitals
```javascript
// Largest Contentful Paint (LCP)
// 最大内容绘制时间，衡量加载性能
// 目标: < 2.5秒

// First Input Delay (FID)
// 首次输入延迟，衡量交互性能
// 目标: < 100毫秒

// Cumulative Layout Shift (CLS)
// 累积布局偏移，衡量视觉稳定性
// 目标: < 0.1

// 监控实现
import { getLCP, getFID, getCLS } from 'web-vitals';

getLCP(console.log);
getFID(console.log);
getCLS(console.log);
```

## 📚 学习路径建议

### 第1阶段：网络协议基础
- HTTP/HTTPS协议机制
- TCP/IP基础知识
- DNS解析过程

### 第2阶段：浏览器原理
- 渲染引擎工作流程
- JavaScript引擎机制
- 浏览器缓存策略

### 第3阶段：Web安全
- 常见安全威胁
- 防护策略实现
- 安全开发实践

### 第4阶段：性能优化
- 网络性能优化
- 渲染性能优化
- 监控指标体系

## 🔍 实际应用场景

### 网络问题排查
```javascript
// 网络延迟分析
1. DNS解析时间
2. TCP连接时间
3. SSL握手时间
4. 请求响应时间

// 工具使用
- Chrome DevTools Network面板
- Wireshark抓包分析
- curl命令行测试
- ping/traceroute网络诊断
```

### 缓存策略设计
```javascript
// 静态资源缓存
- HTML: no-cache (协商缓存)
- CSS/JS: max-age=31536000 (强缓存)
- 图片: max-age=2592000 (30天缓存)

// API接口缓存
- 用户信息: max-age=300 (5分钟)
- 配置信息: max-age=3600 (1小时)
- 静态数据: max-age=86400 (1天)
```

## 📖 相关资源链接

- [HTTP权威指南](https://book.douban.com/subject/10746113/)
- [计算机网络高频考点](../../networks/计算机网络高频考点.md)
- [浏览器工作原理](待补充)

## 🚧 待补充内容

> **注意**: 当前为概述版本，后续将补充以下详细内容：

- [ ] HTTP协议详细报文分析
- [ ] HTTPS加密算法深度解析
- [ ] 浏览器渲染流程可视化
- [ ] Web安全攻防实战案例
- [ ] 网络性能优化完整方案
- [ ] CDN工作原理与配置
- [ ] WebSocket实时通信实现
- [ ] HTTP/2多路复用机制
- [ ] 网络问题排查方法论
- [ ] 性能监控最佳实践
- [ ] 移动端网络优化
- [ ] 跨域问题解决方案

---

**💡 学习提示**: 计算机基础知识是解决复杂问题的基石，建议结合实际项目中遇到的网络和性能问题来加深理解，注重理论与实践相结合。