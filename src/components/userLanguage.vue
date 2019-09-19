<template>
  <div class="usermanage">
    <h1>{{ msg }}</h1> 
      <el-col :span="24" class="toolbar">
        <el-button type="success" @click="dialogAddVisible = true">添加语言</el-button>
        <el-input class="search" v-model="searchID" placeholder="输入关键词搜索" @keydown.enter.native="searchSubmit"></el-input>
        <el-button type="primary" @click="searchSubmit">查询</el-button>
      </el-col> 
      <el-table stripe  :row-class-name="tableRowClassName" center :data="dataList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="uid" label="用户ID"></el-table-column>
          <el-table-column prop="lid" label="语言ID"></el-table-column>
          <el-table-column  prop="created" label="创建时间" :formatter="formatCreated"></el-table-column>
          <el-table-column  prop="modified" label="修改时间" :formatter="formatModified"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 20, 40, 80]"
      :page-size="size" layout="sizes, prev, pager, next" :total="total"></el-pagination>
      
      <!-- 添加语言 -->
      <el-dialog title="添加语言" :visible.sync="dialogAddVisible"  width="600px">
        <el-form ref="addForm" :model="addForm" :rule="addFormRules" label-width="80px">
          <el-form-item prop="uid" label="用户ID">
              <el-input v-model="addForm.uid"></el-input>
          </el-form-item>
          <el-form-item prop="lid" label="语言ID">
              <el-input v-model="addForm.lid"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="addSubmit('addForm')">添加</el-button>
              <el-button @click="CloseAddSubmit('addForm')">取消</el-button>
          </el-form-item>
        </el-form>
    </el-dialog>

      <!-- 修改日期 -->
      <el-dialog title="修改过期时间" :visible.sync="dialogVisible"  width="600px">
        <ul>
          <li><span>uid：</span>{{Uid}}</li>
          <li><span>原过期时间：</span>{{changDate}}</li>
          <li><span>新过期时间：</span><el-date-picker editable v-model="value1" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker></li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmit()">提 交</el-button>
        </span>
    </el-dialog>


   
  </div>
</template>

<script>

