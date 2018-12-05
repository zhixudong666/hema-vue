<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  body,html{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }
  *{
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    text-decoration: none;
    color:inherit;
    margin:0;
    padding:0;
  }
  #app{
    width: 100%;
    height: 100%;
  }
</style>
