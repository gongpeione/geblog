# Chrome 扩展学习笔记

本文是一篇《Chrome 扩展及应用开发》的读书笔记，这本书是一本 Sneezry 大大写的免费书籍，下载以及在线观看可以在图灵社区找到，地址是 http://www.ituring.com.cn/book/1421。在此感谢 Sneezry 大大的分享！

本文是一篇自己记录内容的学习笔记，如有谬误请大神斧正，[issus地址](https://github.com/gongpeione/geblog/issues)。

## 入口文件 manifest.json: {}

所有的 Chrome 扩展都包含一个 JSON 格式的 manifest 文件 `manifest.json`,这个文件是整个扩展的入口，里面包括了所有 Chrome 所需的扩展的基本信息

manifest 文档：[点这里](https://developer.chrome.com/extensions/manifest)

示例代码:

```javascript
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

```javascript
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

```javascript
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

```javascript
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

```javascript
"options_page": "options.html"
```

`localstorage` 的储存大小在 Chrome 里的限制为 5MB 以下，如果储存的数据大于 5MB 的话可以通过 `permissions` 中添加 `unlimitedStorage` 来储存更多的数据。此外，Chrome 还提供了储存API以及数据库，储存API可以让用户将数据储存在本地磁盘以及和你的 Google 账户同步数据，这些内容将在后面讲到。

### 5、页面通信 chrome.runtime.sendMessage...

Chrome 扩展很常见的一个功能就是，扩展的多个页面之间互相传递数据以获取彼此的状态，从而采取不同的操作。这个功能也是很容易实现的，所用到的就是 Chrome 所提供的通信接口。

Chrome 给我们提供了4个相关的通信接口，分别是 `chrome.runtime.sendMessage`, `chrome.runtime.onMessage`, `chrome.runtime.connect` 以及 `chrome.runtime.onConnect`。这四个接口的详细文档可以在 [这里](https://developer.chrome.com/extensions/runtime) 看到。下面就主要说明一下这几个接口的作用。

#### sendMessage & onMessage

文档地址：[sendMessage](https://developer.chrome.com/extensions/runtime#method-sendMessage)，[onMessage](https://developer.chrome.com/extensions/runtime#event-onMessage) 

`sendMessage` 和 `onMessage` 是一组对应的接口。顾名思义，一个是发送消息而另一个是接收消息。

`sendMessage` 的完整调用的方法是 `chrome.runtime.sendMessage(string extensionId, any message, object options, function responseCallback)`，`extensionId` 是一个可选的参数，是你想要发送消息到的扩展ID，如果为空则默认为发送到当前的扩展【可以通过 `chrome.runtime.id` 获取你的扩展ID】。`message` 就是你想要发送的消息内容啦，内容随意你开心就好。`options` 也是一个可选的参数【Chrome 32 之后】，其中只包含一个有用的属性 `includeTlsChannelId`，这个属性决定了 TLS 通道ID 是否会通过 `onMessageExternal` 传递过来，一般不用管它放置一边就好。最后一个参数是 `responseCallback`，依然是一个可选项，这是一个用于接受消息接收方返回的信息的回调函数。回调函数只有一个参数 `response`，内容就是接收方发送过来的消息。

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
...
```

#### connect & onConnect

文档地址：[connect](https://developer.chrome.com/extensions/runtime#method-connect)，[onConnect](https://developer.chrome.com/extensions/runtime#event-onConnect) 

`connect` 主要是用于 `content_scripts` 和扩展的长连接，通常适用于长时间的对话。建立连接之后双方都会获得一个用于之后发送和接收消息的port对象，下面是来自[crxdoc-zh](https://crxdoc-zh.appspot.com/apps/messaging)的示例代码（不要问我为什么不是我自己的代码，犯懒了没有实践这段代码）。

```javascript
var port = chrome.runtime.connect({name: "敲门"});
port.postMessage({joke: "敲门"});
port.onMessage.addListener(function(msg) {
  if (msg.question == "是谁？")
    port.postMessage({answer: "女士"});
  else if (msg.question == "哪位女士？")
    port.postMessage({answer: "Bovary 女士"});
});

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "敲门");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "敲门")
      port.postMessage({question: "是谁？"});
    else if (msg.answer == "女士")
      port.postMessage({question: "哪位女士？"});
    else if (msg.answer == "Bovary 女士")
      port.postMessage({question: "我没听清楚。"});
  });
});
```

### 6、数据的储存 localStorage & storage & Web SQLDatabase

Chrome 扩展通常使用 localStorage & storage & Web SQLDatabase 这三种方法来储存数据，其中 `localStorage` 前面已经介绍过了，而 Web SQLDatabase 已经不推荐使用了，这一节就主要介绍 Chrome 的储存 API `chrome.storage`。

`chrome.storage` 和 `localStorage` 功能基本相同，两者主要的不同之处在于 `chrome.storage` 可以通过谷歌账号同步数据。`content_scripts` 可以不通过扩展的后台页面直接获取数据，在隐身模式下用户的扩展设置也可以保留下来，以及`chrome.storage` 是异步读写，可以进行大量的读写操作，比 `localStorage` 更快。

文档地址：[chrome.storage](https://developer.chrome.com/extensions/storage)

在使用 `chrome.storage` 之前你需要在 `manifest.json` 里声明 `storage` 权限。

`chrome.storage` 包括 `chrome.storage.sync` 和 `chrome.storage.local`，local 只会保存在本地，而 sync 则会同步到所登陆的账号。如果当前 Chrome 处于离线状态则会先保存在本地，在线之后再同步。下面就用 `chrome.storage.sync` 来举例子。

我们可以通过这样来添加或修改数据：
```javascript
chrome.storage.sync.set({'city': 'Nanchang'}, function() {
      alert('Set successful!');
});
```

我们可以通过这样来获取数据：

```javascript
chrome.storage.sync.set('city', function() {
      alert('Set successful!');
});
```
其中 `'city'` 可以是对象或是数组，下同

我们可以通过这样来删除数据：

```javascript
chrome.storage.sync.remove('city', function() {
      alert('Remove successful!');
});
```

我们可以通过这样来删除数据：

```javascript
chrome.storage.sync.remove('city', function() {
      alert('Remove successful!');
});
```

当数据发生变化时我们可以通过这样来获取变化的值：

```javascript
chrome.storage.onChanged.addListener((changes, namespace) => {
    console.log(changes); 
    // { 'city': { 'newValue': '', 'oldValue': '' } }
});
```

我们还可以这样获取当前正在使用的空间大小：

```javascript
chrome.storage.sync.getBytesInUse(b => {
    console.log('Bytes in use ' + b + 'byte');
    // Bytes in use 19byte
});
```

### 7、Browser Actions

`manifest.js` 中的 `"browser_action"` 属性用于将指定的ICON添加到 Chrome 的地址栏右侧的工具栏中。如果还指定了 `"default_popup"` 则在单击扩展图标时会在图标下侧加载此页面。图标上面还可以添加一个“徽章（badge）”，用于显示额外的信息，例如新消息数量等。下面对 `"browser_action"` 属性进行详细的介绍。

文档地址：[browser_actions](https://developer.chrome.com/extensions/browserAction)

 `"browser_action"` 主要包括以下几个属性：
 
 - `"default_icon"` 
 - `"default_title"`
 - `"default_popup"`

1、`"default_icon"` 的格式如下。

```
{                  
    "16": "images/icon16.png",           // 可选
    "24": "images/icon24.png",           // 可选
    "32": "images/icon32.png"            // 可选
},
```
默认大小为 16 x 16，单位为 dips(device-independent pixels)，大图标会被自动压缩，但是还是尽量提供 16 x 16 dips 大小的图片以达到最佳的效果。Chrome 会根据屏幕的像素密度选择最合适图片。

ICON 的值既可以是静态图片也可以是 canvas 生成的动态图片。

ICON 的值还可以通过setIcon设置，具体方法如下示例代码所示：

```javascript
// chrome.browserAction.setIcon(object details, function callback)
chrome.browserAction.setIcon({
	'path': 'pathToImage', // 可选
	'imageData': 'imageData', // 可选
	'tabId': 'tabId' // 可选
}, () => {
	console.log('修改成功');
});
```


`"default_title"`

这个就是图片的提示信息了，鼠标悬浮在图标上时就会显示出来。就不多说了。

title 的值同样可以通过代码设置或是获取当前值，具体方法如下示例代码所示：

```javascript
// 设置新 title， chrome.browserAction.setTitle(object details)
chrome.browserAction.setTitle({
	'title': 'New Title',
	'tabId': tab ID // 可选
});

