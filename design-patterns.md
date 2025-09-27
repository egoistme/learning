# 设计模式概论

> 编程中的智慧结晶 —— 可复用的面向对象软件设计解决方案

## 📚 目录

1. [设计模式基础](#设计模式基础)
2. [设计原则](#设计原则)
3. [创建型模式](#创建型模式)
4. [结构型模式](#结构型模式)
5. [行为型模式](#行为型模式)
6. [实战应用](#实战应用)
7. [学习路径](#学习路径)

---

## 设计模式基础

### 什么是设计模式？

设计模式（Design Pattern）是在软件设计中，**对于某些常见问题的典型解决方案**。它们就像是预制的蓝图，你可以根据自己代码中的实际问题来定制解决方案。

**🤔 思考：** 为什么我们需要"模式"这个概念？

设计模式不是具体的代码，而是**解决特定问题的通用概念**。你需要根据自己程序的需求来实现模式的细节。

### 为什么需要设计模式？

1. **🔄 重复出现的问题需要统一的解决方案**
   - 软件开发中会遇到相似的设计问题
   - 前人的智慧可以避免重复犯错

2. **💬 提供共同的设计词汇**
   - 团队成员可以用模式名称快速沟通
   - "使用观察者模式" 比 "创建一个订阅发布系统" 更精确

3. **📈 提高代码质量**
   - 经过验证的设计方案
   - 提高代码的可维护性和可扩展性

4. **🎓 学习面向对象设计的最佳实践**
   - 理解优秀设计的精髓
   - 培养设计思维

### 设计模式的分类

根据用途，设计模式可以分为三大类：

#### 🏭 创建型模式 (Creational Patterns)
- **关注对象的创建过程**
- 将对象的创建与使用分离
- 提供创建对象的最佳方式

#### 🔧 结构型模式 (Structural Patterns)
- **关注类和对象的组合**
- 描述如何将类或对象结合在一起形成更大的结构
- 使系统更加灵活和高效

#### 🎭 行为型模式 (Behavioral Patterns)
- **关注对象间的通信**
- 描述算法和对象间职责的分配
- 提高系统间通信的灵活性

---

## 设计原则

在学习具体的设计模式之前，我们需要理解几个重要的设计原则。这些原则是设计模式的理论基础：

### SOLID 原则

#### 🎯 S - 单一职责原则 (Single Responsibility Principle)
**一个类应该只有一个引起变化的原因**

```javascript
// ❌ 违反单一职责原则
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  // 用户数据管理
  getName() { return this.name; }
  setName(name) { this.name = name; }

  // 数据库操作 - 不应该在这里
  save() {
    // 保存到数据库
  }

  // 邮件发送 - 不应该在这里
  sendEmail(subject, content) {
    // 发送邮件
  }
}

// ✅ 遵循单一职责原则
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getName() { return this.name; }
  setName(name) { this.name = name; }
}

class UserRepository {
  save(user) {
    // 保存用户到数据库
  }
}

class EmailService {
  sendEmail(user, subject, content) {
    // 发送邮件给用户
  }
}
```

#### 🔓 O - 开闭原则 (Open-Closed Principle)
**对扩展开放，对修改关闭**

```javascript
// ❌ 违反开闭原则
class AreaCalculator {
  calculateArea(shapes) {
    let totalArea = 0;
    shapes.forEach(shape => {
      if (shape.type === 'rectangle') {
        totalArea += shape.width * shape.height;
      } else if (shape.type === 'circle') {
        totalArea += Math.PI * shape.radius * shape.radius;
      }
      // 每次添加新形状都要修改这里
    });
    return totalArea;
  }
}

// ✅ 遵循开闭原则
class Shape {
  area() {
    throw new Error('Area method must be implemented');
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

class AreaCalculator {
  calculateArea(shapes) {
    return shapes.reduce((total, shape) => total + shape.area(), 0);
  }
}
```

#### 🔄 L - 里氏替换原则 (Liskov Substitution Principle)
**子类对象应该能够替换其父类对象**

#### 🔌 I - 接口隔离原则 (Interface Segregation Principle)
**不应该强迫客户依赖它们不使用的接口**

#### ⬇️ D - 依赖倒置原则 (Dependency Inversion Principle)
**高层模块不应该依赖低层模块，两者都应该依赖抽象**

### 其他重要原则

#### 🏗️ DRY - Don't Repeat Yourself
**不要重复自己** - 相同的逻辑不应该出现在多个地方

#### 💋 KISS - Keep It Simple, Stupid
**保持简单** - 简单的解决方案通常是最好的

#### 🚫 YAGNI - You Aren't Gonna Need It
**你不会需要它** - 不要添加当前不需要的功能

---

## 创建型模式

创建型模式专注于对象的创建机制，试图以适合特定情况的方式来创建对象。

### 1. 单例模式 (Singleton Pattern)

#### 📖 定义与意图
确保一个类只有一个实例，并提供一个全局访问点。

#### 🎯 适用场景
- 数据库连接池
- 日志记录器
- 配置管理器
- 缓存管理器

#### 💻 JavaScript 实现

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }

    this.data = [];
    Singleton.instance = this;
    return this;
  }

  addData(item) {
    this.data.push(item);
  }

  getData() {
    return this.data;
  }
}

// 使用
const instance1 = new Singleton();
const instance2 = new Singleton();
console.log(instance1 === instance2); // true

// 更优雅的实现 - 使用模块
const DatabaseConnection = (() => {
  let instance;

  function createInstance() {
    return {
      connect() {
        console.log('连接到数据库');
      },
      query(sql) {
        console.log(`执行查询: ${sql}`);
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// 使用
const db1 = DatabaseConnection.getInstance();
const db2 = DatabaseConnection.getInstance();
console.log(db1 === db2); // true
```

#### 🎨 在前端框架中的应用

```javascript
// Vue 中的应用 - Vuex Store
class Store {
  constructor() {
    if (Store.instance) {
      return Store.instance;
    }

    this.state = {};
    this.mutations = {};
    Store.instance = this;
  }

  commit(type, payload) {
    if (this.mutations[type]) {
      this.mutations[type](this.state, payload);
    }
  }
}

// React 中的应用 - Context
const AppContext = React.createContext();

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
```

#### ✅ 优点
- 确保全局只有一个实例
- 提供全局访问点
- 延迟初始化，节省资源

#### ❌ 缺点
- 违反单一职责原则
- 隐藏了类之间的依赖关系
- 难以进行单元测试

---

### 2. 工厂模式 (Factory Pattern)

#### 📖 定义与意图
定义一个创建对象的接口，让子类决定实例化哪一个类。

#### 🎯 适用场景
- 根据不同条件创建不同类型的对象
- 对象的创建过程复杂
- 需要隐藏对象创建的具体细节

#### 💻 简单工厂实现

```javascript
// 产品类
class Button {
  render() {
    throw new Error('render method must be implemented');
  }
}

class IOSButton extends Button {
  render() {
    return '<button class="ios-button">iOS 风格按钮</button>';
  }
}

class AndroidButton extends Button {
  render() {
    return '<button class="android-button">Android 风格按钮</button>';
  }
}

class WebButton extends Button {
  render() {
    return '<button class="web-button">Web 风格按钮</button>';
  }
}

// 简单工厂
class ButtonFactory {
  static createButton(type) {
    switch (type) {
      case 'ios':
        return new IOSButton();
      case 'android':
        return new AndroidButton();
      case 'web':
        return new WebButton();
      default:
        throw new Error(`Unknown button type: ${type}`);
    }
  }
}

// 使用
const iosButton = ButtonFactory.createButton('ios');
console.log(iosButton.render());
```

#### 💻 工厂方法实现

```javascript
// 抽象工厂类
class UIFactory {
  createButton() {
    throw new Error('createButton method must be implemented');
  }

  createInput() {
    throw new Error('createInput method must be implemented');
  }
}

// 具体工厂类
class IOSFactory extends UIFactory {
  createButton() {
    return new IOSButton();
  }

  createInput() {
    return new IOSInput();
  }
}

class AndroidFactory extends UIFactory {
  createButton() {
    return new AndroidButton();
  }

  createInput() {
    return new AndroidInput();
  }
}

// 使用
class Application {
  constructor(factory) {
    this.factory = factory;
  }

  createUI() {
    const button = this.factory.createButton();
    const input = this.factory.createInput();
    return { button, input };
  }
}

const app = new Application(new IOSFactory());
const ui = app.createUI();
```

#### 🎨 在前端中的实际应用

```javascript
// React 组件工厂
const ComponentFactory = {
  createForm(type, props) {
    const components = {
      'login': () => import('./LoginForm'),
      'register': () => import('./RegisterForm'),
      'forgot': () => import('./ForgotPasswordForm')
    };

    const Component = components[type];
    if (!Component) {
      throw new Error(`Unknown form type: ${type}`);
    }

    return Component().then(module =>
      React.createElement(module.default, props)
    );
  }
};

// HTTP 请求工厂
class RequestFactory {
  static createRequest(type) {
    const configs = {
      'api': {
        baseURL: 'https://api.example.com',
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      },
      'upload': {
        baseURL: 'https://upload.example.com',
        timeout: 30000,
        headers: { 'Content-Type': 'multipart/form-data' }
      },
      'download': {
        baseURL: 'https://cdn.example.com',
        timeout: 60000,
        responseType: 'blob'
      }
    };

    return axios.create(configs[type]);
  }
}
```

---

### 3. 建造者模式 (Builder Pattern)

#### 📖 定义与意图
将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。

#### 🎯 适用场景
- 对象的创建过程复杂，有很多可选参数
- 需要创建的对象有多种配置
- 创建过程需要分步骤进行

#### 💻 JavaScript 实现

```javascript
class Computer {
  constructor() {
    this.cpu = '';
    this.memory = '';
    this.storage = '';
    this.graphics = '';
    this.os = '';
  }

  display() {
    return `
      电脑配置：
      CPU: ${this.cpu}
      内存: ${this.memory}
      存储: ${this.storage}
      显卡: ${this.graphics}
      操作系统: ${this.os}
    `;
  }
}

class ComputerBuilder {
  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu) {
    this.computer.cpu = cpu;
    return this; // 返回自身，支持链式调用
  }

  setMemory(memory) {
    this.computer.memory = memory;
    return this;
  }

  setStorage(storage) {
    this.computer.storage = storage;
    return this;
  }

  setGraphics(graphics) {
    this.computer.graphics = graphics;
    return this;
  }

  setOS(os) {
    this.computer.os = os;
    return this;
  }

  build() {
    return this.computer;
  }
}

// 使用建造者模式
const gamingComputer = new ComputerBuilder()
  .setCPU('Intel i9-12900K')
  .setMemory('32GB DDR4')
  .setStorage('1TB NVMe SSD')
  .setGraphics('RTX 4080')
  .setOS('Windows 11')
  .build();

console.log(gamingComputer.display());

// 导演类 - 封装构建过程
class ComputerDirector {
  static buildGamingComputer() {
    return new ComputerBuilder()
      .setCPU('Intel i9-12900K')
      .setMemory('32GB DDR4')
      .setStorage('1TB NVMe SSD')
      .setGraphics('RTX 4080')
      .setOS('Windows 11')
      .build();
  }

  static buildOfficeComputer() {
    return new ComputerBuilder()
      .setCPU('Intel i5-12600')
      .setMemory('16GB DDR4')
      .setStorage('512GB SSD')
      .setGraphics('Integrated')
      .setOS('Windows 11')
      .build();
  }
}
```

#### 🎨 在前端中的应用

```javascript
// HTTP 请求建造者
class RequestBuilder {
  constructor() {
    this.config = {
      method: 'GET',
      headers: {},
      params: {},
      data: null
    };
  }

  method(method) {
    this.config.method = method;
    return this;
  }

  url(url) {
    this.config.url = url;
    return this;
  }

  header(key, value) {
    this.config.headers[key] = value;
    return this;
  }

  param(key, value) {
    this.config.params[key] = value;
    return this;
  }

  body(data) {
    this.config.data = data;
    return this;
  }

  build() {
    return axios(this.config);
  }
}

// 使用
const response = await new RequestBuilder()
  .method('POST')
  .url('/api/users')
  .header('Authorization', 'Bearer token')
  .header('Content-Type', 'application/json')
  .body({ name: '张三', email: 'zhangsan@example.com' })
  .build();

// React 组件建造者
class ComponentBuilder {
  constructor(type) {
    this.element = document.createElement(type);
  }

  className(className) {
    this.element.className = className;
    return this;
  }

  text(text) {
    this.element.textContent = text;
    return this;
  }

  onClick(handler) {
    this.element.addEventListener('click', handler);
    return this;
  }

  appendTo(parent) {
    parent.appendChild(this.element);
    return this;
  }

  build() {
    return this.element;
  }
}

// 使用
const button = new ComponentBuilder('button')
  .className('btn btn-primary')
  .text('点击我')
  .onClick(() => alert('按钮被点击'))
  .build();
```

---

## 结构型模式

结构型模式专注于如何将类和对象组合成更大的结构，同时保持结构的灵活性和高效性。

### 4. 适配器模式 (Adapter Pattern)

#### 📖 定义与意图
允许接口不兼容的类可以合作无间，将一个类的接口转换成客户希望的另外一个接口。

#### 🎯 适用场景
- 系统需要使用现有的类，但其接口不符合需求
- 想要创建一个可复用的类，与其他不相关的类协同工作
- 需要在不修改原有代码的情况下使用第三方库

#### 💻 JavaScript 实现

```javascript
// 旧的音频播放器（只支持 mp3）
class OldAudioPlayer {
  playMP3(filename) {
    console.log(`播放 MP3 文件: ${filename}`);
  }
}

// 新的高级音频播放器
class AdvancedAudioPlayer {
  playWAV(filename) {
    console.log(`播放 WAV 文件: ${filename}`);
  }

  playFLAC(filename) {
    console.log(`播放 FLAC 文件: ${filename}`);
  }
}

// 适配器 - 让旧播放器支持新格式
class AudioAdapter {
  constructor(audioType) {
    this.audioType = audioType;
    this.advancedPlayer = new AdvancedAudioPlayer();
  }

  play(filename) {
    switch (this.audioType.toLowerCase()) {
      case 'wav':
        this.advancedPlayer.playWAV(filename);
        break;
      case 'flac':
        this.advancedPlayer.playFLAC(filename);
        break;
      default:
        console.log(`不支持的音频格式: ${this.audioType}`);
    }
  }
}

// 媒体播放器 - 使用适配器
class MediaPlayer {
  constructor() {
    this.oldPlayer = new OldAudioPlayer();
  }

  play(audioType, filename) {
    if (audioType.toLowerCase() === 'mp3') {
      this.oldPlayer.playMP3(filename);
    } else {
      const adapter = new AudioAdapter(audioType);
      adapter.play(filename);
    }
  }
}

// 使用
const player = new MediaPlayer();
player.play('mp3', 'song.mp3');   // 播放 MP3 文件: song.mp3
player.play('wav', 'song.wav');   // 播放 WAV 文件: song.wav
player.play('flac', 'song.flac'); // 播放 FLAC 文件: song.flac
```

#### 🎨 在前端中的实际应用

```javascript
// 不同 HTTP 库的适配器
class HTTPAdapter {
  constructor(httpLib) {
    this.httpLib = httpLib;
  }

  async request(config) {
    switch (this.httpLib) {
      case 'fetch':
        return this.fetchAdapter(config);
      case 'axios':
        return this.axiosAdapter(config);
      case 'jquery':
        return this.jqueryAdapter(config);
      default:
        throw new Error(`不支持的 HTTP 库: ${this.httpLib}`);
    }
  }

  async fetchAdapter(config) {
    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: JSON.stringify(config.data)
    });
    return await response.json();
  }

  async axiosAdapter(config) {
    const response = await axios(config);
    return response.data;
  }

  jqueryAdapter(config) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: config.url,
        method: config.method,
        data: config.data,
        success: resolve,
        error: reject
      });
    });
  }
}

// 统一的 API 客户端
class APIClient {
  constructor(httpLib = 'fetch') {
    this.adapter = new HTTPAdapter(httpLib);
  }

  async get(url, headers = {}) {
    return this.adapter.request({
      method: 'GET',
      url,
      headers
    });
  }

  async post(url, data, headers = {}) {
    return this.adapter.request({
      method: 'POST',
      url,
      data,
      headers
    });
  }
}

// 不同存储方式的适配器
class StorageAdapter {
  constructor(storageType) {
    this.storageType = storageType;
  }

  setItem(key, value) {
    const stringValue = JSON.stringify(value);

    switch (this.storageType) {
      case 'localStorage':
        localStorage.setItem(key, stringValue);
        break;
      case 'sessionStorage':
        sessionStorage.setItem(key, stringValue);
        break;
      case 'cookie':
        document.cookie = `${key}=${stringValue}`;
        break;
      case 'memory':
        this.memoryStorage = this.memoryStorage || {};
        this.memoryStorage[key] = stringValue;
        break;
    }
  }

  getItem(key) {
    let value;

    switch (this.storageType) {
      case 'localStorage':
        value = localStorage.getItem(key);
        break;
      case 'sessionStorage':
        value = sessionStorage.getItem(key);
        break;
      case 'cookie':
        value = this.getCookieValue(key);
        break;
      case 'memory':
        value = this.memoryStorage?.[key];
        break;
    }

    return value ? JSON.parse(value) : null;
  }

  getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  }
}
```

---

### 5. 装饰器模式 (Decorator Pattern)

#### 📖 定义与意图
动态地给一个对象添加一些额外的职责，就增加功能来说，装饰器模式相比生成子类更为灵活。

#### 🎯 适用场景
- 需要扩展一个类的功能，或给一个类添加附加职责
- 需要动态的给一个对象添加功能，这些功能可以再动态的撤销
- 需要增加由一些基本功能的排列组合而产生的非常大量的功能

#### 💻 JavaScript 实现

```javascript
// 基础组件
class Coffee {
  cost() {
    return 5;
  }

