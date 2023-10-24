<template>
    <div class="z-crud">
        <fs-crud ref="crudRef" v-bind="crudBinding" />
    </div>
</template>

<script setup lang="ts">
    import { useCrud } from "@fast-crud/fast-crud";
    import { useExpose } from "@fast-crud/fast-crud";
    import { createDeviceTelemetryRealtimeCrudOptions } from "/@/views/iot/devices/detail/deviceTelemetryRealtimeCrudOptions";
    import { getCurrentInstance } from "vue";
    const { proxy } = <any>getCurrentInstance();
    const state = reactive({
        currentPageState: 'realtime',
        telemetryKeys: []
    })
    const props = defineProps({
        deviceId: {
            type: String,
            default: ''
        }
    })
    // ref of crud component
    const crudRef = ref();
    // crud configured ref
    const crudBinding = ref();
    //Exposed method
    const { crudExpose } = useExpose({ crudRef, crudBinding });
    //Your crud configuration
    let { crudOptions } = createDeviceTelemetryRealtimeCrudOptions({ expose: crudExpose }, props.deviceId, state);
    //Initialize crud configuration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose: crudExpose, crudOptions });
    // You can call this method to reinitialize the crud configuration
    // resetCrudOptions(options)
    watch(() => props.deviceId, () => {
        // watch deviceId, reconfigure crud according to Device id, and then refresh
        const res = createDeviceTelemetryRealtimeCrudOptions({ expose: crudExpose }, props.deviceId, state);
        crudOptions = res.crudOptions
        resetCrudOptions(crudOptions)
        crudExpose.doRefresh();
    })
    // Get the list data after the page is opened
    onMounted(() => {
        crudExpose.doRefresh();
        proxy.mittBus.on('updateTelemetryPageSate', (pageSateName) => {
            state.currentPageState = pageSateName
        });
    });
    onUnmounted(() => {
        proxy.mittBus.off('updateTelemetryPageSate', () => {
        });
    })

</script>

<style scoped lang="scss">
    .z-crud {
        height: calc(100vh - 160px);
    }
</style>
