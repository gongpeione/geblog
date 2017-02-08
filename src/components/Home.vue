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

<style>
    article {
        background: #fff;
        width: 80%;
        text-align: center;
        min-height: 100%;
        margin: 0 auto;
        margin-bottom: .2rem;
        padding: .2rem .4rem;
        box-shadow: 1px 1px 2px rgba(0,0,0,.1), 0 1px 1px rgba(0,0,0,.1);
        border-radius: 3px;
        max-width: 1200px;
        font-size: .16rem;
    }
    article a {
        text-decoration: none;
        color: #333;
    }

</style>