  description() {
    return '咖啡';
  }
}

// 装饰器基类
class CoffeeDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost();
  }

  description() {
    return this.coffee.description();
  }
}

// 具体装饰器
class MilkDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 2;
  }

  description() {
    return this.coffee.description() + ' + 牛奶';
  }
}

class SugarDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 1;
  }

  description() {
    return this.coffee.description() + ' + 糖';
  }
}

class WhipDecorator extends CoffeeDecorator {
  cost() {
    return this.coffee.cost() + 3;
  }

  description() {
    return this.coffee.description() + ' + 奶泡';
  }
}

// 使用装饰器
let coffee = new Coffee();
console.log(`${coffee.description()}: ¥${coffee.cost()}`);
// 咖啡: ¥5

coffee = new MilkDecorator(coffee);
console.log(`${coffee.description()}: ¥${coffee.cost()}`);
// 咖啡 + 牛奶: ¥7

coffee = new SugarDecorator(coffee);
console.log(`${coffee.description()}: ¥${coffee.cost()}`);
// 咖啡 + 牛奶 + 糖: ¥8

coffee = new WhipDecorator(coffee);
console.log(`${coffee.description()}: ¥${coffee.cost()}`);
// 咖啡 + 牛奶 + 糖 + 奶泡: ¥11
```

#### 🎨 JavaScript 中的函数装饰器

```javascript
// 日志装饰器
function logDecorator(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args) {
    console.log(`调用方法 ${propertyKey}，参数:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${propertyKey} 返回:`, result);
    return result;
  };

  return descriptor;
}

