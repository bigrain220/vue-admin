<template>
	<div class="mumanage">
		<div class="box">
			<el-input placeholder="标题 编号" clearable v-model="input5" class="input-with-select">
				<el-select v-model="searchValue" slot="prepend" placeholder="请选择">
					<el-option label="编号" value="option_id"></el-option>
					<el-option label="标题" value="option_name"></el-option>
				</el-select>
			</el-input>
            <el-cascader placeholder="字段/排序" expand-trigger="hover" :options="options" v-model="selectedOptions" @change="Select" class="select"></el-cascader>
            <el-button type="primary" icon="el-icon-search" @click="Search">搜索</el-button> 
            <el-button @click="resetSearch" >重置</el-button>
		</div>
		<header>
			<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="小程序列表" name="level">
				<div id="order-list">
					<ul class='list' >
						<li v-for="(item , index) in dataList" :key ="index">
							<div class="mask">
								<div class="group">
								<el-button type="primary" size="medium" @click.native="moduleEdit(item)">编辑</el-button>
								<el-button type="danger" size="medium" @click.native="moduleDel(item)">删除</el-button>
                </div>
								<el-button id="preview" type="success" @click.native="preView(item)">预览</el-button>	
							</div>
							<div class="img"><img :src="setSrc(item.image)" onerror=""/></div>
							<p id="text1"><span>{{item.id}} {{item.name}}</span><span>￥{{item.price}}</span></p>
							<p id="text2"><span>销量：{{item.hits}}</span><span v-if="item.status==1">正常</span><span v-else>禁用</span></p>
						</li>
						<!-- <li @click="addModule()" class="add"><i class="el-icon-plus"></i></li> -->
					</ul>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage1" :page-sizes="[8, 14, 20, 26]" :page-size="pagination.size1"
					layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
				</div>
			</el-tab-pane>
		   
		  </el-tabs>
		  <el-button @click="addModule" type="primary" class="addModule">新增模板</el-button>
		</header>
      <!-- 新增模板 -->
      <el-popover placeholder="top-start"  v-model="addVisibile" trigger="click" title="新增模板"  v-if="addVisibile">
      		<i class="close el-icon-close" @click="closePopover('addForm')"></i>
      		<el-form :model="addForm"  ref="addForm" :rules="rules" label-width="120px" class="add-ruleForm">
      			<el-form-item label="模板标题:" prop="name">
      				<el-input v-model="addForm.name" placeholder="不超过20个字符"></el-input>
					   <div class="repeat_name" v-show="repeat_add_name">该名称已存在</div>
      			</el-form-item>
      			<el-form-item label="封面图片:" prop="image">
      				<elSingleUpload v-model="addForm.image" v-on:sendToImage="sendToImage"></elSingleUpload>
      			</el-form-item>
      			<el-form-item label="价格(￥):" prop="price">
      				<el-input-number controls-position="right" v-model="addForm.price"  :step="50" :min="0" ></el-input-number>
      			</el-form-item>
            <!-- <el-form-item label="类型 :" prop="tid">
								<el-radio v-model="addForm.tid" label="1">微信小程序</el-radio>
								<el-radio v-model="addForm.tid" label="2">智能小程序</el-radio>
      			</el-form-item>
            <el-form-item label="上传App版:" prop="app">
      				<minAppUpload  sendAppData="add,app" :isUpload=isUpload :changeData=addForm></minAppUpload>
      			</el-form-item>  -->
						<!-- <el-form-item label="上传Web版:" prop="web" style="display:none">
      				<minAppUpload  sendAppData="add,web" :isUpload=isUpload></minAppUpload>
      			</el-form-item>  -->
      			<el-form-item label="状态 :" prop="status">
      				<el-switch  v-model="addForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" ></el-switch>
      			</el-form-item>
      			<el-form-item>
      				<el-button type="primary" @click="submitForm('addForm' , '0')">立即创建</el-button>
      				<el-button @click="resetForm('addForm')">重置</el-button>
      			</el-form-item>

      		</el-form>
      </el-popover>
      <!-- 编辑模板 -->
      <el-popover  placeholder="top-start"  v-model="editVisibile" trigger="click" title="编辑模板" v-if="editVisibile">
      		<i class="close el-icon-close" @click="closeView"></i>
      		<el-form :model="editForm"  ref="editForm" :rules="rules" label-width="120px" class="add-ruleForm" enctype="multipart/form-data">
      			<el-form-item label="ID:" >
					<span>{{editForm.id}}</span>
      			</el-form-item>
      			<el-form-item label="模板标题:" prop="name">
      				<el-input v-model="editForm.name" placeholder="不超过20个字符"></el-input>
					  <div class="repeat_name" v-show="repeat_edit_name">该名称已存在</div>
      			</el-form-item>
      			<el-form-item label="封面图片:" prop="image">
								<elSingleUpload v-model="editForm.image" v-on:sendToImage="sendToImage"></elSingleUpload>
      			</el-form-item>
      			<el-form-item label="价格:" prop="price">
      				<span>￥</span><el-input-number controls-position="right" v-model="editForm.price"  :step="50"></el-input-number>
      			</el-form-item>
      			<el-form-item label="类型 :" prop="tid">
								<el-radio v-model="editForm.tid" label="1">微信小程序</el-radio>
								<el-radio v-model="editForm.tid" label="2">智能小程序</el-radio>
      			</el-form-item>
                <el-form-item label="上传App版:" prop="app">
      				<minAppUpload  sendAppData="edit,app" :isUpload=isUpload :changeData=editForm :lineChange=lineChange></minAppUpload>
      			</el-form-item> 
				<el-form-item label="上传Web版:" prop="web">
      				<minAppUpload   sendAppData="edit,web" :isUpload=isUpload :changeData=editForm :lineChange=lineChange></minAppUpload>
      			</el-form-item> 
      			<el-form-item label="状态:" prop="status">
      				<el-switch  v-model="editForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" ></el-switch>
      			</el-form-item>
      			<el-form-item label="创建时间:" prop="created"><span>{{editForm.created}}</span></el-form-item>
      			<el-form-item v-if="editForm.modified" label="修改时间:"><span>{{editForm.modified}}</span></el-form-item>
      			<el-form-item>
      				<el-button type="primary" @click="submitForm('editForm' , '1')">确认修改</el-button>
      			</el-form-item>
      		</el-form>
      </el-popover>
	</div>
