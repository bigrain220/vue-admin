
<template>
  <div class="left-nav">
    <el-menu router
      :default-active="onRoutes"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-menu-item index="UserManage">
          <i class="el-icon-menu"></i><span slot="title">用户管理</span>
      </el-menu-item>
      <!-- <el-menu-item index="UserLang">
          <i class="el-icon-setting"></i><span slot="title">语言配置</span>
      </el-menu-item> -->
       <el-menu-item index="DomainManage">
          <i class="el-icon-upload"></i><span slot="title">域名管理</span>
      </el-menu-item>
      <el-menu-item index="SeoManage">
          <i class="el-icon-share"></i><span slot="title">SEO管理</span>
      </el-menu-item>
       <el-menu-item index="ApiManage">
          <i class="el-icon-share"></i><span slot="title">API管理</span>
      </el-menu-item>
      <el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i><span>模板管理</span></template>
          <el-menu-item index="MuManage">模板列表</el-menu-item>
          <el-menu-item index="ColorManage">颜色列表</el-menu-item>
          <el-menu-item index="IndustryManage">行业列表</el-menu-item>
          <el-menu-item index="MinAppManage">程序列表</el-menu-item>
      </el-submenu>
      <el-menu-item index="LangManage">
          <i class="el-icon-share"></i><span slot="title">语言管理</span>
      </el-menu-item>
      <!-- <el-submenu index="4">
           <template slot="title"><i class="icon iconfont icon-bianjimarkdown"></i><span slot="title">编辑器</span></template>
           <el-menu-item index="QuillEditor">quillEditor</el-menu-item>
           <el-menu-item index="MavonEditor">mavonEditor</el-menu-item>
           <el-menu-item index="CodeMirror">codemirror</el-menu-item>
      </el-submenu> -->
    </el-menu>
      
  </div>
</template>
 
<script>
export default {
  name: 'leftNav',
  data () {
    return {
    }
  },
  methods: {
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  },
  computed:{
      onRoutes(){
        return this.$route.path.replace('/admin/','');
      }
    }
}

</script>
<style>
 	.left-nav{
       display: block;
	    position: absolute;
	    width: 200px;
	    left: 0;
	    top: 66px;
	    bottom: 0;
	   
       
    }
    .iconfont{
       font-size:24px;
    }
    .el-menu {height:100%;}
   .el-menu-item.is-active a{color:#409EFF;}
   .el-menu-item a{color:#303133; text-decoration: none; display: block;}
    .iconfont {width:24px; height:18px;font-size:18px; margin-right: 5px; padding:0 3px; }
</style>