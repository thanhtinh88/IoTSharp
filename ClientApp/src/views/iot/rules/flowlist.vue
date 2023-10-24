<template>
    <div class="system-list-container">
        <el-card shadow="hover" v-if="state.viewstate === 'list'">
            <div class="system-dept-search mb15">
                <el-input size="default" placeholder="Please enter the rule name" style="max-width: 180px" v-model="query.name">
                </el-input>

                <el-button size="default" type="primary" class="ml10" @click="getData()">
                    <el-icon>
                        <ele-Search />
                    </el-icon>
                    Inquire
                </el-button>
                <el-button size="default" type="success" @click="create()" class="ml10">
                    <el-icon>
                        <ele-FolderAdd />
                    </el-icon>
                    Add new rule
                </el-button>
            </div>
            <el-table :data="state.tableData.rows" style="width: 100%" row-key="ruleId" table-layout="auto"
                      @expand-change="expandchange">


                <el-table-column type="expand">
                    <template #default="props">
                        <el-table :data="props.row.flows">
                            <el-table-column label="node name" prop="flowname" />
                            <el-table-column label="type" prop="flowType" />
                            <el-table-column label="executor" prop="nodeProcessClass" />
                            <el-table-column label="Script Type" prop="nodeProcessScriptType" />

                        </el-table>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="Rule name" show-overflow-tooltip>
                </el-table-column>

                <el-table-column prop="mountType" label="mount type" show-overflow-tooltip>
                    <template #default="scope">
                        <el-tag effect="dark" size="small" type="info" class="mx-1"
                                :color="mountTypes.get(scope.row.mountType)?.color" disable-transitions>
                            {{
                   mountTypes.get(scope.row.mountType)?.text
                            }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="creatTime" label="Creation Time" show-overflow-tooltip></el-table-column>



                <el-table-column label="Operation" show-overflow-tooltip>
                    <template #default="scope">
                        <el-button size="small" text type="primary" icon="Edit" @click="edit(scope.row.ruleId)">Edit</el-button>
                        <el-button size="small" text type="success" icon="Memo" @click="design(scope.row.ruleId)">Design</el-button>
                        <el-button size="small" text icon="DocumentChecked" @click="simulator(scope.row.ruleId)">Test</el-button>
                        <el-button size="small" text type="danger" icon="Delete" @click="onTabelRowDel(scope.row)">Delete</el-button>

                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" class="mt15"
                           :pager-count="5" :page-sizes="[10, 20, 30]" v-model:current-page="state.tableData.param.pageNum" background
                           v-model:page-size="state.tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="state.tableData.total">
            </el-pagination>
        </el-card>


        <addflow ref="addformRef" @close="close" @submit="submit" />
        <flowdesigner v-if="state.viewstate === 'designer'" :ruleId="state.currentruleId" @close="ondesignerclose">
        </flowdesigner>
        <flowsimulator v-if="state.viewstate === 'simulator'" :ruleId="state.currentruleId" @close="onsimulatorclose"></flowsimulator>
    </div>

</template>

<script lang="ts" setup>
import { ElMessageBox, ElMessage, getPositionDataWithUnit } from "element-plus";
import { ref, reactive, onMounted, defineComponent } from "vue";
import addflow from "./addflow.vue";
import flowdesigner from "./flowdesigner.vue";
import flowsimulator from "./flowsimulator.vue";
import { ruleApi } from "/@/api/flows";
import { Session } from "/@/utils/storage";
import { appmessage } from "/@/api/iapiresult";
import { useRouter } from "vue-router";
import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
//Define the interface to define the type of object
interface TableDataRow {
  ruleId?: string;
  creatTime?: string;
  createId?: string;
  mountType?: string;
  name?: string;
  parentRuleId?: string;
  ruleDesc?: string;
  creator?: string;
  ruleType?: string;
  flows?: Array<SubTableDataRow>

}
interface SubTableDataRow {
  flowId?: string;
  createDate?: string;
  flowType?: string;
  nodeProcessClass?: string;
  nodeProcessScript?: string;
  nodeProcessScriptType?: string;
  nodeProcessType?: string;
  conditionexpression?: string;

}

interface TableDataState {
  currentruleId: string;
  viewstate: string;
  tableData: {
    rows: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
    };
  };
}