</template>
<script>
  import elSingleUpload from './common/singleUploadImage.vue';
  // import minAppUpload from './common/minAppUpload.vue';
	import {minAppEdit, ossGet,minAppAdd,appList,minAppDel} from '../api/api.js';
	import util from '../api/util.js';
	import axios from 'axios';
	export default{
		name: 'MinAppManage',
		components:{
			elSingleUpload,
			minAppUpload:()=>import('./common/minAppUpload.vue'),
		},
		data() {
			 var validateName = (rule, value, callback) => {
				this.repeat_edit_name= false;
				this.repeat_add_name= false;
				callback();					
			};
			return {
				msg:'模板管理',
				total:10,//一共多少条
				pagination:{
					currentPage1:1,
					size1:8,
				},
		    activeName: 'level',
				dataList:[],
				searchform:{
					sort_by:'',
					sort_order:''
				},
				addVisibile:false,
				editVisibile:false,
				searchValue:'option_id',
				input5:'',
				selectedOptions:[],
				isUpload:false,
				lineChange:"",
				repeat_edit_name:false,
				repeat_add_name:false,
				addForm: {
					name:'',
					image:'',
					price:'',
					status:'1',
					tid:'',
				},
				editForm: {
					id:'',
					name:'',
					image:'',
					price:'',
					status:'',
					tid:'',
				},
				rules:{
					name: [
						    {required:true,max: 20, message:'该项为必填项且长度不能超过20', trigger:'blur' }, 
							{ validator: validateName, trigger: 'change' }
						 ],
					image:[{required:true, messag:'请选择封面的图片', trigger:'change' }],
					price: [{ type:'number', required:true, message:'情填写价格', trigger:'blur' }], 
				},
				options:[
						{value:'id',label:'编号',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
						{value:'price',label:'价格',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
						{value:'hits',label:'销量',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]},
						{value:'created',label:'时间',children:[{value:'asc',label:'升序'},{value:'desc',label:'降序'}]}
					],
			}
		},
		methods:{
			Select(value){
				if(value instanceof Array){
					this.searchform.sort_by=value[0];	this.searchform.sort_order=value[1];
					this.Search();
				}
			},
			Search(){
				var param1={},param2={};
				if(this.searchValue == 'option_name'){
						param1=this.searchform;
						param1.name=this.input5;param1.page=this.pagination.currentPage1; param1.rows=this.pagination.size1;param1.id='';
						this.getAppList(param1);
				}else if(this.searchValue == 'option_id'){
						param2=this.searchform;
						param2.id=this.input5;param2.page=this.pagination.currentPage1; param2.rows=this.pagination.size1;param2.name=''
						this.getAppList(param2);
				} 
				
			},
			resetSearch(){
				this.selectedOptions=[];this.input5='';this.searchValue='option_id';this.searchform={};
				this.getAppList({page:this.pagination.currentPage1, rows:this.pagination.size1});
			},
			setSrc(image){
				return image+'?x-oss-process=image/resize,w_200';
			},
			sendToImage(data){
				this.addForm.image = data;
				this.editForm.image = data;	
			},
			closeView(){
				this.editVisibile = false;
				this.resetForm('editForm');
				this.repeat_edit_name=false;
				this.repeat_add_name=false;
			},
			async getAppList(params){
				let rs1 = await appList(params).catch(error => {console.log(error)})
				if(this.activeName == 'level'){
						this.dataList = rs1.rows;
						params.page = this.pagination.currentPage1; params.rows = this.pagination.size1;
					}else{

				}
				this.total = Number(rs1.total);
			},
			handleSizeChange(val) {
				if(this.activeName == 'level'){
					this.pagination.size1 = val;
					var params = {page:this.pagination.currentPage1, rows:val};
				} 
		        this.getAppList(params);
		     },
		    handleCurrentChange(val) {
				if(this.activeName == 'level'){
					this.pagination.currentPage1 = val;
					var params = {page:val,rows:this.pagination.size1}
				}
		      this.getAppList(params);
			},
				 
		    handleClick(tab, event){
						// if(this.activeName == 'level'){
						// 	var params = {page:this.pagination.currentPage1, rows:this.pagination.size1};
						// }
				},
				openFullScreen() {
					const loading = this.$loading({
						lock: true,
						text: 'Loading',
						spinner: 'el-icon-loading',
						background: 'rgba(0, 0, 0, 0.7)'
					});
					setTimeout(() => {
						loading.close();
					}, 2000);
     		},
		    addModule(){
		    	this.addVisibile = true;
		    },
		    submitForm(formName , val){
		    		var params = {};
	        	if(val == '0'){
							params = this.addForm;
	        	}else{
	        		params.id = this.editForm.id; params.name = this.editForm.name; params.image = this.editForm.image;
						 params.price = this.editForm.price;params.status = this.editForm.status;params.tid = this.editForm.tid;
							// params = this.editForm;
						}
		    	this.$confirm('确定执行此操作?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'success'
			        }).then(() => {
			        	this.$refs[formName].validate((valid) => {
				    		if(valid){
									this.isUpload=true;
				    			if(val == '0'){											
				    				minAppAdd(params).then(rs => {
											// console.log('rs',rs,'params:',params)
											if(rs.msg=="ILLEGAL_NAME_EXISTS"){
												this.repeat_add_name=true;
											};
					    				// if(rs.code == 1){
										 if(rs.indexOf('"code": 1')>0){
					    					this.addVisibile = false;
					    					this.$refs[formName].resetFields();
					    					this.$message.success('模板新增成功~');
												this.resetForm('addForm')
												var param = {page:this.pagination.currentPage1, rows:this.pagination.size1};
												this.getAppList(param);
					    				}else{
					    					this.$message.error(rs.msg);
					    				}
										}).catch(error => {console.log(error)})
										
				    			}else{				
										 minAppEdit(params).then(rs => {
											// console.log('rs1:',rs,'params:',params);
											if(rs.msg=="ILLEGAL_NAME_EXISTS"){
												this.repeat_edit_name=true;
											};
				    					// if(rs.code == 1){
										if(rs.indexOf('"code": 1')>0){
											this.openFullScreen();
											setTimeout(()=>{
												this.editVisibile = false;
					    					this.$refs[formName].resetFields();
					    					this.$message.success('模板编辑成功~');
												this.resetForm('editForm')
												var param = {page:this.pagination.currentPage1, rows:this.pagination.size1};
												this.getAppList(param);
											},2000)
					    			
										}else{
					    					this.$message.error(rs.msg);
					    				}
				    				}).catch(error => {console.log(error)})
				    			}
				    		
				    		}else{
				    			return false;
				    		}
				    	});
			        }).catch(() => {
			   
			        });
		    },

		    resetForm(formName){
					this.$refs[formName].resetFields();
					this.isUpload=false;
		    },
	      moduleEdit(item,id){
	      	this.editVisibile = true;
	      	appList({id:item.id}).then(rs => {
						// console.log('moduleEdit-rs:',rs)
						this.editForm.id = rs.rows[0].id;
						this.editForm.name = rs.rows[0].name;
						this.editForm.image = rs.rows[0].image;
						this.editForm.price = rs.rows[0].price;
						this.editForm.status = rs.rows[0].status;
		      	this.editForm.created = util.formatDate.format(rs.rows[0].created,'yyyy-MM-dd hh:mm:ss');
						// this.editForm.modified = util.formatDate.format(rs.rows[0].modified,'yyyy-MM-dd hh:mm:ss');
						rs.rows[0].modified==0 ? this.editForm.modified='' : this.editForm.modified = util.formatDate.format(rs.rows[0].modified,'yyyy-MM-dd hh:mm:ss');
	      	}).catch(error => {console.log(error)});
		},
	      moduleDel(item){
	      	 this.$confirm('此操作将永久删除此模块, 是否继续?', '提示', {
	      	 		confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
	      	 }).then(() => {
	      	 	minAppDel({id:item.id}).then(rs => {
	      	 		if(rs.code == 1){
	      	 			this.$message.success('删除成功！');
	      	 			this.getAppList({page:this.pagination.currentPage1, rows:this.pagination.size1,});
	      	 		}else{
	      	 			this.$message.error(rs.msg);
	      	 		}
	      	 	})
	      	 	
	      	 }).catch(() => {

	      	 })
		  },
		  preView(item){
				var temHost = util.changHost()
			  window.open('http://'+temHost+'/upload/web/'+item.id);
		  },
	      closePopover(formName){
	      	this.resetForm(formName);
			  this.addVisibile = false;
			  this.repeat_edit_name=false;
			  this.repeat_add_name=false;
		  },

		},
		mounted:function(){
			this.getAppList({page:this.pagination.currentPage1,rows:this.pagination.size1});
			this.lineChange =	util.changHost();
		},

	}
