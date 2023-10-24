<template>
  <div class="system-list-container">
      <el-card shadow="hover">
          <div class="system-dept-search ">
              <el-form size="default" label-width="100px">
                  <el-row :gutter="35">
                      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                          <el-form-item label="product name">
                              <el-input v-model="query.name" placeholder="Please enter the product name" />
                          </el-form-item>
                      </el-col>
                  </el-row>
                  <el-row :gutter="35">
                      <el-col :span="8">
                          <el-button size="default" type="success" style="margin-left: 100px;" @click="creatprod()"
                                     icon="FolderAdd">
                              Add new product
                          </el-button>
                      </el-col> <el-col :span="10"></el-col>
                      <el-col :span="6" justify="end" style="text-align: end;">
                          <el-button size="default" type="primary" @click="getData()">
                              <el-icon>
                                  <ele-Search />
                              </el-icon>
                              Inquire
                          </el-button>
                          <el-button size="default" type="primary" @click="getData()">
                              <el-icon>
                                  <ele-Search />
                              </el-icon>
                              reset
                          </el-button>
                      </el-col>
                  </el-row>
              </el-form>
          </div>

          <div class="system-dept-search">





          </div>

          <el-table :data="state.tableData.rows" style="width: 100%" row-key="id">
              <el-table-column type="expand">
                  <template #default="props">
                      <el-table :data="props.row.devices">
                          <el-table-column label="Device name" prop="name" />
                          <el-table-column label="DeviceType" prop="deviceType">
                              <template #default="scope">
                                  <el-tag v-if="scope.row.deviceType==='Gateway'">Gateway</el-tag>
                                  <el-tag type="warning" v-if="scope.row.deviceType==='Device'">Device</el-tag>
                              </template>
                          </el-table-column>
                          <el-table-column label="timeout" prop="timeout" />
                      </el-table>
                  </template>
              </el-table-column>

              <el-table-column v-if="false" prop="id" label="id" show-overflow-tooltip></el-table-column>

              <el-table-column prop="name" label="Product Name" show-overflow-tooltip>
                  <template #default="scope">
                      <el-tag v-if="scope.row.defaultDeviceType==='Gateway'">Gateway</el-tag>
                      <el-tag type="warning" v-if="scope.row.defaultDeviceType==='Device'">Device</el-tag>
                  </template>
              </el-table-column>

              <el-table-column prop="defaultIdentityType" label="Authentication method" show-overflow-tooltip></el-table-column>
              <el-table-column prop="defaultTimeout" label="Timeout" show-overflow-tooltip></el-table-column>
              <el-table-column prop="description" label="Remarks" show-overflow-tooltip></el-table-column>
              <el-table-column prop="endDateTime" label="status" show-overflow-tooltip></el-table-column>

              <el-table-column label="Operation" show-overflow-tooltip width="300">
                  <template #default="scope">
                      <el-button size="small" text type="primary" @click.prevent="editprod(scope.row)">

                          <el-icon>
                              <Edit />
                          </el-icon>Modify
                      </el-button>

                      <el-button size="small" text type="primary" @click.prevent="deleteprod(scope.row)">
                          <el-icon>
                              <Delete />
                          </el-icon>Delete
                      </el-button>

                      &nbsp;
                      <el-dropdown size="small" @command="
                                   (command)=>
                          {
                          dropdownCommand(scope.row, command);
                          }
                          ">
                          <el-button type="primary" size="small" text>
                              More<el-icon class="el-icon--right"><arrow-down /></el-icon>
                          </el-button>
                          <template #dropdown>
                              <el-dropdown-menu>
                                  <el-dropdown-item command="prop">
                                      <el-icon>
                                          <Operation />
                                      </el-icon>attribute
                                  </el-dropdown-item>
                                  <el-dropdown-item command="dict">
                                      <el-icon>
                                          <DocumentCopy />
                                      </el-icon>Dictionary
                                  </el-dropdown-item>
                                  <el-dropdown-item command="createdev">
                                      <el-icon>
                                          <Plus />
                                      </el-icon>Create device
                                  </el-dropdown-item>
                                  <el-dropdown-item command="managedev">Manage device</el-dropdown-item>
                              </el-dropdown-menu>
                          </template>
                      </el-dropdown>
                  </template>
              </el-table-column>
          </el-table>
          <el-pagination @size-change="onHandleSizeChange" @current-change="onHandleCurrentChange" class="mt15"
                         :pager-count="5" :page-sizes="[10, 20, 30]" v-model:current-page="state.tableData.param.pageNum" background
                         v-model:page-size="state.tableData.param.pageSize" layout="total, sizes, prev, pager, next, jumper"
                         :total="state.tableData.total">
          </el-pagination>
      </el-card>
    <produceform ref="produceformRef" @close="close" @submit="submit" />
    <producedatadictionaryform ref="producedatadictionaryformRef" @submit="submit" @close="close" />
    <producepropform ref="producepropformRef" @close="close" @submit="submit" />
    <deviceform ref="deviceformRef" @close="close" @submit="submit"></deviceform>
  </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive, onMounted, defineComponent } from "vue";
