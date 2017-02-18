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

这个就是在 JavaScript 中完全没有的概念了。如果学习了 Java 的对这个应该不陌生。下面就介绍一下 TypeScript 的接口。

学习接口之前需要知道的一个名词是：鸭子类型（dock typing）。这个名词的来源是一句谚语：当看到一只鸟走起来像鸭子、游泳起来像鸭子、叫起来也像鸭子，那么这只鸟就可以被称为鸭子。例如 JavaScript 里的数组和函数的 `arguments`，`arguments` 和数组一样有它的 `length`，也可以通过下标来获取值，`arguments` 就是一个类数组。

鸭子类型总结起来就是，不关注本身是什么，只关注某些方面是否相同。这就是 TypeScript 里接口的作用。

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
> 从源码可以看出其实数组的 `push` 方法完全没有涉及到判断它是不是一个真的数组，只和 `length` 有关。这就是鸭子类型很典型的体现。

> 参考：[深入理解JAVASCRIPT类数组](http://hao.jser.com/archive/10357/)

TypeScript 的接口使用方法如下。

#### 首先是个简单的例子：

```typescript
function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```
`printLabel` 是一个函数，他有一个参数 `labelledObj`，传递过来的 `labelledObj` 必须是一个包括 `label` 属性的对象。注意到我们传的 `myObj` 对象除了 `label` 之外还有别的属性，但是编译器只会检查传递过来的参数里至少有我们所规定的 ` label` 属性就好。

在 TypeScript 里，只要传递给函数的对象和接口 **形似** 就可以了，并且和对象里属性的顺序也没有关系。

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

现在，`LabelledValue` 就是我们所定义的那个接口的名字了。

#### 可选属性 Optional Properties

如果接口中的某些属性是可有可无的，那么就可以定义时在属性后面加上一个问号 `?`，代表它是一个可选属性，下面是一个简单的例子：

```typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

#### 只读属性 Readonly properties

有一些属性可能不能去更改它，那么就可以在定义时在属性前面加上 `readonly`，那么在变量声明赋值之后就不能再更改属性的值了。这个和 ECMAScript 2015 里的 `const` 比较类似。那么什么时候用 `readonly` 什么时候用 `const` 呢？当然是变量使用 `const` 而属性使用 `readonly`。

例子：

```typescript
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // 出错!
```

#### 任意属性

有的时候我们需要接口中允许有任意名字的属性，TypeScript 中可以使用 `[propName: string]: any` 来定义一个任意属性，例如：

```typescript
interface Website {
	title: string;
	url: string;
	[propName: string]: string;
}
const geeku: Website = {
	title: 'Geeku',
	url: 'https://geeku.net',
	blog: 'http://blog.geeku.net'
}
```

需要注意的是，如果你在接口中定义了 任意属性，那么接口中的其他的属性的类型都要是可选属性类型的子属性。


### 数组的类型

TypeScript 中也扩展了数组的定义方式，包括 *类型[]* , *泛型* 和 *接口* 三种方法。

#### 类型[]

我们可以使用类型后面加一个方括号的形式来定义数组：

```typescript
const myDomains: string[] = [ 'geeku.net', 'geeku.work', 'gcinori.com' ];
```

若数组中出现了其他类型的元素就会报错。同样的在这里我们也可以使用联合类型。

#### 泛型 Generic

除了 *类型[]* 我们还可以使用形如 `Array<type>` 来表示数组，这种表示方式叫做泛型，例如：

```typescript
const myDomains: Array<string> = [ 'geeku.net', 'geeku.work', 'gcinori.com' ];
```

关于泛型的内容将在后文详细介绍。

#### 接口

接口也是用来表示数组元素类型的一个很有用的方式，例子如下：

```typescript
interface StringArray {
    [index: number]: string
}
const myDomains: StringArray = [ 'geeku.net', 'geeku.work', 'gcinori.com' ];
```

### 函数

函数包括参数和返回值，在 TypeScript 中要把这两者都考虑到。

```typescript
function sum (x: number, y: number): number {
	return x + y;
}
```

#### 可选参数

括号内的即为参数的类型，括号后的即为函数的返回值的类型。需要注意的是，在 TypeScript 中，函数声明之后调用时所传入的参数不可多于也不可少于声明时所定义参数。如果需要有可选参数，我们可以使用和接口类似的问号 `?` 来定义可选参数，例如：

```typescript
function sum (x: number, y: number, z?: number): number {
	if (z) return x + y + z;
	else return x + y;
}
```

在这里注意一下，可选参数后面不可再接必选参数。

#### 参数默认值

除了通过添加问号之外，我们还可以给参数添加默认值，使之成为一个可选参数，例如：

```typescript
function sum (x: number, y: number, z: number = 10): number {
	return x + y + z;
}
```

而这样给参数添加默认值的方法就不再受到限制，可以放在任意位置。

#### rest 参数

TypeScript 中也可以使用类似 ES6 中的 rest 参数来获取剩余参数。例如：

```typescript
function sum (x: number, y: number, z: number = 10, ...rest: number[]): number {
	let sum = x + y + z;
	rest.forEach(num => {
		sum += num;
	});
	
	return sum;
}
```

#### 重载

TypeScript 为 JavaScript 加上了重载。重载是指你可以通过给函数传递不同数量或类型的参数使得函数做出不同的处理。例如：

```typescript
function sum (x: number): number;
function sum (x: string): string;
function sum (x): any  {
	if (typeof x === 'string') {
		return '[String]: ' + x;
	} else {
		return x;
	}
}
```

注意到前两行都是函数定义，第三行是函数实现。

### 类型断言 Type Assertion

类型断言是指当你有个联合类型的变量时手动将它指定为具体类型。具体方法为在变量前面加上 `<type>`。 例如：

```typescript
function sum (x: number | string): number {
	if (x.length) return true; // 报错
	if ((<stirng>x).length) return true;  // 正确
}
```

需要注意的是，类型断言只可以断言成联合类型中存在的类型，例如上面的例子，`x` 只能断言为 `number` 或者 `string`，否则将会报错。

### 声明 Declare

当我们在 TypeScript 使用第三方库时，需要引用第三方库的声明文件，例如我们要引入 jQuery，然而当我们在代码里直接使用 jQuery 时会报错，因为 TypeScript 并不知道 jQuery 是一个什么东西。所以这时我们就需要使用 `declare` 帮 TypeScript 判断 jQuery 是什么。例如：

```typescript
declare const jQuery: (string) => any;
```

之后我们就可以在 TypeScript 里使用 jQuery 了。`declare` 只用于编译时的检查，输出中会被删除。

#### 声明文件

顾名思义声明文件就是我们把类型的声明放入的一个单独的文件，这个文件的后缀一般为 `.d.ts`。之后我们可以用形如 `/// <referrence path="path/to/your.d.ts">` 的方式来引用声明文件，例如：

```typescript
/// <reference path="path/to/jquery.d.tx">

$body = jQuery('body');
```

TypeScript 在 2.0 的时候加入了 `@types` 来管理 TypeScript 的声明文件。我们可以通过 `npm install --save @types/lodash` 来下载已经写好的声明文件。然后就可以直接引入了。例如：

```typescript
import * as _ from "lodash";
_.padStart("Hello TypeScript!", 20, " ");
```

P.S. 我们可以在 [TypeSearch](http://microsoft.github.io/TypeSearch/) 来搜索已有的声明文件。【最近官方的有些问题，可以先在[这里](https://rajington.github.io/TypeSearch/)搜索】

### 内置对象

JavaScript 中包括很多内置对象，我们可以在 TypeScript 中直接使用它们。

传送门：[Standard built-in objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)

[TypeScript 核心库定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)

注意，如果想用 TypeScript 写 Node.js，则需要引入 Node.js 的第三方文件，可以通过 `npm install --save @types/node` 来使用。

## 进阶