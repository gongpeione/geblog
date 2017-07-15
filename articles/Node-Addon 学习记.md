# Node Addon 学习记录（一）

## Hello World

废话不多说，首先开始一个最基础的 Node Addon 的 Hello World demo，毕竟万物始于 Hello World。

### 安装 node-gyp

node-gyp 就是专门用来编译 node addon 的一个工具。

```bash
yarn global add node-gyp
// 或者
npm install -g node-gyp
```

### 新建 binding.gyp 文件

最基础的 binding.gyp 文件长这样

```
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "geeku.cc" ]
    }
  ]
}
```

geeku.cc 里面的内容是：

```c
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "geeku"));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "geeku", Method);
}

NODE_MODULE(addon, init)

}  // namespace demo
```

### 生成项目构建文件

binding.gyp 文件写好之后就可以进行这一步了。命令也很简单：

```bash
node-gyp configure
```

执行完成之后，如果你 binding.gyp 没写错的话，理论上会生成一个 build 文件夹，里面会根据当前的系统生成对应的构建文件，macOS 下的话会生成这些文件：

```bash
xxx/build
▶ ls
Makefile         binding.Makefile gyp-mac-tool
Release          config.gypi      hello.target.mk
```

### Build

接下来依旧是执行一个简单的命令：

```bash
node-gyp build
```

这个命令则会在 build/Release 里生成 hello.node 这个文件。

### 使用

使用方法和其他的包使用方法一样，只需要 require 一下就可以用了。例如：

```javascript
// hello.js
const hello = require('./build/Release/hello.node');

console.log(hello);
console.log(hello.geeku());
```

`node hello.js` 之后输出的内容如下：

```base                                                  
▶ node hello.js
{ geeku: [Function: geeku] }
geeku
```



