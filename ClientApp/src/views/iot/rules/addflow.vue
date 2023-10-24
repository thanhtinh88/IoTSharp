<template>
    <div>
        <el-drawer v-model="state.drawer" :title="state.dialogtitle" size="60%">
            <div class="add-form-container">
                <el-form :model="state.dataForm" size="default" label-width="90px" ref="dataFormRef" :rules="rules">
                    <el-row :gutter="35">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="Rule chain name">
                                <el-input v-model="state.dataForm.name" placeholder="Please enter the rule chain name" clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="event type">
                                <el-select v-model="state.dataForm.mountType" placeholder="Please select event type">
                                    <el-option v-for="item in state.mountTypes" :key="item.value" :label="item.label"
                                               :value="item.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="Rule chain description">
                                <el-input v-model="state.dataForm.ruleDesc" placeholder="Please enter the rule chain description information" clearable></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">Save</el-button>
                                <el-button @click="closeDialog">Cancel</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { ref, toRefs, reactive, onMounted, defineComponent, watchEffect } from "vue";
import { ElMessageBox, ElMessage, FormRules, FormInstance } from "element-plus";
import { ruleApi } from "/@/api/flows";
import { appmessage } from "/@/api/iapiresult";
import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
interface ruleform {
  drawer: boolean;
  dialogtitle: string;
  dataForm: ruleaddoreditdto;
  mountTypes: Array<any>;
}
const emit = defineEmits(["close", "submit"]);
const dataFormRef = ref();
const rules = reactive<FormRules>({
  name: [
   { required: true, type: "string", message: "Please enter the device name", trigger: "blur" },
   { min: 2, message: "The length of the device name should be greater than 1", trigger: "blur" },
], mountType: [
   { required: true, message: "Please select the event type", trigger: "blur" },
 
],
});
const state = reactive<ruleform>({
  drawer: false,
  dialogtitle: "",
  mountTypes: [
   {
     value: "None",
     label: "None",
   },
   {
     value: "RAW",
     label: "Original value (RAW)",
   },
   {
     value: "Telemetry",
     label: "telemetry",
   },
   {
     value: "Attribute",
     label: "property",
   },
   {
     value: "RPC",
     label: "Remote Control (RPC)",
   },
   {
     value: "Connected",
     label: "online",
   },
   {
     value: "Disconnected",
     label: "offline",
   },
   {
     value: "TelemetryArray",
     label: "telemetry array",
   },
   {
     value: "Alarm",
     label: "alarm",
   },
   {
     value: "DeleteDevice",
     label: "Delete device",
   },
   {
     value: "CreateDevice",
     label: "Create device",
   },
   {
     value: "Activity",
     label: "Activity event",
   },
   {
     value: "Inactivity",
     label: "inactive status",
   },
],
  dataForm: {
    ruleId: NIL_UUID,
    name: "",
    ruleDesc: "",
    mountType: "",
  },
});

const openDialog = (ruleid: string) => {
  console.log(ruleid);
  if (ruleid === NIL_UUID) {
    state.dataForm = {
      ruleId: NIL_UUID,
      name: "",
      ruleDesc: "",
      mountType: "",
    };
state.dialogtitle = "New rule chain";
   } else {
     state.dialogtitle = "Modify rule chain";
    ruleApi()
      .getrule(ruleid)
      .then((res) => {
        state.dataForm = res.data;
      });
  }
  state.drawer = true;
};
//Close pop-up window

const closeDialog = () => {
  state.drawer = false;
  emit("close", state.dataForm);
};

watchEffect(() => { });

onMounted(() => { });
const onSubmit = () => {
  if (state.dataForm.ruleId === NIL_UUID) {
    ruleApi()
      .postrule(state.dataForm)
      .then((res: appmessage<boolean>) => {
        if (res.code === 10000 && res.data) {
          ElMessage.success("New success");
          emit("submit", state.dataForm);
          emit("close", state.dataForm);
          state.drawer = false;
        } else {
          ElMessage.warning("New failure:" + res.msg);
        }
      });
  } else {
    ruleApi()
      .putrule(state.dataForm)
      .then((res: appmessage<boolean>) => {
        if (res.code === 10000 && res.data) {
          ElMessage.success("Modified successfully");
          emit("close", state.dataForm);
          state.drawer = false;
        } else {
          ElMessage.warning("Modification failed:" + res.msg);
        }
      });
  }
};

defineExpose({
  openDialog,
});
</script>
