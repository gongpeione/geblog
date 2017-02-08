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
}

h1 {
    font-size: .3rem;
}
h2 {
    font-size: .28rem;
}
h3 {
    font-size: .25rem;
}
h4 {
    font-size: .2rem;
}
p {
    line-height: 1.5;
}
#app {
    background: #eee;
    min-height: 100%;
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
.logo h1 {
    margin: .1rem 0;
}

.loading {
    text-align: center;
    font-size: .3rem;
    color: #aaa;
}
</style>
