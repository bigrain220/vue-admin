<template>
  <div class="markdown">
      <mavon-editor id="mavonEditor" style="height: 100%" :ishljs = "true"  @imgAdd="$imgAdd" @imgDel="$imgDel" :toolbars="toolbars"></mavon-editor>
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
                toolbars: {
                    bold: true, // 粗体
                    italic: true,// 斜体
                    header: true,// 标题
                    underline: true,// 下划线
                    strikethrough: true,// 中划线
                    mark: true,// 标记
                    superscript: true,// 上角标
                    subscript: true,// 下角标
                    quote: true,// 引用
                    ol: true,// 有序列表
                    ul: true,// 无序列表
                    link: true,// 链接
                    imagelink: true,// 图片链接
                    code: true,// code
                    table: true,// 表格
                    subfield: true,// 是否需要分栏
                    fullscreen: true,// 全屏编辑
                    readmodel: true,// 沉浸式阅读
                    htmlcode: true,// 展示html源码
                    help: true,// 帮助
                    
                }
            }
        },
        components: {
        mavonEditor
      },
       methods: {
         
           
        },
        computed: {
          
        },
        mounted() {
          
        }
    }
</script>
<style scoped>
    .quill-editor {background:#fff; }
    #mavonEditor {margin-top:30px;}
</style>