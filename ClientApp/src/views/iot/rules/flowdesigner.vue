<template>
    <div class="workflow-container">
        <div class="workflow-mask" v-if="state.isShow"></div>
        <div class="layout-view-bg-white flex" :style="{ height: `calc(100vh - ${setViewHeight}` }">
            <div class="workflow">
                <!-- Top toolbar -->
                <Tool @tool="onToolClick" :ruleName="state.ruleName " />

                <!-- Left navigation area -->
                <div class="workflow-content">
                    <div class="workflow-left">
                        <el-scrollbar view-style="padding: 10px">
                            <div ref="leftNavRefs" v-for="val in state.leftNavList" :key="val.id"
                                 :style="{ height: val.isOpen ? 'auto' : '50px', overflow: 'hidden' }" class="workflow-left-id">
                                <div class="workflow-left-title" @click="onTitleClick(val)">
                                    <span>{{ val.title }}</span>
                                    <SvgIcon :name="val.isOpen ? 'ele-ArrowDown' : 'ele-ArrowRight'" />
                                </div>
                                <div class="workflow-left-item" v-for="(v, k) in val.children" :key="k" :data-color="val.color"
                                     :data-name="v.name" :data-icon="v.icon" :data-id="v.id" :nodetype="v.nodetype"
                                     :nodenamespace="v.nodenamespace" :mata="v.mata">
                                    <div class="workflow-left-item-icon" :style="{ backgroundColor: val.color }">
                                        <component :is="{ ...customIcons[v.icon] }" class="workflow-icon-drag"></component>
                                        <div class="text-sm pl5 name">{{ v.name }}</div>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>

                    <!-- Painting area on the right -->
                    <div class="workflow-right" ref="workflowRightRef">
                        <h1 v-if="modal" v-on-click-outside="onItemCloneClickOutside">Test</h1>
                        <div v-for="(v, k) in state.jsplumbData.nodeList" :key="v.nodeId" :id="v.nodeId" :data-node-id="v.nodeId"
                             :class="v.nodeclass" :style="{ left: v.left, top: v.top }" @click="onItemCloneClick(k)"
                             @contextmenu.prevent="onContextmenu(v, k, $event)" v-on-click-outside="
                             ()=>
                            {
                            onItemCloneClickOutside(k);
                            }
                            ">
                            <div :style="{ backgroundColor: v.color }" class="workflow-right-box"
                                 :class="{ 'workflow-right-active': state.jsPlumbNodeIndex === k }">
                                <div class="workflow-left-item-icon">
                                    <!-- <SvgIcon :name="v.icon" class="workflow-icon-drag" />-->
                                    <div class="workflow-icon-drag">
                                        <component :is="{ ...customIcons[v.icon] }"></component>
                                    </div>
                                    <div class="text-sm pl5 name">{{ v.name }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Node right-click menu -->
        <ContextmenuNode :dropdown="state.dropdownNode" ref="contextmenuNodeRef" @currentnode="onCurrentNodeClick" />
        <!-- Line right-click menu -->
        <ContextmenuLine :dropdown="state.dropdownLine" ref="contextmenuLineRef" @currentline="onCurrentLineClick" />
        <!-- Drawer form, line -->
        <Drawer ref="drawerRef" @executor="onexecutorSubmit" @script="onscriptSubmit" @panelclose="panelClose" />

        <!-- Top toolbar-Help popup -->
        <Help ref="helpRef" />
    </div>
</template>

<script lang="ts" setup>
    import { reactive, computed, onMounted, onUnmounted, nextTick, ref } from "vue";
    import { vOnClickOutside } from "@vueuse/components";
    import { ElMessage, ElMessageBox } from "element-plus";
    import { jsPlumb } from "jsplumb";
    import Sortable from "sortablejs";
    import { storeToRefs } from "pinia";
    import { useThemeConfig } from "/@/stores/themeConfig";
    import { useTagsViewRoutes } from "/@/stores/tagsViewRoutes";
    import Tool from "./component/tool/index.vue";
    import Help from "./component/tool/help.vue";
    import ContextmenuNode from "./component/contextmenu/node.vue";
    import ContextmenuLine from "./component/contextmenu/line.vue";
    import Drawer from "./component/drawer/index.vue";
    import commonFunction from "/@/utils/commonFunction";
    import { getGetLeftNavList } from "./js/leftNavList.ts";
    import { customIcons } from "./js/leftNavList.ts";
    import {
        jsplumbDefaults,
        jsplumbMakeSource,
        jsplumbMakeTarget,
        jsplumbConnect,
    } from "./js/config.ts";
    import { useRouter, useRoute } from "vue-router";
    import { ruleApi } from "/@/api/flows";
    import { FlowState } from "/@/views/iot/rules/models";
    const props = defineProps({
        ruleId: {
            type: String,
            default: ''
        }
    })
    const emit = defineEmits(["close", "submit"]);
    const modal = ref(false);
    const contextmenuNodeRef = ref();
    const contextmenuLineRef = ref();
    const drawerRef = ref();
    const helpRef = ref();
    const stores = useTagsViewRoutes();
    const storesThemeConfig = useThemeConfig();
    const { themeConfig } = storeToRefs(storesThemeConfig);
    const { isTagsViewCurrenFull } = storeToRefs(stores);
    const { copyText } = commonFunction();

    const workflowRightRef = ref<HTMLDivElement | null>(null);
    const leftNavRefs = ref([]);
    const state = reactive<FlowState>({

        ruleName: '',
        flowid: props.ruleId,
        leftNavList: [],
        dropdownNode: { x: "", y: "" },
        dropdownLine: { x: "", y: "" },
        isShow: false,
        jsPlumb: null,
        jsPlumbNodeIndex: null,
        jsplumbDefaults,
        jsplumbMakeSource,
        jsplumbMakeTarget,
        jsplumbConnect,
        jsplumbData: {
            nodeList: [],
            lineList: [],
        },
    });
    //Set the height of the view
    const setViewHeight = computed(() => {
        let { isTagsview } = themeConfig.value;
        if (isTagsViewCurrenFull.value) {
            return `30px`;
        } else {
            if (isTagsview) return `114px`;
            else return `80px`;
        }
    });
    // Set width less than 768, operation is not supported
    const setClientWidth = () => {
        const clientWidth = document.body.clientWidth;
        clientWidth < 768 ? (state.isShow = true) : (state.isShow = false);
    };
    // Left navigation-data initialization
    const initLeftNavList = async () => {
        const nav = await getGetLeftNavList();
        state.leftNavList = nav!;
        state.jsplumbData = {
            nodeList: [],
            lineList: [],
        };
        await ruleApi()
            .getDiagram(state.flowid)
            .then((res) => {
                state.jsplumbData = {
                    nodeList: res.data.nodes,
                    lineList: res.data.lines,
                };
            });


        await ruleApi()
            .getrule(state.flowid)
            .then((res) => {
                state.ruleName = res.data.name;

            });
    };


    // Left navigation-initialize drag
    const initSortable = () => {

        leftNavRefs.value.forEach((v) => {
            Sortable.create(v as HTMLDivElement, {
                group: {
                    name: "vue-next-admin-1",
                    pull: "clone",
                    put: false,
                },
                animation: 0,
                sort: false,
                draggable: ".workflow-left-item",
                forceFallback: true,
                onEnd: function (evt: any) {
                    const { name, icon, id, color } = evt.clone.dataset;
                    const { nodetype, nodenamespace, mata } = evt.clone.attributes;
                    const { layerX, layerY, clientX, clientY } = evt.originalEvent;
                    const el = workflowRightRef.value!;

                    const { x, y, width, height } = el.getBoundingClientRect();

                    if (clientX < x || clientX > width + x || clientY < y || y > y + height) {
                        ElMessage.warning("Please drag the node into the canvas");
                    } else {

                        //Node id (unique)
                        const nodeId = Math.random().toString(36).substr(2, 12);
                        // Process node data
                        const node = {
                            nodeId,
                            color,
                            left: `${layerX - 40}px`,
                            top: `${layerY - 15}px`,
                            nodeclass: "workflow-right-clone",
                            nodetype: nodetype.value,
                            nodenamespace: nodenamespace?.value ?? '',
                            mata: mata?.value ?? '',
                            name,
                            icon,
                            id,
                        };

                        // Right view content array
                        state.jsplumbData.nodeList.push(node);
                        //When the element is loaded
                        nextTick(() => {
                            //The entire node serves as source or target
                            state.jsPlumb.makeSource(nodeId, state.jsplumbMakeSource);
                            // // The entire node serves as source or target
                            state.jsPlumb.makeTarget(nodeId, state.jsplumbMakeTarget, jsplumbConnect);
                            //Set the node to be draggable (here is the id value, not class)
                            state.jsPlumb.draggable(nodeId, {
                                containment: "parent",
                                stop: (el: any) => {
                                    state.jsplumbData.nodeList.forEach((v) => {
                                        if (v.nodeId === el.el.id) {
                                            // Reassign nodes x and y to prevent x and y from returning to default when dragging nodes from the left navigation again.
                                            v.left = `${el.pos[0]}px`;
                                            v.top = `${el.pos[1]}px`;
                                        }
                                    });
                                },
                            });
                        });
                    }
                },
            });
        });
    };
    //Initialize jsPlumb
    const initJsPlumb = () => {
        (<any>jsPlumb).ready(() => {
            state.jsPlumb = (<any>jsPlumb).getInstance({
                detachable: false,
                Container: "workflow-right",
            });
            state.jsPlumb.fire("jsPlumbDemoLoaded", state.jsPlumb);
            //Import default configuration
            state.jsPlumb.importDefaults(state.jsplumbDefaults);
            // state.jsPlumb.importDefaults(jsplumbSetting);
            // Will cause the entire jsPlumb to be redrawn immediately.
            state.jsPlumb.setSuspendDrawing(false, true);
            // Initialize the links of nodes and lines
            initJsPlumbConnection();
            // Click on the line to pop up the right-click menu client
            state.jsPlumb.bind("contextmenu", (conn: any, originalEvent: MouseEvent) => {
                originalEvent.preventDefault();
                const { sourceId, targetId } = conn;
                const { clientX, clientY } = originalEvent;
                state.dropdownLine.x = clientX;
                state.dropdownLine.y = clientY;
                const v: any = state.jsplumbData.nodeList.find((v) => v.nodeId === targetId);
                const line: any = state.jsplumbData.lineList.find(
                    (v) => v.sourceId === sourceId && v.targetId === targetId
                );
                v.type = "line";
                v.label = line.label;
                conn.linename = line.linename;
                conn.condition = line.condition;

                contextmenuLineRef.value.openContextmenu(v, conn);
            });
            // before connecting
            state.jsPlumb.bind("beforeDrop", (conn: any) => {
                const { sourceId, targetId } = conn;
                if (conn.targetId == conn.sourceId) {
                    ElMessage.warning("The connection target cannot be itself");
                    return false;
                }

                const item = state.jsplumbData.lineList.find(
                    (v) => v.sourceId === sourceId && v.targetId === targetId
                );
                if (item) {
                    ElMessage.warning("The relationship already exists and cannot be connected repeatedly");
                    return false;
                } else {
                    return true;
                }
            });
            //When connecting
            state.jsPlumb.bind("connection", (conn: any) => {
                const lineId = Math.random().toString(36).substr(2, 12);
                const { sourceId, targetId } = conn;
                state.jsplumbData.lineList.push({
                    lineId,
                    sourceId,
                    targetId,
                    label: "",
                    linenamespace: "bpmn:SequenceFlow",
                });
            });
            // Callback function when deleting the connection
            state.jsPlumb.bind("connectionDetached", (conn: any) => {
                const { sourceId, targetId } = conn;
                state.jsplumbData.lineList = state.jsplumbData.lineList.filter((line) => {
                    if (line.sourceId == sourceId && line.targetId == targetId) {
                        return false;
                    }
                    return true;
                });
            });
        });
    };// Initialize the links of nodes and lines
    const initJsPlumbConnection = () => {
        // node
        state.jsplumbData.nodeList.forEach((v) => {
            //The entire node serves as source or target
            state.jsPlumb.makeSource(v.nodeId, state.jsplumbMakeSource);
            //The entire node serves as source or target
            state.jsPlumb.makeTarget(v.nodeId, state.jsplumbMakeTarget, jsplumbConnect);
            //Set the node to be draggable (here is the id value, not class)
            state.jsPlumb.draggable(v.nodeId, {
                containment: "parent",
                stop: (el: any) => {
                    state.jsplumbData.nodeList.forEach((v) => {
                        if (v.nodeId === el.el.id) {
                            // Reassign nodes x and y to prevent x and y from returning to default when dragging nodes from the left navigation again.
                            v.left = `${el.pos[0]}px`;
                            v.top = `${el.pos[1]}px`;
                        }
                    });
                },
            });
        });
        // Wire
        state.jsplumbData.lineList.forEach((v) => {
            state.jsPlumb.connect(
                {
                    source: v.sourceId,
                    target: v.targetId,
                    label: v.linename,
                    linename: v.linename,
                    condition: v.condition,
                },
                state.jsplumbConnect
            );
        });
        // node
    };
    // Left navigation-menu title click
    const onTitleClick = (val: any) => {
        val.isOpen = !val.isOpen;
    };

    const onexecutorSubmit = (data: object) => {



    };

    const onscriptSubmit = (data: any) => { };

    // Right content area - click on the current item
    const onItemCloneClick = (k: number) => {
        state.jsPlumbNodeIndex = k;
        let { nodeId } = state.jsplumbData.nodeList[k];
        changeLineState(nodeId!, true);
    };

    //Right content area-click outside the current item
    const onItemCloneClickOutside = (k: number) => {
        state.jsPlumbNodeIndex = null;
        let { nodeId } = state.jsplumbData.nodeList[k];
        changeLineState(nodeId!, false);
    };
    // Right content area - when activated, change the line color
    const changeLineState = (nodeId: string, isInsideOfNode: boolean) => {
        let lines = state.jsPlumb.getAllConnections();
        lines.forEach((line: any) => {
            if (line.targetId === nodeId || line.sourceId === nodeId) {
                if (isInsideOfNode) {
                    line.canvas.classList.add("active");
                } else {
                    line.canvas.classList.remove("active");
                }
            }
        });
    };
    //Right content area-Current item right-click menu click
    const onContextmenu = (v: any, k: number, e: MouseEvent) => {
        state.jsPlumbNodeIndex = k;
        const { clientX, clientY } = e;
        state.dropdownNode.x = clientX;
        state.dropdownNode.y = clientY;
        v.type = "node";
        v.label = "";
        let item: any = {};
        state.leftNavList.forEach((l) => {
            if (l.children)
                if (l.children.find((c: any) => c.id === v.id))
                    item = l.children.find((c: any) => c.id === v.id);
        });
        v.from = item.form;
        contextmenuNodeRef.value.openContextmenu(v);
    };
    // Right content area-Current item right-click menu click callback (node)
    const onCurrentNodeClick = (item: any, conn: any) => {
        switch (item.nodetype) {
            case "script":
                {
                    const { contextMenuClickId, nodeId } = item;
                    if (contextMenuClickId === 0) {
                        const nodeIndex = state.jsplumbData.nodeList.findIndex(
                            (item) => item.nodeId === nodeId
                        );
                        state.jsplumbData.nodeList.splice(nodeIndex, 1);
                        state.jsPlumb.removeAllEndpoints(nodeId);
                        state.jsPlumbNodeIndex = null;
                    } else if (contextMenuClickId === 1) {
                        item.value = item.result;
                        drawerRef.value.open(item);
                    }
                }

                break;
            case "basic":
                {
                    const { contextMenuClickId, nodeId } = item;
                    if (contextMenuClickId === 0) {
                        const nodeIndex = state.jsplumbData.nodeList.findIndex(
                            (item) => item.nodeId === nodeId
                        );
                        state.jsplumbData.nodeList.splice(nodeIndex, 1);
                        state.jsPlumb.removeAllEndpoints(nodeId);
                        state.jsPlumbNodeIndex = null;
                    } else if (contextMenuClickId === 1) {
                        drawerRef.value.open(item);
                    }
                }

                break;
            case "executor":
                {
                    const { contextMenuClickId, nodeId } = item;
                    if (contextMenuClickId === 0) {
                        const nodeIndex = state.jsplumbData.nodeList.findIndex(
                            (item) => item.nodeId === nodeId
                        );
                        state.jsplumbData.nodeList.splice(nodeIndex, 1);
                        state.jsPlumb.removeAllEndpoints(nodeId);
                        state.jsPlumbNodeIndex = null;
                    } else if (contextMenuClickId === 1) {
                        drawerRef.value.open(item);
                    }
                }

                break;
        }
    };
    // Right content area-Current item right-click menu click callback (line)
    const onCurrentLineClick = (item: any, conn: any) => {
        const { contextMenuClickId } = item;
        const { endpoints } = conn;
        const intercourse: any = [];
        endpoints.forEach((v: any) => {
            intercourse.push({
                id: v.element.id,
                innerText: v.element.innerText,
            });
        });
        item.contact = `${intercourse[0].innerText}(${intercourse[0].id}) => ${intercourse[1].innerText}(${intercourse[1].id})`;
        if (contextMenuClickId === 0) state.jsPlumb.deleteConnection(conn);
        else if (contextMenuClickId === 1) {
            drawerRef.value.open(item, conn);
        }
    };
    //Set the label of the line
    const setLineLabel = (obj: any) => {
        const { sourceId, targetId, label, linename, condition } = obj;
        const conn = state.jsPlumb.getConnections({
            source: sourceId,
            target: targetId,
        })[0];
        conn.setLabel(linename);
        if (!linename || linename === "") {
            conn.addClass("workflow-right-empty-label");
        } else {
            conn.removeClass("workflow-right-empty-label");
            conn.addClass("workflow-right-label");
        }
        state.jsplumbData.lineList.forEach((v) => {
            if (v.sourceId === sourceId && v.targetId === targetId) {
                v.label = label;
                v.linename = linename;
                v.condition = condition;
            }
        });
    };
    //Set node content
    const setNodeContent = (obj: any) => {
        const { nodeId, name, icon, nodetype, nodenamespace, mata, content } = obj;

        //Set node name and icon
        state.jsplumbData.nodeList.forEach((v) => {
            if (v.nodeId === nodeId) {
                v.name = name;
                v.icon = icon;
                v.nodetype = nodetype;
                v.nodenamespace = nodenamespace;
                v.mata = mata;
                v.content = content;
            }
        });
        // redraw
        nextTick(() => {
            state.jsPlumb.setSuspendDrawing(false, true);
        });
    };
//Top toolbar-Click on current item
    const onToolClick = (fnName: String) => {
        switch (fnName) {
            case "help":
                onToolHelp();
                break;
            case "download":
                onToolDownload();
                break;
            case "submit":
                onToolSubmit();
                break;
            case "copy":
                onToolCopy();
                break;
            case "del":
                onToolDel();
                break;
            case "fullscreen":
                onToolFullscreen();
                break;
            case "return":
                onReturnToList();
                break;
        }
    };

    const onReturnToList = () => {


        emit("close", state.jsplumbData);
        // router.push({
        //   path: "/iot/rules/flowlist",
        // });
    };

    //Top Toolbar-Help
    const onToolHelp = () => {
        nextTick(() => {
            helpRef.value.open();
        });
    };
//Top Toolbar-Download
    const onToolDownload = () => {
        const { globalTitle } = themeConfig.value;
        const href =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(state.jsplumbData, null, "\t"));
        const aLink = document.createElement("a");
        aLink.setAttribute("href", href);
        aLink.setAttribute("download", `${globalTitle}design.json`);
        aLink.click();
        aLink.remove();
        ElMessage.success("download successful");
    };

    const panelClose = (data: any) => {
        if (!data) {
            return;
        }
        switch (data.nodetype) {
            case "script":
                setNodeContent(data)
                state.jsplumbData.nodeList.forEach((v) => {
                    if (v.nodeId === data.nodeId) {
                        v.name = data.name;
                        v.icon = data.icon;
                        v.nodetype = data.nodetype;
                        v.nodenamespace = data.nodenamespace;
                        v.mata = data.mata;
                        v.content = data.content;
                    }
                });

                break;
            case "executor":
                setNodeContent(data)
                state.jsplumbData.nodeList.forEach((v) => {
                    if (v.nodeId === data.nodeId) {
                        v.name = data.name;
                        v.icon = data.icon;
                        v.nodetype = data.nodetype;
                        v.nodenamespace = data.nodenamespace;
                        v.mata = data.mata;
                        v.content = data.content;
                    }
                });
                break;
            case "basic":
                break;

            default:
                setLineLabel(data);

                break;
        }
    };

    //Top Toolbar-Submit
    const onToolSubmit = async () => {
        var result = await ruleApi()
            .saveDiagramV({
                RuleId: state.flowid,
                nodes: state.jsplumbData.nodeList,
                lines: state.jsplumbData.lineList,
            })
        if (result.data) {
            ElMessage.success("Rule saved successfully");
            onReturnToList();
        } else {
            ElMessage.success("Failed to save rules: " + result['msg']);
        }

    };
    //Top Toolbar-Copy
    const onToolCopy = () => {
        copyText(JSON.stringify(state.jsplumbData));
    };
    //Top Toolbar-Delete
    const onToolDel = () => {
        ElMessageBox.confirm("This operation will clear the canvas, do you want to continue?", "Prompt", {
            confirmButtonText: "Clear",
            cancelButtonText: "Cancel",
        })
            .then(() => {
                state.jsplumbData.nodeList.forEach((v) => {
                    state.jsPlumb.removeAllEndpoints(v.nodeId);
                });
                nextTick(() => {
                    state.jsplumbData = {
                        nodeList: [],
                        lineList: [],
                    };
                    ElMessage.success("Clear canvas successfully");
                });
            })
            .catch(() => { });
    };
    // Top toolbar - full screen
    const onToolFullscreen = () => {
        stores.setCurrenFullscreen(true);
    };



    watch(() => props.ruleId, async () => {
        await initData();
    })
    //When the page loads
    onMounted(async () => {
        await initData();

        window.addEventListener("resize", setClientWidth);
    });

    const initData = async () => {
        if (props.ruleId && props.ruleId !== "") {
            await initLeftNavList();
            await initSortable();
            initJsPlumb();
            setClientWidth();
        }

    }

