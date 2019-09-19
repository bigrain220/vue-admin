<template>
	<div class="mumanage">
		<div class="box">
			<el-input placeholder="标题 编号" clearable v-model="input5" class="input-with-select">
				<el-select v-model="searchValue" slot="prepend" placeholder="请选择">
					<el-option label="编号" value="id"></el-option>
					<el-option label="标题" value="name"></el-option>
				</el-select>
			</el-input>
			<el-button @click="Search" type="primary">查询</el-button>
			 <el-button @click="resetSearch" >重置</el-button>
		</div>
		<header>
			<el-tabs v-model="activeName" @tab-click="handleClick">
		    <el-tab-pane label="默认" name="level">
				<div id="order-list">
					<ul class='list' >
						<li v-for="(item , index) in dataList" :key ="index">
							<div class="mask">
								<el-button-group>
								<el-button type="primary" size="mini" @click.native="moduleData(item)">管理</el-button>
								<el-button type="primary" size="mini" @click.native="moduleEdit(item)">编辑</el-button>
								<el-button type="danger" size="mini" @click.native="moduleDel(item)">删除</el-button>
								</el-button-group>
								<el-button id="preview" type="success" @click.native="preView(item)">预览</el-button>	
							</div>
							<div class="img"><img :src="setSrc(item.image)" onerror=""/></div>
							<p id="text1"><span>{{item.id}} {{item.name}}</span><span>￥{{item.price}}</span></p>
							<p id="text2"><span>销量：{{item.sale}}</span><span>{{item.status}}</span></p>
						</li>
						<!-- <li @click="addModule()" class="add"><i class="el-icon-plus"></i></li> -->
					</ul>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage1" :page-sizes="[14, 20, 30, 40]" :page-size="pagination.size1"
					layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
				</div>
			</el-tab-pane>
		    <el-tab-pane label="销量" name="sale">
				<el-table stripe  center :data="MuList" style="width: 100%">
					<el-table-column prop='id' label="模板编号"></el-table-column>
					<el-table-column prop='name' label="模板名称"></el-table-column>
					<el-table-column prop='sale' label="销量" sortable></el-table-column>
					<el-table-column prop='level' label="排序"></el-table-column>
					<el-table-column prop='arrIndustry' label="分类" width="360">
						 <template slot-scope="scope">
							<el-tag v-for="tag in scope.row.arrIndustry" :key="tag">{{tag}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop='created' label="创建时间" :formatter="formatCreated"></el-table-column>
					<el-table-column fixed="right" label="操作" width="150">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="moduleData(scope.row)">管理</el-button>
							<el-button type="text" size="small" @click="moduleEdit(scope.row)">编辑</el-button>
							<el-button type="text" size="small" @click="moduleDel(scope.row)" class="danger">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage2" :page-sizes="[14 ,20, 30, 40]" :page-size="pagination.size2"
					layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
			</el-tab-pane>
		    <el-tab-pane label="最新" name="created">
				<div id="order-list">
					<ul class='list' >
						<li v-for="(item , index) in dataList" :key ="index">
							<div class="mask">
								<el-button-group>
								<el-button type="primary" size="mini" @click.native="moduleData(item)">管理</el-button>
								<el-button type="primary" size="mini" @click.native="moduleEdit(item)">编辑</el-button>
								<el-button type="danger" size="mini" @click.native="moduleDel(item)">删除</el-button>
								</el-button-group>
								<el-button id="preview" type="success" @click.native="preView(item)">预览</el-button>	
							</div>
							<div class="img"><img :src="setSrc(item.image)" onerror=""/></div>
							<p id="text1"><span>{{item.id}} {{item.name}}</span><span>￥{{item.price}}</span></p>
							<p id="text2"><span>销量：{{item.sale}}</span><span>{{item.status}}</span></p>
						</li>
						<!-- <li @click="addModule()" class="add"><i class="el-icon-plus"></i></li> -->
					</ul>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage3" :page-sizes="[14, 20, 30, 40]" :page-size="pagination.size3"
				layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
				</div>
			</el-tab-pane>
		  </el-tabs>
		  <el-button @click="addModule" type="primary" class="addModule">新增模板</el-button>
		</header>
		
      <!-- 新增模板 -->
      <el-popover placeholder="top-start"  v-model="addVisibile" trigger="click" title="新增模板">
      		<i class="close el-icon-close" @click="closePopover('addForm')"></i>
      		<el-form :model="addForm" :rules="rules" ref="addForm" label-width="120px" class="add-ruleForm">
      			<el-form-item label="模板标题:" prop="name">
      				<el-input v-model="addForm.name" placeholder="不超过20个字符"></el-input>
      			</el-form-item>
      			<el-form-item label="封面图片:" prop="image">
      				<elSingleUpload v-model="addForm.image" v-on:sendToImage="sendToImage"></elSingleUpload>
      			</el-form-item>
      			<el-form-item label="banner图片:" prop="banner">
      				<elSingleUpload v-model="addForm.banner" v-on:sendToImage="sendToImage2"></elSingleUpload>
      			</el-form-item>
      			<el-form-item label="颜色:" prop="cid">
      				<el-checkbox-group v-model="addForm.cid" @change="checkColor">
      					<el-checkbox v-for="item in colorObject" :label="item.id" :key="item.id"  value="item.id" >{{item.name}}</el-checkbox>
      				</el-checkbox-group>
      			</el-form-item>
      			<el-form-item label="分类:" prop="iid">
      				<el-checkbox-group v-model="addForm.iid"  @change="checkColor">
      					<el-checkbox v-for="item in industryObject" :label="item.id" :key="item.id" name="industry">{{item.name}}</el-checkbox>
      				</el-checkbox-group>
      			</el-form-item>
      			<el-form-item label="价格:" prop="price">
      				<span>￥</span><el-input-number controls-position="right" v-model="addForm.price"  :step="50" ></el-input-number>
      			</el-form-item>
      			<el-form-item label="排序:" prop="level">
      				<el-input-number controls-position="right" v-model="addForm.level"></el-input-number>
      			</el-form-item>
      			<el-form-item label="状态:" prop="status">
      				<el-switch  v-model="addForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" ></el-switch>
      			</el-form-item>
      			<el-form-item>
      				<el-button type="primary" @click="submitForm('addForm' , '0')">立即创建</el-button>
      				<el-button @click="resetForm('addForm')">重置</el-button>
      			</el-form-item>

      		</el-form>
      </el-popover>
      <!-- 编辑模板 -->
      <el-popover  placeholder="top-start"  v-model="editVisibile" trigger="click" title="编辑模板">
      		<i class="close el-icon-close" @click="closeView"></i>
      		<el-form :model="editForm" :rules="rules" ref="editForm" label-width="120px" class="add-ruleForm">
      			<el-form-item label="ID:" >
					<span>{{editForm.id}}</span>
      			</el-form-item>
      			<el-form-item label="模板标题:" prop="name">
      				<el-input v-model="editForm.name" placeholder="不超过20个字符"></el-input>
      			</el-form-item>
      			<el-form-item label="封面图片:" prop="image">
					<elSingleUpload v-model="editForm.image" v-on:sendToImage="sendToImage"></elSingleUpload>
      			</el-form-item>
      			<el-form-item label="banner图片:" prop="banner">
					<elSingleUpload v-model="editForm.banner" v-on:sendToImage="sendToImage2"></elSingleUpload>
      			</el-form-item>
      			<el-form-item label="颜色:" prop="cid">
      				<el-checkbox-group v-model="editForm.cid" @change="checkColor">
      					<el-checkbox v-for="item in colorObject" :label="item.id" :key="item.id"  value="item.id" >{{item.name}}</el-checkbox>
      				</el-checkbox-group>
      			</el-form-item>
      			<el-form-item label="分类:" prop="iid">
      				<el-checkbox-group v-model="editForm.iid" @change="checkColor" >
      					<el-checkbox v-for="item in industryObject" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
      				</el-checkbox-group>
      			</el-form-item>
      			<el-form-item label="价格:" prop="price">
      				<span>￥</span><el-input-number controls-position="right" v-model="editForm.price"  :step="50"></el-input-number>
      			</el-form-item>
      			<el-form-item label="销量:" prop="sale">
      				<el-input v-model="editForm.sale" :disabled="true"></el-input>
      			</el-form-item>
      			<el-form-item label="排序:" prop="level">
      				<el-input-number controls-position="right" v-model="editForm.level" ></el-input-number>
      			</el-form-item>
      			<el-form-item label="状态:" prop="status">
      				<el-switch  v-model="editForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" ></el-switch>
      			</el-form-item>
      			<el-form-item label="创建时间:" prop="created"><span>{{editForm.created}}</span></el-form-item>
      			<el-form-item v-if="editForm.modified" label="修改时间:"><span>{{editForm.modified}}</span></el-form-item>
      			<el-form-item>
      				<el-button type="primary" @click="submitForm('editForm' , '1')">确认修改</el-button>
      				<!-- <el-button @click="resetForm('editForm')">重置</el-button> -->
      			</el-form-item>
      		</el-form>
      </el-popover>
	</div>
</template>
<script>
	import elSingleUpload from './common/singleUploadImage.vue';
	import { templateList , colorList , industryList , templateAdd , templateDel , templateEdit, ossGet, DomainName} from '../api/api.js';
	import util from '../api/util.js'
	export default{
		name: 'MuManage',
		components:{elSingleUpload},
		data() {
			return {
				msg:'模板管理',
				total:10,//一共多少条
				pagination:{
					currentPage1:1,
					currentPage2:1,
					currentPage3:1,
					size1:14,
					size2:14,
					size3:14,
				},
		        activeName: 'level',
				dataList:[],
				MuList:[],
				tags:[],
				searchform:{
					colorList:[],
				industryList:[],
				},
				searchformRules:{},
				addVisibile:false,
				editVisibile:false,
				ruleAddForm:{
				},
        		colorObject:[],
        		industryObject:[],
        		addForm: {
        			name:'',
        			image:'',
        			banner:'',
        			cid:[],
        			iid:[],
        			price:'',
        			level:'',
        			status:'1',
        		},

        		editForm: {
							id:'',
        			name:'',
        			image:'',
        			banner:'',
        			cid:[],
        			iid:[],
        			price:'',
        			level:'',
        			status:''
        		},
        		rules:{
        			name: [{ required:true, message:'长度不超过20字符', trigger:'blur' }],
        			color: [{ type:'array', required:true, message:'请至少选择一个颜色分组', trigger:'change' }],
        			industry: [{ type:'array', required:true, message:'请至少选择一个类型分组', trigger:'change' }],
        			image:[{ required:true, messag:'请选择封面的图片', trigger:'change' }],
        			banner:[{ required:true, messag:'请选择banner图片', trigger:'change' }],
        			price: [{ required:true, message:'情填写价格', trigger:'blur' }],
        			level: [{ type:'number', required:true, message:'请输入0-9的数字组合,数值越大排序越靠前', trigger:'blur' }]
				},
				searchValue:'id',
				input5:'',
			}
		},
		methods:{
			formatCreated: function(row,column) {
				return util.formatDate.format(row.created,'yyyy-MM-dd hh:mm');
			},
			Search(){
				var param = {};var tem = this.test();
				if(this.searchValue == 'name'){
					param = {name:this.input5};
					this.getTemplateList(Object.assign(param,tem));
				}
				if(this.searchValue == 'id'){
					param = {id:this.input5};
					this.getTemplateList(Object.assign(param,tem));
				}
			},
			resetSearch(){
				this.searchValue = 'id';
				this.input5 = "";
				this.Search();
			},
			test(){
				if(this.activeName == 'level'){
					var params = {page:1, rows:this.pagination.size1, sort_by:this.activeName};
				}
				if(this.activeName == 'sale'){
					var params = {page:1, rows:this.pagination.size2, sort_by:this.activeName};
				}
				if(this.activeName == 'created'){
					var params = {page:1, rows:this.pagination.size3, sort_by:this.activeName};
				}
				if(this.activeName == 'sale' || this.activeName == 'created'){params.sort_order = 'desc'}
				return params;
			},
			isStatus(status){
				return isStatus == 0 ? '禁用' : '正常' ;
			},
			setSrc(image){
				return image+'?x-oss-process=image/resize,w_200';
			},
			sendToImage(data){
				this.addForm.image = data;
				this.editForm.image = data;
			},
			sendToImage2(data){
				this.addForm.banner = data;
				this.editForm.banner = data;
			},
			closeView(){
				this.editVisibile = false;
			},
			async getTemplateList(params){
				if(JSON.stringify(params) == "{}"){
					if(this.activeName == 'level'){
						params.page = this.pagination.currentPage1; params.rows = this.pagination.size1;
					}
					if(this.activeName == 'sale'){
						params.page = this.pagination.currentPage2; params.rows = this.pagination.size2;
					}
					if(this.activeName == 'created'){
						params.page = this.pagination.currentPage3; params.rows = this.pagination.size3;
					}
				}
				let rs1 = await templateList(params).catch(error => {console.log(error)})
				if(this.activeName == 'sale'){
					rs1.rows.map((item,index) => {
						item.arrIndustry = [];
						item.industry.map((item1,index1) => {
							this.industryObject.map((item2,index2) => {
								if(item1.iid == item2.id){
									item.arrIndustry.push(item2.name);
								}
							})
						})
					})
					this.MuList = rs1.rows;
					
				}else{
					this.dataList = rs1.rows;
					this.dataList.forEach(element => {
						if(element.status == 1){
							element.status = '正常'
						}else{
							element.status = '禁用'
						}
					});
				}
				this.total = Number(rs1.total);
				if(this.industryObject.length == 0){
					let rs2 = await industryList({rows:1000, status:1}).catch(err => {cosnole.log(err)});
					this.industryObject = rs2.rows;	
				}
			},
			getColorList(){
		    	var params = {rows:1000,status:1}
		    	colorList(params).then(rs => {
		    		this.colorObject = rs.rows;
		    		this.getIndustryList();
				}).catch(error => {console.log(error)});
		    },
		    getIndustryList(){
				var params = {rows:1000,status:1}
				if(this.industryObject.length == 0){
					industryList(params).then(rs => {
						this.industryObject = rs.rows;
					}).catch(error => {console.log(error)})
				}	
		    },
			handleSizeChange(val) {
				// 这里把3个ordertype换成了sort_by
				if(this.activeName == 'level'){
					this.pagination.size1 = val;
					var params = {page:this.pagination.currentPage1, rows:val , sort_by:this.activeName};
				}
				if(this.activeName == 'sale'){
					this.pagination.size2 = val;
					var params = {page:this.pagination.currentPage2, rows:val , sort_by:this.activeName};
				}
				if(this.activeName == 'created'){
					this.pagination.size3 = val;
					var params = {page:this.pagination.currentPage3, rows:val , sort_by:this.activeName};
				}
				if(this.activeName == 'sale' || this.activeName == 'created'){params.sort_order = 'desc';}   
		        this.getTemplateList(params);
		     },
		    handleCurrentChange(val) {
				// 这里把3个ordertype换成了sort_by
				if(this.activeName == 'level'){
					this.pagination.currentPage1 = val;
					var params = {page:val,rows:this.pagination.size1 , sort_by:this.activeName}
				}
				if(this.activeName == 'sale'){
					this.pagination.currentPage2 = val;
					var params = {page:val,rows:this.pagination.size2 , sort_by:this.activeName}
				}
				if(this.activeName == 'created'){
					this.pagination.currentPage3 = val;
					var params = {page:val,rows:this.pagination.size3 , sort_by:this.activeName}
				}
				if(this.activeName == 'sale' || this.activeName == 'created'){params.sort_order = 'desc';} 
		        this.getTemplateList(params);
		     },
		    handleClick(tab, event){
				//这里把currentPag全部换成了1；
				if(this.activeName == 'level'){
					var params = {page:1, rows:this.pagination.size1, sort_by:this.activeName};
				}
				if(this.activeName == 'sale'){
					var params = {page:1, rows:this.pagination.size2, sort_by:this.activeName};
				}
				if(this.activeName == 'created'){
					var params = {page:1, rows:this.pagination.size3, sort_by:this.activeName};
				}
				if(this.activeName == 'sale' || this.activeName == 'created'){params.sort_order = 'desc'}
		    	this.getTemplateList(params);
		    },
		    addModule(){
		    	this.addVisibile = true;
		    	this.getColorList();
		    },
		    submitForm(formName , val){
		    	var params = {};
	        	if(val == '0'){
	        		params = this.addForm; 
	        	}else{
	        		params.id = this.editForm.id; params.name = this.editForm.name; params.image = this.editForm.image; params.banner = this.editForm.banner; params.iid = this.editForm.iid;
	        		params.cid = this.editForm.cid; params.price = this.editForm.price; params.level = this.editForm.level; params.status = this.editForm.status;
				}
		    	this.$confirm('确定执行此操作?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'success'
			        }).then(() => {
			        	this.$refs[formName].validate((valid) => {
				    		if(valid){
				    			if(val == '0'){
				    				templateAdd(params).then(rs => {
					    				if(rs.code == 1){
					    					this.addVisibile = false;
					    					this.$refs[formName].resetFields();
					    					this.$message.success('模板新增成功~');
											this.resetForm('addForm')
											this.handleClick();
											// var param = {page:this.currentPage, rows:this.size, sort_by:this.activeName};
											// if(this.activeName == 'sale' || this.activeName == 'created'){params.sort_order = 'desc'}
											// this.getTemplateList(param);
					    				}else{
					    					this.$message.error(rs.msg);
					    				}
					    			}).catch(error => {console.log(error)})
				    			}else{
				    				templateEdit(params).then(rs => {
											// console.log('params:',params)
				    					if(rs.code == 1){
					    					this.editVisibile = false;
					    					this.$refs[formName].resetFields();
					    					this.$message.success('模板编辑成功~');
											this.resetForm('editForm')
											this.handleClick();
											// var param = {page:this.currentPage, rows:this.size, sort_by:this.activeName};
											// if(this.activeName == 'sale' || this.activeName == 'created'){params.sort_order = 'desc'}
											// this.getTemplateList(param);
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

		    },
		    defaule(val){
		    	// console.log(val);
		    },
		    checkColor(val){
		    	// console.log(val);
		    },
	      moduleEdit(item,id){
	      	this.editVisibile = true;
	      	templateList({id:item.id}).then(rs => {
	      		this.getColorList();
						this.editForm.id = rs.rows[0].id;
						this.editForm.name = rs.rows[0].name;
						this.editForm.image = rs.rows[0].image;
						this.editForm.banner = rs.rows[0].banner;
						this.editForm.level = rs.rows[0].level;
						this.editForm.price = rs.rows[0].price;
						this.editForm.status = rs.rows[0].status;
						this.editForm.sale = rs.rows[0].sale;
		      	this.editForm.created = util.formatDate.format(rs.rows[0].created,'yyyy-MM-dd hh:mm:ss');
		      	this.editForm.modified = util.formatDate.format(rs.rows[0].modified,'yyyy-MM-dd hh:mm:ss');
		      	this.editForm.cid = rs.rows[0].color;
		      	this.editForm.iid = rs.rows[0].industry;
		      	this.baseArray();
	      	}).catch(error => {console.log(error)});
		},
	      baseArray(){
	      	var arr1 = [] , arr2 = [];
	      	this.editForm.cid.map((i) => {
	      		arr1.push(Number(i.cid));
	      	});
	      	this.editForm.iid.map((j) => {
	      		arr2.push(Number(j.iid));
	      	});
	      	this.editForm.cid = arr1;
	      	this.editForm.iid = arr2;
	      },
	      moduleDel(item){
	      	// console.log(item);
	      	 this.$confirm('此操作将永久删除此模块, 是否继续?', '提示', {
	      	 	confirmButtonText: '确定',
          		cancelButtonText: '取消',
          		type: 'warning'
	      	 }).then(() => {
	      	 	templateDel({id:item.id}).then(rs => {
	      	 		if(rs.code == 1){
	      	 			this.$message.success('删除成功！');
	      	 			this.getTemplateList({});
	      	 		}else{
	      	 			this.$message.error(rs.msg);
	      	 		}
	      	 	})
	      	 	
	      	 }).catch(() => {

	      	 })
		  },
		  moduleData(item){
			  window.open(DomainName.url + '/template/redirect/?id='+item.id);
		  },
		  preView(item){
			  window.open(DomainName.domain + '/demo/'+item.id);
		  },
	      closePopover(formName){
	      	this.resetForm(formName);
	      	this.addVisibile = false;
	      }
		},
		mounted:function(){
			this.getTemplateList({page:this.pagination.currentPage1,rows:this.pagination.size1});
			var orderHeight = document.body.clientHeight;
            document.getElementById("order-list").style.height = (orderHeight-170)+'px';
		},


	}
</script>
<style scoped>
	.el-icon-edit {font-size:18px; margin-left:20px; cursor: pointer;}
	.el-icon-edit:hover {color:#2196F3;}
	.list li{width:200px; height:262px; overflow: hidden; position: relative; float:left; margin-right: 25px; margin-bottom: 25px; background:#fff; border:1px solid #eee; box-shadow:0 2px 12px 0 rgba(0,0,0,.1);}
	.list li .mask{ width:100%; height:100%; background:rgba(0,0,0,.5); position: absolute; left:0; top:0; transition:all 1s; display: none; z-index: 99;}
	.list li:hover .mask{ display: block; transition:all 1s;  }
	.mask .el-button-group {margin-left: 16px; margin-top: 80px;}
	 #preview {
		margin: 0 auto;
		display: block;
		margin-top: 20px;
		width: 151px;
	 }
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
	  .avatar {
	    width: 178px;
	    height: 178px;
	    display: block;
	  }
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
</style>
