<template>
	<div class="domainmanage">
		 <el-col :span="24" class="toolbar">
		 		<el-form ref="searchform" :model="searchform"  :rules="searchformRules" :inline="true" class="search" >
		 			<el-form-item prop="name">
		 				<el-input placeholder="请输入内容查找" v-model="searchform.value" class="input-with-select">
						    <el-select v-model="searchform.type" slot="prepend" placeholder="请选择" >
						      <el-option label="用户ID" value="uid"></el-option>
						      <el-option label="用户名" value="username"></el-option>
						      <el-option label="域名" value="domain"></el-option>
						    </el-select>
						 </el-input>
		 			</el-form-item>
		 			<el-form-item>
		 				<el-select v-model="searchform.status" placeholder="状态选择">
		 					<el-option label="正常" value="1"></el-option>
		 					<el-option label="禁用" value="0"></el-option>
		 				</el-select>
		 			</el-form-item>
					 <el-form-item>
		 				<el-select v-model="searchform.area" placeholder="区域选择">
		 					<el-option label="国内" value="1"></el-option>
		 					<el-option label="海外" value="0"></el-option>
		 				</el-select>
		 				<el-button type="primary" @click="search">查询</el-button>
		 				<el-button @click="resetSearch">重置</el-button>
		 			</el-form-item>
		 		</el-form>
		 </el-col>

		 <el-table :row-class-name="tableRowClassName" center :data="dataList" :highlight-current-row="true" style="width: 100%">
		 		<el-table-column prop='uid' label="UID" ></el-table-column>
		 		<el-table-column prop='domain' label="用户域名">
					 <template slot-scope="scope">
						<i class="el-icon-check" v-if="scope.row.domain.indexOf('正常')>0"></i>
						<i class="el-icon-close" v-if="scope.row.domain.indexOf('失败')>0"></i>
						<a :href="'http://'+scope.row.domain.slice(4)" target="_blank" style="margin-left: 10px" class="net">{{ scope.row.domain.slice(4) }}</a>
					</template>
				 </el-table-column>
				<el-table-column prop="area" label="区域">
					<template slot-scope="scope">
						<el-switch  v-model="dataList[scope.$index].area" @change="changeArea(scope.row)" active-color="#13ce66"  inactive-color="#ff4949"   active-value="1" inactive-value="0">
	                    </el-switch>
					</template>
				</el-table-column>
		 		<el-table-column prop="status" label="状态" >
	               <template slot-scope="scope">
	                    <el-switch  v-model="dataList[scope.$index].status" @change="changeStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0">
	                    </el-switch>
	                </template>
          		</el-table-column>
				<el-table-column fixed="right" label="操作" width="150">
					<template slot-scope="scope">
						<!-- <el-button-group>
						<el-button type="success" size="small" @click="previewClick(scope.row)" icon="el-icon-search"></el-button>
						<el-button type="primary" size="small" @click="editClick(scope.row)"    icon="el-icon-edit"></el-button>
						<el-button type="danger" size="small" @click="deleteClick(scope.row)"  icon="el-icon-delete"></el-button>
						</el-button-group> -->
						<el-button type="text" size="small" @click="previewClick(scope.row)">预览</el-button>
						<el-button type="text" size="small" @click="editClick(scope.row)"   >编辑</el-button>
						<el-button type="text" size="small" @click="deleteClick(scope.row)" >删除</el-button>
					</template>
				</el-table-column>
		 </el-table>
	  	<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20 , 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

		<el-popover placeholder="top-start"  v-model="editVisibile" trigger="click" title="编辑域名">
			<i class="close el-icon-close" @click="editVisibile = false"></i>
			<el-form :model="editForm" :rules="editRules" ref="editForm" label-width="120px" class="demo-ruleForm addForm">
			<el-form-item label="UID" prop="uid">
				<el-input v-model="editForm.uid" disabled></el-input>
			</el-form-item>
			<el-form-item label="用户域名" prop="domain">
				<el-input v-model="editForm.domain"></el-input>
			</el-form-item>
			<el-form-item label="所属区域" prop="name">
				<el-switch  v-model="editForm.area"  active-color="#13ce66" active-text="国内" inactive-color="#ff4949" inactive-text="海外"  active-value="1" inactive-value="0" ></el-switch>
			</el-form-item>
			<el-form-item label="当前状态" prop="status">
				<el-switch  v-model="editForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0"></el-switch>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('editForm')">修改</el-button>
				<el-button @click="editVisibile = false">取消</el-button>
			</el-form-item>
			</el-form>
		</el-popover>

	</div>
