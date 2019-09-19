<template>
	<div class="colormanage">
		<el-col :span="24" class="toolbar">
			<el-button  type="primary" @click="handleAdd">添加颜色</el-button> 
			<div class="status">
				<span>状态选择：</span>
				<el-select v-model="selectObject" placeholder="请选择" @change="selectStatus">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" @click.native="selectStatus()">查询</el-button>
				<el-button @click="resetSearch" >重置</el-button>
			</div>
		</el-col>
		<el-table :data="colorData" style="width:100%" show-header stripe>
			<el-table-column prop="id" label="ID" sortable></el-table-column>
			<el-table-column prop="name" label="颜色"></el-table-column>
			<el-table-column prop="status" label="状态">
					<template slot-scope="scope"><el-switch v-model="colorData[scope.$index].status"  @change="changeStatus(scope.row)"  active-value="1" inactive-value="0"></el-switch></template>
				</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					 <el-button size="mini" type="text"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
					 <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button> 
			    </template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20 , 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

		<el-popover  placeholder="top-start"  v-model="colorchangeVisibile" trigger="click" title="颜色修改">
      		<i class="close el-icon-close" @click="colorchangeVisibile = false"></i>
      		<ul class="add-ruleForm">
      			<li><span>ID：</span>{{changeForm.id}}</li>
      			<li><span>颜色名称：</span><el-input  v-model="changeForm.name" placeholder="请输入颜色名称"></el-input></li>
 				<li>
      				<span><span>状态：</span></span>
      				<el-switch  v-model="changeForm.status"  active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0" ></el-switch>
      			</li>
      			<li>
      				<el-button @click="colorchangeVisibile = false">取 消</el-button>
	          		<el-button type="primary" @click="colorSubmit()">提 交</el-button>
      			</li>
      		</ul>
      	</el-popover>
      	<el-popover  placeholder="top-start"  v-model="coloraddVisibile" trigger="click" title="增加颜色">
      			<i class="close el-icon-close" @click="coloraddVisibile = false"></i>
      			<el-form :model="addForm" :rules="rulesAdd" ref="addForm" label-width="120px" class="add-ruleForm">
      				<el-form-item label="名称" prop="name">
      					<el-input v-model="addForm.name" placeholder="不超过20个字符"></el-input>
      				</el-form-item>
      				<el-form-item label="状态" prop="status">
      					<el-switch v-model="addForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0"></el-switch>
      				</el-form-item>
      				<el-form-item>
      					<el-button type="primary" @click="addsubmitForm('addForm')">新 增</el-button>
      				</el-form-item>
      			</el-form>
      	</el-popover>
	</div>
</template>
<script>
	import { colorList , colorUpdate , colorAdd , colorEdit , colorDel } from '../api/api'
	export default {
		name:'ColorManage',
		data(){
			return {
				msg:'颜色列表',
				colorData:[],
				total:10,//一共多少条
		        currentPage:1,//第几页
		        size:10,//每页10条数据
		        colorchangeVisibile:false,
		        coloraddVisibile:false,
		        changeForm:[],
		        rulesChange:{},
		        addForm:{name:'',status:'1'},
		        rulesAdd:{name: [{ required:true, message:'长度不超过20字符', trigger:'blur' }],},
		        selectObject:'',
		        options:[{value:'1',label:'正常'},{value:'0',label:'禁用'}]
		    }
			
		},
		methods: {
			changeStatus(row){
				let params = {id:row.id , status: row.status , name: row.name}
				colorEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});
			},
			getColorList(){
				var params = {page:this.currentPage, rows:this.size};
				colorList(params).then(rs => {
					console.log(rs);
					this.total = rs.total;
					this.colorData = rs.rows;
				}).catch(error => {console.log(error)})
			},
			handleSizeChange(val) {
		        this.size = val;
		       	this.getColorList();

		     },
		    handleCurrentChange(val) {
		        this.currentPage = val;
		        this.getColorList();
		     
		     },
		     handleEdit(index,row){
		     		this.colorchangeVisibile = true;
		     		colorList({id:row.id}).then(rs => {
		     			this.changeForm = rs.rows[0];
		     		}).catch(error => {console.log(error)})

			 },
			 handleDel(index,row){
				 this.$confirm('颜色确定删除'+row.name+'？','警告', {
		    		confirmButtonText: '确定',
		    		cancelButtonText: '取消',
		    		type:'warning'
		    	}).then(() => {
					colorDel({id:row.id}).then(rs => {
						if(rs.code == 1){
							this.$message.success('已删除')
							this.getColorList();
						}else{
							this.$message.error(row.name+'被模板使用，不能删除');
						}
						
					})
				}).catch(error => {console.log(error)})
			 },
		     handleAdd(){
		     	this.coloraddVisibile = true;
		    },
		    addsubmitForm(formName){
		    	this.$confirm('是否增加颜色?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'info'
			        }).then(() => {
			        	this.$refs[formName].validate((valid) => {
				    		if(valid){
				    			colorAdd(this.addForm).then(rs => {
				    				if(rs.code == 1){
				    					this.coloraddVisibile = false;
				    					this.$refs[formName].resetFields();
				    					this.getColorList();
				    					this.$message.success('颜色新增成功！');
				    				}else{
				    					this.$message.error(rs.msg);
				    				}
				    			})
				    		}else{
				    			return false;
				    		}
				    	});
			        }).catch(() => {});
		    },
		    colorSubmit(){
		    	var params = {id:this.changeForm.id, name:this.changeForm.name, status:this.changeForm.status};
		    	this.$confirm('颜色确定修改？','提示', {
		    		confirmButtonText: '确定',
		    		cancelButtonText: '取消',
		    		type:'success'
		    	}).then(() => {
			    	colorEdit(params).then(rs => {
			    		if(rs.code == 1){
			    			this.colorchangeVisibile = false;
			    			this.$message.success('修改成功！');
			    			this.getColorList();
			    		}else{
			    			this.$message.error(rs.msg);
			    		}
			    	}).catch(error => {console.log(error)})
		    	}).catch(error => {console.log(error)})
		    },

		    selectStatus(){
		    	var params = { status:this.selectObject, page:this.currentPage, rows:this.size };
		    	colorList(params).then(rs => {
		    		this.colorData = rs.rows;
		    	})
			},
			resetSearch(){
				this.selectObject="";
				this.currentPage=1;
				this.getColorList();
			},
		 },
		mounted: function(){
			this.getColorList();
		}
	}
</script>
<style scoped>
	.add-ruleForm {width:650px; padding:30px;}
	.add-ruleForm li {padding:10px 0;}
	.add-ruleForm li:last-child {padding-left:115px;}
	.add-ruleForm li .el-input {width:auto;}
	.add-ruleForm li span { display: inline-block;width: 100px;text-align: right;padding-right: 20px;}
/*	.el-table th {background:#f5f7fa;}*/
	button.select {margin:10px;}
	.status {margin-left:10px; display: inline-block;}
 </style>