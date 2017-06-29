# 从 R.add 来看 Ramda 的 Curry 化

Ramda 是一个很流行的函数式的 JavaScript 工具库。我们从最简单的 `R.add` 函数来分析 Ramda 是如何 Curry 化的。 

## R.add 的使用

R.add 的用法很简单，你既可以通过 `(x,y)` 来调用，也可以通过 `(x)(y)` 来调用，很方便。

```javascript
R.add(2, 3);       //=>  5
R.add(7)(10);      //=> 17
```

## R.add 的源码

那么我们来看看 R.add 是如何实现的。我们打开 `ramda/src/add.js`，可以看到 `R.add` 的源码十分简单：

```javascript
module.exports = _curry2(function add(a, b) {
  return Number(a) + Number(b);
});
```

`add` 函数就是实现相加的功能，那么 `_curry2` 是什么？我们接着往下看。

`_curry2` 在 `ramda/src/internal/_curry2.js` 里，打开之后我们就看到了 `_curry2` 的具体实现了：

```javascript
var _curry1 = require('./_curry1');
var _isPlaceholder = require('./_isPlaceholder');

module.exports = function _curry2(fn) {
  return function f2(a, b) {
    switch (arguments.length) {
      case 0:
        return f2;
      case 1:
        return _isPlaceholder(a) ? f2
             : _curry1(function(_b) { return fn(a, _b); });
      default:
        return _isPlaceholder(a) && _isPlaceholder(b) ? f2
             : _isPlaceholder(a) ? _curry1(function(_a) { return fn(_a, b); })
             : _isPlaceholder(b) ? _curry1(function(_b) { return fn(a, _b); })
             : fn(a, b);
    }
  };
};

```






