# 🌐 计算机网络学习

计算机网络是现代互联网的基石！理解网络原理让你成为更优秀的开发者，能够构建更可靠的应用。

## 🌟 网络知识的重要性

### 💡 为什么要学习计算机网络？
- **性能优化**：理解网络延迟和带宽影响
- **架构设计**：设计分布式系统和微服务
- **问题诊断**：快速定位网络相关问题  
- **安全防护**：理解网络攻击和防护机制

### 🔄 网络在开发中的应用
```
前端请求 → HTTP协议 → 网络传输 → 后端处理
    ↓         ↓         ↓         ↓
用户体验    API设计   性能优化   系统架构
```

## 🎯 学习重点

### 🌟 网络基础层次（OSI 7层模型）
```
应用层 (Application)     ← HTTP/HTTPS, WebSocket, FTP
表示层 (Presentation)    ← 数据加密、压缩
会话层 (Session)         ← 会话管理
传输层 (Transport)       ← TCP/UDP 协议
网络层 (Network)         ← IP 协议、路由
数据链路层 (Data Link)    ← 以太网
物理层 (Physical)        ← 网络硬件
```

### 🚀 核心协议详解

#### HTTP/HTTPS 协议
```
GET /api/users HTTP/1.1
Host: api.example.com
Authorization: Bearer token123
Content-Type: application/json

HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=3600

{"users": [...]}
```

#### WebSocket 实时通信
```javascript
// 客户端
const ws = new WebSocket('wss://chat.example.com');

ws.onopen = () => {
  console.log('连接建立');
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('收到消息:', message);
};

// 服务端 (Node.js + ws)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message = JSON.parse(data);
    // 广播给所有客户端
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  });
});
```

### 🔥 网络性能优化

#### CDN 内容分发
```
用户请求 → 就近CDN节点 → 缓存命中？
                ↓              ↓
              返回缓存      → 源站获取 → 缓存并返回
```

#### HTTP/2 的优势
```
HTTP/1.1 的问题:
- 队头阻塞 (Head-of-line blocking)
- 连接复用困难
- 头部冗余

HTTP/2 的改进:
- 多路复用 (Multiplexing)
- 服务器推送 (Server Push)
- 头部压缩 (HPACK)
```

## 📚 学习路径

### 🎪 推荐学习顺序
```
1. 网络基础概念 → 2. TCP/IP 协议栈 → 3. HTTP 协议详解
        ↓                ↓                ↓
4. DNS 域名解析 → 5. 网络安全基础 → 6. 性能优化技术
        ↓                ↓                ↓
7. WebSocket 实时 → 8. CDN 与缓存 → 9. 网络监控调试
        ↓                ↓                ↓
10. 微服务网络 → 11. 边缘计算 → 12. 实战项目
```

### 💡 重点概念对照表

| 概念 | 说明 | 实际应用 |
|------|------|----------|
| **TCP** | 可靠传输协议 | HTTP、数据库连接 |
| **UDP** | 快速传输协议 | DNS查询、视频直播 |
| **DNS** | 域名解析系统 | 网站访问、负载均衡 |
| **HTTPS** | 安全HTTP协议 | 数据加密传输 |
| **WebSocket** | 双向通信协议 | 实时聊天、游戏 |

## 🛠️ 实践项目

### ✅ 网络工具实现
```javascript
// 1. 简单的 HTTP 客户端
const http = require('http');

function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 使用示例
httpRequest('http://httpbin.org/json')
  .then(response => {
    console.log('状态码:', response.statusCode);
    console.log('响应体:', response.body);
  })
  .catch(console.error);

// 2. 网络延迟测试工具
async function ping(host, count = 4) {
  const results = [];
  
  for (let i = 0; i < count; i++) {
    const start = Date.now();
    
    try {
      await httpRequest(`http://${host}`);
      const latency = Date.now() - start;
      results.push(latency);
      console.log(`ping ${host}: time=${latency}ms`);
    } catch (error) {
      console.log(`ping ${host}: 请求失败`);
    }
    
    // 等待1秒后发送下一个请求
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const avg = results.reduce((a, b) => a + b, 0) / results.length;
  console.log(`平均延迟: ${avg.toFixed(2)}ms`);
}

ping('www.google.com');
```

### 🎯 网络协议实验
```javascript
// WebSocket 聊天室实现
// 服务端
const WebSocket = require('ws');

class ChatServer {
  constructor(port = 8080) {
    this.wss = new WebSocket.Server({ port });
    this.rooms = new Map(); // roomId -> Set of clients
    this.clients = new Map(); // ws -> {userId, roomId}
    
    this.setupConnection();
    console.log(`聊天服务器启动在端口 ${port}`);
  }
  