// 性能监控装饰器
function performanceDecorator(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`方法 ${propertyKey} 执行时间: ${end - start}ms`);
    return result;
  };

  return descriptor;
}

// 缓存装饰器
function cacheDecorator(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`缓存命中: ${propertyKey}`);
      return cache.get(key);
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

// 使用装饰器
class Calculator {
  @logDecorator
  @performanceDecorator
  add(a, b) {
    return a + b;
  }

  @cacheDecorator
  fibonacci(n) {
    if (n < 2) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
```

#### 🎨 React 中的高阶组件（HOC）

```javascript
// 高阶组件本质上就是装饰器模式
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div>加载中...</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

function withAuth(WrappedComponent) {
  return function WithAuthComponent(props) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <div>请先登录</div>;
    }

    return <WrappedComponent {...props} />;
  };
}

// 使用多个装饰器
const UserProfile = withAuth(withLoading(UserProfileComponent));

// 函数式装饰器组合
const enhance = compose(
  withAuth,
  withLoading,
  withErrorBoundary
);

const EnhancedUserProfile = enhance(UserProfileComponent);
```

---

## 行为型模式

行为型模式专注于算法和对象间职责的分配，描述了对象和类的模式以及它们之间的通信模式。

### 6. 观察者模式 (Observer Pattern)

#### 📖 定义与意图
定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并被自动更新。

#### 🎯 适用场景
- 当一个抽象模型有两个方面，其中一个方面依赖于另一个方面
- 当对一个对象的改变需要同时改变其他对象，而不知道具体有多少对象有待改变
- 当一个对象必须通知其他对象，而又不能假定其他对象是谁

#### 💻 JavaScript 实现

```javascript
// 主题（被观察者）
class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
  }

  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }

  // 移除观察者
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // 通知所有观察者
  notify() {
    this.observers.forEach(observer => {
      observer.update(this.state);
    });
  }

  // 设置状态并通知观察者
  setState(state) {
    this.state = state;
    this.notify();
  }

  getState() {
    return this.state;
  }
}

