<template>
    <div>
        <el-drawer v-model="state.drawer" :title="state.dialogtitle" size="100%">
            <el-form ref="tableRulesRef" :model="state.tableData" size="small">
                <el-table :data="state.tableData.data" border table-layout="auto">
                    <el-table-column v-for="(item, index) in state.tableData.header"
                                     :key="index"
                                     :prop="item.prop"
                                     :width="item.width"
                                     :label="item.label">
                        <template v-slot="scope">
                            <el-form-item style="margin: 0px"
                                          :prop="`data.${scope.$index}.${item.prop}`">
                                <el-switch v-if="item.type === 'switch'" v-model="scope.row[item.prop]" />

                                <el-select v-if="item.type === 'select'"
                                           v-model="scope.row[item.prop]"
                                           placeholder="Please select">
                                    <el-option v-for="sel in item.enmus"
                                               :key="sel.id"
                                               :label="sel.label"
                                               :value="sel.value" />
                                </el-select>
                                <el-date-picker v-else-if="item.type === 'date'"
                                                v-model="scope.row[item.prop]"
                                                type="date"
                                                placeholder="Select date"
                                                style="width: 100%" />
                                <el-input v-else-if="item.type === 'input'"
                                          v-model="scope.row[item.prop]"
                                          placeholder="Please enter content" />
                                <el-input v-else-if="item.type === 'dialog'"
                                          v-model="scope.row[item.prop]"
                                          readonly
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
        </el-drawer>
    </div>
</template>

<script lang="ts" setup>
import { defineComponent, toRefs, reactive, ref } from "vue";
import { ElMessage } from "element-plus";

import { editProduceData, getProduceData } from "/@/api/produce";
import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
interface TableHeader {
  prop: string;
  width: string | number;
  label: string;
  isRequired?: boolean;
  isTooltip?: boolean;
  type: string;
  enmus?: any[];
}
interface TableRulesState {
  deviceid: string;
  drawer: boolean;
  dialogtitle: string;
  tableData: {
    data: dictrowitem[];
    header: TableHeader[];
  };
}

interface dictrowitem {
  id?: string;
  keyName?: string;
  dataSide?: string;
  type?: string;
}
const emit = defineEmits(["close", "submit"]);
const tableRulesRef = ref();
    const state = reactive<TableRulesState>({
        deviceid: "",
        drawer: false,
        dialogtitle: "Product Attribute Modification",
        tableData: {
            data: [],
            header: [
                {
                    prop: "keyName",
                    width: "",
                    label: "field name",
                    isRequired: false,
                    type: "input",
                },
                {
                    prop: "type",
                    width: "",
                    label: "data type",
                    isRequired: false,
                    type: "select",
                    enmus: [
                        { value: "Boolean", label: "Boolean" },
                        { value: "String", label: "String" },
                        { value: "Long", label: "Long" },
                        { value: "Double", label: "Double" },
                        { value: "Json", label: "Json" },
                        { value: "XML", label: "XML" },
                        { value: "Binary", label: "Binary" },
                        { value: "DateTime", label: "DateTime" },
                    ],
                },
                {
                    prop: "dataSide",
                    width: "",
                    label: "data side",
                    isRequired: false,
                    type: "select",
                    enmus: [
                        { value: "AnySide", label: "AnySide" },
                        { value: "ServerSide", label: "ServerSide" },
                        { value: "ClientSide", label: "ClientSide" },
                    ],
                },
            ],
        },
    });

    const openDialog = (deviceid: string) => {
        state.deviceid = deviceid;
        getProduceData(deviceid).then((x) => {
            console.log(x.data);
            state.tableData.data = x.data.map((x) => {
                return { id: uuidv4(), keyName: x.keyName, dataSide: x.dataSide, type: x.type };
            });
        });

        state.drawer = true;
    };
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
  state.tableData.data.push({
    id: uuidv4(),
    keyName: "",
    dataSide: "",
    type: "",
  });
};
const deleterow = (row: dictrowitem) => {
  state.tableData.data = state.tableData.data.filter((c) => c.id !== row.id);
    }; const save = async () => {
        var result = await editProduceData({
            produceId: state.deviceid,
            produceData: state.tableData.data,
        });
        if (result["code"] === 10000) {
            ElMessage.success("Modification successful");
            state.drawer = false;
            emit("close", state.tableData.data);
        } else {
            ElMessage.warning("Modification failed:" + result["msg"]);
            emit("close", state.tableData.data);
        }
    };

defineExpose({
  openDialog,
  closeDialog,
});
</script>
