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


### 状态码的类别

- 1XX Infomational 接收的请求正在处理
- 2XX Success 请求正常处理完毕
- 3XX Redirection 重定向
- 4XX Client Error 服务器无法处理请求
- 5XX Server Error 服务器处理请求出错

### 最常用的14种

#### 2XX

- 200 OK 表示请求正常处理了。 
- 204 No Content 请求处理成功但没有资源可以返回，即响应报文里不含实体的主体部分，一般用在只需客户端给服务端发送信息而客户端不需要新内容时。
- 206 Partial Content 只需要资源的一部分，HEAD 中包括 `Content-Range`。

#### 3XX

- 301 Moved Permanently URI 永久性重定向。
- 302 Found URI 临时性重定向
- 303 See Other 303 和 302 很相似，但是 303 是指希望客户端能以 GET 方法重定向到另一个 URI。
- 304 Not Modified 资源未改变，可以直接使用未过期的缓存
- 307 Temporary Redirect 临时重定向，307 会遵照浏览器标准，不会把 POST 变成 GET。

> 301 302 303 这三个状态码几乎所有的浏览器都会把 POST 方法改成 GET 方法并删除请求报文内的主体，之后请求会自动再次发送
> 
> 301 302 标准是禁止将 POST 方法改变成 GET方法的，但是实际使用时大家都会这么做



#### 4XX

- 400 Bad Request 请求报文中存在语法错误
- 401 Unauthorized 请求需要通过 HTTP 认证（BASIC，DIGEST），需要包含一个 `WWW-Authenticate` 的 HEAD 以通过认证
- 403 Forbidden 没有权限不允许访问这个资源
- 404 Not Found 服务器上找不到这个资源


#### 5XX

- 500 Internal Server Error 服务器出现错误
- 502 Bad Gateway 错误的网关，一般是连接超时产生的
- 503 Server Unavailable 服务器处于超负载状态或者停机维护


## 与 HTTP 协作的 Web 服务器

### 虚拟主机 Visual Host

可以通过 HEAD 中的 Host 字段的不同实现同一个 IP 地址下的多个 Web 网站。

### 转发程序：代理、网关、隧道

#### 代理

代理服务器的作用就是接受客户端发送的请求之后转发给其他服务器，得到响应后再传回客户端。

代理服务器一般有缓存代理以及透明代理。缓存代理会预先把资源副本保存在代理服务器上，透明代理则是完全不对报文进行加工处理的代理。

#### 网关

网关可以让通信线路上的服务器提供非 HTTP 服务。

#### 隧道

隧道可以按要求建立起一条与其他服务器的通信线路。


## HTTP 首部

### 报文首部结构

#### 请求报文

请求报文的首部有以下内容

1. 请求行：包括方法、URI、HTTP版本，eg GET / HTTP/1.1
2. 请求首部字段
3. 通用首部字段
4. 实体首部字段
5. 其他

#### 响应报文

响应报文的首部有以下内容

1. 状态行：包括HTTP版本、状态码，eg [HTTP/1.1 304 Not Modified]
2. 请求首部字段
3. 通用首部字段
4. 实体首部字段
5. 其他

### HTTP 首部字段

首部字段根据用途分为四种类型：

1. 通用首部字段 General Header Fields
2. 请求首部字段 Request Header Fields
3. 响应首部字段 Response Header Fields
4. 实体首部字段 Entity Header Fields 补充内容资源更新时间等与实体有关的信息


#### 通用首部字段

##### Cache-Control

控制缓存的行为。

缓存请求指令

- no-cache 强制向原服务器再次验证
- no-store 不缓存
- max-age=xxs 响应最大Age值
- max-stale=xxs 接受已过期的响应
- min-fresh=xxs 期望在指定时间内的响应仍有效
- no-transform 代理不可更改媒体类型
- only-if-cached 从缓存获取资源
- cache-extension 新指令标记

缓存响应指令

- public 其他用户也可以用缓存
- private 仅向特定用户返回响应
- no-cache 缓存前必须先确认其有效性
- no-store 不缓存请求或响应的任何内容
- no-transform 代理不可更改媒体类型
- must-revalidate 可缓存但必须再想源服务器进行确认
- proxy-revalidate 要求中间缓存服务器对缓存的响应有效性再进行确认
- max-age=xxs 响应的最大Age值
- s-maxage=xxs 缓存服务器响应的最大Age值
- cache-extension 新指令标记

##### Connection

- 控制不再转发给代理的首部字段
- 管理持久连接


##### Date

创建报文的日期时间

##### Pragma

历史遗留字段，唯一用法: `Pragma: no-cache`,表示不接受缓存

##### Trailer

表示报文主体后记录了哪些首部字段，例如 `Trailer: Expires ...报文主体... Expires: xxx`。

##### Transfer-Encoding

规定了主体的编码方式，HTTP/1.1 中仅对分块传输编码有效。`Transfer-Encoding: chunked`。

