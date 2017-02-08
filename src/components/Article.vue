<template>
    <div class="cover">
        <div class="loading" v-if="loading">Loading...</div>
        <div class="article" v-html="content"></div>
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
        }
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
        background: #f0f7f1;
    }
    .article article {
        text-align: left;
    }
    .article h1 {
        text-align: center;
        margin-bottom: .2rem;
        padding: .2rem;
    }
    .article a.anchor {
        display: none;
    }
    .article a {
        color: #25b35b;
        text-decoration: underline;
    }
    .article article h2,
    .article article h3 {
        margin: .4rem 0 .2rem -.4rem;
        padding-left: .4rem;
        border-left: 3px solid #54d86f;
    }
    .article article h3 {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
    }
    .article article h4 {
        margin: .2rem 0;
    }
    ol {
        margin: .2rem;
    }
    ul {
        margin: .2rem;
        list-style: none;
    }
    ul li::before {
        content: '•';
        color: #54d86f;
        margin-right: .1rem;
    }
</style>
