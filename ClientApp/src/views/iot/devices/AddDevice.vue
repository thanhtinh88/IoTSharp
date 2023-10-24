<template>
    <div>
        <el-drawer v-model="drawer" :title="dialogtitle" size="50%">
            <div class="add-form-container">
                <el-form :model="dataForm" size="default" label-width="90px">
                    <el-row :gutter="35">
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="Device name">
                                <el-input v-model="dataForm.name"
                                          placeholder="Please enter the device name"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="Equipment Type">
                                <el-select v-model="dataForm.deviceType" placeholder="Please select the device type">
                                    <el-option v-for="item in deviceTypes"
                                               :key="item"
                                               :label="item"
                                               :value="item" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="timeout">
                                <el-input v-model="dataForm.timeout"
                                          placeholder="Please enter timeout"
                                          clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
                            <el-form-item label="Authentication method">
                                <el-select v-model="dataForm.identityType" placeholder="Please select the authentication method">
                                    <el-option v-for="item in identityTypes"
                                               :key="item"
                                               :label="item"
                                               :value="item" />
                                </el-select>
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

<script lang="ts">
    import { ref, toRefs, reactive, onMounted, defineComponent, watchEffect } from "vue";
    import { ElMessageBox, ElMessage } from "element-plus";
    import { deviceApi } from "/@/api/devices";
    import { appmessage } from "/@/api/iapiresult";

    interface deviceform {
        drawer: boolean;
        dialogtitle: string;
        dataForm: deviceaddoreditdto;
        identityTypes: Array<string>;
        deviceTypes: Array<string>;
    }

    export default defineComponent({
        name: "addDevice",
        components: {},
        setup(props) {
            const state = reactive<deviceform>({
                drawer: false,
                dialogtitle: '',
                identityTypes: ['AccessToken', 'DevicePassword', 'X509Certificate'],
                deviceTypes: ['Device', 'Gateway'],
                dataForm: {
                    id: '0000000-0000-0000-0000-000000000000',
                    name: '',
                    timeout: 300,
                    identityType: '',
                    deviceType: '',
                },
            });

            const openDialog = (deviceid: string) => {
                if (deviceid === '0000000-0000-0000-0000-000000000000') {
                    state.dataForm = {
                        id: '0000000-0000-0000-0000-000000000000',
                        name: '',
                        timeout: 300,
                        identityType: '',
                        deviceType: '',
                    }
                    state.dialogtitle = 'Add new device';
                } else {
                    state.dialogtitle = 'Modify device';
                    deviceApi()
                        .getdevcie(deviceid)
                        .then((res) => {
                            state.dataForm = res.data
                        });
                }
                state.drawer = true;
            };
            //Close pop-up window
            const closeDialog = () => {
                state.drawer = false;
            };

            watchEffect(() => { });

            onMounted(() => { });
            const onSubmit = () => {
                if (state.dataForm.id === '0000000-0000-0000-0000-000000000000') {
                    deviceApi().postdevcie(state.dataForm).then((res: appmessage<boolean>) => {
                        if (res.code === 10000 && res.data) {
                            ElMessage.success("Add successfully");
                        } else {
                            ElMessage.warning("Add failed:" + res.msg);
                        }

                    });
                } else {
                    deviceApi().putdevcie(state.dataForm).then((res: appmessage<boolean>) => {
                        if (res.code === 10000 && res.data) {
                            ElMessage.success("Modification successful");
                        } else {
                            ElMessage.warning("Modification failed:" + res.msg);
                        }
                    });
                }

            };
            return { ...toRefs(state), onSubmit, openDialog, closeDialog };
        },
    });
</script>
