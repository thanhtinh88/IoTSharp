<template>
    <div>
        <el-form ref="tableRulesRef" :model="state.tableData" size="small">
            <el-table :data="props.modelValue.node.bizdata.mappings" table-layout="auto">
                <el-table-column v-for="(item, index) in state.tableData.header" :key="index" show-overflow-tooltip
                                 :prop="item.prop" :width="item.width" :label="item.label">
                    <!-- <template v-slot:header>
                      <span v-if="item.isRequired" class="color-danger">*</span>
                      <span class="pl5">{{ item.label }}</span>
                      <el-tooltip
                        v-if="item.isTooltip"
                        effect="dark"
                        content="这是tooltip"
                        placement="top"
                      >
                        <i class="iconfont icon-quanxian" />
                      </el-tooltip>
                    </template> -->
                    <template v-slot="scope">
                        <el-form-item style="margin: 0" :prop="`data.${scope.$index}.${item.prop}`" :rules="[
{
required: item.isRequired,
message: 'cannot be empty',
trigger: `${item.type}` == 'input' ? 'blur' : 'change',
},
]">


                            <el-input-number v-if="item.type === 'number'" v-model="scope.row[item.prop]" />
                            <el-switch v-if="item.type === 'switch'" v-model="scope.row[item.prop]" />

                            <el-select v-if="item.type === 'select' && item.prop == 'dataType'"
                                       v-model="scope.row[item.prop]" placeholder="Please select">
                                <el-option v-for="sel in state.tableData.datatypes" :key="sel.id" :label="sel.label"
                                           :value="sel.value" />
                            </el-select>


                            <el-select v-if="item.type === 'select' && item.prop == 'dataCatalog'"
                                       v-model="scope.row[item.prop]" placeholder="Please select">
                                <el-option v-for="sel in state.tableData.datacatalogs" :key="sel.id" :label="sel.label"
                                           :value="sel.value" />
                            </el-select>

                            <el-select v-if="item.type === 'select' && item.prop == 'funCode'"
                                       v-model="scope.row[item.prop]" placeholder="Please select">
                                <el-option v-for="sel in state.tableData.funcodes" :key="sel.id" :label="sel.label"
                                           :value="sel.value" />
                            </el-select>
                            <el-date-picker v-else-if="item.type === 'date'" v-model="scope.row[item.prop]" type="date"
                                            placeholder="Select date" style="width: 100%" />
                            <el-input v-else-if="item.type === 'input'" v-model="scope.row[item.prop]"
                                      placeholder="Please enter content" />
                            <el-input v-else-if="item.type === 'dialog'" v-model="scope.row[item.prop]" readonly
                                      placeholder="Please enter content">
                                <template v-slot:suffix>
                                    <i class="iconfont icon-shouye_dongtaihui" />
                                </template>
                            </el-input>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column>
                    <template #default="scope">
                        <el-button text type="primary" @click.prevent="deleterow(scope.row)">
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <el-row class="flex mt15">
            <div class="flex-margin">
                <!-- <el-button size="default" type="success" @click="onValidate">Validation</el-button> -->
                <el-button size="default" type="primary" @click="onAddRow">Add</el-button>
                <el-button size="default" type="primary" @click="save">Save</el-button>
            </div>
        </el-row>


    </div>
</template>

<script lang="ts" setup>
    import { reactive, ref } from "vue";
    import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
    import { ElMessage } from "element-plus";
    import { datacatalogs, datatypes, funcodes } from "../../models/constants";
    import { modbusmapping } from "../../models/modbusmapping";
    interface TableHeader {
        prop: string;
        width: string | number;
        label: string;
        isRequired?: boolean;
        isTooltip?: boolean;
        type: string;
    }

    const props = defineProps({
        modelValue: {
            type: Object,
            default: {},
        },

    });

    interface TableRulesState {
        deviceid: string;
        drawer: boolean;
        dialogtitle: string;
        tableData: {
            data: Array<modbusmapping>;
            header: TableHeader[];
            datatypes: any[];
            datacatalogs: any[];
            funcodes: any[];
        };
    }




    const emit = defineEmits(["close", "submit", "change"]);
    const tableRulesRef = ref();

    const state = reactive<TableRulesState>({
        deviceid: "",
        drawer: false,
        dialogtitle: "ModBus point modification",
        tableData: {
            data: props.modelValue.node.bizdata.mappings,
            header: [
                {
                    prop: "code",
                    width: "",
                    label: "Slave station number",
                    isRequired: false,
                    type: "number",
                },

                {
                    prop: "dataName",
                    width: "",
                    label: "Collection item name",
                    isRequired: false,
                    type: "input",
                },
                {
                    prop: "dataType",
                    width: "",
                    label: "data type",
                    isRequired: false,
                    type: "select",
                },

                {
                    prop: "dataCatalog",
                    width: "",
                    label: "data classification",
                    isRequired: false,
                    type: "select",
                },
                {
                    prop: "funCode",
                    width: "",
                    label: "function",
                    isRequired: false,
                    type: "select",
                },
                {
                    prop: "address",
                    width: "",
                    label: "Register Address",
                    isRequired: false,
                    type: "number",
                },
                {
                    prop: "length",
                    width: "",
                    label: "Number of registers",
                    isRequired: false,
                    type: "number",
                },
                {
                    prop: "dataFormat",
                    width: "90px",
                    label: "data format",
                    isRequired: false,
                    type: "input",
                },
                {
                    prop: "codePage",
                    width: "",
                    label: "String encoding",
                    isRequired: false,
                    type: "number",
                },

            ],
            datatypes: [...funcodes.values()],
            datacatalogs: [...datatypes.values()],
            funcodes: [...datacatalogs.values()],
        },
    });



    onMounted(async () => {

    });
    const openDialog = (deviceid: string) => {
        state.deviceid = deviceid;
        state.drawer = true;
    };



    // watch(state.tableData.data, (data) => {

    // })

    //Close pop-up window
    const closeDialog = () => {
        state.drawer = false;
    };

    // verify
    const onValidate = () => {
        if (state.tableData.data.length <= 0) return ElMessage.warning("Please click to add a row first");
        tableRulesRef.value.validate((valid: any) => {
            if (!valid) return ElMessage.warning("Form items are required but not filled in");
            ElMessage.success("All verification passed");
        });
    };

    //Add a new line
    const onAddRow = () => {
        props.modelValue.node.bizdata.mappings.push({
            _id: uuidv4(),
            id: NIL_UUID,
            code: 0,
            dataName: "",
            dataType: "",
            dataCatalog: "",
            funCode: "",
            address: 0,
            length: 0,
            dataFormat: "",
            codepage: 0,

        })
    };
    const deleterow = (row: modbusmapping) => {
        props.modelValue.node.bizdata.mappings = props.modelValue.node.bizdata.mappings.filter((c) => c._id !== row._id)
    };
    const save = async () => {
        emit("submit", {
            namespace: 'modbuslistchanged',
            data: props.modelValue,
        });
    };


    const loaddata = () => {

    }

    defineExpose({
        openDialog, loaddata,
    });
</script>
