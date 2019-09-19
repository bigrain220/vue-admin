<template>
  <div class="markdown">
    <quill-editor ref="myTextEditor"
              v-model="content"
              :config="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)">
    </quill-editor>
    <el-button type="success" @click="handleClick">保存</el-button>
  </div>

</template>
<script>
  import { quillEditor } from 'vue-quill-editor';
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { mavonEditor } from 'mavon-editor'
  import 'mavon-editor/dist/css/index.css'
  import { codemirror } from 'vue-codemirror-lite'
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/vue/vue')

  require('codemirror/addon/hint/show-hint.js')
    require('codemirror/addon/hint/show-hint.css')
    require('codemirror/addon/hint/javascript-hint.js')
    export default {
        data: function(){
            return {
                 content: '<h2>I am Example</h2>',
               editorOption: {},
            }
        },
        components: {
         quillEditor
      },
        methods: {
           onEditorBlur(editor) {
          console.log('editor blur!', editor)
        },
        onEditorFocus(editor) {
          console.log('editor focus!', editor)
        },
        onEditorReady(editor) {
          console.log('editor ready!', editor)
        },
            submit(){
                console.log(this.content);
                this.$message.success('提交成功！');
            },
            handleClick(){
              console.log(this.code);
            },
              yourCodeChangeMethod(val){
                console.log(val,'----',this.code)
              },
           
        },
       
    }
</script>
<style scoped>
    .quill-editor {background:#fff; }
    #mavonEditor {margin-top:30px;}
</style>