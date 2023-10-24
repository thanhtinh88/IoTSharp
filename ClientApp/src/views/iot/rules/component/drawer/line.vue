<template>
    <div class="pt15 pr15 pb15 pl15">
        <el-form :model="state.line" size="default" label-width="50px">
            <el-form-item label="Back and forth">
                <el-input v-model="state.line.contact" placeholder="contact" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="type">
                <el-input v-model="state.line.type" placeholder="type" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="name">
                <el-input v-model="state.line.linename" placeholder="Please enter a name" clearable></el-input>
            </el-form-item>

            <el-form-item label="condition">
                <el-input v-model="state.line.condition" placeholder="Please enter the condition" clearable></el-input>
            </el-form-item>
        </el-form>
        <div class="codeTip">
            <div>On the line node, you can set the name to be displayed above the line segment. You need to pay attention when entering the condition field. The Node node fetching method is input.Name to get the node Json value: </div>
<pre>
{
    "Name":"Zhang San",
    "Age":18
}
</pre>
            <div>But when the line node receives the Json value, the field is used directly, and the condition is written as: </div>
            <el-tag type="Info">Age>18</el-tag> is sufficient, but input cannot be spliced.
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: {},
  },
});
//Define the interface to define the type of object
interface WorkflowDrawerLineState {
   line: any;
}

const emit = defineEmits(["linechange", "close"]);
const state = reactive<WorkflowDrawerLineState>({
   line: props.modelValue,
});
watch(
   () => props.modelValue,
   () => {
     state.line = props.modelValue
   }
);

// Get parent component data
// const getParentData = (linedata: any) => {
// state.line.linename = linedata.linename ?? "";
// state.line.condition = linedata.condition ?? "";
// state.line.namespace = linedata.namespace ?? "";
// };
// reset
const onLineTextReset = () => {
   state.line.linename = "";
};
// save
const onLineTextChange = () => {
  emit("linechange", state.line);
  emit("close");
};
defineExpose({
  onLineTextChange
});

</script>

<style scoped lang="scss">
    .codeTip{
        padding:5px 15px;
        font-size: 12px;
        clear:both;
        background: whitesmoke;
        border: 1px solid #dadada;
        color: #404040;
        pre{
            background: #1e1e1e;
            color: #c6c6c6;
            padding: 4px;
        }
    }
</style>
