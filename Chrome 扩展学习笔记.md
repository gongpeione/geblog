# Chrome 扩展学习笔记

本文是一篇《Chrome 扩展及应用开发》的读书笔记，这本书是一本 Sneezry 大大写的免费书籍，下载以及在线观看可以在图灵社区找到，地址是 http://www.ituring.com.cn/book/1421。在此感谢 Sneezry 大大的分享！

本文是一篇自己记录内容的读书笔记，如有谬误请大神斧正，[issus地址](https://github.com/gongpeione/geblog/issues)。

## 入口文件 manifest.json: {}

所有的 Chrome 扩展都包含一个 JSON 格式的 manifest 文件 `manifest.json`,这个文件是整个扩展的入口，里面包括了所有 Chrome 所需的扩展的基本信息

manifest 文档：[点这里](https://developer.chrome.com/extensions/manifest)

示例代码:

```json
{
	 // 必须
    "manifest_version": 2,
    "name": "Geeku",
    "version": "1.0",
    
    // 推荐
    "default_locale": "en",
    "description": "First Chrome extension",
    "icons": {
        "16": "./img/clock@108x108.png",
        "48": "./img/clock@108x108.png",
        "19": "./img/clock@108x108.png",
        "128": "./img/clock@108x108.png"
    },
    
    // 选择其中一个
    "browser_action": {
        "default_icon": {
            "19": "./img/clock@108x108.png",
            "38": "./img/clock@108x108.png"
        },
        "default_title": "Geeku Clock",
        "default_popup": "popup.html"
    },
    "page_action": {
        "default_icon": {
            "19": "./img/clock@108x108.png",
            "38": "./img/clock@108x108.png"
        },
        "default_title": "Geeku Clock",
        "default_popup": "popup.html"
    },
    
    // 其他可选 具体见上方文档链接
    "background": {
        "scripts": ["background.js"]
    },
    "content_scripts": [
        {
            "matches": ["https://www.google.com/*"],
            "css": ["style.css"],
            "js": ["main.js"]
        }
    ],
    "options_page": "options.html",
    "permissions": [
        "*://www.google.com/*"
    ],
    "web_accessible_resources": [
        "images/*.png"
    ]
}
```

## 基础内容

### 1、不同的页面执行不同的脚本 content_scripts: [{},...]

文档地址：[点这里](https://developer.chrome.com/extensions/content_scripts)

content_scripts 是一个包含一个或多个对象的数组，每个对象可以包含`matches`, `exclude_matches`, `css`, `js` 等属性，具体见上方文档地址，这些对象定义的是在指定的页面里注入或者不注入文件，下面是一个简单的例子。

```json
"content_scripts": [
    {
        // 如果当前URL符合以下规则
        "matches": ["https://www.google.com/*"],
        
        // 就把下面这些文件注入到页面当中
        "css": ["style.css"],
        "js": ["main.js"]
    }
]
```

### 2、喜闻乐见的跨域 permissions: ['', ...]

跨域文档地址：[点这里](https://developer.chrome.com/extensions/xhr#requesting-permission)

permissions文档地址：[点这里](https://developer.chrome.com/extensions/xhr#requesting-permission)

在普通页面中跨域是被浏览器大大禁止的，只能通过jsonp，服务器端设置cors等方法来实现跨域，具体方法写出来又是一篇文章，就不展开讲了。那么在 Chrome 扩展中如果也不允许跨域的话，那么扩展还有个球球用？？

那么答案当然是可以的，在 Chrome 扩展中可以很容易的实现跨域功能。通过 `manifest.json` 中的 `permissions` 属性就可以很容易的获取到跨域权限。具体实现方法如下：

例如我想获取 https://geeku.net/ 的内容，那么可以这么写

```json
"permissions": [
    "https://geeku.net/*"
]
```
那么在js中就可以随随便便获取到这里面的内容了~
```javascript
fetch('https://geeku.net/').then(function (res) {
    console.log(res.text());
});
```
需要注意的是，`permissions` 里填写的域和你需要跨的域要对应起来，例如 `https://baidu.com/` 会重定向到 `https://www.baidu.com`，所以你需要把www也填写上去，或者使用通配符 `https://*.baidu.com`

`permissions` 除了获取跨域的权限之外还可以获得其他很多的权限，具体可以看看 [这里](https://developer.chrome.com/extensions/xhr#requesting-permission)。

### 3、常驻后台 background: { scripts, page, persistent }

通过 `manifest.json` 中添加 `background` 属性就可以使得扩展常驻后台。

 `background` 属性包括三种属性，`scripts`，`page` 和 `persistent`，很明显 `scripts` 就是扩展常驻在后台的脚本。`page` 则是后台页面，一般来说page是不需要的。`persistent` 则是定义了常驻后台的方式，默认为 `true`，是指扩展一直在后台运行。值为 `false` 时则是按需执行。推荐将 `persistent` 的值设置为 `false` 以减小资源的消耗。下面是示例代码：

```json
"background": {
    "scripts": ["background.js"],
    "persistent": false
}
```

顺带一提，如果需要调试后台的话可以通过打开 `chrome://extensions/` 里扩展下的 `检查视图` ->  `背景页` 来完成。

### 4、设置页面 options_page: 'options.html'

我们可以发现很多的 Chrome 扩展都会附带一个设置页面，那么如何来实现呢？

通过 `manifest.json` 中添加 `options_page` 属性就可以添加一个设置页面，通过右键点击右上角的扩展图标，弹出菜单下的”选项”就可以进入。设置的储存的话可以通过 `localstorage` 来实现，具体使用方法可以看[这里](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API)。

下面是示例代码：

```json
"options_page": "options.html"
```

`localstorage` 的储存大小在 Chrome 里的限制为 5MB 以下，如果储存的数据大于 5MB 的话可以通过 `permissions` 中添加 `unlimitedStorage` 来储存更多的数据。此外，Chrome 还提供了储存API以及数据库，储存API可以让用户将数据储存在本地磁盘以及和你的 Google 账户同步数据，这些内容将在后面讲到。

### 5、页面通信 chrome.runtime.sendMessage...

Chrome 扩展很常见的一个功能就是，扩展的多个页面之间互相传递数据以获取彼此的状态，从而采取不同的操作。这个功能也是很容易实现的，所用到的就是 Chrome 所提供的通信接口。

Chrome 给我们提供了4个相关的通信接口，分别是 `chrome.runtime.sendMessage`, `chrome.runtime.onMessage`, `chrome.runtime.connect` 以及 `chrome.runtime.onConnect`。这四个接口的详细文档可以在 [这里](https://developer.chrome.com/extensions/runtime) 看到。下面就主要说明一下这几个接口的作用。

#### sendMessage & onMessage

文档地址：[sendMessage](https://developer.chrome.com/extensions/runtime#method-sendMessage)，[onMessage](https://developer.chrome.com/extensions/runtime#event-onMessage) 

`sendMessage` 和 `onMessage` 是一组对应的接口。顾名思义，一个是发送消息而另一个是接收消息。

`sendMessage` 的完整调用的方法是 `chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)`，`extensionId` 是一个可选的参数，是你想要发送消息到的扩展ID，如果为空则默认为发送到当前的扩展【可以通过 `chrome.runtime.id` 获取你的扩展ID】。`message` 就是你想要发送的消息内容啦，内容随意你开心就好。`options` 也是一个可选的参数【Chrome 32 之后】，其中只包含一个有用的属性 `includeTlsChannelId`，这个属性决定了 TLS 通道ID 是否会通过 `onMessageExternal` 传递过来，一般不用管它放置一遍就好。最后一个参数是 `responseCallback`，依然是一个可选项，这是一个用于接受消息接收方返回的信息的回调函数。回调函数只有一个参数 `response`，内容就是接收方发送过来的消息。

`onMessage` 是一个事件，当扩展或是 `content_script` 发送消息过来时即可触发。你可以通过 `chrome.runtime.onMessage.addListener(function callback)` 来定义触发事件时的回调函数。`callback` 形似 `function(any message, MessageSender sender, function sendResponse) {...};` 这样一个函数，`message` 即为发送过来的消息内容，`sender` 则是一个包括发送方信息的对象，`sendResponse` 则是接收到消息之后的回调函数。

下面是一组接收和发送消息的示例代码

```javascript
// sendMessage
let counter = 0;
setInterval((response) => {
    chrome.runtime.sendMessage(`Current num:${counter}`, response => {
        console.log('[Response] ' + res);
    });
    counter++;
}, 1000);

// onMessage
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log(msg, sender);
    sendResponse('Get!');
});
```

控制台输出的内容分别为

```
// sendMessage
Response: Get! message.js:10 
Response: Get! message.js:10 
...

// onMessage
Current num:0 Object {id: "...", url: "...", tab: Object, frameId: 0}
Current num:1 Object {id: "...", url: "...", tab: Object, frameId: 0}
```