##### Upgrade

用于检测 HTTP 协议及其他协议是否能使用更高版本进行通信。

例如:

```
// 请求
GET /index.html HTTP/1.1
Upgrade: TLS/1.0
Connection: Upgrade

// 响应
HTTP/1.1 101 Switching Protocols
Upgrade: TLS/1.0, HTTP/1.1
Connection: Upgrade
```

##### Via

报文的传输路径。


##### Warning

告知用户与缓存相关的问题的警告。


#### 请求首部字段

##### Accept

表示用户代理能处理的媒体类型和媒体类型的相对优先级。


##### Accept-Charset

表示用户代理支持的字符集和字符集的相对优先级。

##### Accept-Encoding

表示用户代理支持的内容编码和内容编码的优先级。

##### Accept-Language

表示用户代理能够处理的自然语言集和他们的相对优先级。

##### Authorization

用户代理的认证信息。

##### Expect

告知服务器客户端期望出现的某种特定行为。

##### From

客户端告知服务器电子邮件地址。

##### Host

告知服务器请求资源所处的互联网主机名和端口号。这是唯一一个必须包含的首部字段。

##### If-Match

条件请求，只有条件为真时才执行请求。后面跟着的是 `ETag` 的值。

##### If-Modified-Since

如果服务器资源的更新时间比这个值晚，则希望处理这个请求。

##### If-None-Match

如果这个值和 `ETag` 的值不一致时才处理该请求。

##### If-Range

如果时间或 `ETag` 和请求的资源一致时才作为范围请求处理，否则全部返回。

##### If-Unmodified-Since

和 `If-Modified-Since` 作用相反。如果服务器资源的更新时间比这个值早，则希望处理这个请求。

##### Max-Forwards

指定可经过的服务器的最大数目。

##### Proxy-Authorization

代理服务器的认证信息。

##### Range

对于只需获取部分资源的范围需求。

##### Referer

告知服务器请求的原始资源的 URI。

##### TE

表示客户端能处理响应的传输编码方式和相对优先级。和 `Accept-Encoding` 很相似，不同的是这个是用于传输编码。

##### User-Agent

客户端的浏览器和用户代理名称等信息传递给服务器。


#### 响应首部字段

##### Accept-Ranges

服务器告知客户端是否能处理范围请求。

##### Age

表示源服气在多久之前创建了响应。

##### ETag

资源的唯一性标识。

##### Location

将客户端引导至与请求 URI 位置不同的资源。


##### Proxy-Authenticate

代理服务器所要求的认证信息发送给客户端。

##### Retry-After

告知客户端多久之后再次发送请求。

##### Server

告知客户端服务器的 HTTP 服务器应用程序信息。

##### Vary

告知代理服务器只对相同自然语言的请求返回缓存。

##### WWW-Authenticate

用于 HTTP 访问认证，告知客户端认证方案。


#### 实体首部字段

用于补充内容的更新时间等与实体相关的信息。

##### Allow

告知客户端服务器嗦支持的 HTTP 方法。

##### Content-Encoding

告知客户端主体部分的内容编码方式。

##### Content-Language

主体使用的自然语言。

##### Content-Length

主体部分的大小（字节）

##### Content-Location

主体返回资源对应的 URI。


##### Content-MD5

用于检查主体是否完整。

##### Content-Range

告知客户端返回的是主体的哪一部分。

##### Content-Type

主体对象的媒体类型。

##### Expires

告知客户端资源失效日期。如果 Cache-Control 有指定 `max-age` 时，则优先处理 max-age

##### Last-Modified

指明资源最终修改时间。


#### 为 Cookie 服务的首部字段

##### Set-Cookie 

开始状态管理所使用的 Cookie 信息

- NAME=Value 必需项，赋予 Cookie 名称和值
- expires=DATA 有效期，若不指定则默认为浏览器关闭为止
- path=PATH 服务器上的文件目录作为 Cookie 的适用对象，默认为文档所在目录
- domain=DOMAIN 作为 Cookie 适用对象的域名，默认为创建 Cookie 的域名
- Secure 仅在 HTTPS 发送
- HttpOnly 不允许 JavaScript 访问

##### Cookie 

服务器接收到的 Cookie 信息


#### 其他首部字段

##### X-Frame-Options

用于控制网站内容在其他网站的 Frame 标签内的显示问题。

- DENY 拒绝
- SAMEORIGIN 仅限同源域名

##### X-XSS-Protection

用于控制浏览器 XSS 防护机制的开关。

##### DNT

Do Not Track，表示拒绝个人信息被收集。

##### P3P

利用 P3P（The Platform for Privacy Preference 在线隐私偏好平台）。可以让网站上的个人隐私变成一种仅供程序可理解的形式。

## HTTPS

HTTP 的缺点

- 明文传输可能被窃听
- 不验证身份可能遭伪装
- 无法证明报文完整性，可能被篡改

HTTPS = HTTP + 加密 + 认证 + 完整性保护

