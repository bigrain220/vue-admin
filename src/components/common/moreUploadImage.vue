<template>
	<div>
		<el-upload 
		  v-model="fileList"
		  ref="addupload"
		  :multiple = "true"
		  :action="uploadParam.host"
		  :data = 'imgData'
		  :on-preview="addhandlePreview"
		  :on-remove="addhandleRemove"
		  :on-success="adduploadSuccess"
		  :file-list="fileList"
		  :on-change="addhandlefileChange"
		  :before-upload="addbeforeAvatarUpload"
		  :on-error="adduploadError"
		  list-type="picture-card"
		>
		  	<el-button slot="trigger" size="small" type="primary">选取图片</el-button>
			<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
		</el-upload>
	</div>
</template>
<script>
	import { ossGet } from '../../api/api';
	import  util  from '../../api/util.js';
		export default {
			props:{
				value: { type: Array }
			},
			data(){
				return {
					fileList:[],
					dialogImageUrl:'',
					dialogVisible:false,
					imgData:{
						'key':'',
						'policy':'',
						'OSSAccessKeyId':'',
						'success_action_status':200,
						'signature':'',
						'callback':''
					},
					uploadParam:{
						'name':'',
						'host':'',
						'expire':0,
						'dir':'',
						'callback':'',
						'dir':'',
						'policy':'',
						'signature':''
					}
				}
			},
			methods:{
				addhandlefileChange(file,fileList){//选择完文件后的状态
					if(file.status == 'ready'){
						file.name = util.random_string(10) + util.get_suffix(file.name);
						this.uploadParam.name = file.name;
			    	}
				},
				adduploadError(){
					this.$message.warning('上传功能出了点问题，请重试');
				},
			    adduploadSuccess(response, file, fileList){
			      	this.$message.success('图片上传成功!状态码：'+response.Status);
			      	this.fileList = fileList;
			      	this.$emit('sendToImage', this.fileList, this.uploadParam.host, this.uploadParam.dir);
			    },
			    addhandlePreview(file){
			    	this.dialogImageUrl = file.url;
	    			this.dialogVisible = true;
			    },
		        addhandleRemove(file,fileList){
		        	this.fileList = fileList;
		        	this.$emit('sendToImage', this.fileList, this.uploadParam.host, this.uploadParam.dir);
		        },
			    addbeforeAvatarUpload (file) {
			    	const isImage =( file.type === 'image/jpeg' || file.type === 'image/png');
				    const isLt2M = file.size / 1024 / 1024 < 2;
				    if (!isImage) {
			        	this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
			        	return false;
			        }else if (!isLt2M) {
			        	this.$message.error('上传头像图片大小不能超过 2MB!');
			        	return false;
			        }else{
			        	if(this.uploadParam.expire < Date.parse(new Date()) / 1000 + 3){
			        		return	ossGet({}).then(rs => {
							       		this.uploadParam.accessid = rs.accessid;
							       		this.uploadParam.callback = rs.callback;
							       		this.uploadParam.dir = rs.dir;
							       		this.uploadParam.expire = rs.expire;
							       		this.uploadParam.host = rs.host;
							       		this.uploadParam.policy = rs.policy;
							       		this.uploadParam.signature = rs.signature;
							       		this.action = this.uploadParam.host;
							       		this.imgData = {
						   					'key' : this.uploadParam.dir + this.uploadParam.name,
						   					'policy' : this.uploadParam.policy,
						   					'OSSAccessKeyId' : this.uploadParam.accessid,
						   					'success_action_status':200,
						   					'signature' : this.uploadParam.signature,
						   					'callback' : this.uploadParam.callback
						   				};
					   				}).catch(() => {
					   		 			console.log('error');
							})
			        	}else{
			        		return	this.imgData.key = this.uploadParam.dir + this.uploadParam.name;
			        	}
			        }
			    }
			},
			mounted(){
	            this.fileList = this.value;
	        },
	        watch: {
	            'value'(newVal, oldVal) {//监控
					if (newVal !== this.fileList) {
	                    this.fileList = newVal
	                }
	            },
	        }
		}
</script>
<style scoped>
	
</style>