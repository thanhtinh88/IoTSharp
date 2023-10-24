<template>
    <div>
        <el-drawer v-model="state.drawer" :title="state.dialogtitle" size="100%">

            <el-form ref="tableRulesRef" :model="state.tableData" size="small">
                <el-table :data="state.tableData.data" border table-layout="auto">
                    <el-table-column v-for="(item, index) in state.tableData.header"
                                     :key="index"
                                     show-overflow-tooltip
                                     :prop="item.prop"
                                     :width="item.width"
                                     :label="item.label">
                        <!-- <template v-slot:header>
                          <span v-if="item.isRequired" class="color-danger">*</span>
                          <span class="pl5">{{ item.label }}</span>
                          <el-tooltip
                            v-if="item.isTooltip"
                            effect="dark"
                            content="This is tooltip"
                            placement="top"
                          >
                            <i class="iconfont icon-quanxian" />
                          </el-tooltip>
                        </template> -->
                        <template v-slot="scope">
                            <el-form-item style="margin: 0"
                                          :prop="`data.${scope.$index}.${item.prop}`"
                                          :rules="[
                     {
                       required: item.isRequired,
                       message: 'cannot be empty',
                       trigger: `${item.type}` == 'input' ? 'blur' : 'change',
                     },
                   ]">
                                <el-switch v-if="item.type === 'switch'" v-model="scope.row[item.prop]" />

                                <el-select v-if="item.type === 'select'"
                                           v-model="scope.row[item.prop]"
                                           placeholder="Please select">
                                    <el-option v-for="sel in state.tableData.datatypes"
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
import { reactive, ref } from "vue";
import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
import { ElMessage } from "element-plus";

import { editProduceDictionary, getProduceDictionary } from "/@/api/produce";
interface TableHeader {
  prop: string;
  width: string | number;
  label: string;
  isRequired?: boolean;
  isTooltip?: boolean;
  type: string;
}
interface TableRulesState {
  deviceid: string;
  drawer: boolean;
  dialogtitle: string;
  tableData: {
    data: dictrowitem[];
    header: TableHeader[];
    datatypes: any[];
  };
}

interface dictrowitem {
  _id?: string;
  id?: string;
  keyName?: string;
  displayName?: string;
  unit?: string;
  unitExpression?: string;
  unitConvert?: boolean;
  keyDesc?: string;
  defaultValue?: string;
  display?: boolean;
  place0?: string;
  tag?: string;
  dataType?: string;
}const emit = defineEmits(["close", "submit"]);
const tableRulesRef = ref();
const state = reactive<TableRulesState>({
   deviceid: "",
   drawer: false,
   dialogtitle: "Product Dictionary Modification",
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
         prop: "displayName",
         width: "",
         label: "Field display name",
         isRequired: false,
         type: "input",
       },
       {
         prop: "unit",
         width: "",
         label: "unit",
         isRequired: false,
         type: "input",
       },

       {
         prop: "unitExpression",
         width: "",
         label: "Unit conversion expression",
         isRequired: false,
         type: "input",
       },
       {
         prop: "unitConvert",
         width: "",
         label: "UnitConvert",
         isRequired: false,
         type: "switch",
       },
       {
         prop: "keyDesc",
         width: "",
         label: "Field remarks",
         isRequired: false,
         type: "input",
       },
       {
         prop: "defaultValue",
         width: "",
         label: "default value",
         isRequired: false,
         type: "input",
       },
       {
         prop: "display",
         width: "90px",
         label: "Whether to display",
         isRequired: false,
         type: "switch",
       },
       {
         prop: "place0",
         width: "",
         label: "location name",
         isRequired: false,
         type: "input",
       },
       { prop: "tag", width: "", label: "Tag", isRequired: true, type: "input" },
       {
         prop: "dataType",
         width: "",
         label: "data type",
         isRequired: false,
         type: "select",
       },
     ],
    datatypes: [
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
});

const openDialog = (deviceid: string) => {
  state.deviceid = deviceid;
  getProduceDictionary(deviceid).then((x) => {
    state.tableData.data = x.data.map((x) => {
      return {
        _id: uuidv4(),
        id: x.id,
        keyName: x.keyName,
        displayName: x.displayName,
        unit: x.unit,
        unitExpression: x.unitExpression,
        unitConvert: x.unitConvert,
        keyDesc: x.keyDesc,
        defaultValue: x.defaultValue,
        display: x.display,
        place0: x.place0,
        tag: x.tag,
        dataType: x.dataType,
      };
    });
  });

  state.drawer = true;
};//Close pop-up window
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
     _id: uuidv4(),
     id:NIL_UUID,
     keyName: "",
     displayName: "",
     unit: "",
     unitExpression: "",
     unitConvert: false,
     keyDesc: "",
     defaultValue: "",
     display: false,
     place0: "",
     tag: "",
     dataType: "",
   });
};
const deleterow = (row: dictrowitem) => {
   state.tableData.data = state.tableData.data.filter((c) => c._id !== row._id);
};
const save = async () => {
   var result = await editProduceDictionary({
     produceId: state.deviceid,
     produceDictionaryData: state.tableData.data,
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
});
</script>
