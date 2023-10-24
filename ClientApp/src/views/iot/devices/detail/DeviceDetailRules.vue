<template>
    <div class="z-crud">
        <fs-crud ref="crudRef" v-bind="crudBinding" />
    </div>
</template>

<script setup lang="ts">
    import { useCrud } from "@fast-crud/fast-crud";
    import { useExpose } from "@fast-crud/fast-crud";
    import { createDeviceRulesCrudOptions } from "/@/views/iot/devices/detail/deviceRulesCrudOptions";
    import { ruleApi } from "/@/api/flows";

    const props = defineProps({
        deviceId: {
            type: String,
            default: ''
        }
    })// ref of crud component
    const crudRef = ref();
    // crud configured ref
    const crudBinding = ref();
    //Exposed method
    const { crudExpose } = useExpose({ crudRef, crudBinding });
    //Your crud configuration
    let { crudOptions } = createDeviceRulesCrudOptions({ expose: crudExpose }, props.deviceId);
    //Initialize crud configuration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose: crudExpose, crudOptions });
    // You can call this method to reinitialize the crud configuration
    // resetCrudOptions(options)
    watch(() => props.deviceId, () => {
        // watch deviceId, reconfigure crud according to Device id, and then refresh
        const res = createDeviceRulesCrudOptions({ expose: crudExpose }, props.deviceId);
        crudOptions = res.crudOptions
        // console.log(`%c@DeviceDetailProps:32`, 'color:white;font-size:16px;background:green;font-weight: bold;', res)
        resetCrudOptions(crudOptions)
        crudExpose.doRefresh();
    })
    // Get the list data after the page is opened
    onMounted(async () => {
        crudExpose.doRefresh();
    });

</script>

<style scoped lang="scss">
    .z-crud {
        height: calc(100vh - 160px);
    }
</style>
