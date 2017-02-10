<template>
    <div class="cover">
        <div class="content">
            <h1>{{ title }}</h1>
            <div class="loading" v-if="loading">Loading...</div>
            <div class="article" v-html="content"></div>
        </div>
        <div class="comment" v-show="!loading">
            <div id="disqus_thread"></div> 
        </div>                 
    </div>
</template>

<script>
import config from '../config.js'

export default {
    name: 'article',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            title: '',
            content: '',
            loading: true
        }
    },

    beforeRouteEnter (to, from, next) {
        console.log(to.params.title);
        next(vm => {
            vm.title = to.params.title;
            vm.getArticle(vm.title);
        });
    },

    mounted () {
        // console.log(this.$route, window.location.href);
        const url = window.location.href.replace('#/', '');
        if (window.DISQUS) {
            this.reset(url);
            // return
        } else {
            window.disqus_config = function () {
                this.page.url = url;
                this.page.identifier = url;
            };
            const d = document, s = d.createElement('script');
            s.src = '//blog-geeku-github.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        }
    },

    methods: {
        getArticle (title) {
            const url = `${config.url.articles}/${title}.md`;
            const header = { 
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.github.v3.html'
                }
            };

            fetch(url, header).then(res => {
                return res.text()
            }).then(data => {
                this.content = data;
                this.loading = false;
            });
        },
        reset (url) {
            const self = this;
            const dsq = window.DISQUS;
            dsq.reset({
                reload: true,
                config: function () {
                    // this.page.identifier = (self.$route.path || window.location.pathname)
                    this.page.url = url;
                    this.page.identifier = url;
                }
            })
      },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import '../css/github-light.css';
    pre {
        // border: 2px dashed #aaa;
        padding: .2rem;
        margin: .2rem 0;
        background: #f0f5f7;
        overflow-x: auto;
        border-radius: 3px
    }
    code {
        background: #f0f5f7;
        padding: .02rem .08rem;
        border-radius: 3px
    }
    .content > h1 {
        display: block;
        background: #fff;
        width: 70%;
        text-align: center;
        min-height: 100%;
        margin: 0 auto;
        margin-bottom: .2rem;
        padding: .2rem .4rem;
        // box-shadow: 1px 1px 2px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.1);
        box-shadow: 1px 1px rgb(199, 206, 200),
                    2px 2px rgb(199, 206, 200),
                    3px 3px rgb(199, 206, 200),
                    -2px -2px 10px rgba(0,0,0,.2),
                    2px 2px 10px rgba(0,0,0,.2);
        border-radius: 3px;
        max-width: 1200px;
        outline: 2px dashed #ddd;
        outline-offset: -.1rem;
        transition: all .2s ease-in-out;
        font-weight: 800;
        font-size: .26rem;
    }
    .article article {
        text-align: left;
        outline: none;
    }
    .article article > h1 {
        display: none;
        // text-align: center;
        // margin-bottom: .2rem;
        // padding: .2rem;
    }
    .article a.anchor {
        display: none;
    }
    .article a {
        color: #1d71c0;
        text-decoration: underline;
    }
    .article article h2,
    .article article h3 {
        margin: .4rem 0 .2rem -.4rem;
        padding-left: .4rem;
        border-left: 3px solid #1d71c0;
    }
    .article article h3 {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
    }
    .article article h4 {
        margin: .2rem 0;
    }
    blockquote {
        border-left: 5px solid #f0f5f7;
        padding: 0 .3rem;
        color: #666;
        margin: .4rem 0;
        font-size: .14rem;
        overflow: hidden;
    }
    ol {
        margin: .2rem;
    }
    ul {
        margin: .2rem 0;
        list-style: none;
    }
    ul li::before {
        content: '•';
        color: #1d71c0;
        margin-right: .1rem;
    }
    ul li.task-list-item::before {
        content: '';
    }

    .comment {
        width: 70%;
        margin: 0 auto;
        background: #fff;
        padding: .2rem .3rem;
        border-radius: 3px;
        box-shadow: 1px 1px rgb(199, 206, 200),2px 2px rgb(199, 206, 200),3px 3px rgb(199, 206, 200);

    }
</style>