import {
  ElMessageBox,
  ElMessage,
  ElButton,
  ElCard,
  ElIcon,
  ElInput,
  ElPagination,
  ElTable,
  ElTableColumn,
} from "element-plus";
import { useRouter } from "vue-router";
import produceform from "./produceform.vue";
import deviceform from "./deviceform.vue";
import producepropform from "./producepropform.vue";
import producedatadictionaryform from "./producedatadictionaryform.vue";
import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
import { Session } from "/@/utils/storage";
import { getProduceList, deleteProduce } from "/@/api/produce";
import { appmessage } from "/@/api/iapiresult";
//Define the interface to define the type of object
interface TableDataRow {
  id?: string;
  name?: string;
  defaultIdentityType?: string;
  defaultTimeout?: string;
  description?: string;
  devices?: Array<SubTableDataRow>;
}
interface SubTableDataRow {
  id?: string;
  name?: string;
  deviceType?: string;
  timeout?: string;
}
interface TableDataState {
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
const produceformRef = ref();
const deviceformRef = ref();
const producedatadictionaryformRef = ref();
const producepropformRef = ref();
const propformRef = ref();
const userInfos = Session.get("userInfo");
const router = useRouter();
const state = reactive<TableDataState>({
  tableData: {
    rows: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 20,
    },
  },
});
const query = reactive({
  name: "",
});
const onHandleSizeChange = (val: number) => {
  state.tableData.param.pageSize = val;
  getData();
};
//Page changes
const onHandleCurrentChange = (val: number) => {
  state.tableData.param.pageNum = val;
  getData();
};
const getData = () => {
  getProduceList({
    offset: state.tableData.param.pageNum - 1,
    limit: state.tableData.param.pageSize,
    name: "",
  }).then((res) => {
    state.tableData.rows = res.data.rows;
    state.tableData.total = res.data.total;
  });
};
//Initialize table data
const initTableData = () => {
  getData();
};
onMounted(() => {
  initTableData();
});
const close = ({ sender: string, args: any }) => {
  getData();
};
const submit = ({ sender: string, args: any }) => {
  getData();
};
const dropdownCommand = (row: any, command: string) => {
  switch (command) {
    case "dict":
      editdict(row);
      break;
    case "createdev":
      creatdevice(row);
      break;
    case "managedev":
      navtodevice(row);
      break;
    case "prop":
      editprop(row);
      break;
  }
};
const creatprod = () => {
  //  propformRef.value.openDialog("11c12dfe-8b37-4ddb-805a-00ba802259eb");
  produceformRef.value.openDialog(NIL_UUID);
};
const editprod = (row: TableDataRow) => {
  produceformRef.value.openDialog(row.id);
};
const editprop = (row: TableDataRow) => {
  producepropformRef.value.openDialog(row.id);
};
const editdict = (row: TableDataRow) => {
  producedatadictionaryformRef.value.openDialog(row.id);
};
const creatdevice = (row: TableDataRow) => {
  deviceformRef.value.openDialog(row.id);
};
const navtodevice = (row: TableDataRow) => {
  router.push({
    path: "/iot/devices/devicelist",
  });
};

const deleteprod = async (row: TableDataRow) => {
   ElMessageBox.confirm("Are you sure you want to delete this product?", "Warning", {
     confirmButtonText: "OK",
     cancelButtonText: "Cancel",
     type: "warning",
   })
     .then(async () => {
       var result = await deleteProduce(row.id ?? "");
       if (result["code"] === 10000) {
         ElMessage.success("Deletion successful");
         getData();
       } else {
         ElMessage.warning("Deletion failed:" + result["msg"]);
       }
     })
     .catch(() => { });
};
</script>
<style lang="scss" >
    .system-list-container {
        .el-table__expanded-cell {
            padding: 0 5%;
        }
    }
</style>