// 观察者接口
class Observer {
  update(state) {
    throw new Error('update method must be implemented');
  }
}

// 具体观察者
class ConcreteObserver extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }

  update(state) {
    console.log(`${this.name} 收到通知，新状态: ${state}`);
  }
}

// 使用示例
const subject = new Subject();

const observer1 = new ConcreteObserver('观察者1');
const observer2 = new ConcreteObserver('观察者2');
const observer3 = new ConcreteObserver('观察者3');

subject.addObserver(observer1);
subject.addObserver(observer2);
subject.addObserver(observer3);

subject.setState('新的状态');
// 输出:
// 观察者1 收到通知，新状态: 新的状态
// 观察者2 收到通知，新状态: 新的状态
// 观察者3 收到通知，新状态: 新的状态

subject.removeObserver(observer2);
subject.setState('另一个状态');
// 输出:
// 观察者1 收到通知，新状态: 另一个状态
// 观察者3 收到通知，新状态: 另一个状态
```

#### 🎨 EventEmitter 实现

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 监听事件
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // 监听一次
  once(eventName, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }

  // 移除监听
  off(eventName, callback) {
    if (!this.events[eventName]) return;

    this.events[eventName] = this.events[eventName].filter(
      cb => cb !== callback
    );
  }

  // 触发事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return;

    this.events[eventName].forEach(callback => {
      callback(...args);
    });
  }

  // 移除所有监听器
  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }
}

// 使用示例
const emitter = new EventEmitter();

// 添加监听器
emitter.on('userLogin', (user) => {
  console.log(`用户 ${user.name} 登录了`);
});

emitter.on('userLogin', (user) => {
  console.log(`记录用户 ${user.id} 的登录时间`);
});

// 触发事件
emitter.emit('userLogin', { id: 1, name: '张三' });
// 输出:
// 用户 张三 登录了
// 记录用户 1 的登录时间
```

