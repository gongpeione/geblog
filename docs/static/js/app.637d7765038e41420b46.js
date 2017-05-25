webpackJsonp([1,2],{30:function(t,e,i){"use strict";var n=i(18),a=i.n(n),r=i(78),o=i.n(r),s=i(74),c=i.n(s),l=i(73),u=i.n(l);a.a.use(o.a),e.a=new o.a({routes:[{path:"/",name:"Home",component:c.a},{path:"/article/:title",name:"Article",component:u.a}]})},31:function(t,e,i){i(70);var n=i(17)(i(33),i(76),null,null);t.exports=n.exports},33:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(8),a=i(36),r=i(9);e.default={name:"app",data:function(){return{menu:n.a.menu}},created:function(){},mounted:function(){r.a.loadingEl=this.$refs.loading;var t=this.$refs.canvas.getBoundingClientRect();new a.a(this.$refs.canvas,{width:t.width,height:t.height,opacity:.2,maxCircle:50})},methods:{}}},34:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(37),a=i.n(n),r=i(8),o=i(9);e.default={name:"article",data:function(){return{msg:"Welcome to Your Vue.js App",title:"",content:"",loading:!0,catalog:[],hasCatalog:!1}},beforeRouteEnter:function(t,e,i){console.log(t.params.title),i(function(e){e.title=t.params.title,e.getArticle(e.title)})},mounted:function(){var t=window.location.href.replace("#/","");if(window.DISQUS)this.reset(t);else{window.disqus_config=function(){this.page.url=t,this.page.identifier=t};var e=document,i=e.createElement("script");i.src="//blog-geeku-github.disqus.com/embed.js",i.setAttribute("data-timestamp",+new Date),(e.head||e.body).appendChild(i)}},methods:{getArticle:function(t){var e=this,i=r.a.url.articles+"/"+t+".md",n={method:"GET",headers:{Accept:"application/vnd.github.v3.html"}};o.a.show(),fetch(i,n).then(function(t){return t.text()}).then(function(t){e.content=t,e.loading=!1,e.$nextTick(function(){var t=document.querySelectorAll("h2,h3");e.catalogBuilder(t)}),o.a.hide()})},catalogBuilder:function(t){var e=this;a()(t).forEach(function(t){var i=t.querySelector("a").getAttribute("href");e.catalog.push([t.textContent,i])}),this.hasCatalog=!0},reset:function(t){var e=window.DISQUS;e.reset({reload:!0,config:function(){this.page.url=t,this.page.identifier=t}})},anchor:function(t){var e=t.target.getAttribute("href").split("#")[1],i=document.querySelector("#user-content-"+e);i.scrollIntoView(),this.$refs.catalogTrigger.checked=!1}}}},35:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(8),a=i(9);e.default={name:"home",data:function(){return{articles:[],loading:!0}},created:function(){var t=this;this.$nextTick(function(){return a.a.show()}),fetch(n.a.url.articles).then(function(t){return t.json()}).then(function(e){e=e.reverse(),e.forEach(function(e){t.articles.push({title:e.name.replace(".md","")})}),t.loading=!1,t.$nextTick(function(){return a.a.hide()})})}}},36:function(t,e,i){"use strict";var n=i(39),a=i.n(n),r=i(40),o=i.n(r),s=function(){function t(e,i){if(a()(this,t),this.el="string"==typeof e?document.querySelector(e):e,"CANVAS"!==this.el.tagName)throw new TypeError("canvas element is required.");this.width=this.el.width=2*i.width||300,this.height=this.el.height=2*i.height||100,this.ctx=this.el.getContext("2d"),this.colors=[[255,255,255]],this.opacity=i.opacity||.5,this.maxCircle=i.maxCircle||100,this.circleList=[],this._options=i,this.init()}return o()(t,[{key:"init",value:function(){for(var t=0;t<this.maxCircle;t++)this.createCircle();this.render()}},{key:"render",value:function(){this.ctx.clearRect(0,0,this.width,this.height),this.updateCircle(),this.drawCircleList(),requestAnimationFrame(this.render.bind(this))}},{key:"updateCircle",value:function(){var t=this;this.circleList.forEach(function(e){e.x+=e.vx,e.y+=e.vy,e.radius+=.05,e.opacity=t.easeInCirc(t.height-e.y,.1,1.3,t.height+e.radius),e.x>t.width+e.radius&&(e.x=-e.radius),e.y>t.height+e.radius,e.x<-e.radius&&(e.x=t.width+e.radius),e.y<-e.radius&&(e.y=t.height+e.radius,e.vy=-t.random(1,5,!0),e.radius=t.random(5,10),e.opacity=.1)})}},{key:"createCircle",value:function(){var t={x:this.random(0,this.width),y:this.random(0,this.height),vx:this.random(-2,2,!0),vy:-this.random(1,3,!0),color:this.colors[this.random(0,this.colors.length-1)],radius:this.random(5,10),opacity:.1};this.circleList.push(t)}},{key:"drawCircleList",value:function(){var t=this;this.circleList.forEach(function(e){return t.drawCircle(e)})}},{key:"drawCircle",value:function(t){var e=t.x,i=void 0===e?0:e,n=t.y,a=void 0===n?0:n,r=t.radius,o=void 0===r?10:r,s=t.color,c=void 0===s?this.colors[0]:s,l=t.opacity,u=void 0===l?.1:l;this.ctx.fillStyle="rgba("+c.join(",")+", "+u+")",this.ctx.beginPath(),this.ctx.arc(i,a,o,0,2*Math.PI,!0),this.ctx.closePath(),this.ctx.fill()}},{key:"random",value:function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],t=Math.round(Math.random()*(i-e)+e);return n?t:~~t}},{key:"easeInCirc",value:function(t,e,i,n){return-i*(Math.sqrt(1-(t/=n)*t)-1)+e}}]),t}();e.a=s},69:function(t,e){},70:function(t,e){},71:function(t,e){},72:function(t,e,i){t.exports=i.p+"static/img/logo.e2d08f3.svg"},73:function(t,e,i){i(71);var n=i(17)(i(34),i(77),null,null);t.exports=n.exports},74:function(t,e,i){i(69);var n=i(17)(i(35),i(75),null,null);t.exports=n.exports},75:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"articles"},[t.loading?i("div",{staticClass:"loading"},[t._v("Loading...")]):t._e(),t._v(" "),t._l(t.articles,function(e){return i("article",[i("router-link",{attrs:{to:{name:"Article",params:{title:e.title}}}},[i("h2",[t._v(t._s(e.title))])])],1)})],2)},staticRenderFns:[]}},76:function(t,e,i){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"app"}},[n("div",{ref:"loading",attrs:{id:"loading"}}),t._v(" "),n("div",{staticClass:"logo"},[n("router-link",{attrs:{to:"/"}},[n("img",{attrs:{src:i(72),alt:"home"}})]),t._v(" "),n("h1",[t._v("Geeku")])],1),t._v(" "),n("div",{staticClass:"main-menu"},[n("nav",t._l(t.menu,function(e){return n("router-link",{attrs:{to:e.link,exact:""}},[t._v(t._s(e.name))])}))]),t._v(" "),n("div",{staticClass:"wrap"},[n("router-view")],1),t._v(" "),n("footer",[n("canvas",{ref:"canvas",staticClass:"footer-bg"}),t._v(" "),n("a",{attrs:{href:"/"}},[t._v("Blog.Geeku.Net")])]),t._v(" "),n("div",{staticClass:"totop",nativeOn:{click:function(e){t.totop(e)}}})])},staticRenderFns:[]}},77:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"cover"},[t.hasCatalog?i("div",{ref:"catalog",staticClass:"catalog"},[i("label",{attrs:{for:"catalog"}},[t._v("Catalog")]),t._v(" "),i("input",{ref:"catalogTrigger",attrs:{type:"checkbox",id:"catalog"}}),t._v(" "),i("nav",t._l(t.catalog,function(e){return i("a",{attrs:{href:e[1]},on:{click:function(e){e.preventDefault(),t.anchor(e)}}},[t._v(t._s(e[0]))])}))]):t._e(),t._v(" "),i("div",{staticClass:"content"},[i("h1",[t._v(t._s(t.title))]),t._v(" "),t.loading?i("div",{staticClass:"loading"},[t._v("Loading...")]):t._e(),t._v(" "),i("div",{staticClass:"article",domProps:{innerHTML:t._s(t.content)}})]),t._v(" "),i("div",{directives:[{name:"show",rawName:"v-show",value:!t.loading,expression:"!loading"}],staticClass:"comment"},[i("div",{attrs:{id:"disqus_thread"}})])])},staticRenderFns:[]}},8:function(t,e,i){"use strict";e.a={url:{articles:"https://api.github.com/repos/gongpeione/geblog/contents/articles"},category:{draft:"draft",hidden:"hidden"},menu:[{name:"Home",link:"/"},{name:"Category",link:"/category"},{name:"Links",link:"/links"},{name:"Guestbook",link:"/guestbook"}]}},81:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=i(18),a=i.n(n),r=i(31),o=i.n(r),s=i(30),c=i(32);i.n(c);new a.a({el:"#app",router:s.a,template:"<App/>",components:{App:o.a}}),"serviceWorker"in navigator&&window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js",{scope:"/"}).then(function(t){console.log("ServiceWorker registration successful with scope: ",t.scope)},function(t){console.log("ServiceWorker registration failed: ",t)})}),fetch("https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new").then(function(t){return t.json()},function(t){return console.log(t)}).then(function(t){return console.log(t)})},9:function(t,e,i){"use strict";e.a={loadingEl:null,show:function(){this.loadingEl&&this.loadingEl.classList.add("show")},hide:function(){this.loadingEl&&this.loadingEl.classList.remove("show")}}}},[81]);