</script>
<style scoped>
	.el-icon-edit {font-size:18px; margin-left:20px; cursor: pointer;}
	.el-icon-edit:hover {color:#2196F3;}
	.list li{width:200px; height:262px; overflow: hidden; position: relative; float:left; margin-right: 25px; margin-bottom: 25px; background:#fff; border:1px solid #eee; box-shadow:0 2px 12px 0 rgba(0,0,0,.1);}
	.list li .mask{ width:100%; height:100%; background:rgba(0,0,0,.6); position: absolute; left:0; top:0; transition:all 1s; display: none; z-index: 99;}
	.list li:hover .mask{ display: block; transition:all 1s;  }
	.mask .group {width:80%;margin:0 auto;margin-top: 80px;display: flex;justify-content: space-around;}
	 #preview {margin: 0 auto;display: block;margin-top: 40px;width: 151px;}
	.list li p {    position: absolute;
    bottom: 0;
    height: 26px;
    border-top: 1px solid #eee;
    width: 100%;
    line-height: 26px;
    font-size: 14px;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
	justify-content: space-between; color:#333; background: #fff;}
	.list li p#text1 {bottom:31px; height:31px; padding-top:5px;}
	.list li p#text2 {border-top:none; height:31px; padding-bottom:5px;}
	.list li p#text1 span:last-child {color:#409eff;}
    .toolbar {border:none; border-bottom:2px solid #eee;}
    .toolbar ul{width:400px; line-height: 40px; height:40px; padding-top:20px; line-height: 40px; float:left; padding-left:20px;overflow:hidden;}
    .list .img {width:100%; height:100%; position: relative}
    .list img {width:100%; height: auto; margin:0 auto;}
    .toolbar ul li {    float: left;
    padding: 0 5px;
    margin: 0 5px;
    box-sizing: border-box;
    height: 40px;
    font-size: 14px;
    color: #7b7878;
    cursor: pointer; line-height: 40px}
	ul.list {overflow: hidden;}
    ul.list li.add {border:1px dashed #c0ccda; background-color:#fbfdff; cursor:pointer; position: relative}
    li.add i {font-size:30px; position: absolute; left:50%; top:50%; transform:translate(-50%,-50%);}
    ul.list li.add:hover {border-color:#409eff; color:#409eff;}
    .el-dialog__header {background:#E4E7ED;}

   .avatar-uploader .el-upload {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 178px;
	    height: 178px;
	    line-height: 178px;
	    text-align: center;
	  }
	  .avatar {width: 178px;height: 178px;display: block;}
	  .add-ruleForm {padding:30px; width: 90%;}
	  header {position: relative}
	  header .addModule {position: absolute; top:-7px; right:0; }
	  #order-list {overflow-y:scroll;}
	  #order-list::-webkit-scrollbar {display:none}
	  .view {width:100%; padding:30px; height:auto; box-sizing: border-box;}
	  .view dt {font-size:24px; line-height: 60px; border-bottom:1px solid #eee; margin-bottom:20px;}
	  .view dd {font-size:16px; line-height: 40px; }
	  .view dd em {font-style: normal; padding-right:10px;}
	  .view span {width:150px; margin-bottom: 20px; text-align: right; padding-right: 30px; display: inline-block; font-weight: bold;}
	  .mumanage .el-checkbox {margin-left:30px;}
	  .box {margin-bottom:5px;}
	 .box .el-input {width:340px;}
	 .el-tag {margin:0 5px 5px 0;}
	 .danger {color:#f56c6c !important;}
	 .list{min-height: 646px;}
	 .repeat_name{color: #f56c6c;font-size: 12px;line-height: 1;padding-top: 4px;}
</style>