#### 🎨 在前端框架中的应用

```javascript
// Vue 的响应式系统
class Vue {
  constructor(options) {
    this.data = options.data;
    this.observers = [];

    // 使数据变为响应式
    this.observe(this.data);
  }

  observe(data) {
    Object.keys(data).forEach(key => {
      let value = data[key];
      const observers = [];

      Object.defineProperty(data, key, {
        get() {
          // 收集依赖
          if (Vue.currentWatcher) {
            observers.push(Vue.currentWatcher);
          }
          return value;
        },
        set(newValue) {
          value = newValue;
          // 通知所有观察者
          observers.forEach(watcher => watcher.update());
        }
      });
    });
  }
}

// React 的状态管理
class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = [];
  }

  // 订阅状态变化
  subscribe(callback) {
    this.subscribers.push(callback);

    // 返回取消订阅的函数
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  // 更新状态
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  // 通知所有订阅者
  notify() {
    this.subscribers.forEach(callback => {
      callback(this.state);
    });
  }

  getState() {
    return this.state;
  }
}

// 使用
const store = new Store({ count: 0, user: null });

const unsubscribe = store.subscribe((state) => {
  console.log('状态更新:', state);
});

store.setState({ count: 1 }); // 状态更新: { count: 1, user: null }
store.setState({ user: { name: '张三' } }); // 状态更新: { count: 1, user: { name: '张三' } }

unsubscribe(); // 取消订阅
```

---

### 7. 策略模式 (Strategy Pattern)

#### 📖 定义与意图
定义一系列算法，把它们一个个封装起来，并且使它们可相互替换。本模式使得算法可独立于使用它的客户而变化。

#### 🎯 适用场景
- 有多种方式实现同一个功能
- 需要在运行时动态选择算法
- 想要避免多重条件语句

#### 💻 JavaScript 实现

```javascript
// 策略接口
class Strategy {
  execute() {
    throw new Error('execute method must be implemented');
  }
}

// 具体策略 - 不同的排序算法
class BubbleSort extends Strategy {
  execute(array) {
    console.log('使用冒泡排序');
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1 - i; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }

    return arr;
  }
}

class QuickSort extends Strategy {
  execute(array) {
    console.log('使用快速排序');

    if (array.length <= 1) return array;

    const pivot = array[Math.floor(array.length / 2)];
    const left = array.filter(x => x < pivot);
    const middle = array.filter(x => x === pivot);
    const right = array.filter(x => x > pivot);

    return [
      ...this.execute(left),
      ...middle,
      ...this.execute(right)
    ];
  }
}

class MergeSort extends Strategy {
  execute(array) {
    console.log('使用归并排序');

    if (array.length <= 1) return array;

    const mid = Math.floor(array.length / 2);
    const left = this.execute(array.slice(0, mid));
    const right = this.execute(array.slice(mid));

    return this.merge(left, right);
  }

  merge(left, right) {
    const result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex] < right[rightIndex]) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result
      .concat(left.slice(leftIndex))
      .concat(right.slice(rightIndex));
  }
}

// 上下文类
class SortContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(array) {
    return this.strategy.execute(array);
  }
}

// 使用示例
const data = [64, 34, 25, 12, 22, 11, 90];

const sorter = new SortContext(new BubbleSort());
console.log(sorter.sort(data)); // 使用冒泡排序

sorter.setStrategy(new QuickSort());
console.log(sorter.sort(data)); // 使用快速排序

sorter.setStrategy(new MergeSort());
console.log(sorter.sort(data)); // 使用归并排序
```

#### 🎨 实际应用场景

```javascript
// 支付策略
class PaymentStrategy {
  pay(amount) {
    throw new Error('pay method must be implemented');
  }
}

class CreditCardPayment extends PaymentStrategy {
  constructor(cardNumber, cvv, expiryDate) {
    super();
    this.cardNumber = cardNumber;
    this.cvv = cvv;
    this.expiryDate = expiryDate;
  }

  pay(amount) {
    console.log(`使用信用卡支付 ¥${amount}`);
    console.log(`卡号: ${this.cardNumber}`);
    return { success: true, method: 'credit_card', amount };
  }
}

class AliPayPayment extends PaymentStrategy {
  constructor(account) {
    super();
    this.account = account;
  }

  pay(amount) {
    console.log(`使用支付宝支付 ¥${amount}`);
    console.log(`账户: ${this.account}`);
    return { success: true, method: 'alipay', amount };
  }
}

class WeChatPayment extends PaymentStrategy {
  constructor(account) {
    super();
    this.account = account;
  }

  pay(amount) {
    console.log(`使用微信支付 ¥${amount}`);
    console.log(`账户: ${this.account}`);
    return { success: true, method: 'wechat', amount };
  }
}

// 购物车
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item) {
    this.items.push(item);
  }

  setPaymentStrategy(strategy) {
    this.paymentStrategy = strategy;
  }

  getTotalAmount() {
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  checkout() {
    if (!this.paymentStrategy) {
      throw new Error('请选择支付方式');
    }

    const amount = this.getTotalAmount();
    return this.paymentStrategy.pay(amount);
  }
}

// 使用
const cart = new ShoppingCart();
cart.addItem({ name: '商品1', price: 100 });
cart.addItem({ name: '商品2', price: 200 });

// 使用不同的支付策略
cart.setPaymentStrategy(new CreditCardPayment('1234-5678-9012-3456', '123', '12/25'));
cart.checkout(); // 使用信用卡支付

cart.setPaymentStrategy(new AliPayPayment('user@example.com'));
cart.checkout(); // 使用支付宝支付
```

