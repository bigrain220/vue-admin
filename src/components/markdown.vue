<template>
	<div class="markdown">
		<quill-editor ref="myTextEditor"
              v-model="content"
              :config="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @ready="onEditorReady($event)">
		</quill-editor>

        <mavon-editor id="mavonEditor" style="height: 100%" :ishljs = "true"  @imgAdd="$imgAdd" @imgDel="$imgDel"></mavon-editor>
       	<div style="width:100%; height:30px;"></div>
			

			<!-- simple (with bindings in Vue2.x) -->
			<codemirror v-model="code"></codemirror>

			<!-- advanced -->
			<codemirror
			  :value="code"
			  :options="editorOptions"
			  ref="myEditor"
			  @change="yourCodeChangeMethod">
			</codemirror>
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
	             code: 'const str = "hello world"',
	             editorOptions: {
	             	mode: 'vue',
    				extraKeys: {'Ctrl-Space': 'autocomplete'}
	             }
            }
        },
        components: {
	       quillEditor,mavonEditor,codemirror
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
        computed: {
            // editor() {
            //     return this.$refs.myTextEditor.quillEditor;
            // },
             editor() {
		      // get current editor object
		      return this.$refs.myEditor.editor
		    }
        },
        mounted() {
        	 // this.editor.focus()
   		      console.log('this is current editor object', this.editor)
        }
    }
</script>
<style scoped>
    .quill-editor {background:#fff; }
    #mavonEditor {margin-top:30px;}
</style>