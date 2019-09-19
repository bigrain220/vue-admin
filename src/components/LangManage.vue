<template>
  <div class="usermanage">
    <el-row style="margin-bottom:20px;">
      <el-button type="primary" @click="addVisibile = true">添加语言</el-button>
    </el-row>
    <el-table  stripe  center :data="dataList" style="width: 100%">
       <el-table-column prop="id" label="ID" width="80px"></el-table-column>
       <el-table-column prop="code" label="国家代码"></el-table-column>
       <el-table-column prop="locale" label="区域代码"></el-table-column>
       <el-table-column prop="name" label="国家名称"></el-table-column>
       <el-table-column prop="status" label="状态">
          <template slot-scope="scope"><el-switch v-model="dataList[scope.$index].status"  @change="changeStatus(scope.row)" active-value="1" inactive-value="0"></el-switch></template>
        </el-table-column>
       <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteClick(scope.row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-popover placeholder="top-start"  v-model="editVisibile" trigger="click" title="编辑语言" >
        <i class="close el-icon-close" @click="closePopover('editForm')"></i>
        <el-form :model="editForm" :rules="editRules" ref="editForm" label-width="120px" class="demo-ruleForm editForm">
          <el-form-item label="ID" prop="id">
            <span>{{editForm.id}}</span>
          </el-form-item>
          <el-form-item label="国家代码" prop="code">
            <el-input v-model="editForm.code"></el-input>
          </el-form-item>
          <el-form-item label="区域代码" prop="locale">
            <el-input v-model="editForm.locale"></el-input>
          </el-form-item>
          <el-form-item label="国家名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
              <el-switch  v-model="editForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('editForm')">修改</el-button>
            <el-button @click="closePopover('editForm')">取消</el-button>
          </el-form-item>
        </el-form>
    </el-popover>
    <el-popover placeholder="top-start"  v-model="addVisibile" trigger="click" title="添加语言">
        <i class="close el-icon-close" @click="closePopover('addForm')"></i>
        <el-form :model="addForm" :rules="addRules" ref="addForm" label-width="120px" class="demo-ruleForm addForm">
          <el-form-item label="国家代码" prop="code">
            <el-input v-model="addForm.code"></el-input>
          </el-form-item>
          <el-form-item label="区域代码" prop="locale">
            <el-input v-model="addForm.locale"></el-input>
          </el-form-item>
          <el-form-item label="国家名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="状态:" prop="status">
              <el-switch  v-model="addForm.status"  active-color="#13ce66" inactive-color="#ff4949"  active-value="1" inactive-value="0" ></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('addForm')">添加</el-button>
            <el-button @click="closePopover('addForm')">取消</el-button>
          </el-form-item>
        </el-form>
    </el-popover>

  </div>
</template>

<script>

import {  LangList, LangAdd ,LangEdit ,LangDel } from '../api/api'
import util from '../api/util'
export default {
  name: 'language',
  data () {
    return {
      msg: '语言列表',
      dataList:[],
      editVisibile:false,
      editForm:{id:'' , code:'' , locale:'' , name:''},
      editRules:{
          id:[{ required: true, message: '请填写id', trigger: 'blur'}],
          code:[{ required: true, message: '请填写code', trigger: 'blur'}],
          locale:[{ required: true, message: '请填写locale', trigger: 'blur'}],
          name:[{ required: true, message: '请填写name', trigger: 'blur'}],
      },
      addVisibile:false,
      addForm:{code:'' , locale:'' , name:'' , status:''},
      addRules:{
        code:[{required:true, message:'请填写国家代码' , trigger:'blur'}],
        locale:[{required:true, message:'请填写区域代码' , trigger:'blur'}],
        name:[{required:true, message:'请填写国家名称' , trigger:'blur'}],
      }
    }
  },
  methods: {
    changeStatus(row){
      let params = {id:row.id , status: row.status , code: row.code , locale: row.locale , name: row.name}
      LangEdit(params).then(rs => {if(rs.code == 1){this.$message.success('设置成功！');}else{this.$message.error(rs.msg);}}).catch(error => {console.log(error)});
    },
    formatStatus(row,column){
      return row.status == '0' ? '禁用' : '正常' ;
    },
    getLangList(param){
      LangList(param).then(rs => {
        this.dataList = rs;
      }).catch(error => {console.log(error)})
    },
    editClick(row){
      this.editVisibile = true;
      this.editForm = row;
    },
    deleteClick(row){
      this.$confirm('此操作将永久删除此语言, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          LangDel({id:row.id}).then(rs => {
              if(rs.code == 1){
                this.$message.success('删除成功！');
                this.getLangList({});
              }else{
                this.$message.error(rs.msg);
              }
          }).catch(error => {console.log(error)})
          }).catch(error => {console.log(error)});
    },
    closePopover(formName){
      this.editVisibile = false;
      this.addVisibile = false;
      this.getLangList();
    },
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
          if(valid){
            if(formName == 'editForm'){
              // console.log(this.editForm);
              LangEdit(this.editForm).then(rs => {
                if(rs.code == 1){
                  this.editVisibile = false;
                  this.$message.success('修改成功！');
                  this.getLangList({});
                }else{
                   this.$message.error(rs.msg);
                }
              }).catch(error => {console.log(error)})
            }else if (formName == 'addForm'){
              // console.log(this.addForm);
              LangAdd(this.addForm).then(rs => {
                if(rs.code == 1){
                  this.addVisibile = false;
                  this.$message.success('添加成功！');
                  this.getLangList({});
                }else{
                  this.$message.error(rs.msg);
                }
              }).catch(error => {console.log(error)})
            }
          }
      })
    },
    resetForm(formName){
        this.$refs[formName].resetFields();
    },

  },  
  mounted:function(){
      this.getLangList({});
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .editForm {width:90%; margin-top:30px;}
</style>