//When the page is unloaded
    onUnmounted(() => {
        window.removeEventListener("resize", setClientWidth);
    });
</script>

<style scoped lang="scss">
    .workflow-container {
        position: relative;

        .workflow {
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: column;

            .workflow-content {
                display: flex;
                height: calc(100% - 35px);

                .workflow-left {
                    box-sizing: border-box;
                    width: 220px;
                    height: 100%;
                    border-right: 1px solid var(--el-border-color-light, #ebeef5);

                    :deep(.el-collapse-item__content) {
                        padding-bottom: 0;
                    }

                    .workflow-left-title {
                        height: 50px;
                        display: flex;
                        align-items: center;
                        padding: 0 10px;
                        border-top: 1px solid var(--el-border-color-light, #ebeef5);
                        color: var(--el-text-color-primary);
                        cursor: default;

                        span {
                            flex: 1;
                        }
                    }

                    .workflow-left-item {
                        box-sizing: border-box;
                        display: inline-block;
                        width: 100%;
                        position: relative;
                        cursor: move;
                        //margin: 0 0 10px 10px;
                        //padding-right: 10px;
                        //border: 2px solid #9E9DAD;
                        border: 2px solid transparent;
                        border-radius: 6px;
                        margin-bottom: 10px;
                        outline: 1px solid #9e9dad;
                        outline-offset: -2px;

                        &:hover {
                            outline: none;
                            //transition: all 0.3s ease;
                            border: 2px dashed var(--el-color-primary);
                            background: var(--el-color-primary-light-9);
                            border-radius: 6px;

                            i,
                            .name {
                                transition: all 0.3s ease;
                                color: var(--el-color-primary);
                            }
                        }

                        .workflow-left-item-icon {
                            height: 35px;
                            display: flex;
                            align-items: center;
                            transition: all 0.3s ease;
                            padding: 5px 10px;
                            border: 1px dashed transparent;
                            background: var(--next-bg-color);
                            border-radius: 6px;

                            i,
                            .name {
                                color: black;
                                transition: all 0.3s ease;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }
                        }
                    }

                    & .workflow-left-id:first-of-type {
                        .workflow-left-title {
                            border-top: none;
                        }
                    }
                }

                .workflow-right {
                    flex: 1;
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    background-image: linear-gradient(90deg, rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%), linear-gradient(rgb(156 214 255 / 15%) 10%, rgba(0, 0, 0, 0) 10%);
                    background-size: 10px 10px;

                    .workflow-right-clone {
                        position: absolute;

                        .workflow-right-box {
                            height: 50px;
                            align-items: center;
                            color: black;
                            padding: 0 10px;
                            border-radius: 3px;
                            cursor: move;
                            transition: all 0.1s ease;
                            min-width: 94.5px;
                            background: var(--el-color-white);
                            border: 2px solid var(--el-border-color-light, #1d59e6);

                            .workflow-left-item-icon {
                                display: flex;
                                align-items: center;
                                height: 50px;
                            }

                            &:hover {
                                outline: 2px dashed var(--el-color-primary);
                                background: var(--el-color-primary-light-9);
                                //transition: all 0.3s ease;
                                color: var(--el-color-primary);

                                i {
                                    cursor: Crosshair;
                                }
                            }
                        }

                        .workflow-right-active {
                            //border: 1px dashed var(--el-color-primary);
                            outline: 2px solid var(--el-color-primary);
                            background: var(--el-color-primary-light-9);
                            color: var(--el-color-primary);
                        }
                    }

                    :deep(.jtk-overlay):not(.aLabel) {
                        padding: 4px 10px;
                        border: 1px solid var(--el-border-color-light, #ebeef5) !important;
                        color: var(--el-text-color-secondary) !important;
                        background: var(--el-color-white) !important;
                        border-radius: 3px;
                        font-size: 10px;
                    }

                    :deep(.jtk-overlay.workflow-right-empty-label) {
                        display: none;
                    }
                }
            }
        }

        .workflow-mask {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;

            &::after {
                content: "The mobile version does not support jsPlumb operation";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: 1;
                background: rgba(255, 255, 255, 0.9);
                color: #666666;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    .workflow-icon-drag {
        position: relative;

        &:after {
            content: " ";
            width: 32px;
            height: 32px;
            left: 0;
            top: 0;
            z-index: 1000;
            position: absolute;
            cursor: default;
            background: transparent;
        }
    }
</style>

<style lang="scss">
    //Connection animation, activated when the node is clicked
    .jtk-connector.active {
        z-index: 9999;

        path {
            stroke: #150042;
            stroke-width: 1.5;
            animation: ring;
            animation-duration: 3s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            stroke-dasharray: 5;
        }
    }

    @keyframes ring {
        from {
            stroke-dashoffset: 50;
        }

        to {
            stroke-dashoffset: 0;
        }
    }
</style>
