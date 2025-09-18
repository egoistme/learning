# 原型链与继承 - 大厂必考核心题

> **难度**: ⭐⭐⭐⭐⭐ | **出现频率**: 95% | **重要程度**: 核心必考

## 📋 题目清单

### 🔥 基础概念题

#### 1. 什么是原型链？请详细解释其工作原理

**考察点**: JavaScript继承机制、原型链查找过程

**参考答案**:

原型链是JavaScript实现继承的主要方法。每个对象都有一个内部属性`[[Prototype]]`（通过`__proto__`访问），指向其构造函数的`prototype`对象。

**工作原理**:
1. 当访问对象属性时，先在对象自身查找
2. 如果没有找到，沿着`__proto__`向上查找
3. 直到找到属性或到达`Object.prototype`（原型链顶端）
4. 如果还没找到，返回`undefined`

```javascript
// 原型链示例
function Person(name) {
    this.name = name;
}

Person.prototype.sayHello = function() {
    console.log(`Hello, I'm ${this.name}`);
};

const person = new Person('张三');

console.log(person.name);           // 直接访问实例属性
person.sayHello();                  // 通过原型链访问方法
console.log(person.toString());     // 通过原型链访问Object.prototype方法

// 原型链路径: person -> Person.prototype -> Object.prototype -> null
```

---

#### 2. 请解释`prototype`和`__proto__`的区别

**考察点**: 原型对象与原型链的概念区分

**参考答案**:

```javascript
function Constructor() {}
const instance = new Constructor();

// prototype: 构造函数的原型对象属性
console.log(Constructor.prototype);              // 构造函数的原型对象
console.log(typeof Constructor.prototype);       // 'object'
console.log(Constructor.prototype.constructor);   // Constructor函数本身

// __proto__: 实例对象的原型链指针
console.log(instance.__proto__);                 // 指向Constructor.prototype
console.log(instance.__proto__ === Constructor.prototype); // true

// 关键区别
console.log(Constructor.__proto__);              // 指向Function.prototype
console.log(Constructor.prototype.__proto__);    // 指向Object.prototype
```

**核心区别**:
- `prototype`: 函数特有属性，指向原型对象
- `__proto__`: 所有对象都有，指向其构造函数的`prototype`

---

### 🔥 深入理解题

#### 3. 手写实现`instanceof`操作符

**考察点**: 原型链查找算法、JavaScript内部机制

```javascript
// 手写instanceof
function myInstanceof(obj, Constructor) {
    // 边界条件处理
    if (obj === null || obj === undefined) return false;
    if (typeof Constructor !== 'function') {
        throw new TypeError('Right-hand side of instanceof is not callable');
    }

    // 获取对象的原型链
    let prototype = Object.getPrototypeOf(obj);
    // 获取构造函数的prototype对象
    let constructorPrototype = Constructor.prototype;

    // 沿着原型链查找
    while (prototype !== null) {
        if (prototype === constructorPrototype) {
            return true;
        }
        prototype = Object.getPrototypeOf(prototype);
    }

    return false;
}

// 测试用例
class Parent {}
class Child extends Parent {}
const child = new Child();

console.log(myInstanceof(child, Child));   // true
console.log(myInstanceof(child, Parent));  // true
console.log(myInstanceof(child, Object));  // true
console.log(myInstanceof(child, Array));   // false

// 边界测试
console.log(myInstanceof(null, Object));   // false
console.log(myInstanceof([], Array));      // true
```

---

#### 4. 实现一个完整的继承模式（包含ES5和ES6方式）

**考察点**: 继承的多种实现方式、class语法糖原理

**ES5 原型继承**:
```javascript
// 1. 组合继承（推荐）
function Parent(name) {
    this.name = name;
    this.hobbies = ['reading', 'coding'];
}

Parent.prototype.sayName = function() {
    console.log('My name is ' + this.name);
};

function Child(name, age) {
    // 继承实例属性
    Parent.call(this, name);
    this.age = age;
}

// 继承原型方法
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.sayAge = function() {
    console.log('I am ' + this.age + ' years old');
};

// 测试
const child1 = new Child('小明', 18);
const child2 = new Child('小红', 20);

child1.hobbies.push('gaming');
console.log(child1.hobbies); // ['reading', 'coding', 'gaming']
console.log(child2.hobbies); // ['reading', 'coding'] - 独立的数组

child1.sayName(); // My name is 小明
child1.sayAge();  // I am 18 years old
```

**ES6 Class继承**:
```javascript
class Parent {
    constructor(name) {
        this.name = name;
        this.hobbies = ['reading', 'coding'];
    }

    sayName() {
        console.log(`My name is ${this.name}`);
    }

    // 静态方法
    static getSpecies() {
        return 'Homo sapiens';
    }
}

class Child extends Parent {
    constructor(name, age) {
        super(name); // 调用父类构造函数
        this.age = age;
    }

    sayAge() {
        console.log(`I am ${this.age} years old`);
    }

    // 方法重写
    sayName() {
        super.sayName(); // 调用父类方法
        console.log('I am a child');
    }
}

