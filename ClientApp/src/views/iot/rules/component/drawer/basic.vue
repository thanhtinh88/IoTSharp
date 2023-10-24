<template>
    <div class="workflow-drawer-node">
        <el-tabs type="border-card" v-model="state.tabsActive">
            <!-- Extended form -->
            <el-tab-pane label="Extended form" name="1"> </el-tab-pane>
            <!-- Node editing -->
            <el-tab-pane label="Node Edit" name="2">
                <el-scrollbar>
                    <el-form :model="state.node"
                             :rules="state.nodeRules"
                             ref="nodeFormRef"
                             size="default"
                             label-width="80px"
                             class="pt15 pr15 pb15 pl15">
                        <el-form-item label="data id" prop="id">
                            <el-input v-model="state.node.id"
                                      placeholder="Please enter data id"
                                      clearable
                                      disabled></el-input>
                        </el-form-item>
                        <el-form-item label="node id" prop="nodeId">
                            <el-input v-model="state.node.nodeId"
                                      placeholder="Please enter node id"
                                      clearable
                                      disabled></el-input>
                        </el-form-item>
                        <el-form-item label="type" prop="type">
                            <el-input v-model="state.node.type"
                                      placeholder="Please enter the type"
                                      clearable
                                      disabled></el-input>
                        </el-form-item>
                        <el-form-item label="left coordinate" prop="left">
                            <el-input v-model="state.node.left"
                                      placeholder="Please enter the left coordinate"
                                      clearable
                                      disabled></el-input>
                        </el-form-item>
                        <el-form-item label="top coordinates" prop="top">
                            <el-input v-model="state.node.top"
                                      placeholder="Please enter top coordinates"
                                      clearable
                                      disabled></el-input>
                        </el-form-item>
                        <el-form-item label="icon icon" prop="icon">
                            <el-input v-model="state.node.icon"
                                      placeholder="Please enter icon"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item label="name" prop="name">
                            <el-input v-model="state.node.name"
                                      placeholder="Please enter name"
                                      clearable></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="mb15" @click="onNodeRefresh">
                                <SvgIcon name="ele-RefreshRight" />
                                reset
                            </el-button>
                            <el-button type="primary" class="mb15" @click="onNodeSubmit">
                                <SvgIcon name="ele-Check" />
                                save
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts" setup>
    import {
        defineComponent,
        reactive,
        toRefs,
        ref,
        nextTick,
        getCurrentInstance,
    } from "vue";
    import { ElMessage } from "element-plus";

    const emit = defineEmits(["close", "submit"]);
    //Define the interface to define the type of object
    interface WorkflowDrawerNodeState {
        node: { [key: string]: any };
        nodeRules: any;
        form: any;
        tabsActive: string;
        loading: {
            extend: boolean;
        };
    }

    const { proxy } = <any>getCurrentInstance();
    const nodeFormRef = ref();
    const extendFormRef = ref();
    const chartsMonitorRef = ref();
    const state = reactive<WorkflowDrawerNodeState>({
        node: {},
        nodeRules: {
            id: [{ required: true, message: "Please enter the data id", trigger: "blur" }],
            nodeId: [{ required: true, message: "Please enter the node id", trigger: "blur" }],
            type: [{ required: true, message: "Please enter the type", trigger: "blur" }],
            left: [{ required: true, message: "Please enter the left coordinate", trigger: "blur" }],
            top: [{ required: true, message: "Please enter top coordinates", trigger: "blur" }],
            icon: [{ required: true, message: "Please enter the icon icon", trigger: "blur" }],
            name: [{ required: true, message: "Please enter a name", trigger: "blur" }],
        },
        form: {
            module: [],
        },
        tabsActive: "1",
        loading: {
            extend: false,
        },
    });// Get parent component data
    const getParentData = (data: object) => {
        state.tabsActive = "1";
        state.node = data;
    };
    //Node edit-reset
    const onNodeRefresh = () => {
        state.node.icon = "";
        state.node.name = "";
    };
    //Node edit-save
    const onNodeSubmit = () => {
        nodeFormRef.value.validate((valid: boolean) => {
            if (valid) {
                emit("submit", state.node);
                emit("close");
            } else {
                return false;
            }
        });
    };
    //Extended form-reset
    const onExtendRefresh = () => {
        extendFormRef.value.resetFields();
    };
    //Extended form-save
    const onExtendSubmit = () => {
        extendFormRef.value.validate((valid: boolean) => {
            if (valid) {
                state.loading.extend = true;
                setTimeout(() => {
                    state.loading.extend = false;
                    ElMessage.success("Save successfully");
                    emit("close");
                }, 1000);
            } else {
                return false;
            }
        });
    };
//Chart visualization-initialization
</script>

<style scoped lang="scss">
.workflow-drawer-node {
  :deep {
    .el-tabs {
      box-shadow: unset;
      border: unset;
      .el-tabs__nav {
        display: flex;
        width: 100%;
        .el-tabs__item {
          flex: 1;
          padding: unset;
          text-align: center;
          &:first-of-type.is-active {
            border-left-color: transparent;
          }
          &:last-of-type.is-active {
            border-right-color: transparent;
          }
        }
      }
      .el-tabs__content {
        padding: 0;
        height: calc(100vh - 90px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
}
</style>
