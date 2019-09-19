<template>
	<div class="industrymanage">
		<el-col :span="24" class="toolbar">
			<el-button  type="primary" @click="handleAdd()">添加行业</el-button> 
			<div class="status">
				<span>状态选择：</span>
				<el-select v-model="selectObject" placeholder="请选择" @change="selectStatus()">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" @click.native="selectStatus()">查询</el-button>
				<el-button @click="resetSearch" >重置</el-button>
			</div>
		</el-col>
		<el-table :data="industryData" style="width:100%" show-header>
				<el-table-column prop="id" label="ID" sortable></el-table-column>
				<el-table-column prop="name" label="名称"></el-table-column>
				<el-table-column prop="status" label="状态">
					<template slot-scope="scope"><el-switch v-model="industryData[scope.$index].status"  @change="changeStatus(scope.row)" active-value="1" inactive-value="0"></el-switch></template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						 <el-button size="mini" type="text"  @click="handleEdit(scope.$index, scope.row)">修改</el-button>
						 <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				    </template>
			    </el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2, 10, 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

		<el-popover  placeholder="top-start"  v-model="industrychangeVisibile" trigger="click" title="分类修改">
      		<i class="close el-icon-close" @click="industrychangeVisibile = false"></i>
      		<ul class="add-ruleForm">
      			<li><span>ID：</span>{{changeForm.id}}</li>
      			<li><span>分类名称：</span><el-input  v-model="changeForm.name" placeholder="请输入颜色名称"></el-input></li>
 				<li>
      				<span><span>状态：</span></span>
      				<el-switch  v-model="changeForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" >
                    </el-switch>
      			</li>
      			<li>
      				<el-button @click="colorchangeVisibile = false">取 消</el-button>
	          		<el-button type="primary" @click="industrySubmit()">提 交</el-button>
      			</li>
      		</ul>
      	</el-popover>
      	<el-popover  placeholder="top-start"  v-model="industryaddVisibile" trigger="click" title="增加分类">
      		<i class="close el-icon-close" @click="industryaddVisibile = false"></i>
      		<el-form :model="addForm" :rules="rulesAdd" ref="addForm" label-width="120px" class="add-ruleForm">
  				<el-form-item label="名称" prop="name">
  					<el-input v-model="addForm.name" placeholder="不超过20个字符"></el-input>
  				</el-form-item>
  				<el-form-item label="状态" prop="status">
  					<el-switch  v-model="addForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" >
                    </el-switch>
  				</el-form-item>
  				<el-form-item>
  					<el-button type="primary" @click="addsubmitForm('addForm')">新 增</el-button>
  				</el-form-item>
  			</el-form>	
      	</el-popover>
	</div>
</template>
<script>
	import { industryList , industryAdd , industryEdit , industryDel} from '../api/api'
	export default {
		name:'IndustryManage',
		data(){
			return {
				msg:'分类列表',
				total:10,//一共多少条
		        currentPage:1,//第几页
		        size:10,//每页10条数据
				industryData:[],
				selectObject:'',
				options:[{value:'1',label:'正常'},{value:'0',label:'禁用'}],
				industrychangeVisibile:false,
				industryaddVisibile:false,
				changeForm:[],
				addForm:{name:'',status:'1'},
		        rulesAdd:{name: [{ required:true, message:'长度不超过20字符', trigger:'change' }],},
			}
			
		},
		methods: {
			changeStatus(row){
				let params = {id:row.id , status: row.status , name: row.name}
				industryEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});
			},
			getIndustryList(){
				var params = {page:this.currentPage, rows:this.size};
				industryList(params).then(rs => {
					this.industryData = rs.rows;
					this.total = rs.total;

				}).catch(error => {console.log(error)})
			},
			selectStatus(){
				var params = {page:this.currentPage, rows:this.size, status:this.selectObject};
				industryList(params).then(rs => {
					this.industryData = rs.rows;
					this.total = rs.total;
				})	
			},
			resetSearch(){
				this.selectObject="";
				this.currentPage=1;
				this.getIndustryList();
			},
			handleSizeChange(val) {
		        this.size = val;
		       	this.getIndustryList();

		     },
		    handleCurrentChange(val) {
		        this.currentPage = val;
		        this.getIndustryList();
		     
		     },
		     handleEdit(index, row){
		     	this.industrychangeVisibile = true;
		     	industryList({id:row.id}).then(rs => {
		     		this.changeForm = rs.rows[0];
				}).catch(error => {console.log(error)})
		     },
		     handleAdd(index, row){
		     	this.industryaddVisibile = true;
			 },
			 handleDel(index,row){
				 this.$confirm('颜色确定删除'+row.name+'？','警告', {
		    		confirmButtonText: '确定',
		    		cancelButtonText: '取消',
		    		type:'warning'
		    	}).then(() => {
					industryDel({id:row.id}).then(rs => {
						if(rs.code == 1){
							this.$message.success('已删除')
							this.getIndustryList();
						}else{
							this.$message.error(row.name+'被模板使用，不能删除');
						}
						
					})
				}).catch(error => {console.log(error)})
			 },
		     industrySubmit(){
		     	this.$confirm('分类确定修改？','提示', {
		    		confirmButtonText: '确定',
		    		cancelButtonText: '取消',
		    		type:'success'
		    	}).then(() => {
			    	industryEdit(this.changeForm).then(rs => {
			    		if(rs.code == 1){
			    			this.industrychangeVisibile = false;
			    			this.$message.success('模板修改成功');
			    			this.getIndustryList();
			    		}
			    	}).catch(() => {this.$message.success(rs.msg);})
		    	}).catch(error => {console.log(error)});
		     },
		     addsubmitForm(formName){
		     	this.$confirm('是否增加分类?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'success'
			        }).then(() => {
			        	this.$refs[formName].validate((valid) => {
				    		if(valid){
				    			industryAdd(this.addForm).then(rs => {
				    				if(rs.code == 1){
				    					this.industryaddVisibile = false;
				    					this.$refs[formName].resetFields();
				    					this.getIndustryList();
				    					this.$message.success('分类新增成功！');
				    				}else{
				    					this.$message.error(rs.msg);
				    				}
				    			})
				    		}else{
				    			return false;
				    		}
				    	});
			        }).catch(() => { });
		     }

		},
		mounted: function(){
			this.getIndustryList();
		}
	}
</script>
<style scoped>
	.add-ruleForm {width:650px; padding:30px;}
	.add-ruleForm li {padding:10px 0;}
	.add-ruleForm li:last-child {padding-left:115px;}
	.add-ruleForm li .el-input {width:auto;}
	.add-ruleForm li span { display: inline-block;width: 100px;text-align: right;padding-right: 20px;}
	.status {display: inline-block;}
</style>