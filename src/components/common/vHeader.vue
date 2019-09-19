<template>
  <div class="header">
    <img :src="image" alt="网络营销系统">
    <div class="right">
      <div class="username"><i class=""></i>{{this.username}}</div>
      <el-button type="primary" @click="loginOut()" class="loginout">退出</el-button>
    </div>
    
  </div>
</template>
 
<script>
import {logout} from '../../api/api.js'
export default {
  name: 'vHeader',
  data () {
    return {
      image:'./static/img/logo.png',
      username:localStorage.getItem('g3s_username'),
    }
  },
  methods: {
      loginOut() {
         this.$confirm('确定退出登录?', '提示', {
          confirmButtonText: '退出',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          logout({}).then(rs => {
            if(rs.code == 1){
                this.$router.push({ path: '/login' });
                this.$message({
                  type: 'success',
                  message: '成功退出！'
                });
            }else{
              this.$message.error(rs.msg)
            }
          })
          .catch(error => {console.log(error)})
          
        }).catch(() => {});
      },
      getusername(){

      },
  },
}

</script>
<style>
   .header {

    position: fixed;
    box-sizing: border-box;
    width: 100%;
    height: 66px;
    font-size: 14px;
    line-height: 66px;
    background-color: #324157;
    box-shadow: 2px 0 3px rgba(0,0,0,.5);
    z-index: 1000;
    padding: 0 32px 0 40px;
    overflow: hidden;
    display:flex;
    justify-content: space-between;
    align-content: flex-start;
   }
.header img {  margin-left:-40px; margin-top:4px; height:58px;}
.loginout {
  margin-top:14px; 
  display:inline-block;
}
.username {
  display: inline-block;
    line-height: 66px;
    color: #fff;
    margin: 0 15px;
}

</style>