// 获取新 title， chrome.browserAction.setTitle(object details)
chrome.browserAction.getTitle({
	'tabId': tab ID // 可选
}, result => {
	console.log('新Title为：' + result);
});
```

徽章（badge）只能通过代码设置，只能包括最多 4 个字符（文档说是只能有四个字符，经过测试 Chrome 56 最多可以设置五个英文字符，超过五个则会显示前面三个，后面则显示为省略号，中文只显示两个字，超过则显示第一个字和省略号）：

```
// 设置 Badge 文字：chrome.browserAction.setBadgeText(object details)
chrome.browserAction.setBadgeText({
    "text": '测试'
});

// 设置 Badge 背景颜色：chrome.browserAction.setBadgeBackgroundColor(object details)
chrome.browserAction.setBadgeBackgroundColor({
    'color': [255, 0, 0, 255] // 或者 "#000"
})

```

需要注意的是，现在 Badge 的字体颜色是不能更改的，所以请不要用太浅的背景色。以及 Chrome 56 以及 58.0.3006.0 canary 下设置半透明的背景色似乎都是无效的。

`"default_popup"` 指定用户点击扩展图标之后展示在图标下方弹出框的页面。需要注意的是这个页面并不是一直在后台运行的，每次用户点击图标时都是重新打开这个页面。


除了上述所说的内容，文档里还给出了一些视觉效果方面的小提示：

1. 确保 browser actions 在大部分的页面都是有用的，如果只是对部分页面生效请使用 page actions
2. 请使用尽量大的，颜色比较突出的图标
3. 给你的图标添加半透明的描边效果。因为很多用户都会使用主题，你的图标应该在各种背景色下都可用。
4. 不要一直给你的图标加动画效果，很容易惹人不悦。