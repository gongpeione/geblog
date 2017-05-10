<template>
  <div class="cover">
    <div class="catalog" v-if="hasCatalog" ref="catalog">
      <label for="catalog">Catalog</label>
      <input type="checkbox" id="catalog" ref="catalogTrigger">
      <nav>
        <a :href="item[1]" v-for="item in catalog" @click.prevent="anchor">{{ item[0] }}</a>
      </nav>
    </div>
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
  import config from '../config.js';
  import loading from '../lib/loading';

  export default {
    name: 'article',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        title: '',
        content: '',
        loading: true,
        catalog: [],
        hasCatalog: false
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

        loading.show();
        fetch(url, header).then(res => {
          return res.text()
        }).then(data => {
          this.content = data;
          this.loading = false;

          this.$nextTick(() => {
            const heads = document.querySelectorAll('h2,h3');
            this.catalogBuilder(heads);
          });

          loading.hide();
        });
      },
      catalogBuilder (headList) {
        Array.from(headList).forEach(head => {
        	const link = head.querySelector('a').getAttribute('href');
        	this.catalog.push([head.textContent, link]);
        });
        this.hasCatalog = true;
//        window.addEventListener('click', (e) => {
//        	if (e.target !== this.$refs['catalog']) {
//        		this.$refs['catalogTrigger'].checked = false;
//          }
//        })
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
      anchor (e) {
      	const id = e.target.getAttribute('href').split('#')[1];
      	const target = document.querySelector('#user-content-' + id);
        target.scrollIntoView();
        this.$refs['catalogTrigger'].checked = false;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import '../css/github-light.css';
  @import "../css/color.scss";
  @import "../css/base.scss";

  .catalog {
    label {
      position: fixed;
      z-index: 999;
      left: .2rem;
      top: .2rem;
      font-family: 'Josefin Slab', serif;
    }
    nav {
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #fff;
      padding: .2rem;
      min-width: 25%;
      border-right: 1px solid #ccc;
      transform: translateX(-100%);
      transition: transform .2s ease-in-out;
      padding-top: .6rem;
    }
    input {
      display: none;
    }
    input:checked + nav {
      transform: translateX(0);
    }
  }
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
    opacity: 0;
    width: 0px;
    display: inline-block;
    svg {
      height: .26rem;
    }
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
