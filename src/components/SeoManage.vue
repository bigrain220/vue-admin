<template>
	<div class="SeoManage">
		 <el-col :span="24" class="toolbar">
		 		<el-form ref="searchform" :model="searchform"  :rules="searchformRules" :inline="true" class="search" >
		 			<el-form-item prop="name">
		 				<el-input placeholder="请输入内容查找" v-model="searchform.value" class="input-with-select">
						    <el-select v-model="searchform.type" slot="prepend" placeholder="请选择" >
						      <el-option label="用户ID" value="uid"></el-option>
						      <el-option label="用户名" value="username"></el-option>
                              <el-option label="站点" value="site"></el-option>
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
		 				<el-button type="primary" @click="search">查询</el-button>
		 				<el-button @click="resetSearch">重置</el-button>
		 			</el-form-item>
		 		</el-form>
		 </el-col>

		 <el-table :row-class-name="tableRowClassName" center :data="dataList" :highlight-current-row="true" style="width: 100%">
		 		<el-table-column prop='uid' label="UID" ></el-table-column>
		 		<el-table-column prop='site' label="用户站点">
					 <template slot-scope="scope">
						<i class="el-icon-check" v-if="scope.row.site.indexOf('正常')>0"></i>
						<i class="el-icon-close" v-if="scope.row.site.indexOf('失败')>0"></i>
						<a :href="'http://'+scope.row.site.slice(4)" target="_blank" style="margin-left: 10px" class="net">{{ scope.row.site.slice(4) }}</a>
					</template>
				 </el-table-column>
		 		<el-table-column prop="status" label="状态" >
	               <template slot-scope="scope">
	                    <el-switch disabled v-model="dataList[scope.$index].status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0"  >
	                    </el-switch>
	                </template>
          		</el-table-column>
                <el-table-column label="百度">
                    <template slot-scope="scope">
						<el-button type="text" size="small" @click="vertifyClick(scope.row)">验证</el-button>
						<el-button type="text" size="small" @click="pushClick(scope.row)" >推送</el-button>
					</template>
				</el-table-column>
				<el-table-column fixed="right" label="操作" width="150">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="previewClick(scope.row)">预览</el-button>
						<el-button type="text" size="small" @click="deleteClick(scope.row)" >删除</el-button>
					</template>
				</el-table-column>
		 </el-table>
	  	<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20 , 30, 40]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>

        <el-dialog title="百度验证" :visible.sync="dialogVerVisible" class="vertifyBox">
            <el-form :model="vertifyform">
                <el-form-item label="uid:" :label-width="formLabelWidth">
                    <el-input v-model="vertifyform.uid" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="cname:" :label-width="formLabelWidth">
                    <el-input v-model="vertifyform.cname" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVerVisible = false">取 消</el-button>
                <el-button type="primary" @click="vertifySure">确 定</el-button>
            </div>
        </el-dialog>
         <el-dialog title="百度推送" :visible.sync="dialogPuVisible" class="pushBox">
            <el-form :model="pushform">
                <el-form-item label="uid:" :label-width="formLabelWidth">
                    <el-input v-model="pushform.uid" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="token:" :label-width="formLabelWidth">
                    <el-input v-model="pushform.token" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPuVisible = false">取 消</el-button>
                <el-button type="primary" @click="pushSure">确 定</el-button>
            </div>
        </el-dialog>
	
	</div>
</template>
<script>
	import { seoList,domainResolution,seoDel,seoVerify,seoPush} from '../api/api';
	export default{
		name: 'SeoManage',
		data() {
			return {
				msg: '站点管理列表',
				dataList:[],
				total:10,//一共多少条
		        currentPage:1,//第几条数据
		        size:10,//每页10条数据
		        searchform:{type:'username', value:'', status:''},
		        searchformRules:{},
				select:'',
                oldDomain:'',
                dialogVerVisible:false,
                formLabelWidth: '80px',
                vertifyform:{uid: "",cname: ""},
                dialogPuVisible:false,
                pushform:{uid: "",token: ""},
			}
		},
		methods: {
			search(val){
				var params = {}
				if(this.searchform.status){
					params.status = this.searchform.status;
				}
				if(this.searchform.cname){
					params.cname = this.searchform.cname;
				}
				if(this.searchform.type){
					if(this.searchform.value){
						this.searchform.type == 'uid' ? params.uid = this.searchform.value : this.searchform.type == 'username' ? params.username = this.searchform.value : params.site = this.searchform.value;
					}
				}
				console.log(params)
				if(JSON.stringify(params) != "{}"){
					this.SeoList(params);
				}
			},
			resetSearch(){
				this.searchform.type = 'username'; this.searchform.value = ''; this.searchform.status = '';this.searchform.cname ='';
				this.SeoList({});
			},
			 tableRowClassName({row, rowIndex}) {

			 },
			
			 handleSizeChange(val) {
				 this.size = val;
		        this.SeoList({});
		      },
		       handleCurrentChange(val) {
		        this.currentPage = val;
		        this.SeoList({});
		      },
			SeoList(params){
				params.page = this.currentPage;
                params.rows = this.size;
                var arr=[];
				seoList(params).then( rs => {
					this.total = Number(rs.total);
					rs.rows.map((item , index) => { 
                        item.status+="";
						//解析状态
						domainResolution({"uid":item.uid,"cname":item.cname}).then(rs1 => {
							if(rs1.msg == 'SUCCESS'){
								item.site="(正常)"+item.site;
							}else{
								item.site="(失败)"+item.site;
							}
                        }).catch(err => console.log(err));
					})
                    this.dataList =  rs.rows;
				}).catch(() => {
	             this.$message.warning(rs.msg);
	        })
			},
			handleClick(row){
				// console.log(row);
            },
            vertifyClick(row){
                this.vertifyform.uid=row.uid;
                this.vertifyform.cname=row.cname;
                this.dialogVerVisible=true;
            },
            vertifySure(){
                 var params= this.vertifyform;
                 seoVerify(params).then(rs => {
                   rs.code==1?this.$message.success("uid:"+params.uid+"验证成功"):this.$message.success(rs.msg);
                    this.SeoList({})
                }).catch(err => console.log(err));
                 this.dialogVerVisible=false;
            },
            pushClick(row){
                this.pushform.uid=row.uid;
                this.pushform.token=row.token;
                this.dialogPuVisible=true;
            },
            pushSure(){
                 var params= this.pushform;
                 seoPush(params).then(rs => {
                   rs.code==1?this.$message.success("uid:"+params.uid+"推送成功"):this.$message.success(rs.msg);
                    this.SeoList({})
                }).catch(err => console.log(err));
                this.dialogPuVisible=false;
            },
			previewClick(row){
				window.open("http://"+row.site.slice(4));
			},
			deleteClick(row){
				this.$confirm('此操作将永久删除此站点, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					seoDel({uid : row.uid}).then(rs => {
						if(rs.code == 1){
							this.$message.success('已删除uid:'+rs.uid+'的站点！')
							this.SeoList({});
						}else{
							this.$message.error(rs.msg)
						}
					}).catch(err => {console.log(err)})
				}).catch(err => {console.log(err)})
			},

		},
		mounted:function(){
		  this.SeoList({});
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
.vertifyBox .el-dialog,.pushBox .el-dialog{
    width: 600px;
}
.vertifyBox .el-dialog .el-input .el-input__inner,.pushBox .el-dialog .el-input .el-input__inner{
    width: 80%;
}
</style>