#### 🎨 表单验证策略

```javascript
// 验证策略
const validationStrategies = {
  required: (value, message = '此字段不能为空') => {
    return value && value.trim() !== '' ? null : message;
  },

  email: (value, message = '请输入有效的邮箱地址') => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  minLength: (minLength, message) => (value) => {
    if (!message) message = `最少需要 ${minLength} 个字符`;
    return value && value.length >= minLength ? null : message;
  },

  maxLength: (maxLength, message) => (value) => {
    if (!message) message = `最多只能 ${maxLength} 个字符`;
    return !value || value.length <= maxLength ? null : message;
  },

  pattern: (regex, message = '格式不正确') => (value) => {
    return regex.test(value) ? null : message;
  }
};

// 表单验证器
class FormValidator {
  constructor() {
    this.rules = {};
  }

  addRule(fieldName, strategies) {
    this.rules[fieldName] = strategies;
  }

  validate(formData) {
    const errors = {};

    Object.keys(this.rules).forEach(fieldName => {
      const value = formData[fieldName];
      const strategies = this.rules[fieldName];

      for (let strategy of strategies) {
        const error = strategy(value);
        if (error) {
          errors[fieldName] = error;
          break; // 一个字段只显示第一个错误
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// 使用
const validator = new FormValidator();

validator.addRule('email', [
  validationStrategies.required,
  validationStrategies.email
]);

validator.addRule('password', [
  validationStrategies.required,
  validationStrategies.minLength(8, '密码至少需要8个字符'),
  validationStrategies.pattern(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大写字母、小写字母和数字')
]);

validator.addRule('username', [
  validationStrategies.required,
  validationStrategies.minLength(3),
  validationStrategies.maxLength(20)
]);

const formData = {
  email: 'user@example.com',
  password: 'Password123',
  username: 'john'
};

const result = validator.validate(formData);
console.log(result);
// { isValid: true, errors: {} }
```

---

## 实战应用

### 前端框架中的设计模式

#### Vue.js 中的设计模式

```javascript
// 1. 观察者模式 - Vue 的响应式系统
class Vue {
  constructor(options) {
    this.data = options.data;
    this.methods = options.methods;

    // 观察者模式：监听数据变化
    this.observe(this.data);

    // 代理模式：将 data 和 methods 代理到实例上
    this.proxy();
  }

  observe(data) {
    Object.keys(data).forEach(key => {
      let value = data[key];
      const dep = new Dep(); // 依赖收集器

      Object.defineProperty(this.data, key, {
        get() {
          // 收集依赖
          if (Dep.target) {
            dep.depend();
          }
          return value;
        },
        set(newValue) {
          if (value !== newValue) {
            value = newValue;
            // 通知所有观察者
            dep.notify();
          }
        }
      });
    });
  }

  proxy() {
    Object.keys(this.data).forEach(key => {
      Object.defineProperty(this, key, {
        get() {
          return this.data[key];
        },
        set(value) {
          this.data[key] = value;
        }
      });
    });
  }
}

// 2. 组合模式 - Vue 组件树
class VueComponent {
  constructor(options) {
    this.name = options.name;
    this.children = [];
    this.parent = null;
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  render() {
    console.log(`渲染组件: ${this.name}`);
    this.children.forEach(child => child.render());
  }
}

// 3. 工厂模式 - Vue 组件创建
class ComponentFactory {
  static createComponent(type, props) {
    const components = {
      'button': () => new ButtonComponent(props),
      'input': () => new InputComponent(props),
      'dialog': () => new DialogComponent(props)
    };

    const createComponent = components[type];
    if (!createComponent) {
      throw new Error(`未知组件类型: ${type}`);
    }

    return createComponent();
  }
}
```

#### React 中的设计模式

```javascript
// 1. 高阶组件 - 装饰器模式
function withLoading(WrappedComponent) {
  return function WithLoadingComponent(props) {
    if (props.isLoading) {
      return <div className="loading">加载中...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

function withErrorBoundary(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('组件错误:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <div>出错了！</div>;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

// 2. Render Props - 策略模式
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 使用不同的渲染策略
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <h1>鼠标位置: ({x}, {y})</h1>
      )}
    />
  );
}

// 3. Context API - 单例模式
const ThemeContext = React.createContext();

class ThemeProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: 'light',
      toggleTheme: this.toggleTheme
    };
  }

  toggleTheme = () => {
    this.setState(prevState => ({
      theme: prevState.theme === 'light' ? 'dark' : 'light'
    }));
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}
```

### Node.js 中的设计模式

