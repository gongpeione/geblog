<template>
    <div class="articles">
        <div class="loading" v-if="loading">Loading...</div>
        <article v-for="article in articles">
            <router-link :to="{ name: 'Article', params: { title: article.title } }">
                <h2>{{ article.title }}</h2>
            </router-link>
        </article>
    </div>
</template>

<script>
import config from '../config.js'
export default {
    name: 'home',
    data () {
        return {
            articles: [],
            loading: true
        }
    },

    created () {
        fetch(config.url.articles).then(res => {
            return res.json()
        }).then(data => {
            data = data.reverse();
            data.forEach(article => {
                this.articles.push({
                    title: article.name.replace('.md', '')
                })
            });
            this.loading = false;
        });
    }
}
</script>

<style lang="scss">
  @import "../css/base";
  @import "../css/color";
  .articles article {
    font-size: .25rem;
    margin-bottom: $gap-large;
    h2 {
      font-size: inherit;
      margin: 0;
      flex: 1;
    }
    a {
      color: $dark;
      display: flex;
      &:hover {
        text-decoration: none;
        color: $blue;

        &::after {
          content: '<';
          font-family: 'Josefin Slab', serif;
        }
      }
      h2 {
        color: inherit;
      }
    }
  }

</style>
