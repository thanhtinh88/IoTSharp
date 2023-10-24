<template>
    <div class="z-crud">
        <fs-crud ref="crudRef" v-bind="crudBinding" v-if="state.currentPageState === 'listprop'" />

        <div v-if="state.currentPageState === 'editprop'">

            <propform :device-id="props.deviceId" @close="propformclose" @submit="propformsubmit"></propform>
        </div>
    </div>
</template>

<script setup lang="ts">
    import propform from "./propform.vue";
    import { useCrud } from "@fast-crud/fast-crud";
    import { useExpose } from "@fast-crud/fast-crud";
    import { createDevicePropsCrudOptions } from "/@/views/iot/devices/detail/devicePropsCrudOptions";
    import { constant } from "lodash";
    const props = defineProps({
        deviceId: {
            type: String,
            default: ''
        }
    })


    const state = reactive({
        currentPageState: 'listprop',

    })// ref of crud component
    const crudRef = ref();
    // crud configured ref
    const crudBinding = ref();
    //Exposed method
    const { crudExpose } = useExpose({ crudRef, crudBinding });
    //Your crud configuration
    let { crudOptions } = createDevicePropsCrudOptions({ expose: crudExpose }, props.deviceId, state);
    //Initialize crud configuration
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose: crudExpose, crudOptions });
    // You can call this method to reinitialize the crud configuration
    // resetCrudOptions(options)
    watch(() => props.deviceId, () => {
        // watch deviceId, reconfigure crud according to Device id, and then refresh
        const res = createDevicePropsCrudOptions({ expose: crudExpose }, props.deviceId, state);
        crudOptions = res.crudOptions
        // console.log(`%c@DeviceDetailProps:32`, 'color:white;font-size:16px;background:green;font-weight: bold;', res)
        resetCrudOptions(crudOptions)
        crudExpose.doRefresh();
    })
    // Get the list data after the page is opened
    onMounted(() => {
        crudExpose.doRefresh();

    });
    onActivated(() => {


    });



    const propformsubmit = () => { }
    const propformclose = () => {

        state.currentPageState = 'listprop'
    }
</script>

<style scoped lang="scss">
    .z-crud {
        height: calc(100vh - 160px);
    }
</style>