const mountTypes = new Map([
  ["None", { text: "None", color: "#b1b3b8" }],
["RAW", { text: "raw data", color: "#d3adf7" }],
["Telemetry", { text: "Telemetry", color: "#79bbff" }],
["Attribute", { text: "Attribute", color: "#b3e19d" }],
["RPC", { text: "Remote Control", color: "#1890ff" }],
["Connected", { text: "Online", color: "#79bbff" }],
["Disconnected", { text: "Offline", color: "#ffa940" }],
["TelemetryArray", { text: "Telemetry Array", color: "#2f54eb" }],
["Alarm", { text: "Alarm", color: "#F56C6C" }],
["DeleteDevice", { text: "Delete Device", color: "#fa541c" }],
["CreateDevice", { text: "Create Device", color: "#08979c" }],
["Activity", { text: "Activity event", color: "#7cb305" }],
["Inactivity", { text: "Inactivity", color: "#ffa940" }],
]);


const addformRef = ref();
const userInfos = Session.get("userInfo");
const router = useRouter();
const state = reactive<TableDataState>({
  currentruleId: "08dada8f-b042-4163-867c-4e97cccd745e",
  viewstate: 'list',
  tableData: {
    rows: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
    },
  },
});

const query = reactive({
  offset: state.tableData.param.pageNum - 1,
  limit: state.tableData.param.pageSize,
  name: "",
});

//Initialize table data
const initTableData = () => {
  getData();
};

const close = () => {
  getData();
};
const submit = () => {
  getData();
};
const ondesignerclose = () => {
  state.viewstate = 'list'
};
const onsimulatorclose = () => {
  state.viewstate = 'list'
};




//Delete current row
const onTabelRowDel = (row: TableDataRow) => {
   ElMessageBox.confirm(`This operation will permanently delete the rule: ${row.name}, do you want to continue?`, "Prompt", {
     confirmButtonText: "Delete",
     cancelButtonText: "Cancel",
     type: "warning",
   })
     .then(() => {
       return ruleApi().deleterule(row.ruleId!);
     })
     .then((res: appmessage<boolean>) => {
       if (res.code === 10000 && res.data) {
         ElMessage.success("Deletion successful");
         getData();
       } else {
         ElMessage.warning("Deletion failed:" + res.msg);
       }
     })
     .catch(() => { });
};

const design = (id: string) => {
  state.viewstate = 'designer';
  state.currentruleId = id;


  // router.push({
  //   path: "/iot/rules/flowdesigner",
  //   query: {
  //     id: id,
  //   },
  // });
};

const simulator = (id: string) => {

  state.currentruleId = id;
  state.viewstate = 'simulator';
  // router.push({
  //   path: "/iot/rules/flowsimulator",
  //   query: {
  //     id: id,
  //   },
  // });
};

const edit = (id: string) => {
  addformRef.value.openDialog(id);
};
const create = () => {
  addformRef.value.openDialog(NIL_UUID);
};

const onHandleSizeChange = (val: number) => {
  query.limit = val;
  getData();
};
//Page changes
const onHandleCurrentChange = (val: number) => {
  query.offset = val - 1;
  getData();
};

const getData = () => {
  ruleApi()
    .ruleList(query)
    .then((res) => {
      state.tableData.rows = res.data.rows;
      state.tableData.total = res.data.total;
    });
};



const expandchange = async (row: TableDataRow, expanded: Array<TableDataRow>

) => {

  if (expanded.length > 0 && row.ruleId) {
    var result = await ruleApi().getFlows(row.ruleId)
    row.flows = result.data;
  }

}
//When the page loads
onMounted(() => {
  initTableData();
});
</script>
