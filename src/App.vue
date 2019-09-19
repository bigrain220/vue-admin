<template>
  <div id="app">
  <transition name="fade" mode="out-in">
    <router-view></router-view>
   </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
}
* {margin:0; padding:0;}
body,html,#app {width:100%; height:100%; overflow: hidden;}
h1, h2 {
  font-weight: normal;
}
h1 {text-align: left; text-indent: 20px; padding-bottom:20px;}

ul {
  list-style-type: none;
  padding: 0;

}
  .toolbar {  height: 60px;background: #fff;margin-bottom: 20px;    box-sizing: border-box;border-left: 5px solid #409EFF;}
   .el-pagination {text-align: right; margin:10px 0;}
</style>