</template>
<script>
	import { domainList , domainEdit , domainDel,domainResolution} from '../api/api';
	import util from '../api/util';
	export default{
		name: 'DomainManage',
		data() {
			return {
				msg: '域名管理列表',
				dataList:[],
				total:10,//一共多少条
		        currentPage:1,//第几条数据
		        size:10,//每页10条数据
		        searchform:{type:'username', value:'', status:'', area:''},
		        editForm:{type:'username', value:'', status:'', area:''},
		        searchformRules:{},
				select:'',
				oldDomain:'',
				editVisibile:false,
				editRules:{
					domain: [{required:true,trigger:'change',message: '请填写域名，例如：www.g3wei.com'}]
				}
			}
		},
		methods: {
			search(val){
				var params = {}
				if(this.searchform.status){
					params.status = this.searchform.status;
				}
				if(this.searchform.area){
					params.area = this.searchform.area;
				}
				if(this.searchform.type){
					if(this.searchform.value){
						this.searchform.type == 'uid' ? params.uid = this.searchform.value : this.searchform.type == 'username' ? params.username = this.searchform.value : params.domain = this.searchform.value;
					}
				}
				console.log(params)
				if(JSON.stringify(params) != "{}"){
					this.DomainList(params);
				}
			},
			resetSearch(){
				this.searchform.type = 'username'; this.searchform.value = ''; this.searchform.status = '';this.searchform.area ='';
				this.DomainList({});
			},
			 tableRowClassName({row, rowIndex}) {

			 },
			
			 handleSizeChange(val) {
				 this.size = val;
		        this.DomainList({});
		      },
		       handleCurrentChange(val) {
		        this.currentPage = val;
		        this.DomainList({});
		      },
			DomainList(params){
				params.page = this.currentPage;
				params.rows = this.size;
				domainList(params).then( rs => {
					this.total = Number(rs.total);
					rs.rows.map((item , index) => { 
						item.isCurrent = false ;
						//解析状态
						var pra={"uid":item.uid};
						domainResolution(pra).then(rs1 => {
							if(rs1.msg == 'SUCCESS'){
								item.domain="(正常)"+item.domain;
							}else{
								item.domain="(失败)"+item.domain;
							}
						}).catch(err => console.log(err))
					})
					this.dataList = rs.rows;
					// console.log(this.dataList)
				}).catch(() => {
	             this.$message.warning(rs.msg);
	        })
			},
			async changeStatus(row) {
				var params = {uid : row.uid , status : row.status , page : 1 , rows : this.size};
				const rs = await domainEdit(params).catch(err => {console.log(err)});
				if(rs.code == 1){ row.status == '1' ? this.$message.success('用户'+row.uid+'的域名状态开启！') : this.$message.success('用户'+row.uid+'的域名状态关闭！') }
				else {this.$message.error(rs.msg)}
			},
			async changeArea(row){
				var params = {uid : row.uid , area : row.area , page : 1 , rows : this.size};
				const rs = await domainEdit(params).catch(err => {console.log(err)});
				console.log(rs);
				if(rs.code == 1){ row.area == '1' ? this.$message.success('用户'+row.uid+'的域名区域改为国内！') : this.$message.success('用户'+row.uid+'的域名区域改为海外！') }
				else {this.$message.error(rs.msg)}
			},
			handleClick(row){
				// console.log(row);
			},
			previewClick(row){
				window.open("http://"+row.domain.slice(4));
			},
			deleteClick(row){
				this.$confirm('此操作将永久删除此域名, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					domainDel({uid : row.uid}).then(rs => {
						if(rs.code == 1){
							this.$message.success('已删除uid:'+rs.uid+'的域名！')
							this.DomainList({});
						}else{
							this.$message.error(rs.msg)
						}
					}).catch(err => {console.log(err)})
				}).catch(err => {console.log(err)})
			},
			editClick(row){
				this.editVisibile = true;
				domainList({uid:row.uid}).then(rs => {
					this.editForm = rs.rows[0];
				}).catch(err => console.log(err))
			},
			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if(valid){
						domainEdit(this.editForm).then(rs => {
							if(rs.code == 1){
								this.editVisibile = false;
								this.$message.success('uid:'+this.editForm.uid+'的域名修改成功');
								this.DomainList({});
							}else if (rs.msg == "ILLEGAL_DOMAIN_NOT_MATCH"){
								this.$message.error('域名不合法，请重新更改域名！')
							}else{
								this.$message.error(rs.msg)
							}
						}).catch(err => console.log(err))
					}
				})
			}

		},
		mounted:function(){
		  this.DomainList({});
	  }
	}
	

</script>
<style >
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
    width:75px;
  }
  #button .el-button{position: absolute; top:18px; right:18px;}
  .el-button+.el-button {margin-left:0px !important;}
  th>div.cell{color:#333;}
  .el-icon-check{
	  color: rgb(118, 212, 118);
  }
  .el-icon-close{
	  color:rgb(240, 97, 97);
  }
a.net,a.net:link,a.net:visited{
	text-decoration: none;
	color: rgb(28, 110, 192);
}
a.net:hover{
	color: rgb(13, 93, 173);
}
</style>