import {  userLangList, userLangAdd} from '../api/api'
import util from '../api/util'
export default {
  name: 'userLanguage',
  data () {
    return {
      msg: '语言配置',
      dataList: [],
      dialogVisible: false,
      changDate:'',
      Uid:'',
      value1:'',
      total:10,//一共多少条
      currentPage:1,//第几条数据
      size:10,//每页10条数据
      searchform:{
          value:'',
          name:'',
          type:'',
          date:'',
          status:''
      },
      searchformRules:{
          // value:[{ required: true, message: '请选择搜索类型', trigger: 'change'}],
          // name:[{required: true, message: '请输入IDh或用户名查找', trigger: 'blur' }]
      },
      searchCform: {
          type:'',
          date:''
      },
      searchformRules:{
        // type:[{ required: true, message: '请选择搜索类型', trigger: 'change'}],
        // date:[{required: true, message: '请选择日期', trigger: 'blur' }]
      },
      searchRform: {
          status:''
      },
      searchformRules:{
        // status:[{ required: true, message: '请选择状态', trigger: 'change'}],
      }, 
      searchID:'',
      addForm:{uid:'',lid:''},
      dialogAddVisible:false,
      addForm:{
        uid:'',
        lid:''
      },
      addFormRules:{
        uid:[{required:true, message:'请输入用户ID' , trigger:'blur'}],
        lid:[{required:true, message:'请输入语言ID' , trigger:'blur'}]
      }
    }
  },
  methods: {
    formatCreated: function(row,column) {
        return util.formatDate.format(row.created,'yyyy-MM-dd hh:mm:ss');
      },
       formatExpired: function(row,column) {
        return util.formatDate.format(row.expired, 'yyyy-MM-dd');
      },
       formatModified: function(row,column) {
        return util.formatDate.format(row.modified, 'yyyy-MM-dd hh:mm:ss');
      },
      formatStatus: function(row,column){
          return row.status == '0' ? row.status = true : row.status = false;
      },
    tableRowClassName({row, rowIndex}) {},
    editClick(row) {
        this.dialogVisible = true;
        this.Uid = row.uid;
        this.changDate = util.formatDate.format(row.expired, 'yyyy-MM-dd');
      },
    deleteClick(row) {
        this.dialogVisible = true;
        this.Uid = row.uid;
        this.changDate = util.formatDate.format(row.expired, 'yyyy-MM-dd');
      },
    //获取用户列表
    getLangList() {
        let params = {page:this.currentPage,rows:this.size};
        this.LangList(params);
    },

    LangList(params){
      userLangList(params).then( rs => {
              this.total = Number(rs.total);
             this.dataList = rs.rows;
        }).catch(() => {
             this.$message({
              message: rs.msg,
              type: 'warning'
            });
        })
      },

    //启动--禁用
    changeStatus(row) {
        var params = { uid : row.uid };
        userStatus(params).then( rs => {
            this.getLangList();
            this.$message({
              message:'设置成功',
              type:'success'
            })
        })
    },

    //提交过期的日期
    dialogSubmit(){
        if(this.value1 == ''){
             this.$message({
                type: 'error',
                message: '您还没有提交过期时间！'
              });          
        }else {
          var params = { uid: this.Uid, expired: this.value1 };
          userExpired(params).then( rs => {
              this.dialogVisible = false;
              this.getLangList();
              this.$message({
                  message:'过期时间修改成功！',
                  type:'success'
              })
          }).catch(() => {
              this.$message({
                  message: rs.msg,
                  type:'error'
              })
          })
        }
    },

    submit(formName){
        this.$refs[formName].validate((valid) => {
            if(valid){
               if((this.searchform.value && this.searchform.name == '') || (this.searchform.value == '' && this.searchform.name)) {
                  this.$message({
                      type:'info',
                      message:'确少 ID or name 查询参数！'
                    });
                  return ;
                }
                if((this.searchform.type && this.searchform.date == '') || (this.searchform.type == '' && this.searchform.date)){
                    this.$message({
                      type:'info',
                      message:'确少日期查询参数！'
                    });
                    return ;
                }
                if(this.searchform.value == 'uid'){
                    var params = {uid:this.searchform.name, type:this.searchform.type, start_time:this.searchform.start_time, end_time:this.searchform.end_time, status:this.searchform.status};
                }else if (this.searchform.value == 'username'){
                  var pamams = {username:this.searchform.name, type:this.searchform.type, start_time:this.searchform.start_time,end_time:this.searchform.end_time, status:this.searchform.status};
                }else{
                  var params = {type:this.searchform.type, start_time:this.searchform.start_time,end_time:this.searchform.end_time, status:this.searchform.status};
                }
                this.LangList(params);
            }
        })

    },
   
     resetForm(formName) {
        this.$refs[formName].resetFields();
      },


     handleSizeChange(val) {
        this.getLangList();
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        this.getLangList();
      },
      searchTime(value){
        this.searchform.start_time = value[0];
        this.searchform.end_time = value[1];
      },
      searchSubmit(){
        this.LangList({uid:this.searchID, page:this.currentPage,rows:this.size});
      },
      addSubmit(formName){
          this.$refs[formName].validate((valid) => {
              if(valid){
                  userLangAdd(this.addForm).then(rs => {
                  })
              } 
          })
      },

  },
  mounted:function(){
      this.getLangList();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.el-dialog ul li {
  display: block;
  margin: 0 10px;
  font-size: 16px;
  padding: 10px 0;
}
ul li span {    display: inline-block;
    text-align: right;
    width: 100px;
    padding-right: 20px;}
a {
  color: #42b983;
}

 .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
  .el-table thead {background: #f5f7fa;}
  .el-dialog__header {background:#ccc;}
  
  .el-form.search .el-form-item.Uid{width:90px; margin-right: 0;}
  .el-form.search .el-form-item.date{width:110px; margin-right: 0;}
  .search {width:200px; margin-left:20px;}
  .el-row  {margin-bottom: 20px}
</style>