  setupConnection() {
    this.wss.on('connection', (ws) => {
      console.log('新用户连接');
      
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (error) {
          console.error('消息解析失败:', error);
        }
      });
      
      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
    });
  }
  
  handleMessage(ws, message) {
    const { type, payload } = message;
    
    switch (type) {
      case 'join':
        this.joinRoom(ws, payload.userId, payload.roomId);
        break;
      case 'message':
        this.broadcastMessage(ws, payload);
        break;
      case 'leave':
        this.leaveRoom(ws);
        break;
    }
  }
  
  joinRoom(ws, userId, roomId) {
    // 离开当前房间
    this.leaveRoom(ws);
    
    // 加入新房间
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    
    this.rooms.get(roomId).add(ws);
    this.clients.set(ws, { userId, roomId });
    
    // 通知房间内其他用户
    this.broadcastToRoom(roomId, {
      type: 'user-joined',
      payload: { userId, message: `${userId} 加入了聊天室` }
    }, ws);
  }
  
  broadcastMessage(ws, payload) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;
    
    const { roomId } = clientInfo;
    this.broadcastToRoom(roomId, {
      type: 'message',
      payload: {
        userId: clientInfo.userId,
        message: payload.message,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  broadcastToRoom(roomId, data, excludeWs = null) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    
    room.forEach(ws => {
      if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
  
  leaveRoom(ws) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;
    
    const { userId, roomId } = clientInfo;
    const room = this.rooms.get(roomId);
    
    if (room) {
      room.delete(ws);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      } else {
        this.broadcastToRoom(roomId, {
          type: 'user-left',
          payload: { userId, message: `${userId} 离开了聊天室` }
        });
      }
    }
    
    this.clients.delete(ws);
  }
  
  handleDisconnect(ws) {
    this.leaveRoom(ws);
    console.log('用户断开连接');
  }
}

new ChatServer();
```

## 🔐 网络安全基础

### 🛡️ HTTPS 与 TLS
```javascript
// SSL/TLS 证书验证
const https = require('https');
const tls = require('tls');

function checkCertificate(hostname, port = 443) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(port, hostname, () => {
      const cert = socket.getPeerCertificate();
      
      console.log('证书信息:');
      console.log('颁发者:', cert.issuer.CN);
      console.log('有效期:', new Date(cert.valid_from), '到', new Date(cert.valid_to));
      console.log('指纹:', cert.fingerprint);
      
      socket.end();
      resolve(cert);
    });
    
    socket.on('error', reject);
  });
}

checkCertificate('www.github.com');
```

### 🚨 常见网络攻击防护
```javascript
// CORS 跨域配置
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://trusted-domain.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '3600');
  next();
});

// 请求限流防护
const rateLimit = {
  requests: new Map(),
  
  check(ip, limit = 100, window = 60000) {
    const now = Date.now();
    const userRequests = this.requests.get(ip) || [];
    
    // 清理过期请求
    const validRequests = userRequests.filter(time => now - time < window);
    
    if (validRequests.length >= limit) {
      return false; // 触发限流
    }
    
    validRequests.push(now);
    this.requests.set(ip, validRequests);
    return true; // 允许请求
  }
};

// 中间件使用
app.use((req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!rateLimit.check(clientIP)) {
    return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
  }
  
  next();
});
```

## 🎓 网络调试与监控

### 🔧 网络工具使用
```bash
# 基础网络诊断命令
ping google.com                 # 测试连通性
traceroute google.com           # 追踪路由路径
nslookup google.com             # DNS查询
curl -I https://api.github.com  # HTTP头信息
netstat -an                     # 查看网络连接状态

# 使用 dig 进行 DNS 分析
dig @8.8.8.8 github.com         # 指定DNS服务器查询
dig github.com MX               # 查询邮件服务器记录
dig github.com CNAME            # 查询别名记录
```

### 📊 性能监控实现
```javascript
// 网络性能监测工具
class NetworkMonitor {
  constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      totalTime: 0,
      slowRequests: 0
    };
  }
  
  async request(url, options = {}) {
    const start = Date.now();
    this.metrics.requests++;
    
    try {
      const response = await fetch(url, options);
      const duration = Date.now() - start;
      
      this.metrics.totalTime += duration;
      
      if (duration > 1000) { // 超过1秒视为慢请求
        this.metrics.slowRequests++;
        console.warn(`慢请求警告: ${url} 耗时 ${duration}ms`);
      }
      
      if (!response.ok) {
        this.metrics.errors++;
      }
      
      return response;
    } catch (error) {
      this.metrics.errors++;
      console.error('请求失败:', error.message);
      throw error;
    }
  }
  
  getStats() {
    const avgTime = this.metrics.totalTime / this.metrics.requests;
    const errorRate = (this.metrics.errors / this.metrics.requests) * 100;
    const slowRate = (this.metrics.slowRequests / this.metrics.requests) * 100;
    
    return {
      总请求数: this.metrics.requests,
      平均响应时间: `${avgTime.toFixed(2)}ms`,
      错误率: `${errorRate.toFixed(2)}%`,
      慢请求比例: `${slowRate.toFixed(2)}%`
    };
  }
}

// 使用示例
const monitor = new NetworkMonitor();

async function testAPI() {
  const urls = [
    'https://api.github.com/users/octocat',
    'https://httpbin.org/delay/2',
    'https://httpbin.org/status/500'
  ];
  
  for (const url of urls) {
    try {
      await monitor.request(url);
    } catch (error) {
      // 错误已被监控记录
    }
  }
  
  console.log('网络性能统计:', monitor.getStats());
}

testAPI();
```

## 🎯 学习提醒

### ⚡ 网络学习重点
- **理论与实践结合**：不仅要理解协议，更要会用工具调试
- **性能思维**：始终考虑网络对应用性能的影响
- **安全意识**：理解常见网络攻击和防护措施
- **监控习惯**：学会使用工具分析网络问题

### 🚀 进阶方向
1. **微服务网络**：服务发现、负载均衡、熔断器
2. **网络编程**：Socket 编程、自定义协议
3. **网络安全**：渗透测试、防火墙配置
4. **性能调优**：网络优化、CDN 配置

记住：网络是现代应用的血管，理解网络让你的应用更快、更稳定、更安全！

有任何网络相关的问题，随时问我！我会用最直观的例子帮你理解网络的奥秘！🌐🚀