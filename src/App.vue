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
    </div>
</template>

<script>
export default {
    name: 'app'
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
    font-size: .28rem;
    font-weight: 300;
}
h3 {
    font-size: .25rem;
    font-weight: 300;
}
h4 {
    font-size: .2rem;
    font-weight: 300;
}
p {
    line-height: 1.5;
    font-weight: 300;
}
#app {
    // background: #252f33;
    /* Rectangle: */
    background-image: linear-gradient(-180deg, #304958 0%, #433245 99%);
    // background-attachment: fixed;
    min-height: 100%;
    overflow: auto;
    padding: .5rem 0;
}
.logo {
    text-align: center;
    padding: .2rem;
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
</style>
