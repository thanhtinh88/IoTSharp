<template>
  <div>
    <el-drawer
      :title="`${state.nodeData.type === 'line' ? '线' : state.nodeData.name}操作`"
      v-model="state.isOpen"
      size="640px"
      @closed="drawerclose"
    >
      <el-scrollbar>
        <Line
          v-if="state.nodeData.type === 'line'"
          @linechange="onLineChange"
          @close="close"
          v-model="state.jsplumbConn"
          ref="lineRef" 
        />
        <ExecutorPanel
          v-if="state.nodeData.nodetype === 'executor' && state.nodeData.type === 'node'"
          @submit="onexecutorSubmit"
          v-model="state.nodeData"
          @close="close"
          ref="executorRef"
        />
        <ScriptPanel
          v-if="state.nodeData.nodetype === 'script' && state.nodeData.type === 'node'"
          @submit="onscriptSubmit"
          @close="close"
          v-model="state.nodeData"
          ref="scriptRef"
        />
      </el-scrollbar>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue";
import Line from "./line.vue";
import ExecutorPanel from "./executor.vue";
import ScriptPanel from "./script.vue";
//Define the interface to define the type of object
interface WorkflowDrawerState {
  isOpen: boolean;
  nodeData: {
    name: string;
    type: string;
    nodetype: string;
    content?: string;
  };
  jsplumbConn: any;
}

const emit = defineEmits([
  "close",
  "submit",
  "panelclose",
  "label",
  "node",
  "executor",
  "script",
]);
const lineRef = ref();
const executorRef = ref();
const scriptRef = ref();
const state = reactive<WorkflowDrawerState>({
  isOpen: false,
  nodeData: {
    type: "node",
    nodetype: "executor",
    name: "",
    content: "",
  },
  jsplumbConn: {},
});
    // open drawer
    const open = (item: any, conn: any) => {
        state.isOpen = true;
        state.jsplumbConn = conn;
        state.nodeData = item;
        nextTick(() => {
            if (item.type === "line") {
                //The data of the current line is not stored in the node, but in the conn copy.

                // lineRef.value.getParentData(conn);
            } else {
                switch (item.nodetype) {
                    case "executor":
                        {
                            // executorRef.value.getParentData(item);
                        }
                        break;

                    case "script":
                        // {
                        // scriptRef.value.getParentData(item);
                        // }
                        break;
                }
            }
        });
    };

    // closure
    const drawerclose = () => {
        //Trigger save separately. If the node's label and the line's label trigger the change event at the same time, there will be a namespace conflict, causing the label value to be overwritten.
        if (state.nodeData.type === "line") {
            emit("panelclose", state.jsplumbConn);

        }
        if (state.nodeData.type === "node") {
            emit("panelclose", state.nodeData);
        }
    };

    // closure
    const close = () => {
        state.isOpen = false;
    };
    //When the line label content changes
    const onLineChange = (label: any) => {
        state.jsplumbConn.label = label.label;
        state.jsplumbConn.linename = label.linename;
        state.jsplumbConn.condition = label.condition;

        console.log(state)
        emit("label", state.jsplumbConn);
    };
    //When the node content changes
    const onNodeSubmit = (data: object) => {
        emit("node", data);
    };

    const onexecutorSubmit = (data: object) => {
        emit("executor", data);
    };

    const onscriptSubmit = (data: object) => {
        emit("script", data);
    };
defineExpose({
  open,
});
</script>
