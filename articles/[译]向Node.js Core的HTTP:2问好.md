# [译]当 Node.js Core 遇到 HTTP/2

原文：[Say hello to HTTP/2 for Node.js Core](https://medium.com/the-node-js-collection/say-hello-to-http-2-for-node-js-core-261ba493846e)

几分钟前我打开了一个 [pull-request](https://github.com/nodejs/node/pull/14239)，它为 Nodejs Core 提供了初始的 HTTP/2 实现。虽然还不堪用，但对 Node.js 来说是一个重要的里程碑。

因为这只是一个pull-request，你要想和它愉快的玩耍的话需要做好下面这些准备工作。

首先你需要跟着[这个介绍](https://github.com/nodejs/node/blob/master/BUILDING.md)来配置好 Node.js 的构建环境。

然后切换到 `initial-pr` 分支：

```bash
$ git clone https://github.com/jasnell/node
$ git checkout initial-pr
```

然后开始构建：

```bash
$ ./configure
$ make -j8
```

构建需要小一会儿时间，你可以先去觅个食等待构建完毕。

构建完成之后，随手几行代码就可以开一个 HTTP/2 的服务了：

```javascript
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', (stream, requestHeaders) => {
  stream.respond({ ':status': 200, 'content-type': 'text/plain' });
  stream.write('hello ');
  stream.end('world');
});
server.listen(8000);
```

由于现在这个 HTTP/2 还处在实验阶段，所以你在运行上面代码的时候需要加上一个 `--expose-http2` 参数：

```bash
$ node --expose-http2 h2server.js
```

需要注意的是，上面启动的服务是一个明文 TCP 连接，而浏览器对于使用 HTTP/2 协议的要求是必须使用 TLS。然而我们可以开一个简单的 HTTP/2 客户端来达到目的：

```javascript
const http2 = require('http2');
const client = http2.connect('http://localhost:8000');
const req = client.request({ ':method': 'GET', ':path': '/' });
req.on('response', (responseHeaders) => {
  // do something with the headers
});
req.on('data', (chunk) => {
  // do something with the data
});
req.on('end', () => client.destroy());
```

设置好一个开启 TLS 的 HTTP/2 服务只需要额外的几个步骤：

```javascript
const http2 = require('http2');
const options = {
  key: getKeySomehow(),
  cert: getCertSomehow()
};
const server = http2.createSecureServer(options);
server.on('stream', (stream, requestHeaders) => {
  stream.respond();
  stream.end('secured hello world!');
});
server.listen(43);
```


你可以到 [文档](https://nodejs.org/dist/latest-v8.x/docs/api/tls.html#tls_tls_createserver_options_secureconnectionlistener) 中获取更多有关 `tls.createServer()` 参数里的 `key` 和 `cert` 的使用说明。

尽管现在还有很多的细节需要处理，还有很多的问题需要修复，但是这个最初的实现已经提供了足够多的功能了，包括：

1. 支持推流（Push Stream）
2. respondWithFile() 和 respondWithFD() 可以高效的绕过 Stream API 发送原始文件数据
3. 支持 TLS 和 明文连接
4. 完全支持多路复用的流（stream multiplexing）
5. 支持 HTTP/2 的优先级（Prioritization）和流量控制（Flow Control）
6. 支持 HTTP/2 Trailer 头
7. 支持 HPACK 头压缩
8. 尽可能接近当前 HTTP/1 API 的 API 兼容层

开发将会继续进行，例如安全性加强、性能优化和 API 优化。我们付出的越多，Node.js 就会变的越好。

祝大家复用愉快。

