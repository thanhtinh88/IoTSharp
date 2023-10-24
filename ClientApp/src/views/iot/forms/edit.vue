<template><div id="codeEditBox" style="height: 300px"></div></template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent ,nextTick} from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as monaco from 'monaco-editor';
import {useRoute} from 'vue-router'
export default defineComponent({
  name: 'addDevice',
  components: {},
  setup() {
    const text=ref('')
const route=useRoute()
const language=ref('go')
const msg=ref()
const loading=ref(false)
let editor: monaco.editor.IStandaloneCodeEditor;


const editorInit = () => {
    nextTick(()=>{
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: false
        });
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES2016,
            allowNonTsExtensions: true
        });
        
        !editor ? editor = monaco.editor.create(document.getElementById('codeEditBox') as HTMLElement, {
         value:text.value, // Editor initial display text
         language: 'go', // Check the demo for language support
         automaticLayout: true, // adaptive layout
         theme: 'vs-dark', // There are three official themes vs, hc-black, or vs-dark
         foldingStrategy: 'indentation',
         renderLineHighlight: 'all', // line light
         selectOnLineNumbers: true, // Display line numbers
         minimap:{
             enabled: false,
         },
         readOnly: false, // read only
         fontSize: 16, // font size
         scrollBeyondLastLine: false, // A large blank space after the cancellation code
         overviewRulerBorder: false, // No scroll bar border
        }):
        editor.setValue("");
        // console.log(editor)
        // Monitor value changes
        editor.onDidChangeModelContent((val:any) => {
            text.value = editor.getValue();
             
        })
    })
}
    onMounted(() => {


        editorInit()
    });
    return {};
  },
});
</script>
<style lang="scss">
body {
  margin: 0;  /* If a vertical scroll bar appears on the page, add this line of CSS to eliminate it */
}

</style>