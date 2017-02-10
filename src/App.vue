<template>
    <div id="app">
        <div class="logo">
             <router-link to="/">
                <img src="./assets/avatar.png" alt="home">
            </router-link>

            <router-link to="/">
                <h1>Geeku</h1>
            </router-link>
        </div>
        <div class="main-menu">
            <nav>
            </nav>
        </div>
        <div class="wrap">
            <router-view></router-view>
        </div>

        <div class="totop" @click.native="totop"></div>
    </div>
</template>

<script>
export default {
    name: 'app',
    data () {
        return {}
    },
    methods: {
        totop () {
            console.log('aaa');
            window.scrollTo(0, 0);
        }
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}
html {
    font-size: 100px;
}
body,
html {
    padding: 0;
    margin: 0;
    height: 100%;
}
body {
    background: #eee;
    font-size: .16rem;
    line-height: 2;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: 300;
    color: #3b546b;
}
a,
a:hover {
    text-decoration: none;
}

h1 {
    font-size: .3rem;
    font-weight: 300;
}
h2 {
    font-size: .26rem;
    font-weight: 300;
}
h3 {
    font-size: .22rem;
    font-weight: 300;
}
h4 {
    font-size: .18rem;
    font-weight: 300;
}
p {
    line-height: 1.5;
    font-weight: 300;
}
#app {
    // background: #252f33;
    /* Rectangle: */
    background-image: linear-gradient(-180deg, #202b31 0%, #433245 99%);
    // background-attachment: fixed;
    min-height: 100%;
    overflow: auto;
    padding: .5rem 0;
}
.logo {
    text-align: center;
    padding: .2rem;
    margin-bottom: .2rem;
}
.logo img {
    width: 1.6rem;
    height: auto;
}
.logo a {
    color: #333;
    text-decoration: none;
}
.logo a::after {
    content: "\A";
    white-space: pre; 
}
.logo a:hover {
    text-decoration: none;
}
.logo h1 {
    margin: .1rem 0;
    font-weight: 600;
    color: #59ceff;
    text-shadow: 1px 1px #1d71c0, 2px 2px #1d71c0, 3px 3px #1d71c0;
    font-size: .6rem;
    display: inline-block;
}
.logo h1:hover {
    text-shadow: 1px 1px #1d71c0, 2px 2px #1d71c0;
}
.logo h1::first-letter {
    // color: #cad;
}

.loading {
    text-align: center;
    font-size: .3rem;
    color: rgba(255,255,255,.2);
    font-weight: 600;
}

.totop {
    display: inline-block;
    position: fixed;
    right: .2rem;
    bottom: .2rem;
    width: .4rem;
    height: .4rem;
    background: #fff;
    box-shadow: 1px 1px rgb(199, 206, 200),
                2px 2px rgb(199, 206, 200),
                3px 3px rgb(199, 206, 200),
                -2px -2px 10px rgba(0,0,0,.2),
                2px 2px 10px rgba(0,0,0,.2);
    border-radius: 3px;
}
.totop::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 40%;
    width: .2rem;
    height: .05rem;
    background: #ccc;
    transform: rotate(-45deg) translate(-75%, -50%);
    transform-origin: left;
}
.totop::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 40%;
    width: .2rem;
    height: .05rem;
    background: #ccc;
    transform: rotate(45deg) translate(-25%, -50%);
    transform-origin: left;
}
.totop:hover::before,
.totop:hover::after {
    background: #59ceff;
}
</style>
