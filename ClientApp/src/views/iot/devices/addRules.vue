<template>
    <el-drawer v-model="state.drawer" :title="state.dialogtitle" size="70%">
        <el-form :model="state.dataForm" label-width="120px" class="mt-20px">
            <el-form-item label="Please select a rule">
                <el-select v-model="state.dataForm.rule" placeholder="Select">
                    <el-option v-for="item in state.rules" :key="item.value" :label="item.label" :value="item.value"
                               :disabled="item.disabled" />
                </el-select>
            </el-form-item>
            <el-form-item label="Please select a device">
                <el-checkbox-group v-model="state.dataForm.dev">
                    <el-checkbox v-for="device in state.devices" :label="device.id" :checked="true">
                        {{
 device.name
                        }}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">Delegation</el-button>
                <el-button @click="closeDialog">Cancel</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script lang="ts" setup>
    import { ruleApi } from "/@/api/flows";
    interface addruleform {
        drawer: boolean;
        dialogtitle: string;

        devices: Array<any>;
        rules: Array<any>;
        dataForm: addruledto;

    }
    interface addruledto {
        rule: string;
        dev: any;
    }

    const state = reactive<addruleform>({
        drawer: false,
        dialogtitle: "Rule Delegation",
        devices: [
        ],
        rules: [],
        dataForm: {
            rule: "",
            dev: []
        }
    });

    const emit = defineEmits(["close", "submit"]);
    const openDialog = (devices: Array<any>) => {
        // emit("submit",state.devices);
        state.drawer = true;
        state.devices = [...devices];
    };
    //Close pop-up window
    const closeDialog = () => {
        state.drawer = false;
        emit("close", state.devices);
    };

    const onSubmit = async () => {
        var result = await ruleApi().bindDevice(state.dataForm);
        if (result["code"] === 10000) {
            ElMessage.success("Delegation successful");
            state.drawer = false;
            emit("close", { sender: "deviceform", args: state.dataForm });
        } else {
            ElMessage.warning("Delegation failed:" + result["msg"]);
            emit("close", state.dataForm);
        }
    }

    onMounted(() => {
        ruleApi()
            .ruleList({
                limit: 100, offset: 0
            })
            .then((res) => {
                state.rules = [...res.data.rows.map(c => { return { value: c.ruleId, label: c.name } })]
            });

    });
    const tagclose = (tag: any) => {
        state.devices = state.devices.filter(c => c.id != tag.id);
    }


    defineExpose({
        openDialog,
    });
</script>