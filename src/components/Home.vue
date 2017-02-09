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
        font-size: .16rem;
    }
    article a {
        text-decoration: none;
        color: #333;
    }

    .articles article a,
    .articles article a:hover {
        text-decoration: none;   
    }
    .articles article a {
        transition: .2s all ease-in-out;
    }
     .articles article a:hover {
        color: #1d71c0;
     }

    .articles article h2 {
        margin: 0;
    }

</style>