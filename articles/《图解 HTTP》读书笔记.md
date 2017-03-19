# 《图解 HTTP》读书笔记

前段时间看到图灵在搞图解系列的活动，顺手就把图解系列三本书（HTTP，TCP/IP，网络硬件）入手了。一直没有完整的把图解 HTTP 刷一遍，实体书到手了准备没事翻一翻把这本书看完。

## HTTP 是啥

HTTP 是 HyperText Transfer Protocol 的缩写，约定俗成的翻译为超文本传输协议，但译者说更严谨的译名应该为“超文本转移协议 ”，有兴趣的同学可以去看图灵社区里的讨论，链接为：[关于HTTP中文翻译的讨论](http://www.ituring.com.cn/article/1817)

HTTP 是包括在 TCP/IP 协议族里的一个子集。TCP/IP 是互联网相关各类协议族的总称。下面对 TCP/IP 进行简单的介绍。

### TCP/IP

TCP/IP 分为：应用层，传输层，网络层和数据链路层。

- 应用层 Application layer：通用的应用服务，例如 FTP，DNS等，HTTP 也包含在这里面
- 传输层 Transport layer：TCP 和 UDP
- 网络层 Internet layer：处理网络上流动的数据包，数据包是网络传输最小数据单位。网络层规定了通过怎样的路径到达对方计算机，并把数据包传送给对方
- 链路层 Network access layer：网络硬件部分

> ![](https://ww2.sinaimg.cn/large/006tNc79gy1fdsbxobhrej30jg0f5jsk.jpg)

> TCP/IP 通信传输流

简单来说就是，应用层提供具体内容，后面的三层在内容的外部一层层包装上信息，送到下一层，最后把打上一层层信息的数据包传送给接收方，接收方再一层层的解包得到具体内容。

这种包装的做法叫做封装（encapsulate）。

### IP，TCP 和 DNS

这三个协议是和 HTTP 密不可分的。

#### IP 协议

即 Internet Protocol，它的作用是把封装好的数据包传送给对方。为了保证数据包能传送到对方那里，IP 地址和 MAC 地址是两个重要的条件。IP 地址是对方被分配到的地址，MAC 地址则是硬件地址。

通常来说网络中的两个设备很少在同一局域网内，那么两者通信就需要进行中转。这时就需要 ARP 协议（Address Resolution Protocol）来通过通信方的 IP 地址来反查对应的 MAC 地址。

那么你可能要问了，我已经知道对方的 IP 地址了，直接传过去不就好了么，为什么还要反查 MAC 地址？但是实际上，以太网中数据传输所依赖的是 MAC 地址而非 IP 地址，所以我们需要通过 ARP 来通过 IP 地址反查出 MAC 地址，才能顺利的把数据传输给对方。

#### TCP 协议

和 UDP 不同，TCP 协议是一个确保可靠性的协议，意思是指 TCP 协议可以把数据准确可靠的传送给对方。

为了确保数据能够到达对方，TCP 协议采用了三次握手策略（three-way handshaking）。

大致的过程就是：

1. 发送方 -> 接收方  哟我要发东西给你了你在咩
2. 发送方 <- 接收方  好哒我收到你的消息了
3. 发送方 -> 接收方  好的嘞我传数据了 xxxx

那么为什么是三次握手而不是两次四次五次呢？在这里转一个知乎上看到的段子：

```
三次握手：

1. “喂，你听得到吗？”
2. “我听得到呀，你听得到我吗？”
3. “我能听到你，今天balabala……”

两次握手：

1. “喂，你听得到吗？”
2. “我听得到呀”
3. “喂喂，你听得到吗？”
4. “草，我听得到呀！！！！”
5. “你TM能不能听到我讲话啊！！喂！”
6. “……”

四次握手：

1. “喂，你听得到吗？”
2. “我听得到呀，你听得到我吗？”
3. “我能听到你，你能听到我吗？”
4. “……不想跟傻逼说话”

```

[TCP 为什么是三次握手，为什么不是两次或四次？](https://www.zhihu.com/question/24853633/answer/114872771)

#### DNS 服务

DNS 服务提供域名到 IP 地址的服务。

#### 小结

一个完整的 HTTP 请求大致如下：

1. 客户端：我想访问 https://geeku.net，DNS 请告诉我他的 IP地址猴不猴 【IP 地址 GET】
2. HTTP 生成请求报文
3. TCP 协议将第二步的报文分割成报文段
4. IP 协议通过路由器一步步的中转传送
5. TCP 协议吧接收到的报文段拼回去
6. HTTP 对请求内容处理
7. 接收端：哟我收到了，我马上把你想要的通过同样的步骤传送给你

### URL 和 URI

URL(Uniform Resource Locator) 就是我们熟悉的网页地址了~ 用来表示资源的地点

URI(Uniform Resource Identifier) 则是统一资源标识符，是用字符串来标识某一个互联网资源。

由此可见，URL 是 URI 的子集

#### URI 的格式

`protocol://user:pass@domainNameOrIP:port/path/to/res/resouce.file?query=content#anchor`

## HTTP 的历史

历史是什么可以吃么？略过

## 简单的 HTTP 协议

### 请求报文

```
POST(方法) /login.php(URI) HTTP/1.1(协议版本)
Host: geeku.net
Connection: keep-alive
Content-Type: application/x-www-from-urlencoded
Content-length: 16
(请求首部字段)

name=admin&password=admin
(内容实体)
```

### 响应报文

```
HTTP/1.1(协议版本) 200(状态码) OK(状态码原因短语)
Data: Tue, 10 July 2012 06:11:11 GMT
Content-Length: 333
Content-Type: text/html
(响应首部字段)

<html>...
(主体)
```

### HTTP 是无状态协议

HTTP 是一个无状态的协议，即不保存之间的通信状态，不过可以使用 Cookie 来管理状态。

### HTTP 方法

- GET 获取资源
- POST 传输实体主体
- PUT 传输文件
- HEAD 获取报文首部，不返回主体部分
- DELETE 删除文件
- OPTIONS 询问支持的方法
- TRACE 跟踪路径
- CONNECT 要求用隧道协议连接代理

其中 GET，POST，PUT，DELETE 可以与 REST 风格的 API 一一对应

- GET 对应 SELECT
- POST 对应 UPDATE
- PUT 对应 CREATE
- DELETE 对应 DELETE

### 持久化连接 keep-alive

持久化连接的好处在于可以减少 TCP 链接的重复建立与断开造成的额外开销。

### 管线化

管线化之后可以并行发送多个请求而不用一个接一个的发送响应等待响应了。

### Cookie

服务器端可以给客户端发送一个 `Set-Cookie` 的首部字段，客户端就会把这个字段的内容保存下来，下次发送请求时客户端就自动在请求报文中加入 Cookie 之后发送给服务端，服务端就可以通过这个来判断不同的客户端了。

## HTTP 报文

HTTP 报文大致分为报文首部和报文主体两个部分，通过空行来划分，报文主体是可选项。

### 报文结构

响应报文和请求报文的结构大致相同。大致分为报文首部和报文主体两个部分。其中首部的结构如下：

- 请求行（请求报文，例：GET / HTTP/1.1）/状态行（响应报文,例：HTTP/1.1 200 OK）
- 请求/响应首部字段
- 通用首部字段
- 实体首部字段
- 其他

### 压缩编码

通常来说，报文主体等于实体主题，但当传输过程中进行了压缩编码操作是，实体主体的内容发生了变化，才和报文主体产生差异。

#### 常见内容编码

- gzip（GNU zip）
- compress（UNIX 系统标准压缩）
- deflate（zlib）
- indentify（不进行编码）


#### 分块编码

可以把大容量数据分块传输，让客户端逐步显示页面。

### MIME 

MIME 即 Multipurpose Internet Mail Extensions，它允许邮件处理各种不同类型的数据，例如文本，图片，视频等。HTTP 协议中也采纳了这个。

MIME 包含的对象如下：

- multipart/from-data Web表单上传
- multipart/byteranges 


### 内容协商

判断基准：

- Accept
- Accept-Charset
- Accept-Encoding
- Accept-Language
- Content-Language

类型：

- 服务器驱动协商 Server-driven Negotiation 由服务器进行内容协商
- 客户端驱动协商 Agent-driven Negotiation 由客户端进行内容协商
- 透明驱动协商 Transparent Negotiation 由两者各自进行内容协商


## 状态码

状态码是用来描述返回请求的结果的数字。用户可以通过状态码判断请求的成功或是失败等。



