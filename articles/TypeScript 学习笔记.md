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

这里稍微扩展一下。`arguments` 其实是一个形如 `{ 0: 1, 1: 2, length: 2 }` 的一个对象，那么为什么 `arguments` 可以通过类似 `[].push.call(arguments, 0)` 这样的方式使用真·数组的方法呢。翻看 Google 的 V8 引擎处理数组的源代码就可以大概了解到了，关于数组的源码地址在这里：[array.js](https://github.com/v8/v8/blob/master/src/js/array.js)。
这里以数组的 `push` 为例：

```javascript
// 把所有参数附加到数组的最后并且返回新的数组长度
// Appends the arguments to the end of the array and returns the new
// length of the array. See ECMA-262, section 15.4.4.7.
function ArrayPush() {
  CHECK_OBJECT_COERCIBLE(this, "Array.prototype.push");
  var array = TO_OBJECT(this); // 获取数组
  var n = TO_LENGTH(array.length); // 获取数组的length
  var m = arguments.length; // 获取参数的length
	
  // 不管
  // Subtract n from kMaxSafeInteger rather than testing m + n >
  // kMaxSafeInteger. n may already be kMaxSafeInteger. In that case adding
  // e.g., 1 would not be safe.
  if (m > kMaxSafeInteger - n) throw %make_type_error(kPushPastSafeLength, m, n);
	
  // 依次将参数附加到数组中
  for (var i = 0; i < m; i++) {
    array[i+n] = arguments[i];
  }

  var new_length = n + m;
  array.length = new_length;
  return new_length;
}
```
从源码可以看出其实数组的 `push` 方法完全没有涉及到判断它是不是一个真的数组，只和 `length` 有关。这就是鸭子类型很典型的体现。

参考：[深入理解JAVASCRIPT类数组](http://hao.jser.com/archive/10357/)

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

有一些属性可能不能去更改它，那么就可以在定义时在属性前面加上 `readonly`，那么在变量声明赋值之后就不能再更改属性的值了。这个和 ECMAScript 6 里的 `const` 比较类似。那么什么时候用 `readonly` 什么时候用 `const` 呢？当然是变量使用 `const` 而属性使用 `readonly`。

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


### 类型别名

不多说，看代码：

```typescript
type num = number;
type str = string;
type numOrStr = num | str;

const test: numOrStr = 1;
```

### 字符串字面量类型

字符串字面量类型可以用来把取值限制在几个字符串之中，例如：

```typescript
type javascript = 'good' | 'perfect' | 'awesome' | 'wonderful';

const js: javascript = 'bad' // ERROR!
const myJS: javascript = 'good' // PASS
```

### 元组 Tuple

啥是元组？元组声明了一个数组并且规定了数组内每个元素的类型。例如

```typescript
let Tree: [stirng, number] = ['Pei Gong', 24];
```
这里需要注意的是，如果数组的元素超过了元组规定的，那么后面的元素会被限制为元组规定的各个类型的联合类型。


### 枚举 Enum

// TODO

### 类 Class

ES6 中已经有类了，虽说是个语法糖但写起来也是简单了不少，TypeScript 的类除了实现 ES6 中的功能之外，还包括了其他的用法。

### ECMAScript 6 中的类

首先简单介绍下 ES6 中类的概念，具体内容可以阮一峰的 [ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/class)

#### 基本写法

TypeScript 通过 `class` 定义一个类：

```javascript
class Animal {
	constructor (name) {
		this.name = name;
	}
	myName () {
		return this.name;
	}
}
```

如上所示，使用 `class Animal {}` 来定义一个名为 Animal 的类，类名一般以大写字母开头，constructor 则是类的构造函数，在新建实例时会自动调用 `constructor`。

#### 继承 Extends

通过 `extends` 可以为当前类指定继承一个父类，例如：

```javascript
class Dog extends Animal {
	constructor (name) {
		super(name);
	}
}
const doge = new Dog('doge');
doge.myName(); // doge
```

如上所示，使用 `class Dog extends Animal {}` 来定义一个继承自 `Animal`, 名为 Dog 的类。在子类中用super来表示父类，通过 `super()` 来调用父类的 `constructor` 以继承父类的属性。通过 `super.myName()` 可以调用父类的方法。

#### 存取器 Getter & Setter

通过 getter 和 setter 我们可以改变属性的赋值&读取方式，例如：

```javascript
class Animal {
 	private _name = '';
	constructor (name) {
		this.name = name;
	}
	myName () {
		return this.name;
	}
	get name () {
		return this._name;
	}
	set name (newVal) {
		this._name = '[Animal] ' + newVal;
	}
}
const unknown = new Animal('unknown');

console.log(unknown.name); // [Animal] unknown

unknown.name = 'known';

console.log(unknown.name); // [Animal] known
```

#### 静态方法

如果在方法前面加上 `static` 修饰符，那么这个方法被称为静态方法。这些方法不需要实例化可以直接通过类来调用，例如：

```javascript
class Animal {
	constructor (name) {
		this.name = name;
	}
	myName () {
		return this.name;
	}
	static isAnimal (obj) {
		return obj instanceof Animal;
	}
}
const unknown = new Animal('unknown');
Animal.isAnimal(unknown) // true
Animal.isAnimal({}) // false
```

#### 静态属性

类的静态属性是指类本身的属性，而不是定义在实例上的属性，即你只能通过 `ClassName.prop` 来获取这个值。例如：

```javascript
class Animal {
	constructor (name) {
		this.name = name;
	}
}
Animal.amount = 8.7e6;
console.log(Animal.amount); // 8700000
```

需要注意的是，ES6 还不支持在类里定义静态属性。

### ECMAScript 7 中的类

ES7 中还有一些关于类的提案，TypeScript 中也都实现了。

#### 实例属性

ES7 在提案中可以在类里直接定义实例属性，例如：

```javascript
class Animal {
	name = 'unknown';
	constructor (name) {
		this.name = name;
	}
}
```

#### 实例属性

ES7 在提案中可以在类里定义静态属性，例如：

```javascript
class Animal {
	static amount = 8.7e6;
	constructor (name) {
		this.name = name;
	}
}
console.log(Animal.amount); // 8700000
```

### TypeScript 中的类

#### 修饰符 Modifiers

TypeScript 中的修饰符包括以下几种：

- public 公有属性/方法，任何地方都能使用
- private 私用属性/方法，不能在类的外部使用
- protected 保护属性/方法，可以在本类或子类里使用

下面举个例子：

`public` 修饰的属性或方法可以随意访问

```typescript
class Animal {
	public name;
	constructor (name) {
		this.name = name;
	}
}
const unknown = new Animal('unknown');
console.log(unknown.name) // unknown
unknown.name = 'known'
console.log(unknown.name) // known
```

`private` 修饰的属性或方法不可以访问。需要注意的是编译之后的 JavaScript 代码是没有限制 `private` 的访问的。

```typescript
class Animal {
	public name;
	private hide;
	constructor (name) {
		this.name = name;
		this.hide = 'hide';
	}
}
class Dog {
	constructor (name) {
		super(name);
	}
	hide () {
		return this.hide;
	}
}
const unknown = new Animal('unknown');
console.log(unknown.hide) // ERROR

const doge = new Dog('doge');
console.log(doge.hide()) // ERROR
```

而使用 `protected` 修饰的属性或是方法则在子类可以访问：

```typescript
class Animal {
	public name;
	protected value;
	constructor (name) {
		this.name = name;
		this.value = 'value';
	}
}
class Dog {
	constructor (name) {
		super(name);
	}
	value () {
		return this.value;
	}
}
const unknown = new Animal('unknown');
console.log(unknown.hide) // ERROR

const doge = new Dog('doge');
console.log(doge.value()) // value
```

#### 抽象类

抽象类是什么？抽象类是一个不允许实例化的类，他的属性和方法要在子类里实现。例如：

```typescript
abstract class Animal {
	public name;
	constructor (name) {
		this.name = name;
	}
	myName () {
		return this.name;
	}
}
class Dog extends Animal {
	constructor (name) {
		super(name);
	}
}
const unknown = new Animal('unknown'); // ERROR

const doge = new Dog('doge');
console.log(doge.myName()) // doge
```

#### 类与接口

类可以实现（implements）接口。不同类中可能有相同的属性或是方法，我们可以把这些相同的属性和方法提取出来，定义为一个接口，其他类也可以去实现这个接口。例如：

```typescript
interface Animal {
	weight: number;
	eat();
	sleep();
}

class Animal implements Animal {
	public name;
	public weight: number;
	constructor (name) {
		this.name = name;
	}
	eat () {
		console.log('Animal can eat');
	}
	sleep () {
		console.log('Animal can sleep');
	}
}

class Human implements Animal {
	public name;
	public weight: number;
	constructor (name) {
		this.name = name;
	}
	eat () {
		console.log('Human can eat');
	}
	sleep () {
		console.log('Human can sleep');
	}
}
```

我们注意到抽象类也可以实现和接口类似的功能，那么这两者之间有什么区别呢？

1. 一个类只可以继承一个父类，却可以实现很多个接口。
2. 接口是没有自己的属性和方法的，而抽象类可以。

### 泛型 Generics

前文已经用到过泛型了，那么泛型是什么呢？泛型是指在定义函数、接口、类时，不指定具体的类型而是在调用时再指定，例如：

```typescript
function ArrayGenerator<T> (length: number, value: T): Array<T> {
	return Array(length).fill(value);
}

ArrayGenerator<string>(2, 'A') // ['A', 'A']
```

你可以给泛型定义多个类型参数：

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
	return [tuple[1], tuple[0]];
}
swap([7, 'seven']) // ['seven', 7]
```

泛型还可以约束他的参数类型，例如：

```typescript
interface Lengthwise {
	length: number
}
function length<T extends Lengthwise>(arg: T): T {
	return arg.length;
}
```

我们还可以用带泛型的接口来定义函数：

```typescript
interface CreateArrayFunc {
	<T>(length: number, value: T): Array<T>
}
let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
	return Array(length).fill(value);
}
```

泛型同样可以使用在类的定义当中：

```typescript
class GenericNumber<T> {
	zeroValue: T;
	add: (x: T, y: T) => T;
}
```


### 声明合并

如果定义了两个相同的函数接口或类，那么后面的不会覆盖前面的，而是会被合并成一个。

例如接口的合并：

```typescript
interface Test {
	haha: number;
}
interface Test {
	nono: string
}
// 相当于

interface Test {
	haha: number;
	nono: string
}

```
