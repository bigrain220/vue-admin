<template>
  <div class="usermanage">
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="user">
        <el-col :span="24" class="toolbar">
           <el-form ref="searchform" :model="searchform"  :rules="searchformRules" :inline="true" class="search" >
              <el-form-item class="Uid" prop="value">
                  <el-select v-model="searchform.value" placeholder="请选择">
                    <el-option label="用户名" value="username"></el-option>
                    <el-option label="UID" value="uid"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item prop="name">
                  <el-input v-model="searchform.name" type="search" placeholder="输入关键词搜索" @keydown.enter.native="submit('searchform')"></el-input>
              </el-form-item>
              <el-form-item prop="type" class="date">
                    <el-select v-model="searchform.type" placeholder="请选择">
                        <el-option label="创建时间" value="0"></el-option>
                        <el-option label="过期时间" value="1"></el-option>
                    </el-select>
              </el-form-item>
              <el-form-item prop="date">
                  <el-date-picker v-model="searchform.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="searchTime"></el-date-picker>
              </el-form-item>
              <el-form-item class="status" prop="status" label="状态选择">
                  <el-select v-model="searchform.status" placeholder="筛选状态">
                      <el-option label="正常" value="1"></el-option>
                      <el-option label="禁用" value="0"></el-option>
                  </el-select>
              </el-form-item>
               <el-form-item>
                  <el-button type="primary" @click="submit('searchform')">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button @click="resetForm('searchform')">重置</el-button>
              </el-form-item>
           </el-form>
        </el-col>
        <el-table stripe  center :data="dataList" style="width: 100%">
          <el-table-column prop='uid' label="UID"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column  prop="created" label="创建时间" :formatter="formatCreated"></el-table-column>
          <el-table-column  prop="modified" label="修改时间" :formatter="formatModified"></el-table-column>
          <el-table-column  prop="expired" label="过期时间" :formatter="formatExpired"></el-table-column>
          <el-table-column  prop="status" label="状态" >
               <template slot-scope="scope">
                    <el-switch  v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0" >
                    </el-switch>
                </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="handleClick2(scope.row)">管理</el-button>
                  <el-button type="text" size="small" @click="preView(scope.row)">预览</el-button>
                  <el-button type="text" size="small" @click="handleData(scope.row)">修改日期</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage1" :page-sizes="[10, 20, 40, 80]"
        :page-size="size1" layout="total, sizes, prev, pager, next" :total="total1"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="userconfig">
        <el-col :span="24" class="toolbar">
          <el-select v-model="searchform.value" placeholder="请选择" style="width:90px;">
            <el-option label="用户名" value="username"></el-option>
            <el-option label="UID" value="uid"></el-option>
          </el-select>
          <el-input class="Langsearch" v-model="searchform.name" type="search" placeholder="输入关键词搜索" @keydown.enter.native="submitForm('searchform','configSearch')"></el-input>
          <el-button type="primary" @click="submitForm('searchform','configSearch')">查询</el-button>
           <el-button @click="resetSearch('searchformConfig')">重置</el-button>
        </el-col>
        <el-table stripe  center :data="configList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="uid" label="UID"></el-table-column>
          <el-table-column prop="lid" label="语言ID" :formatter="formatLid"></el-table-column>
          <el-table-column prop="tid" label="模板ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="is_default" label="是否默认" :formatter="formatDefault"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage2" :page-sizes="[10, 20, 40, 80]"
        :page-size="size2" layout="total, sizes, prev, pager, next" :total="total2"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="语言管理" name="userlanguage">
        <el-col :span="24" class="toolbar">
          <el-button type="success" @click="languageAdd" style="margin-right:20px;">新增语言</el-button>
          <el-select v-model="searchform.value" placeholder="请选择" style="width:90px;">
            <el-option label="用户名" value="username"></el-option>
            <el-option label="UID" value="uid"></el-option>
          </el-select>
          <el-input class="Langsearch" v-model="searchform.name" type="search" placeholder="输入关键词搜索" @keydown.enter.native="submitForm('searchform','langSearch')"></el-input>
          <el-button type="primary" @click="submitForm('searchform','langSearch')">查询</el-button>
           <el-button @click="resetSearch('searchformLanguage')">重置</el-button>
        </el-col>
        <el-table stripe  center :data="languageList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="uid" label="UID"></el-table-column>
          <el-table-column prop="lid" label="语言ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="created" label="创建时间" :formatter="formatCreated"></el-table-column>
          <el-table-column prop="modified" label="修改时间" :formatter="formatModified"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="languageEdit(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="languageDel(scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage3" :page-sizes="[10, 20, 40, 80]"
        :page-size="size3" layout="total, sizes, prev, pager, next" :total="total3"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="模板管理" name="usertemplate">
        <el-col :span="24" class="toolbar">
          <el-button type="success" @click="tempAdd" style="margin-right:20px;">添加模板</el-button>
          <el-select v-model="searchform.value" placeholder="请选择" style="width:90px;">
            <el-option label="用户名" value="username"></el-option>
            <el-option label="UID" value="uid"></el-option>
          </el-select>
          <el-input class="Langsearch" v-model="searchform.name" type="search" placeholder="输入关键词搜索" @keydown.enter.native="submitForm('searchform','tempSearch')"></el-input>
          <el-button type="primary" @click="submitForm('searchform','tempSearch')">查询</el-button>
          <el-button @click="resetSearch('searchformTemplate')">重置</el-button>
        </el-col>
        <el-table stripe center :data="templateList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="uid" label="UID"></el-table-column>
          <el-table-column prop="tid" label="模板ID"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="created" label="创建时间" :formatter="formatCreated"></el-table-column>
          <el-table-column prop="modified" label="修改时间" :formatter="formatModified"></el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="templateEdit(scope.row)">编辑</el-button>
                  <el-button type="text" size="small" @click="templateDel(scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage4" :page-sizes="[10, 20, 40, 80]"
        :page-size="size4" layout="total, sizes, prev, pager, next" :total="total4"></el-pagination>
      </el-tab-pane>
  </el-tabs>

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
    <!-- 新增语言 -->
    <el-popover placeholder="top-start"  v-model="addLanuageVisibile" trigger="click" title="新增模板语言">
      <i class="close el-icon-close" @click="closePopover('addLangForm')"></i>
      <el-form :model="addLangForm" ref="addLangForm" label-width="120px" class="add-ruleForm">
          <el-form-item label="用户ID:" prop="uid">
            <el-input v-model="addLangForm.uid"></el-input>
          </el-form-item>
          <el-form-item label="语言ID:" prop="lid">
            <el-select v-model="addLangForm.lid" placeholder="请选择">
              <el-option v-for="item in lidObject" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addLangForm','addLang')">立即创建</el-button>
            <el-button @click="resetForm('addLangForm')">重置</el-button>
          </el-form-item>
      </el-form>
    </el-popover>
    <!-- 编辑语言 -->
    <el-popover placeholder="top-start"  v-model="editLanuageVisibile" trigger="click" title="新增模板语言">
      <i class="close el-icon-close" @click="closePopover('editLangForm')"></i>
      <el-form :model="editLangForm" ref="editLangForm" label-width="120px" class="add-ruleForm">
          <el-form-item label="ID:" prop="id">{{editLangForm.id}}</el-form-item>
          <el-form-item label="用户ID:" prop="uid">
            <el-input v-model="editLangForm.uid"></el-input>
          </el-form-item>
          <el-form-item label="语言ID:" prop="lid">
            <el-select v-model="editLangForm.lid" placeholder="请选择">
              <el-option v-for="item in lidObject" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('editLangForm','editLang')">确认修改</el-button>
            <el-button @click="resetForm('editLangForm')">重置</el-button>
          </el-form-item>
      </el-form>
    </el-popover>
    <!-- 新增用户模板  -->
    <el-popover placeholder="top-start"  v-model="addTemplateVisibile" trigger="click" title="新增用户模板">
      <i class="close el-icon-close" @click="closePopover('addTempForm')"></i>
      <el-form :model="addTempForm" ref="addTempForm" label-width="120px" class="add-ruleForm">
        <el-form-item label="用户ID:" prop="uid">
          <el-input v-model="addTempForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="模板ID:" prop="tid">
          <el-select v-model="addTempForm.tid" placeholder="请选择">
            <el-option v-for="item in tempObject" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('addTempForm','addTemp')">立即创建</el-button>
            <el-button @click="resetForm('addTempForm')">重置</el-button>
          </el-form-item>
      </el-form>
    </el-popover>
    <!-- 编辑用户模板  -->
    <el-popover placeholder="top-start"  v-model="editTemplateVisibile" trigger="click" title="编辑用户模板">
      <i class="close el-icon-close" @click="closePopover('editTempForm')"></i>
      <el-form :model="editTempForm" ref="editTempForm" label-width="120px" class="add-ruleForm">
        <el-form-item label="用户ID:" prop="uid">
          <el-input v-model="editTempForm.uid"></el-input>
        </el-form-item>
        <el-form-item label="模板ID:" prop="tid">
          <el-select v-model="editTempForm.tid" placeholder="请选择">
            <el-option v-for="item in tempObject" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('editTempForm','editTemp')">确认修改</el-button>
            <el-button @click="resetForm('editTempForm')">重置</el-button>
          </el-form-item>
      </el-form>
    </el-popover>
  </div>
</template>

<script>

import { DomainName , userList , LangList ,  userStatus , userExpired , userconfigList , userlanguageList , usertemplateList , userlanguageDel , userLangAdd , userLangEdit , templateList , usertemplateAdd, usertemplateEdit, usertemplateDel} from '../api/api'
import  util  from '../api/util.js';
export default {
  name: 'user',
  data () {
    return {
      activeName: 'user',
      uidObject:[],
      lidObject:[],
      tempObject:[],
      dataList: [],
      configList: [],
      languageList: [],
      templateList: [],
      addLangForm:{uid:'',lid:''},
      editLangForm:{id:'',uid:'',lid:''},
      addTempForm:{},
      editTempForm:{id:'',uid:'',tid:''},
      dialogVisible: false,
      addLanuageVisibile:false,
      editLanuageVisibile:false,
      addTemplateVisibile:false,
      editTemplateVisibile:false,
      changDate:'',
      Uid:'',
      value1:'',
      total1:10,//一共多少条
      total2:10,//一共多少条
      total3:10,//一共多少条
      total4:10,//一共多少条
      currentPage1:1,//第几页数据
      currentPage2:1,//第几页数据
      currentPage3:1,//第几页数据
      currentPage4:1,//第几页数据
      size1:10,//每页10条数据
      size2:10,//每页10条数据
      size3:10,//每页10条数据
      size4:10,//每页10条数据
      searchform:{
          value:'username',
          name:'',
          type:'0',
          date:'',
          status:'',
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
    }
  },
  methods: {
    formatCreated: function(row,column) {
      return util.formatDate.format(row.created,'yyyy-MM-dd hh:mm');
    },
    formatExpired: function(row,column) {
      return util.formatDate.format(row.expired, 'yyyy-MM-dd hh:mm');
    },
    formatModified: function(row,column) {
      return util.formatDate.format(row.modified, 'yyyy-MM-dd hh:mm');
    },
    formatStatus: function(row,column){
        return row.status == '0' ? row.status = true : row.status = false;
    },
    formatDefault:function(row,column){
        return row.is_default == '0' ? '否' : '是'
    },
    formatLid:function(row,column){
      return this.selectLid(row.lid);
    },

    formatTid:function(row,column){
      return this.selectTid(row.tid);
    },
    selectLid(lid){
      var value = '缺失';
      this.languageList.forEach( function(ele,index) {
         if(ele.lid == lid){
           value = ele.name;
        }
      });
      return value;
    },
    selectTid(tid){
      var value = '缺失';
      this.templateList.forEach( function(ele,index) {
         if(ele.tid == tid){
           value = ele.name;
        }
      });
      return value;
    },
    handleData(row) {
        console.log(row);
        this.dialogVisible = true;
        this.Uid = row.uid;
        this.changDate = util.formatDate.format(row.expired, 'yyyy-MM-dd');
      },
    handleClick2(row){
      window.open(DomainName.url + '/user/redirect/?uid='+row.uid);
    },
    preView(row){
      if(document.domain == 'www.g3wei.com'){
        window.open('http://'+row.username+'.b.g3wei.com');
      }else{
        window.open('http://'+row.username+'.'+document.domain);
      }
    },
    async Init(){
       let rs1 = await userList({page:this.currentPage1 , rows:this.size1}).catch(err => {console.log(err)});
       this.total1 = Number(rs1.total)
       this.dataList = rs1.rows;
       
       let rs2 = await userconfigList({page:this.currentPage2 , rows:this.size2}).catch(err => {console.log(err)});
       this.total2 = Number(rs2.total)
       this.configList = rs2.rows;

       let rs3 = await userlanguageList({page:this.currentPage3 , rows:this.size3}).catch(err => {console.log(err)});
       this.total3 = Number(rs3.total)
       this.languageList = rs3.rows;

       let rs4 = await usertemplateList({page:this.currentPage4 , rows:this.size4}).catch(err => {console.log(err)});
       this.total4 = Number(rs4.total)
       this.templateList = rs4.rows;
    },
    UserList(param){
      param.page = this.currentPage1
      param.rows = this.size1
      if(this.searchform.name){
        if(this.searchform.value == 'uid'){
          param.uid = this.searchform.name;
        }
        if(this.searchform.value == 'username'){
          param.username = this.searchform.name;
        }
      }
      param.type = this.searchform.type;
      if(this.searchform.start_time){
        param.start_time = this.searchform.start_time;
        param.end_time = this.searchform.end_time;
      }
      if(this.searchform.status){
        param.status = this.searchform.status;
      }
      userList(param).then( rs => {
            this.total1 = Number(rs.total);
            this.dataList = rs.rows;
      }).catch(error => {console.log(error)});

    },
    // 获取配置列表
    getConfitList(param){
      param.page = this.currentPage2
      param.rows = this.size2
      userconfigList(param).then(rs => {
        this.total2 = Number(rs.total)
        this.configList = rs.rows;
      }).catch(error => {console.log(error)});
    },
    //获取用户语言列表
    getLanguageList(param){
      param.page = this.currentPage3
      param.rows = this.size3
      userlanguageList(param).then(rs => {
        this.total3 = Number(rs.total)
        this.languageList = rs.rows;
      }).catch(error => {console.log(error)});
    }, 
    //获取用户模板列表
    getTemplateList(param){
      param.page = this.currentPage4
      param.rows = this.size4
      usertemplateList(param).then(rs => {
        this.total4 = Number(rs.total)
        this.templateList = rs.rows;
      }).catch(error => {console.log(error)});
    },
    

    //启动--禁用
    changeStatus(row) {
        var params = { uid : row.uid };
        userStatus(params).then( rs => {
            this.UserList({});
            this.$message({
              message:'设置成功',
              type:'success'
            })
        })
    },

    //提交过期的日期
    dialogSubmit(){
        console.log(this.value1);
        if(this.value1 == ''){
             this.$message({
                type: 'error',
                message: '您还没有提交过期时间！'
              });          
        }else {
          var params = { uid: this.Uid, expired: this.value1 };
          userExpired(params).then( rs => {
              this.dialogVisible = false;
              this.UserList({});
              this.$message({
                  message:'过期时间修改成功！',
                  type:'success'
              })
          }).catch(error => {console.log(error)})
        }
    },

    submit(){
        var params = {};
        //  console.log(this.searchform);
         if(this.searchform.name){
           if(this.searchform.value == 'uid'){
             params.uid = this.searchform.name;
           }
           if(this.searchform.value == 'username'){
             params.username = this.searchform.name;
           }
         }
         params.type = this.searchform.type;
         if(this.searchform.start_time){
           params.start_time = this.searchform.start_time;
           params.end_time = this.searchform.end_time;
         }
         if(this.searchform.status){
           params.status = this.searchform.status;
         }

         if(JSON.stringify(params) != "{}"){
					this.UserList(params);
				}
    },
    //新增语言
    submitForm(formName , keyword){
        if(keyword == 'addLang'){
          var params = {uid:this.addLangForm.uid,lid:this.addLangForm.lid};
          this.$confirm('确定继续该操作？','提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'success'
          }).then(() => {
              userLangAdd(params).then(rs => {
                if(rs.code == 1){
                  this.$message.success('修改成功！');
                  this.addLanuageVisibile = false;
                  this.getLanguageList({});
                }else{
                  this.$message.error(rs.msg);
                }
                this.resetForm('addLangForm');
              }).catch(error => {console.log(error)})
          }).catch(error => {console.log(error)});
        }
        if(keyword == 'langSearch'){
          console.log(this.searchform)
          if(this.searchform.name != ''){
             if(this.searchform.value == 'username'){
                var params = {username:this.searchform.name , page:1 , row:this.size3};
              }else{
                var params = {uid:this.searchform.name , page:1 , row:this.size3};
              }
              userlanguageList(params).then(rs => {
                this.languageList = rs.rows;
                this.total3 = Number(rs.total);
              }).then(error => {console.log(error)});
              }
        }
        if(keyword == 'configSearch'){
          if(this.searchform.name != ''){
            if(this.searchform.value == 'username'){
              var params = {username:this.searchform.name , page:1, rows:this.size2};
            }else{
              var params = {uid:this.searchform.name, page:1, rows:this.size2}
            }
            userconfigList(params).then(rs => {
              this.configList = rs.rows;
              this.total2 = Number(rs.total);
            }).then(error => {console.log(error)});
          }
        }
        if(keyword == 'editLang'){
          var params = {id:this.editLangForm.id, uid:this.editLangForm.uid, lid:this.editLangForm.lid};
          this.$confirm('确定修改该用户语言？','提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'success'
          }).then(() => {
              userLangEdit(params).then(rs => {
                if(rs.code == 1){
                  this.$message.success('修改成功！');
                  this.editLanuageVisibile = false;
                  this.getLanguageList({});
                }else{
                  this.$message.error(rs.msg);
                }
                this.resetForm('addLangForm');
              }).catch(error => {console.log(error)})
          }).catch(error => {console.log(error)});
        }
        if(keyword == 'addTemp'){
          var params = {uid:this.addTempForm.uid, tid:this.addTempForm.tid};
          this.$confirm('确定增减用户模板?', '提示',{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type:'success'
          }).then(() => {
            usertemplateAdd(params).then(rs => {
              console.log(rs)
              if(rs.code == 1){
                this.$message.success('新增成功！');
                this.addTemplateVisibile = false;
                this.getTemplateList();
              }else{
                this.$message.erroe(rs.msg);
              }
               this.resetForm('addTempForm');
            }).catch(error => {console.log(error)})
          })
        }
        if(keyword == 'tempSearch'){
          if(this.searchform.name != ''){
            if(this.searchform.value == 'username'){
              var params = {username:this.searchform.name , page:1, rows:this.size4};
            }else{
              var params = {uid:this.searchform.name , page:1, rows:this.size4};
            }
            usertemplateList(params).then(rs => {
              this.templateList = rs.rows;
              this.total4 = Number(rs.total);
            }).then(error => {console.log(error)});
          }
        }
    },
     resetForm(formName) {
        this.$refs[formName].resetFields();
        console.log(this.searchform)
        if(formName == 'searchform'){
          if(this.searchform.start_time){this.searchform.start_time = ''; this.searchform.end_time = '';}
          this.UserList({});}
      },
      resetSearch(x){
       this.searchform.value = 'username';this.searchform.name = '';
       switch(x) {
            case 'searchformConfig':
                this.getConfitList({});
                break;
            case 'searchformLanguage':
                this.getLanguageList({});
                break;
            case 'searchformTemplate':
                this.getTemplateList({});
                break;
            default:break;         
        } 
      },
      handleSizeChange(val) {
        switch(this.activeName){
          case 'user':
            this.size1 = val;
            this.UserList({})
            break ;
          case 'userconfig':
            this.size2 = val;
            this.getConfitList({})
            break;
          case 'userlanguage':
            this.size3 = val;
            this.getLanguageList({})
            break;
          case 'usertemplate':
            this.size4 = val;
            this.getTemplateList({})
            break;
          default:break;
        }
      },
      handleCurrentChange(val) {
        console.log(val)
        switch(this.activeName){
          case 'user':
            this.currentPage1 = val;
            this.UserList({})
            break ;
          case 'userconfig':
            this.currentPage2 = val;
            this.getConfitList({})
            break;
          case 'userlanguage':
            this.currentPage3 = val;
            this.getLanguageList({})
            break;
          case 'usertemplate':
            this.currentPage4 = val;
            this.getTemplateList({})
            break;
          default:break;
        }
      },
      searchTime(value){
        if(value == null){
          this.searchform.start_time ='';
          this.searchform.end_time = '';
        }else{
          this.searchform.start_time = value[0];
          this.searchform.end_time = value[1];
        }
      },
      // 编辑语言
      languageEdit(row){
        this.editLanuageVisibile = true;
        LangList({status:'1'}).then(rs => {
            this.lidObject = rs;
        }).catch(error => {console.log(error)})
        this.editLangForm.id = row.id;
        this.editLangForm.uid = row.uid;
        this.editLangForm.lid = Number(row.lid);
      },
      languageDel(row){
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          userlanguageDel({id:row.id}).then(rs => {
            if(rs.code == 1){
              this.$message.success('删除成功!');
              this.getLanguageList({});
            }else{
              this.$message.error(rs.msg);
            }
          }).catch(error => {console.log(error)})
          
        }).catch(error => {console.log(error)});
      },
      templateEdit(row){
        this.editTemplateVisibile = true;
        templateList({status:'1'}).then(rs => {
          this.tempObject = rs.rows;
        }).catch(error => {console.log(error)})
        this.editTempForm.id = row.id;
        this.editTempForm.uid = row.uid;
        this.editTempForm.tid = row.tid;
      },
      templateDel(row){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          usertemplateDel({id:row.id}).then(rs => {
            if(rs.code == 1){
              this.$message.success('删除成功!');
              this.getTemplateList({});
            }else{
              this.$message.error(rs.msg);
            }
          }).catch(error => {console.log(error)})
          
        }).catch(error => {console.log(error)});
      },
      languageAdd(){
          this.addLanuageVisibile = true;
          LangList({status:'1'}).then(rs => {
              this.lidObject = rs;
          }).catch(error => {console.log(error)})
      },
      tempAdd(){
        this.addTemplateVisibile = true;
        templateList({status:'1'}).then(rs => {
          this.tempObject = rs.rows;
        }).catch(error => {console.log(error)})
      },
      closePopover(formName){
        this.addLanuageVisibile = false;
        this.resetForm('addLangForm');
        this.editLanuageVisibile = false;
        this.resetForm('editLangForm');
        this.addTemplateVisibile = false;
        this.resetForm('addTempForm');
        this.editTemplateVisibile = false;
        this.resetForm('editTempForm');
      },
      templateAdd(){},
        
  },
  mounted:function(){
      this.Init();
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
  .Langsearch {width:240px; margin-left:0px;}
</style>