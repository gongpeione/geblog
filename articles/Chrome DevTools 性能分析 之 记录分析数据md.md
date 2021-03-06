# Chrome DevTools 性能分析 之 记录分析数据

>《Chrome DevTools 性能分析》系列主要是对 Chrome DevTools 中的性能（Performance）功能的使用进行详细的说明，文章的主要内容参考自 [Performance Analysis Reference](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#clear)。

Chrome 的 DevTools 一直是一个前端程序猿调试分析前端代码的神兵利器。它从最早的几个简单的功能发展到现在，功能越来越多，越来越强大了。其中的性能（Performance）选项卡可能是平时用的不太多的（也可能是我还太弱了哈哈哈），但在对页面进行调优却是十分重要的一个功能。那么在这里就参考官网的介绍，来详细讲解下 DevTools 中性能模块的使用方法。

>![](https://ww4.sinaimg.cn/large/006tNc79gy1fjfpm7ptujj30oj0gnn0x.jpg)
> 早期的 DevTools，仅仅只有6个功能模块

## 性能数据的记录

要对网页性能进行分析，第一步当然是要先把它记录下来。

### 记录实时数据

DevTools 中记录实时性能数据的方法很简单，只要以下几步：

1. 打开需要分析的页面
2. 打开性能（Performance）选项卡（前两步骤下文不再重复）
3. 点击左上角的“●”开始记录![](https://ww4.sinaimg.cn/large/006tNc79gy1fjfpm62fosj30p00b6t9y.jpg)
4. 正常使用页面，DevTools 会记录下所有数据
5. 再次点击“●”即可停止记录

### 记录加载数据

你也可以记录页面加载中的数据

1. 点击左上角第二个刷新按钮![](https://ww2.sinaimg.cn/large/006tNc79gy1fjfpm5uz48j30d405kq3b.jpg)

DevTools 会自动放大最活跃的一段

### 记录过程中的截图

勾选截图即可保存过程中的每一帧截图。

![](https://ww3.sinaimg.cn/large/006tNc79gy1fjfpm5okswj30i804kq3h.jpg)


### 强制垃圾回收

点击垃圾桶图标即可强制开始垃圾回收。

![](https://ww1.sinaimg.cn/large/006tNc79gy1fjfpm5jd4pj30nw050js5.jpg)


### 记录设置

点击右上角的齿轮按钮即可对记录内容进行设置。

![](https://ww4.sinaimg.cn/large/006tNc79gy1fjfpm5dx6ej30pk078abl.jpg)

### 禁用 JavaScript 样本

默认的 Main 部分的数据显示的是记录过程中的 JavaScript 函数的调用栈，如果想要禁用他那么勾选“Disable JavaScript Samples”即可。 

![](https://ww1.sinaimg.cn/large/006tNc79gy1fjfpm54bzxj30qq07gmys.jpg)

### 记录时限制网络

![](https://ww3.sinaimg.cn/large/006tNc79gy1fjfpm4uwc2j30qu07itab.jpg)


### 记录时限制 CPU

![](https://ww2.sinaimg.cn/large/006tNc79gy1fjfpm4ltpij30qs07ejt0.jpg)

### 启用高级渲染功能

![](https://ww2.sinaimg.cn/large/006tNc79gy1fjfpm4ecpvj30qs07ijt3.jpg)

如果你想知道开启这个选项之后该怎么使用，可以参考下面的两个链接，本文不做涉及。

- [View Layer](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#layers) 
- [View paint profiler](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#paint-profiler)

## 保存记录内容

只要单击右键，选择 Save Profile 即可。

![](https://ww2.sinaimg.cn/large/006tNc79gy1fjfpm45mrhj30tm0lwgsd.jpg)

## 加载已保存的记录

同样的只要单击右键，选择 Load Profile 即可。

![](https://ww2.sinaimg.cn/large/006tNc79gy1fjfpm45mrhj30tm0lwgsd.jpg)

## 清除之前的记录

只需点击左上角的清除按钮即可。

![](https://ww4.sinaimg.cn/large/006tNc79gy1fjfpm3e3crj30tm0lojy4.jpg)

    
    


