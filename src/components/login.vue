<template>
	<div class="login">
		<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container" width="360">
	        <h3 class="title">网络营销后台系统登录</h3>
	        <el-form-item prop="username">
	          <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="账号"></el-input>
	        </el-form-item>
	        <el-form-item prop="password">
	          <el-input type="password" v-model="ruleForm2.password" @keydown.enter.native="handleSubmit2" auto-complete="off" placeholder="密码"></el-input>
	        </el-form-item>
	        <el-form-item> <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">立即登录</el-button></el-form-item>
	    </el-form>	
	</div>
</template>
<script>
   import { login } from '../api/api'
	
	export default {
		name:'Login',
		data () {
			return {
				 logining: false,
				ruleForm2: {
                  username: '',
                  password: ''
                },
                rules2: {
                    username: [
                        { required: true, message: '请输入账号', trigger: 'blur' },
                        //{ validator: validaePass }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        //{ validator: validaePass2 }
                    ]
                },

			}
		},
		methods: {
			handleSubmit2(ev) {
                 	 this.$refs.ruleForm2.validate((valid) => {
                 	 	if(valid){
                 	 		 this.logining = true;
                 	 		 let loginParams = {username:this.ruleForm2.username, password: this.ruleForm2.password};
                 	 		 login(loginParams).then( rs => {
									this.logining = false;
									localStorage.setItem('g3s_username',this.ruleForm2.username)
                 	 		 		if(rs.code == '1'){
                 	 		 			this.$router.push({ path: '/admin/UserManage' });
                 	 		 			this.$message({
		                                    message:'登录成功',
		                                    type: 'success'
		                                });
                 	 		 		}else if (rs.code == '0'){
                 	 		 			this.$message({
		                                    message:'用户名或密码错误！',
		                                    type: 'error'
		                                });
                 	 		 		}
                 	 		 }).catch(() => {
                 	 		 	this.logining = true;
                 	 		 	this.$message.error(rs.msg);
                 	 		 })
	                 	}
                 })
			}
		}
	}
</script>
<style scoped>
	.login {       width: 350px;
    position: absolute;
    left: 50%;
    top: 20%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    padding: 20px;
    border: 1px solid #dded;
    border-radius: 4px;
    -webkit-box-shadow: 0 0 5px #eee;
    box-shadow: 0 0 10px #eee;}
    form {
    	    font-size: 22px;
    font-weight: normal;
    padding-bottom: 20px;
    color: #555;
    }
	form h3 {    font-size: 22px;
    font-weight: normal;
    padding-bottom: 20px;
    color: #555;}


</style>