HTTPS 其实就是套了一层 SSL 的 HTTP。而 SSL 不只适用于 HTTP，其他应用层的各种协议都可以配合 SSL 使用


### 对称加密和非对称加密

对称加密也叫公开密钥加密（Public-key cryptography）。对称加密是指使用同一个密钥可以加密内容或者解密用这个密钥加密的内容。如果通过这种方法加密内容发送给其他人时，则要同时把密钥也发送给对方，这就带来了隐患，如果通信过程中被第三方监听了，那么加密的内容和密钥都会被第三方获得，第三方可以很轻易的使用密钥解密内容。

非对称加密解决的就是这个问题。非对称加密使用的不是一个密钥而是两个，一个叫公钥（public key），一个叫私钥（private key）。任何人都可以使用公钥加密内容，而加密后的内容只能通过私钥解密。那么只要一方单独保存好私钥，把公钥发送给对方，对方使用公钥加密内容之后再发送回来，我方就可以使用私钥解密内容了。

### HTTPS 和对称/非对称加密

非对称加密虽然安全但是处理速度要慢上不少，于是 HTTPS 就充分的利用了这两者的优势，在交换密钥时使用非对称加密，交换完毕之后就切换到对称加密。

### HTTPS 通信步骤
```
-> 客户端到服务器
<- 服务器到客户端
```

1. Handshake: ClientHello ->
2. Handshake: ServerHello <-
3. Handshake: Certificate <-
4. Handshake: ServerHelloDone <-
5. Handshake: ClientKeyExchange ->
6. ChnageCipherSpec ->
7. Handshake: Finished ->
8. ChangeCipherSpec <-
9. Handshake: Finished <-
10. Application Data ->
11. Application Data <-
12. Alert: warning, close nitify ->


## 认证

### HTTP 认证方式
- BASIC 认证 基本认证 `401 => username:password => base64 => 200`
- DIGEST 认证 摘要认证 `401(realm, nonce) => MD5() => 200`
- SSL 客户端认证 
- FormBase 认证 基于表单认证（大多数）

## 基于 HTTP 的功能追加协议

### HTTP 瓶颈

- 一条连接上只能一个请求
- 请求只能由客户端发起
- 头部传送未压缩且冗长
- 未强制要求压缩

### AJAX&COMET

这两者可以在一定程度上优化 HTTP 的瓶颈，Ajax 可以通过 JavaScript 发送请求获取数据，局部更新页面，这样使得响应中的数据了可以大大减少。Comet 则是模拟服务器端向客户端推送的功能。

### SPDY

Ajax 和 Comet 只能一定程度上优化 HTTP 的瓶颈，然而对 HTTP 协议本身的限制依旧是毫无作用。SPDY 的出现就是为了在协议级别消除 HTTP 的瓶颈

- 多路复用流
- 赋予请求优先级
- 压缩头部
- 推送功能
- 服务器提示功能

### WebSocket

WebSocket 是一个客户端与服务器之间的全双工通信标准。他的出现是为了解决 Ajax 和 Comet 的缺陷所引发的问题。

使用 WebSocket 的双方都可以向对方发送任意格式的数据。

#### 握手

**请求**：为了实现 WebSocket 通信，需要在 HTTP 头中带上 `Upgrade: websocket`，以告诉服务器通信协议发生改变。除了 `Upgrade` 之外，还需要带上 `Sec-WebSocket-Key: xxxxx`，这个字段的内容是记录着握手过程中必不可少的键值。`Sec-WebSocket-Protocol: xxx` 里则记录了使用的子协议。

**响应**：响应头返回 `HTTP/1.1 101 Switching Protocols` 以表示协议切换成功，还包括 `Connection: Upgrade` 和 `Upgrade: websocket`, `Sec-WebSocket-Accept: xx` 这个字段的内容是由握手请求中的 `Sec-WebSocket-Key` 生成的。

握手成功建立连接之后，通信就不再使用 HTTP 的数据帧了，而是使用 WebSocket 独立的数据帧。

#### HTTP/2.0

HTTP/2.0 在 2014 年 11 月实现了标准化。目的是为了改善用户使用 Web 时的速度体验。HTTP/2.0 有如下一些技术：

- 压缩 
- 多路复用
- TLS 义务化
- 协商
- 客户端Pull/服务器Push
- 流量控制
- WebSocket

#### WebDAV

WebDAV 是一个可以对 Web 服务器上的内容直接进行操作的分布式文件系统。


## 构建 HTTP 内容的技术

这章就不过多描述了，主要就是大概介绍了一下 HTML/XML、CSS、JavaScript、CGI、Servlet、RSS、JSON

## Web 的攻击技术

这一章也是简单的介绍了 XSS、SQL 注入、OS 命令注入、HTTP 头部注入、邮件头部注入、目录遍历、远程文件包含等。这些内容应该会再看过 Web 安全的书籍之后再做总结。