```javascript
// 1. 中间件模式 - 责任链模式
class ExpressApp {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  handle(req, res) {
    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        middleware(req, res, next);
      }
    };

    next();
  }
}

// 使用
const app = new ExpressApp();

app.use((req, res, next) => {
  console.log('日志中间件');
  next();
});

app.use((req, res, next) => {
  console.log('认证中间件');
  next();
});

app.use((req, res, next) => {
  console.log('业务处理');
  res.send('响应');
});

// 2. 模块模式 - 单例模式
const DatabaseConnection = (() => {
  let instance;

  function createConnection() {
    return {
      host: 'localhost',
      port: 3306,
      connect() {
        console.log('连接数据库');
      },
      query(sql) {
        console.log(`执行查询: ${sql}`);
      },
      close() {
        console.log('关闭连接');
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createConnection();
      }
      return instance;
    }
  };
})();

// 3. 事件驱动 - 观察者模式
const EventEmitter = require('events');

class OrderService extends EventEmitter {
  createOrder(orderData) {
    // 创建订单
    const order = { id: Date.now(), ...orderData };

    // 触发事件
    this.emit('orderCreated', order);

    return order;
  }
}

const orderService = new OrderService();

// 监听订单创建事件
orderService.on('orderCreated', (order) => {
  console.log('发送确认邮件');
});

orderService.on('orderCreated', (order) => {
  console.log('更新库存');
});

orderService.on('orderCreated', (order) => {
  console.log('记录日志');
});

// 创建订单会触发所有监听器
orderService.createOrder({ product: '商品A', quantity: 2 });
```

### 设计模式组合使用

```javascript
// 综合示例：购物车系统
// 使用多种设计模式的组合

// 1. 单例模式 - 购物车实例
class ShoppingCart {
  constructor() {
    if (ShoppingCart.instance) {
      return ShoppingCart.instance;
    }

    this.items = [];
    this.observers = [];
    this.discountStrategy = null;

    ShoppingCart.instance = this;
  }

  // 观察者模式 - 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }

  // 通知观察者
  notify(event, data) {
    this.observers.forEach(observer => {
      if (observer[event]) {
        observer[event](data);
      }
    });
  }

  // 添加商品
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }

    this.notify('itemAdded', { product, quantity });
  }

  // 移除商品
  removeItem(productId) {
    const index = this.items.findIndex(item => item.product.id === productId);
    if (index > -1) {
      const removedItem = this.items.splice(index, 1)[0];
      this.notify('itemRemoved', removedItem);
    }
  }

  // 策略模式 - 设置折扣策略
  setDiscountStrategy(strategy) {
    this.discountStrategy = strategy;
  }

  // 计算总价
  getTotal() {
    let total = this.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    // 应用折扣策略
    if (this.discountStrategy) {
      total = this.discountStrategy.applyDiscount(total, this.items);
    }

    return total;
  }

  getItems() {
    return [...this.items];
  }

  clear() {
    this.items = [];
    this.notify('cartCleared');
  }
}

// 2. 策略模式 - 不同的折扣策略
class DiscountStrategy {
  applyDiscount(total, items) {
    return total;
  }
}

class PercentageDiscount extends DiscountStrategy {
  constructor(percentage) {
    super();
    this.percentage = percentage;
  }

  applyDiscount(total, items) {
    return total * (1 - this.percentage / 100);
  }
}

class FixedAmountDiscount extends DiscountStrategy {
  constructor(amount) {
    super();
    this.amount = amount;
  }

  applyDiscount(total, items) {
    return Math.max(0, total - this.amount);
  }
}

class BuyTwoGetOneFreeDiscount extends DiscountStrategy {
  applyDiscount(total, items) {
    let discount = 0;

    items.forEach(item => {
      const freeItems = Math.floor(item.quantity / 3);
      discount += freeItems * item.product.price;
    });

    return total - discount;
  }
}

// 3. 观察者模式 - 不同的观察者
class InventoryObserver {
  itemAdded(data) {
    console.log(`库存减少: ${data.product.name} -${data.quantity}`);
  }

  itemRemoved(data) {
    console.log(`库存增加: ${data.product.name} +${data.quantity}`);
  }
}

class AnalyticsObserver {
  itemAdded(data) {
    console.log(`分析: 用户添加了 ${data.product.name}`);
  }

  itemRemoved(data) {
    console.log(`分析: 用户移除了 ${data.product.name}`);
  }

  cartCleared() {
    console.log('分析: 用户清空了购物车');
  }
}

class UIObserver {
  itemAdded(data) {
    this.updateCartUI();
  }

  itemRemoved(data) {
    this.updateCartUI();
  }

  cartCleared() {
    this.updateCartUI();
  }

  updateCartUI() {
    console.log('UI: 更新购物车显示');
  }
}

// 4. 工厂模式 - 产品工厂
class ProductFactory {
  static createProduct(type, data) {
    const products = {
      'book': () => new Book(data),
      'electronics': () => new Electronics(data),
      'clothing': () => new Clothing(data)
    };

    const createProduct = products[type];
    if (!createProduct) {
      throw new Error(`未知产品类型: ${type}`);
    }

    return createProduct();
  }
}

class Product {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.price = data.price;
  }
}

class Book extends Product {
  constructor(data) {
    super(data);
    this.author = data.author;
    this.isbn = data.isbn;
  }
}

class Electronics extends Product {
  constructor(data) {
    super(data);
    this.brand = data.brand;
    this.warranty = data.warranty;
  }
}

class Clothing extends Product {
  constructor(data) {
    super(data);
    this.size = data.size;
    this.color = data.color;
  }
}

// 使用示例
const cart = new ShoppingCart();

// 添加观察者
cart.addObserver(new InventoryObserver());
cart.addObserver(new AnalyticsObserver());
cart.addObserver(new UIObserver());

// 创建产品
const book = ProductFactory.createProduct('book', {
  id: 1,
  name: 'JavaScript高级程序设计',
  price: 89,
  author: 'Matt Frisbie'
});

const laptop = ProductFactory.createProduct('electronics', {
  id: 2,
  name: 'MacBook Pro',
  price: 12999,
  brand: 'Apple',
  warranty: '1年'
});

// 添加到购物车
cart.addItem(book, 2);
cart.addItem(laptop, 1);

console.log('原价总计:', cart.getTotal());

// 应用不同的折扣策略
cart.setDiscountStrategy(new PercentageDiscount(10));
console.log('九折后:', cart.getTotal());

cart.setDiscountStrategy(new FixedAmountDiscount(1000));
console.log('减1000后:', cart.getTotal());

cart.setDiscountStrategy(new BuyTwoGetOneFreeDiscount());
console.log('买二送一后:', cart.getTotal());
```

