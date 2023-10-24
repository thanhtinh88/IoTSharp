<template>
    <div class="system-list-container">
        <el-card shadow="hover">
            <div class="system-dept-search mb15">
                <el-input size="default"
                          placeholder="Please enter the device name"
                          style="max-width: 180px"
                          v-model="query.name">
                </el-input>
                <el-switch v-model="query.onlyActive"
                           size="large"
                           active-text="Only show online"
                           inactive-text="all" />
                <el-button size="default" type="primary" class="ml10" @click="getData()">
                    <el-icon>
                        <ele-Search />
                    </el-icon>
                    Inquire
                </el-button>
                <el-button size="default"
                           type="success"
                           @click="create('0000000-0000-0000-0000-000000000000')"
                           class="ml10">
                    <el-icon>
                        <ele-FolderAdd />
                    </el-icon>
                    Add new device
                </el-button>
            </div>

            <el-table :data="state.tableData.rows" style="width: 100%" row-key="id" @row-click="rowOnClick">
                <el-table-column prop="name" label="Device Name" show-overflow-tooltip>
                    <template #default="scope">
                        <el-link type="primary" :underline="false">{{ scope.row.name }}</el-link>
                    </template>
                </el-table-column>

                <el-table-column prop="deviceType"
                                 label="device type"
                                 show-overflow-tooltip></el-table-column>

                <el-table-column prop="active"
                                 label="online status"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column prop="lastActivityDateTime"
                                 label="Last activity time"
                                 show-overflow-tooltip></el-table-column>

                <el-table-column prop="active"
                                 label="Authentication method"
                                 show-overflow-tooltip></el-table-column>

                <el-table-column label="Operation" show-overflow-tooltip width="140">
                    <template #default="scope">
                        <el-button size="small" text type="primary" @click.prevent="create(scope.row.id)">
                            Modify
                        </el-button>
                        <el-button size="small" text type="primary" @click.prevent="onTabelRowDel(scope.row)">
                            Delete
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- Paging -->
            <el-pagination @size-change="onHandleSizeChange"
                           @current-change="onHandleCurrentChange"
                           class="mt15"
                           :pager-count="5"
                           :page-sizes="[10, 20, 30]"
                           v-model:current-page="state.tableData.param.pageNum"
                           background
                           v-model:page-size="state.tableData.param.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="state.tableData.total">
            </el-pagination>
        </el-card>
        <DeviceDetail ref="deviceDetailRef"></DeviceDetail>
        <AddDevice ref="addFormRef" />

    </div>
</template>

<script lang="ts" setup>
import {ElMessageBox, ElMessage} from "element-plus";
import AddDevice from "./AddDevice.vue";
import {deviceApi} from "/@/api/devices";
import {Session} from "/@/utils/storage";
import {appmessage} from "/@/api/iapiresult";
import {TableDataRow, TableDataState} from "/@/views/iot/devices/model";
import DeviceDetail from "/@/views/iot/devices/DeviceDetail.vue";


const deviceDetailRef = ref();
const testRef = ref();
const addFormRef = ref();
const userInfos = Session.get("userInfo");

const state = reactive<TableDataState>({
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
  onlyActive: false,
  customerId: userInfos.customer.id,
  name: "",
});
    //Initialize table data
const initTableData = () => {
   getData();
};

//Delete current row
const onTabelRowDel = (row: TableDataRow) => {
   ElMessageBox.confirm(`This operation will permanently delete the device: ${row.name}, do you want to continue?`, "Prompt", {
     confirmButtonText: "Delete",
     cancelButtonText: "Cancel",
     type: "warning",
   })
       .then(() => {
         return deviceApi().deletedevcie(row.id!);
       })
       .then((res: appmessage<boolean>) => {
         if (res.code === 10000 && res.data) {
           ElMessage.success("Deletion successful");
           getData();
         } else {
           ElMessage.warning("Deletion failed:" + res.msg);
         }
       })
       .catch(() => {
       });
};

const create = (id: string) => {
   addFormRef.value.openDialog(id);
};

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
   deviceApi()
       .devcieList(query)
       .then((res) => {
         state.tableData.rows = res.data.rows;
         state.tableData.total = res.data.total;
       });
};
//When the page loads
onMounted(() => {
   // console.log(`%c@devicelist:185`, 'color:white;font-size:16px;background:green;font-weight: bold;', deviceDetailRef.value!)
   initTableData();
});
//When a row is clicked
const rowOnClick = (row: any, column: any, event: any) => {
   if (column.property == 'name') {
     deviceDetailRef.value.openDialog(row);
   }
}
</script>
<style scoped lang="scss">
:deep(.el-table__row) {
   .el-table__cell:first-child {
     cursor: pointer;
   }
}
</style>
