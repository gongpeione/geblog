<template>
  <div id="app">
    <div class="logo">
      <router-link to="/">
        <img src="./assets/logo.svg" alt="home">
      </router-link>
      <h1>Geeku</h1>
    </div>
    <div class="main-menu">
      <nav>
        <router-link v-for="item in menu" :to="item.link" exact>
          {{ item.name }}
        </router-link>
      </nav>
    </div>
    <div class="wrap">
      <router-view></router-view>
    </div>
    <footer>
      <a href="/">Blog.Geeku.Net</a>
    </footer>
    <div class="totop" @click.native="totop"></div>
  </div>
</template>

<script>
  import config from './config';

  export default {
    name: 'app',
    data () {
      return {
      	menu: config.menu,
      }
    },
    created () {
    },
    methods: {
      totop () {
        console.log('aaa');
        window.scrollTo(0, 0);
      }
    }
  }
</script>

<style lang="scss">
  @import "css/base";
  @import "css/color";

  #app {
    min-height: 100vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    /*padding: .5rem 0;*/
  }

  .main-menu,
  .wrap {
    width: 70%;
    margin: 0 auto;
  }

  .wrap {
    flex: 1;
    margin-bottom: $gap-huge;
  }

  .main-menu {
    text-align: center;
    margin-bottom: .8rem;
    font-size: .2rem;
    font-family: 'Josefin Slab', serif;
    a {
      color: $dark;
      padding: $gap-small 0;
      margin: 0 $gap-middle;
      &:hover {
        text-decoration: none;
        color: $blue;
      }
      &.router-link-active {
        color: $blue;
        border-bottom: .02rem solid $blue;
      }
    }
  }

  .logo {
    text-align: center;
    padding: .8rem;
    margin-bottom: .2rem;

    img {
      width: .5rem;
      height: auto;
    }

    h1 {
      display: none;
    }
  }

  .loading {
    text-align: center;
    font-size: .3rem;
    color: rgba(255, 255, 255, .2);
    font-weight: 600;
  }

  footer {
    width: 100%;
    background: $blue;
    padding: .4rem;
    text-align: center;

    a {
      color: rgba(255,255,255, .6)
    }
  }
</style>
