# TypeScript 学习笔记

本文是一篇 TypeScript 的学习笔记，使用的教程是 [Typescript 入门教程](https://ts.xcatliu.com/advanced/string-literal-types.html)


## 简介

### 啥是 TypeScript

官网说 TypeScript 是：
> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Any browser. Any host. Any OS. Open source.

自己翻译一下就是
> TypeScript 是一种可以被编译成纯 JavaScript 的语言，是 JavaScript 的超集。可以在所有你知道的浏览器，操作系统上运行。而且还是开源的。

啥是超集？就是指 JavaScript 有的 TypeScript 都有，JavaScript 没有的 TypeScript 也可能有。

TypeScript 的优点和缺点我就不多说了也说不好，想具体了解的可以去上面那个教程地址里看，或者 Google 一下你就知道。

其实本人是不太喜欢 TypeScript 的。感觉它给 JavaScript 加上了太多的约束。虽然说z这样有很多的优点。但是我还是喜欢纯 JavaScript 自由的感觉。

然而我司要用白鹭做小游戏了，虽然之前看过一点 ts，但是还是再系统的学一遍吧。

### 安装

```bash
npm install -g typescript
```

### 编译

```
tsc hello.ts
```

### 编辑器选择

曾经的我是 Sublime Text 的粉，直到我遇到了 Visual Studio Code。

## 基础

### 基本数据类型 

#### 原始数据类型 Primitive data types
- 数值 `number`
- 字符串 `string`
- 布尔值 `boolean`
- 未定义 `undefined`
- 空 `null`
- 符号 [ES6] `Symbol`

#### 其他类型
- 空 `void`
- 任意 `any`

使用方法如下：

```typescript
let iAmNumber: number = 1;
let iAmString: string = 'String';
let iAmEmpty: void = null;
let iAmArbitraryValue: any;
```

其中 `void` 的值只能是 `undefined` 和 `null`，而 `any` 可以是任意值。

需要注意的是，如果省略了类型并且在声明的时候没有赋值则默认为 `any` 类型。如果省略了类型却在声明时赋值了则 TypeScript 会根据类型推论（Type Inference）自动判断它的类型。

### 联合类型 Union Types

TypeScript 里的变量常量的取值还可以为多种类型其中之一，例如：

```typescript
let iAmNumOrString: number | string = 1;
iAmNumOrString = 'String';
```

这里需要注意的一点是，如果使用的是联合类型，那么在访问对应变量的方法的时候，只能访问所有类型所共用的方法。


### 接口 Interfaces

这个就是在 JavaScript 中完全没有的概念了。如果学习了 Java 的对这个应该就不陌生了。

学习接口之前需要知道的一个名词是：鸭子类型（dock typing）。这个名词的来源是一句谚语：当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。例如 JavaScript 里的数组和函数的 `arguments`，`arguments` 和数组一样有它的 `length`，也可以通过下标来获取值，`arguments` 就是一个类数组。

>这里稍微扩展一下。`arguments` 其实是一个形如 `{ 0: 1, 1: 2, length: 2 }` 的一个对象，那么为什么 `arguments` 可以通过类似 `[].push.call(arguments, 0)` 这样的方式使用真·数组的方法呢。翻看 Google 的 V8 引擎处理数组的源代码就可以大概了解到了，关于数组的源码地址在这里：[array.js](https://github.com/v8/v8/blob/master/src/js/array.js)。

>这里以数组的 `push` 为例：

>```javascript
// 把所有参数附加到数组的最后并且返回新的数组长度
// Appends the arguments to the end of the array and returns the new
// length of the array. See ECMA-262, section 15.4.4.7.
function ArrayPush() {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.push");

>  var array = TO_OBJECT(this); // 获取数组
  var n = TO_LENGTH(array.length); // 获取数组的length
  var m = arguments.length; // 获取参数的length
	
>  // 不管
  // Subtract n from kMaxSafeInteger rather than testing m + n >
  // kMaxSafeInteger. n may already be kMaxSafeInteger. In that case adding
  // e.g., 1 would not be safe.
  if (m > kMaxSafeInteger - n) throw %make_type_error(kPushPastSafeLength, m, n);
	
>  // 依次将参数附加到数组中
  for (var i = 0; i < m; i++) {
    array[i+n] = arguments[i];
  }

>  var new_length = n + m;
  array.length = new_length;
  return new_length;
}
```
从源码可以看出

> 参考：[深入理解JAVASCRIPT类数组](http://hao.jser.com/archive/10357/)

TypeScript 的接口使用方法如下。

首先是个简单的例子：

```typescript
function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```
`printLabel` 是一个函数，他有一个参数 `labelledObj`，传递过来的 `labelledObj` 必须是一个包括 `label` 属性的对象。注意到我们传的 `myObj` 对象除了 `label` 之外还有别的属性，但是编译器只会检查传递过来的参数里至少有我们所规定的 ` label` 属性就好。

其实上面的那个例子就等价于：

```typescript
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

现在，`LabelledValue` 就是我们所定义的那个接口的名字了。在 TypeScript 里，只要传递给函数的对象和接口 **形似** 就可以了，并且。



## 进阶