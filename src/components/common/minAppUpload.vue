<template>
  <div>
    <form :action=host enctype="multipart/form-data" method="post" ref="hahaForm" target="id_iframe">
    <el-upload
      class="mapp-uploader"
      ref="addupload"
      :multiple="false"
      accept=".zip"
      action="123"
      :on-success="adduploadSuccess"
      :on-change="addhandlefileChange"
      :on-error="adduploadError"
      :show-file-list="true"
      :auto-upload="false"
      :limit="1"
      :on-exceed="handleExceed"
      :before-upload="addbeforeAvatarUpload"
      :name="tidType"
    >
      <el-button size="small" type="primary" slot="trigger">点击选取</el-button>
      <div slot="tip" class="el-upload__tip tips">只能上传zip文件，且不超过10MB</div>
    </el-upload>
        <input type="text" name="id"   :value="changeId"  v-if="controlType === 'edit'"  v-show="false"/>
        <input type="text" name="tid"  :value="changeTid"  v-if="tidType == 'app'"  v-show="false"/>
    </form>

    <iframe id="id_iframe" name="id_iframe" style="display:none;"></iframe> 
  </div>
</template>
<script>
export default {
  props: {
    sendAppData: { type: String },
    isUpload: { type: Boolean },
    changeData: { type: Object },
    lineChange:{ type: String },
  },
  data() {
    return {
      host: "",
      tidType:"",
      controlType:"",
      changeId:"",
      changeTid:"",
    };
  },
  mounted() {
    var actType = this.sendAppData.split(",")[0],
      loadType = this.sendAppData.split(",")[1];
    if (actType == "add") {
      this.lineChange=="www.g3wei.com" ? this.host="http://www.g3wei.com/admin/app/add" : this.host="http://web.51g4.com/admin/app/add"
    } else if (actType == "edit"){
       this.lineChange=="www.g3wei.com" ? this.host="http://www.g3wei.com/admin/app/edit" : this.host="http://web.51g4.com/admin/app/edit"
    };
    this.controlType=actType;
    this.tidType=loadType;
    // console.log(this.changeData)
    this.changeId = this.changeData.id  
  },
  methods: {
    addhandlefileChange(file, fileList) {
      //选择完文件后的状态
      // console.log("change", file);
      const isImage = file.raw.type === "application/zip";
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isImage) {
        this.$message.error("只能上传zip格式的文件！");
        this.$refs.addupload.clearFiles();
        return false;
      } else if (!isLt2M) {
        this.$message.error("上传文件大小不能超过4MB");
        this.$refs.addupload.clearFiles();
        return false;
      } else {
         this.$refs.hahaForm.submit();
      }
    },
    adduploadSuccess(response, file, fileList) {
      console.log("success", response, file, fileList);
      this.$message.success("文件上传成功!状态码：" + response.Status);
    },
    adduploadError() {
      this.$message.warning("上传功能出了点问题，请重试");
    },
    handleExceed() {
      this.$message.error("一次只能选一个文件，请刷新后重新编辑");
    },
    addbeforeAvatarUpload(file) {
	},

  },
  computed: {
    getTid() {
      return this.changeData.tid;
    },
    getId() {
      return this.changeData.id;
    },
  },
  watch:{ 
      isUpload(val){
        if(val==true){
            // console.log(val,'+++')
          // this.$refs.hahaForm.submit();
        }else if(val==false){
          console.log('false')
        }
      },
      getTid(val){
        this.changeTid = val
      },
      getId(val){
        this.changeId = val
      },
  },


};
</script>
<style scoped>
.el-upload__tip.tips {
  margin: 0;
}
</style>
