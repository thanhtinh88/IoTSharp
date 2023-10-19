<template>
    <div class="editor-container">
        <div ref="editorToolbar"></div>
        <div ref="editorContent" :style="{ height }"></div>
    </div>
</template>

<script lang="ts">
    import { toRefs, reactive, onMounted, watch, defineComponent } from 'vue';
    import { createEditor, createToolbar, IEditorConfig, IToolbarConfig, IDomEditor } from '@wangeditor/editor';
    import '@wangeditor/editor/dist/css/style.css';
    import { toolbarKeys } from './toolbar';

    //Define the interface to define the type of object
    interface WangeditorState {
        editorToolbar: HTMLDivElement | null;
        editorContent: HTMLDivElement | null;
        editor: any;
    }

    export default defineComponent({
        name: 'wngEditor',
        props: {
            // node id
            id: {
                type: String,
                default: () => 'wangeditor',
            },
            // Whether to disable
            isDisable: {
                type: Boolean,
                default: () => false,
            },
            //Content box default placeholder
            placeholder: {
                type: String,
                default: () => 'Please enter content',
            },
            // Two-way binding: two-way binding value, the field name is fixed, it will not take effect after changing it
            // Reference: https://v3.cn.vuejs.org/guide/migration/v-model.html#%E8%BF%81%E7%A7%BB%E7%AD%96%E7%95%A5
            modelValue: String,
            // https://www.wangeditor.com/v5/getting-started.html#mode-%E6%A8%A1%E5%BC%8F
            //Mode, optional <default|simple>, default default
            mode: {
                type: String,
                default: () => 'default',
            },
            // high
            height: {
                type: String,
                default: () => '310px',
            },
        },
        setup(props, { emit }) {
            const state = reactive<WangeditorState>({
                editorToolbar: null,
                editor: null,
                editorContent: null,
            });
            //Rich text configuration
            const wangeditorConfig = () => {
                const editorConfig: Partial<IEditorConfig> = { MENU_CONF: {} };
                props.isDisable ? (editorConfig.readOnly = true) : (editorConfig.readOnly = false);
                editorConfig.placeholder = props.placeholder;
                editorConfig.onChange = (editor: IDomEditor) => {
                    // console.log('content', editor.children);
                    // console.log('html', editor.getHtml());
                    emit('update:modelValue', editor.getHtml());
                };
                (<any>editorConfig).MENU_CONF['uploadImage'] = {
                    base64LimitSize: 10 * 1024 * 1024,
                };
                return editorConfig;
            };
            //
            const toolbarConfig = () => {
                const toolbarConfig: Partial<IToolbarConfig> = {};
                toolbarConfig.toolbarKeys = toolbarKeys;
                return toolbarConfig;
            };
            // 初始化富文本
            // https://www.wangeditor.com/
            const initWangeditor = () => {
                state.editor = createEditor({
                    html: props.modelValue,
                    selector: state.editorContent!,
                    config: wangeditorConfig(),
                    mode: props.mode,
                });
                createToolbar({
                    editor: state.editor,
                    selector: state.editorToolbar!,
                    mode: props.mode,
                    config: toolbarConfig(),
                });
            };
            // 页面加载时
            onMounted(() => {
                initWangeditor();
            });
            // 监听双向绑定值的改变
            // https://gitee.com/lyt-top/vue-next-admin/issues/I4LM7I
            watch(
                () => props.modelValue,
                (value) => {
                    state.editor.clear();
                    state.editor.dangerouslyInsertHtml(value);
                }
            );
            return {
                ...toRefs(state),
            };
        },
    });
</script>