// 验证继承关系
const child = new Child('小王', 16);
console.log(child instanceof Child);  // true
console.log(child instanceof Parent); // true
console.log(Child.getSpecies());      // 'Homo sapiens'
```

---

### 🔥 高频面试题

#### 5. 解释下面代码的输出结果

**考察点**: 原型链查找、属性覆盖、引用类型共享

```javascript
function Parent() {
    this.a = 1;
    this.b = [1, 2, this.a];
    this.c = { demo: 5 };
}

function Child() {
    this.a = 2;
    this.change = function() {
        this.b.push(this.a);
        this.a = this.b.length;
        this.c.demo = this.a++;
    };
}

Child.prototype = new Parent();
var parent = new Parent();
var child1 = new Child();
var child2 = new Child();

child1.a = 11;
child2.a = 12;

parent.change = child1.change;
child1.change.call(parent);
child2.change();

console.log(parent.a);    // ?
console.log(child1.a);    // ?
console.log(child2.a);    // ?
console.log(parent.b);    // ?
console.log(child1.b);    // ?
console.log(child2.b);    // ?
```

**详细分析**:

```javascript
// 初始状态分析
// parent: { a: 1, b: [1, 2, 1], c: { demo: 5 } }
// Child.prototype: { a: 1, b: [1, 2, 1], c: { demo: 5 } }
// child1: { a: 11, change: function() {...} }
// child2: { a: 12, change: function() {...} }

// 执行 child1.change.call(parent)
// 相当于在parent上下文执行change方法
// this指向parent
parent.change = child1.change;
child1.change.call(parent);
// 执行过程：
// 1. this.b.push(this.a) => parent.b.push(parent.a) => [1,2,1,1]
// 2. this.a = this.b.length => parent.a = 4
// 3. this.c.demo = this.a++ => parent.c.demo = 4, 然后parent.a = 5

// 执行 child2.change()
// this指向child2，但child2没有b和c属性，会通过原型链找到Child.prototype上的
child2.change();
// 执行过程：
// 1. this.b.push(this.a) => Child.prototype.b.push(12) => [1,2,1,1,12]
// 2. this.a = this.b.length => child2.a = 5
// 3. this.c.demo = this.a++ => Child.prototype.c.demo = 5, 然后child2.a = 6

// 最终结果
console.log(parent.a);    // 5
console.log(child1.a);    // 11 (未修改)
console.log(child2.a);    // 6
console.log(parent.b);    // [1, 2, 1, 1]
console.log(child1.b);    // [1, 2, 1, 1, 12] (通过原型链访问)
console.log(child2.b);    // [1, 2, 1, 1, 12] (通过原型链访问)
```

---

#### 6. 实现一个深度克隆函数处理原型链

**考察点**: 原型链复制、循环引用、特殊对象处理

```javascript
function deepCloneWithPrototype(obj, hash = new WeakMap()) {
    // 处理null和undefined
    if (obj === null || obj === undefined) return obj;

    // 处理基本类型
    if (typeof obj !== 'object') return obj;

    // 处理Date
    if (obj instanceof Date) return new Date(obj);

    // 处理RegExp
    if (obj instanceof RegExp) return new RegExp(obj);

    // 处理循环引用
    if (hash.has(obj)) return hash.get(obj);

    // 获取对象的构造函数，保持原型链
    const Constructor = obj.constructor;
    const cloned = new Constructor();

    // 缓存克隆对象，处理循环引用
    hash.set(obj, cloned);

    // 复制所有可枚举属性
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepCloneWithPrototype(obj[key], hash);
        }
    }

    // 复制不可枚举属性
    const symbols = Object.getOwnPropertySymbols(obj);
    for (let symbol of symbols) {
        cloned[symbol] = deepCloneWithPrototype(obj[symbol], hash);
    }

    return cloned;
}

// 测试用例
class Person {
    constructor(name) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, ${this.name}`);
    }
}

const original = new Person('原对象');
original.hobbies = ['reading'];
original.self = original; // 循环引用

const cloned = deepCloneWithPrototype(original);

console.log(cloned instanceof Person);  // true - 保持原型链
console.log(cloned.name);               // '原对象'
console.log(cloned.self === cloned);    // true - 正确处理循环引用
cloned.greet();                         // Hello, 原对象
```

---

## 💡 面试技巧

### 🎯 答题要点

1. **概念清晰**: 明确区分`prototype`、`__proto__`、`constructor`
2. **原理深入**: 解释原型链查找机制和继承实现
3. **实际应用**: 结合框架源码或实际项目经验
4. **注意边界**: 考虑null、undefined等特殊情况

### 🎯 常见追问

1. **为什么需要原型链？**
   - 实现继承和代码复用
   - 节省内存（方法共享）

2. **原型链的性能问题？**
   - 查找链过长影响性能
   - 使用`hasOwnProperty`避免原型链查找

3. **ES6 class与ES5继承的区别？**
   - class有提升但不初始化（暂时性死区）
   - super关键字
   - 静态方法继承

### 🎯 扩展知识

- **原型污染攻击**: 修改`Object.prototype`的安全风险
- **Mixin模式**: 多重继承的实现方式
- **组合优于继承**: 现代JavaScript开发理念

---

## 🔗 相关面试题

- [闭包原理与应用](./closure.md)
- [this绑定机制](./this-binding.md)
- [执行上下文](./execution-context.md)
- [Object.create vs new](./object-creation.md)