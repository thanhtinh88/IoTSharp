<template>
    <div>
        <el-card>
            <div class="z-crud">
                <fs-crud ref="crudRef" v-bind="crudBinding">
                    <template #actionbar-right>
                        <el-divider direction="vertical" />
                        <el-button @click="openCustomForm">Rule delegation</el-button>
                    </template>
                </fs-crud>
            </div>
        </el-card>
        <DeviceDetail ref="deviceDetailRef"></DeviceDetail>
        <addRules ref="addRulesRef"></addRules>

    </div>
</template>

<script lang="ts" setup>
    import { useCrud } from '@fast-crud/fast-crud';
    import { useExpose } from '@fast-crud/fast-crud';
    import DeviceDetail from './DeviceDetail.vue';
    import addRules from './addRules.vue';
    import { createDeviceCrudOptions } from '/@/views/iot/devices/deviceCrudOptions';
    import { useRoute } from 'vue-router';
    import { useUserInfo } from '/@/stores/userInfo';
    import { storeToRefs } from 'pinia';


    const selectedItems = ref([]);
    const stores = useUserInfo();
    const route = useRoute();
    const { userInfos } = storeToRefs(stores);
    // device details ref
    const deviceDetailRef = ref();
    // ref of crud component
    const crudRef = ref();
    // crud configured ref
    const crudBinding = ref();
    const customerId = route.query.id || userInfos.value.customer.id;
    // Rule delegate ref
    const addRulesRef = ref();
    //Exposed method
    const { crudExpose } = useExpose({ crudRef, crudBinding });
    //Your crud configuration
    const { crudOptions } = createDeviceCrudOptions({ expose: crudExpose }, customerId, deviceDetailRef, addRulesRef, selectedItems);
    //Initialize crud configuration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose: crudExpose, crudOptions });
    // You can call this method to reinitialize the crud configuration
    // resetCrudOptions(options)

    const openCustomForm = () => {
        if (selectedItems.value.length) {
            addRulesRef.value.openDialog(selectedItems.value);
        } else {
            ElMessage.info('Please select a device')
        }

    }

    // Get the list data after the page is opened
    onMounted(() => {
        crudExpose.doRefresh();
    });
</script>
<style lang="scss" scoped>
    .z-crud {
        height: calc(100vh - 160px);
    }
</style>