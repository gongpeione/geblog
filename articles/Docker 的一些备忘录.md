# Docker 的一些备忘录


去年看过一些 Docker 今年就忘了个精光，今天重新看了下教程，把需要的记录下来。


## Docker 简介

> Docker 最初是 dotCloud 公司创始人 Solomon Hykes 在法国期间发起的一个公司内部项目，它是基于 dotCloud 公司多年云服务技术的一次革新，并于 2013 年 3 月以 Apache 2.0 授权协议开源)，主要项目代码在 GitHub 上进行维护。Docker 项目后来还加入了 Linux 基金会，并成立推动开放容器联盟。
> 
> Docker 自开源后受到广泛的关注和讨论，至今其 GitHub 项目已经超过 3 万 6 千个星标和一万多个 fork。甚至由于 Docker 项目的火爆，在 2013 年底，dotCloud 公司决定改名为 Docker。Docker 最初是在 Ubuntu 12.04 上开发实现的；Red Hat 则从 RHEL 6.5 开始对 Docker 进行支持；Google 也在其 PaaS 产品中广泛应用 Docker。
> 
> Docker 使用 Google 公司推出的 Go 语言 进行开发实现，基于 Linux 内核的 cgroup，namespace，以及 AUFS 类的 Union FS 等技术，对进程进行封装隔离，属于操作系统层面的虚拟化技术。由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。最初实现是基于 LXC，从 0.7 以后开始去除 LXC，转而使用自行开发的 libcontainer，从 1.11 开始，则进一步演进为使用 runC 和 containerd。
> 
> Docker 在容器的基础上，进行了进一步的封装，从文件系统、网络互联到进程隔离等等，极大的简化了容器的创建和维护。使得 Docker 技术比虚拟机技术更为轻便、快捷。


Docker 和传统的虚拟机的不同之处在于，传统虚拟机是在一整套虚拟硬件的基础上运行完整的操作系统，而 Docker 则是直接在宿主机内核上运行。所以 Docker 比传统虚拟机更加的轻便。


![](http://oqi1no0ip.bkt.clouddn.com/14956997432469.png)


![](http://oqi1no0ip.bkt.clouddn.com/14956997530603.png)



Docker 相比其他虚拟化技术还有很多优势，在此就不介绍了，有需要的可以 Google 一下。

## 基本概念

### 镜像

> Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。
    
    
### 容器

如果把镜像比作类，那么容器就是镜像的实例。

> 容器的实质是进程，但与直接在宿主执行的进程不同，容器进程运行于属于自己的独立的 命名空间。因此容器可以拥有自己的 root 文件系统、自己的网络配置、自己的进程空间，甚至自己的用户 ID 空间。容器内的进程是运行在一个隔离的环境里，使用起来，就好像是在一个独立于宿主的系统下操作一样。这种特性使得容器封装的应用比直接在宿主运行更加安全。也因为这种隔离的特性，很多人初学 Docker 时常常会把容器和虚拟机搞混。


### 仓库

仓库就是镜像的集中地。例如 Docker 官方的 [Docker Hub](https://hub.docker.com/)，Google 的 [Container Registry](https://cloud.google.com/container-registry/)。以及国内的一些加速器，例如 [DaoCloud](https://www.daocloud.io/mirror#accelerator-doc) 等。

你可以可以通过官方的 [Registry](https://hub.docker.com/_/registry/) 镜像来搭建私有的 Docker 仓库。

## 安装

Ubuntu/Debian/Centos

```bash
# 官方
curl -sSL https://get.docker.com/ | sh 
# 国内 DaoCloud
curl -sSL https://get.daocloud.io/docker | sh
```

安装 Docker 对系统有一些要求，具体可以看看这里 https://yeasy.gitbooks.io/docker_practice/content/install/ubuntu.html 。

MacOS

```
brew cask install docker
```

也可以下载官方的 DMG 来安装，地址：https://download.docker.com/mac/stable/Docker.dmg ，安装完成时候可以在 `Preferences > Advanced > Registry Mirrors` 里添加加速地址，例如 `http://a7e70109.m.daocloud.io` 。

## 使用镜像

### 获取

```
docker pull [选项] [仓库地址]<仓库名>:<标签>
# 例如 docker pull ubuntu:latest
```

获取之后就可以运行这个镜像了：

```
docker run -it --rm ubuntu bash
# -it i是指交互式操作，t是指终端
# --rm 退出后自动删除容器
# ubuntu 镜像名
# bash 执行的命令
```

之后我们可以输入 `exit` 退出容器。


### 镜像列表

通过 `docker images` 我们可以看到本机的所有镜像。例如：

```
▶ docker images
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
nginx               geeku               2055e6075b53        2 hours ago         109.4 MB
ubuntu              latest              ebcd9d4fca80        9 days ago          117.9 MB
<none>               <none>              00285df0df87        5 days ago          342 MB
nginx               latest              3448f27c273f        2 weeks ago         109.4 MB
```

需要注意的是，最后一项的 Size 并不是镜像实际占用硬盘空间大小。Docker 的镜像是可以继承、复用的，所以实际大小会比显示的 Size 小。

#### Dangling Image

Dangling Image 就是在执行 `docker images` 之后列表中 `REPOSITORY` 和 `TAG` 都为 `<none>` 的镜像，可以使用 `docker images -f dangling=true` 命令来列出所有的 Dangling Image。一般来说 Dangling Image 是已经没有用的镜像了，可以使用 ` docker rmi $(docker images -q -f dangling=true)` 来清除所有的 Dangling Image。

### Commit

1. `docker run --name webserver -d -p 80:80 nginx` 启动一个名为 webserver 的 nginx 容器
2. `docker exec -it webserver bash` 以交互式的方式进入容器
3. 一番修改之后…（例如修改 Nginx 默认主页）
4. `docker diff webserver` 查看所做的修改
5. `docker commit --author "xxx" --message "xxx" webserver nginx:modified` 将修改后的 webserver 容器保存为名为 nginx:modified 的镜像
6. `docker images` 可以看到我们新生成的 nginx:modified 镜像了

需要注意的是，`docker commit` 对镜像进行的是黑箱操作，这意味着新的镜像的生成方式，做了些什么，其他使用镜像的人是无从得知的，十分影响后期的维护工作。所以一般只在学习 docker 的时候使用 `docker commit`。

### Dockerfile

Dockerfile 就是描述 Docker 镜像构建过程的文件。下面用一个简单的并没有什么用的实例来解释 Dockerfile 中的各个指令的含义。

```docker
// /home/geeku/docker/Dockerfile
FROM ubuntu:latest //指定基础镜像

RUN mkdir docker // 执行命令
RUN ["可执行文件", "参数1", "参数2"] // 也可以用这种格式执行命令

COPY init.sh init.sh // 将 init.sh 文件复制到镜像中
COPY [file1, file2, dist/] // COPY 也可以这样将多个文件复制到镜像中

ADD root.tar.gz // ADD 是比 COPY 更高级的命令，参数可以是文件，下载链接和压缩文件

CMD ["bash"] // 容器启动时执行的命令

ENTRYPOINT [ "curl", "-s", "http://ip.cn" ]

```

```bash
docker build -t nginx:v3 .
```