---

## 学习路径

### 🎯 初学者学习顺序

#### 第一阶段：基础模式（必学）
1. **单例模式** - 最容易理解，实用性强
2. **工厂模式** - 理解对象创建的抽象
3. **观察者模式** - 理解事件驱动编程

**🤔 思考题：**
- 在你的项目中，哪些地方可能需要全局唯一的实例？
- 什么时候需要根据条件创建不同类型的对象？
- 如何实现数据变化时自动更新UI？

#### 第二阶段：结构模式（进阶）
4. **装饰器模式** - 理解功能的动态扩展
5. **适配器模式** - 学会处理接口不兼容问题
6. **代理模式** - 理解间接访问的价值

#### 第三阶段：行为模式（高级）
7. **策略模式** - 避免复杂的条件语句
8. **命令模式** - 理解操作的封装
9. **状态模式** - 处理对象状态变化

### 📚 学习方法建议

#### 1. 理论 + 实践结合
```javascript
// 不要只看概念，要动手实现
class PatternExample {
  // 先写出最简单的实现
  basicImplementation() {
    // ...
  }

  // 再考虑实际应用场景
  realWorldExample() {
    // ...
  }

  // 最后思考优化和变种
  advancedFeatures() {
    // ...
  }
}
```

#### 2. 从问题出发学习
- **遇到问题时**：这个问题是否有对应的设计模式？
- **学习模式时**：这个模式解决什么问题？
- **应用模式时**：这里是否真的需要这个模式？

#### 3. 渐进式深入
```
第一遍：理解概念，知道是什么
第二遍：理解原理，知道为什么
第三遍：实际应用，知道怎么用
第四遍：融会贯通，知道何时用
```

### 🛠️ 实践项目推荐

#### 初级项目
1. **待办事项应用**
   - 使用观察者模式实现数据绑定
   - 使用策略模式实现不同的排序方式
   - 使用单例模式管理应用状态

2. **计算器应用**
   - 使用策略模式实现不同的计算操作
   - 使用命令模式实现撤销/重做功能
   - 使用工厂模式创建按钮组件

#### 中级项目
3. **音乐播放器**
   - 使用状态模式管理播放状态
   - 使用装饰器模式添加音效
   - 使用观察者模式实现播放列表同步

4. **在线商城**
   - 使用工厂模式创建不同类型的商品
   - 使用策略模式实现不同的支付方式
   - 使用装饰器模式实现商品功能扩展

#### 高级项目
5. **代码编辑器**
   - 使用命令模式实现编辑操作
   - 使用组合模式构建语法树
   - 使用访问者模式实现语法高亮

6. **游戏引擎**
   - 使用组件模式构建游戏对象
   - 使用状态模式管理游戏状态
   - 使用观察者模式实现事件系统

### 🚀 进阶学习建议

#### 1. 阅读优秀源码
```javascript
// 研究流行框架中的设计模式使用
// Vue.js 源码中的响应式系统（观察者模式）
// React 源码中的 Fiber 架构（组合模式）
// Express.js 中间件系统（责任链模式）
```

#### 2. 理解反模式
```javascript
// 学会识别和避免常见的反模式
class AntiPattern {
  // God Object - 违反单一职责原则
  godObject() {
    // 一个类做太多事情
  }

  // Spaghetti Code - 过度耦合
  spaghettiCode() {
    // 代码逻辑混乱，难以维护
  }

  // Copy-Paste Programming - 重复代码
  copyPasteCode() {
    // 大量重复，违反DRY原则
  }
}
```

#### 3. 设计模式组合
```javascript
// 学会组合使用多种模式
class AdvancedPattern {
  // 在一个系统中使用多种模式
  combinePatterns() {
    // 观察者 + 策略 + 工厂 + 单例
  }
}
```

### 📖 推荐学习资源

#### 经典书籍
1. **《设计模式：可复用面向对象软件的基础》** - GoF四人组
2. **《Head First 设计模式》** - 生动易懂的入门书
3. **《JavaScript设计模式与开发实践》** - JavaScript实现

#### 在线资源
1. **Refactoring.Guru** - 优秀的设计模式教程
2. **MDN Web Docs** - JavaScript相关模式
3. **GitHub** - 搜索设计模式的实现代码

#### 实践平台
1. **LeetCode** - 算法中的模式应用
2. **Codepen** - 前端模式演示
3. **GitHub** - 开源项目学习

---

## 总结

### 🎯 核心思想
设计模式不是银弹，而是工具箱中的工具。关键是：
- **理解问题的本质**
- **选择合适的模式**
- **避免过度设计**
- **保持代码简洁**

### 🤔 思考与反思
在学习和应用设计模式时，要经常问自己：
1. 这个模式真的解决了问题吗？
2. 是否有更简单的解决方案？
3. 代码是否变得更容易理解和维护？
4. 是否为了使用模式而使用模式？

### 💡 最佳实践
1. **需求驱动**：先有问题，再找模式
2. **渐进式重构**：不要一开始就过度设计
3. **团队约定**：保持团队对模式使用的一致性
4. **持续学习**：设计模式是思维方式，需要不断实践

**记住：优秀的代码不是因为使用了设计模式而优秀，而是因为解决了问题并且易于维护而优秀。设计模式只是达到这个目标的手段之一。** 🚀

---

**继续学习，不断实践，让设计模式成为你编程思维的一部分！** 💪