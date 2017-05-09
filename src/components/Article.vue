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
<style lang="scss">
  @import '../css/github-light.css';
  @import "../css/color.scss";
  @import "../css/base.scss";

  .content {
    margin-bottom: $gap-huge;

    > h1 {
      text-align: center;
      margin-bottom: $gap-huge;
      position: relative;

      &::before {
        content: '';
        width: .2rem;
        height: .2rem;
        border-radius: 50%;
        position: absolute;
        background: $gray;
        bottom: -.4rem;
        left: 50%;
        margin-left: -.1rem;
        border: .07rem solid #fff;
        z-index: 1;
        box-sizing: border-box;
      }

      &::after {
        content: '';
        width: 20%;
        border-bottom: .01rem solid $gray;
        position: absolute;
        bottom: -.3rem;
        left: 50%;
        transform: translateX(-50%);
      }
  }

  pre {
    padding: $gap-middle;
    margin: .2rem 0;
    background: #f0f5f7;
    overflow-x: auto;
    border-radius: 3px;
    line-height: 1.5;
    font-size: .14rem;
  }

  code {
    background: #f0f5f7;
    padding: .02rem .08rem;
    border-radius: 3px;
    font-size: .14rem;
  }

  .article article {
    text-align: left;
    outline: none;
    font-size: .2rem;
  }

  .article article > h1 {
    display: none;
  }

  .article a.anchor {
    display: none;
  }

  .article a {
    color: $blue;
    text-decoration: none;
    &:hover {
      border-bottom: 1px dashed $blue;
    }
  }

  .article article h2,
  .article article h3 {
    font-weight: 400;
    &::before {
      content: '#';
      margin-right: $gap-middle;
      font-weight: 900;
      color: $blue;
      font-size: .3rem;
    }
  }

  .article article h2 {
    margin-left: -$gap-middle - .2rem;
  }

  .article article h3 {
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    color: $dark;
    &::before {
      font-size: .2rem;
    }
  }

  .article article h4 {
    margin: .2rem 0;
    font-weight: 400;
  }

  strong {
    font-weight: 400;
  }

  blockquote {
    border-left: 5px solid #f0f5f7;
    padding: 0 .3rem;
    color: $dark-gray;
    margin: .4rem 0;
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
    color: $blue;
    margin-right: .1rem;
  }

  ul li.task-list-item::before {
    content: '';
  }

  }
  .comment {
    margin: 0 auto;
  }
</style>
