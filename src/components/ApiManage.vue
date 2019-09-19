<template>
	<div class="apimanage">
		<el-col :span="24" class="toolbar">
		 		<el-form ref="searchform" :model="searchform"  :rules="searchformRules" :inline="true" class="search" >
		 			<el-form-item prop="name">
		 				<el-input placeholder="请输入内容查找" v-model="searchform.value" class="input-with-select" >
						    <el-select v-model="searchform.type" slot="prepend" placeholder="请选择">
						      <el-option label="用户ID" value="uid"></el-option>
						      <el-option label="用户名" value="name"></el-option>
						      <el-option label="合作ID" value="partner"></el-option>
						    </el-select>
						 </el-input>
		 			</el-form-item>
		 			<el-form-item>
		 				<el-select v-model="searchform.status" placeholder="请选择">
		 					<el-option  value="1" label="正常"></el-option>
		 					<el-option  value="0" label="禁用"></el-option>
		 				</el-select>
		 				<el-button type="primary" @click="search">查询</el-button>
		 				<el-button @click="resetSearch">重置</el-button>
		 			</el-form-item>
		 		</el-form>
		 </el-col>
		<!-- <el-col :span="24" class="toolbar"></el-col> -->
		<el-table :data="tableData" stripe>
				<el-table-column prop="uid" label="ID"></el-table-column>
				<el-table-column prop="name" label="用户名"></el-table-column>
				<el-table-column prop="partner" label="合作伙伴"></el-table-column>
				<el-table-column prop="key" label="秘钥" width="280px"></el-table-column>
				<el-table-column prop="sign_type" label="签名类型"></el-table-column>
				<el-table-column prop="input_charset" label="编码"></el-table-column>
				<el-table-column prop="created" label="创建时间" :formatter="formatCreated"></el-table-column>
				<el-table-column prop="modified" label="修改时间" :formatter="formatModified"></el-table-column>
				<el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
		</el-table>
	</div>
</template>
<script>
	import { apiList } from '../api/api';
	import util from '../api/util'
	export default{
		name: 'ApiManage',
		data() {
			return {
				tableData:[],
				searchform:{type:'uid', value:'', status:''},
		        searchformRules:{},
			}
		},
		methods:{
			formatCreated: function(row,column) {
		        return util.formatDate.format(row.created,'yyyy-MM-dd hh:mm');
		    },
		    formatModified: function(row,column) {
		        return util.formatDate.format(row.modified,'yyyy-MM-dd hh:mm');
			},
			formatStatus: function(row,column) {
				return row.status == '0' ? '禁用' : '正常';
			},
			changeStatus(){},
			ApiList(params){
				params.page = this.currentPage;
				params.row = this.size;
				apiList(params).then(rs =>{
					this.tableData = rs.rows;
				}).catch(error => {console.log(error)});
			},
			search(){
				var params = {}
				if(this.searchform.status){
					params.status = this.searchform.status;
				}
				if(this.searchform.type == 'uid' && this.searchform.value){
					params.uid = this.searchform.value;
				}
				if(this.searchform.type == 'name' && this.searchform.value){
					params.name = this.searchform.value;
				}
				if(this.searchform.type == 'partner' && this.searchform.value){
					params.partner = this.searchform.value;
				}
				if(JSON.stringify(params) != "{}"){
					this.ApiList(params);
				}
			},
			resetSearch(){
				this.searchform.status='';
			},
		},
		mounted: function(){
			this.ApiList({});
		}
	}
	

</script>