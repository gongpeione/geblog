# [Note]Nginx 从入门到假装精通

一直没有系统的学习过 Nginx，配置基本靠猜靠谷歌，正巧赶上当当网前段时间世界读书日活动，入手了一本《精通 Nginx》，准备比较系统的学习一遍 Nginx，至少以后在配置的时候可以不那么心惊胆战了。

## 安装

安装 Nginx 就相对来说很简单了，无论是源码编译安装还是通过包管理安装都很简单方便，这部分就不多写了。

在这里记录一下编译安装的时候注意的一些问题：

- 如果想要使用 HTTP2，那么 OpenSSL 的版本应为 `1.0.2+`，如果当前版本不够高那么去[官网下载](https://www.openssl.org/source/)新版，解压之后，在编译 Nginx 时加上 `--with-openssl=<path>`
- 如果想要使用 HTTP2， 在编译 Nginx 时需要带上 `--with-http_ssl_module --with-http_v2_module`
- 添加第三方模块的方法是 `--add-module=<path>`

## Nginx 的配置指南

和 Apache 相比，Nginx 的的配置文件可以说是非常清晰，非常合乎逻辑了。Nginx 的默认配置文件一般在 `/usr/local/nginx/conf/nginx.conf` 里，如果不在的话可以尝试使用 `which nginx` 来找到实际位置，这里总结一下 Nginx 的配置的编写方法。

### 基本格式

Nginx 的配置每一部分都是如下格式：

```
<section> {
    <directive> <parameters>;
}
```

每一个区块中都包含若干个指令行。

### 全局配置

Nginx 的配置文件中，有一系列的全局配置参数，他们是：

- `user`：配置 worker 进程的用户和用户组
- `worker_processes`：指定 worker 进程数量，一般和 CPU 的核心数量相同
- `error_log`：错误日志，只在编译时配置了 `--with-debug` 时才生效。错误级别有 `debug/info/notice/warn/error/crit/alert/emerg`
- `pid`：记录主进程 PID 的文件
- `use`：指定连接方法，需要包括在 `events` 区块里
- `worker_connections`：指定一个工作进程的最大并发连接数

### 包含配置

Nginx 配置文件中可以使用 `include /path/to/conf` 来包含其他的子配置文件，路径可以使用通配符。

修改配置之后可以使用 `nginx -t` 来测试配置是否正确。

### Server 配置

Sever 配置在 Nginx 的配置中是很重要，很常用的一部分。Server 区块部分被称为虚拟服务器，一个虚拟服务器至少由 `listen` 和 `server_name` 组成。

listen 指令定义了一个IP地址/端口组合或是 UNIX 域套接字路径，例如：

- listen address[:port];
- listen port;
- listen unix:path;

除此之外，listen 还有很多可选参数，在这里简单列举几个：

- default_server 默认请求绑定在此
- ssl 表示端口只接受 HTTPS 连接

server_name 指令则是匹配 Host 头，server_name 的值可以使用通配符，也可以在域名前加上 `~` 以通过正则表达式来匹配。

### location 配置

location 一般包含在 server 区块中，用来进一步的匹配处理请求。location 是可以嵌套的。

location 的格式如下：

- `location [modifier] uri {...}`
- `location @name {...} // 命名 location`

location 的修饰符会影响 location 的匹配：

| modifier | 匹配方式 |
| --- | --- |
| = | 精确匹配并终止搜索 |
| ~ | 区分大小写的正则匹配 |
| ~* | 不区分大小写的正则匹配 |
| ^~ | 如果该 location 是最佳匹配，那么对于这个字符串不再进行正则匹配 |

请求进入时，URI 将会匹配一个最佳的 location

`try_files` 指令在 location 中十分常用，它是用来依次匹配可能存在的文件，例如：

```
location / {
    try_files $uri $uri/ /index.html;
}
```

在上述那个例子中，当请求进入这个 location 时，首先判断是否存在请求的这个文件，如果不存在则判断是否存在这个目录，如果目录也不存在，则返回 `index.html`

## Nginx 的反向代理



