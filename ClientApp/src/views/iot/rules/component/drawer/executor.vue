<template>
    <div class="workflow-drawer-node">
        <el-tabs type="border-card" v-model="state.tabsActive">
            <!-- Extended form -->
            <el-tab-pane label="Configuration" name="1">
                <el-scrollbar>
                    <monaco :height="state.configheight"
                            :width="state.configwidth"
                            theme="vs-dark"
                            v-model="state.node.content"
                            language="json"
                            selectOnLineNumbers="true"></monaco>
                    <div style="clear:both;"></div>
                    <div class="codeTip">
                        <div>The current executor is: <span style="font-weight:bold;">{{state.node.name}}</span>, corresponding processor: <span style="font-weight:bold; ">{{state.node.mata}}</span></div>
                        <div>Configuration information description (use the data sent from the superior (the superior can use: "Executor for customized alarm push"), push according to the following configuration): </div>
                        <div v-if="state.node.mata=='IoTSharp.TaskActions.AlarmPullExcutor'">
<pre>
{
   "BaseUrl":"http://xxxxx:xxxxxx/",
   "Url":"/xxxxx/xxxxx",
   "Token":"xxxxxxxxxxx"
}
</pre>
                            <p>如：</p>
<pre>
{
   "BaseUrl":"http://www.baidu.com/",
   "Url":"/Devices/GetDevice", //后端会在此基础上拼接 /DeviceId
   "Token":"e10be78ae02f47b09f8fa2212000d153"
}
</pre>
                        </div>
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.PublishAlarmDataTask'">
                            <p>The objects returned by the superior node are as follows</p>
<pre>
if(input.temperature>38){
     output.CreateDateTime="2023-02-20 16:14:00",//can not be passed
     output.OriginatorType="Device" //Device or Gateway
     output.OriginatorName="Modbus" //Can be the device name or device Id
     output.AlarmType="Fever"
     output.AlarmDetail="The body temperature exceeds 38 degrees, please pay attention"
     output.ServerityLevel="Warning" //Reference enumeration: ServerityLevel
     return output;
}
</pre>
                            <!--output.warnDataId="D9F7DB7A-OB6B-4443-9172-FB58A0 /-->
                            <p>That is to say, the object received by this node is:</p>
<pre>
{
    "CreateDateTime":"2023-02-20 16:14:00",//You can not pass it
    "OriginatorType":"Device" //Device or Gateway
    "OriginatorName":"Modbus" //Can be the device name or device ID
    "AlarmType":"Fever" //Alarm type
    "AlarmDetail":"The body temperature exceeds 38 degrees, please pay attention"
    "ServerityLevel":"Warning" //Reference enumeration: ServerityLevel
}
</pre>
                        </div>
                        <!--Property Publisher-->
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.PublishAttributeDataTask'">
                            <p>Publish device attribute information, the data side is: client side attributes</p>
<pre>
[
     {
        "key":"speed",//property name
        "value":"1000" //Attribute value
     },{
        "key":"rate",//property name
        "value":"10.2" //Attribute value
     }
]
</pre>
                        </div>
                        <!--Telemetry data publisher-->
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.PublishTelemetryDataTask'">
                            <p>Publish device telemetry data, the data side is: client side attributes</p>
<pre>
[
     {
        "key":"speed",//property name
        "value":"1000" //Attribute value
     },{
        "key":"rate",//property name
        "value":"10.2" //Attribute value
     }
]
</pre>
                        </div>
                        <!--Executor for customized alarm push-->
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.CustomeAlarmPullExcutor'">
                            <p>The following information is combined in the background to generate data that can be used by the "alarm data publisher", generally as the superior of the "alarm data publisher"</p>
                            <pre>
{
    "Serverity":4,
    "AlarmType":"xxxxx",
    "AlarmDetail":"xxxxxxxxxxx"
}
</pre>
                            <p>For example:</p>
                            <pre>
{
    "Serverity":7,
    "AlarmType":"Fever",
    "AlarmDetail":"The body temperature exceeds 38 degrees, please pay attention"
}
</pre>
                            <p>Special note here: Serverity must be an Int value</p>
                        </div>
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.DeviceActionExcutor'">
                            <p>1. The executor uses the superior data to perform post push according to the configuration information below, and returns the execution results for the next node to use</p>
                            <pre>
{
    "BaseUrl":"http://xxxxx:xxxxxx/",
    "Url":"/xxxxx/xxxxx",
    "Token":"xxxxxxxxxxx"
}
</pre>
                            <p>For example:</p>
<pre>
{
    "BaseUrl":"http://www.baidu.com/",
    "Url":"/Devices/GetDevice", //The backend will splice /DeviceId on this basis
    "Token":"e10be78ae02f47b09f8fa2212000d153"
}
</pre>
                            <p style="margin:4px 0px;"><el-tag type="success">Outgoing</el-tag>The parameters passed to the above address are:</p>
                            <pre>
{
    "sosType":"1",
    "sosContent":"{\"name\":\"Zhang San\",\"age\":\"17\"}"//Parameters passed by superiors
}
</pre>
                            <p>2. The above address needs to be returned in the following content format (success is used as the basis for judgment):</p>
                            <pre>
{
    "success":true,
    "message":"Processed successfully",
    "timestamp":"1202121545",
    "result":"Processed successfully",
    "code":"200"
}
</pre>
                            <p style="margin:4px 0px;">3.1, <el-tag type="warning">Incoming</el-tag> If the above success is true, the node returns the following format content for the next node to use :</p>
                            <pre>
{
    "ExecutionInfo":"{\"success\":true,\"message\":\"Processing successfully\"
                     ,\"timestamp\":\"1202121545\",\"result\":\"Processed successfully\"
                     ,\"code\":\"200\"}",
    "ExecutionStatus":true,
    "DynamicOutput":"{\"name\":\"Zhang San\",\"age\":\"17\"}",
}
</pre>
                            <p>3.2. If the above success is false, the node returns the following format:</p>
                            <pre>
{
    "ExecutionInfo":"{\"success\":false,\"message\":\"An exception occurred during processing and the format is incorrect\"
                     ,\"timestamp\":\"1202121545\",\"result\":\"Processing failed\"
                     ,\"code\":\"500\"}",
    "ExecutionStatus":false,
}
</pre>
                        </div>
                        <!--Executor for message push-->
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.MessagePullExecutor'">
                            <p>1. The executor uses the superior data to perform post push according to the configuration information below, and returns the execution results for the next node to use</p>
                            <pre>
{
    "BaseUrl":"http://xxxxx:xxxxxx/",
    "Url":"/xxxxx/xxxxx",
    "Token":"xxxxxxxxxxx"
}
</pre>
                            <p>For example:</p>
<pre>
{
    "BaseUrl":"http://www.baidu.com/",
    "Url":"/Devices/GetDevice", //The backend will splice /DeviceId on this basis
    "Token":"e10be78ae02f47b09f8fa2212000d153"
}
</pre>
                            <p>Example: If the incoming parameters of the previous node in the flow chart are (the format is an example, other json objects are acceptable):</p>
                            <pre>
{
"UserName": "Zhang San",
"DeviceId": "123GE3423455",
"Age": "18",
"Attr": {
"Spped": 100,
"State": "stop",
"Msg": "Run Stop",
"Time": "20230317"
}
}
</pre>
                            <p style="margin:4px 0px;"><el-tag type="success">Outgoing</el-tag> The backend will convert the above Json object into the following form and then transmit the configured address Parameters, the format is: </p>
                            <pre>
[{
"keyName": "username",
"value": "Zhang San"
}, {
"keyName": "deviceid",
"value": "123GE3423455"
}, {
"keyName": "age",
"value": "18"
}, {
"keyName": "attr",
"value": {
"Spped": 100,
"State": "stop",
"Msg": "Run Stop",
"Time": "20230317"
}
}]
</pre>
                            <p>2. The above address needs to be returned in the following content format (success is used as the basis for judgment):</p>
                            <pre>
{
    "success":true,
    "message":"Processed successfully",
    "timestamp":"1202121545",
    "result":"Processed successfully",
    "code":"200"
}
</pre>
                            <p style="margin:4px 0px;">3.1, <el-tag type="warning">Incoming</el-tag> If the above success is true, the node returns the following format content for the next node to use :</p>
                            <pre>
{
    "ExecutionInfo":"{\"success\":true,\"message\":\"Processing successfully\"
                     ,\"timestamp\":\"1202121545\",\"result\":\"Processed successfully\"
                     ,\"code\":\"200\"}",
    "ExecutionStatus":true,
    "DynamicOutput":"{\"UserName\":\"Zhang San\",\"DeviceId\":\"123GE3423455\",\"Age\":\"18\"
                     ,\"Attr\":{\"Spped\":100,\"State\":\"stop\",\"Msg\":\"Run stop\"
                     ,\"Time\":\"20230317\"}}",
}
</pre>
                            <p>3.2. If the above success is false, the node returns the following format:</p>
                            <pre>
{
    "ExecutionInfo":"{\"success\":false,\"message\":\"An exception occurred during processing and the format is incorrect\"
                     ,\"timestamp\":\"1202121545\",\"result\":\"Processing failed\"
                     ,\"code\":\"500\"}",
    "ExecutionStatus":false,
}
</pre>

                        </div>
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.RangerCheckExcutor'">
                            To be added, an executor for adding range attributes

                        </div>
                        <div v-else-if="state.node.mata=='IoTSharp.TaskActions.TelemetryArrayPullExcutor'">
                            To be added, executor for telemetry array push


                        </div>

                        <!--mata："IoTSharp.TaskActions.AlarmPullExcutor"
       nodenamespace:"bpmn:Task"
       nodetype:"executor"
     name:"Executor for alarm push"-->
                     </div>
                 </el-scrollbar>
             </el-tab-pane>
             <!-- Node editing -->
             <el-tab-pane label="Miscellaneous" name="2">
                 <el-scrollbar>
                     <el-form :model="state.node"
                              :rules="state.nodeRules"
                              ref="nodeFormRef"
                              size="default"
                              label-width="80px"
                              class="pt15 pr15 pb15 pl15">
                         <el-form-item label="data id" prop="id">
                             <el-input v-model="state.node.id"
                                       placeholder="Please enter data id"
                                       clearable
                                       disabled></el-input>
                         </el-form-item>
                         <el-form-item label="node id" prop="nodeId">
                             <el-input v-model="state.node.nodeId"
                                       placeholder="Please enter node id"
                                       clearable
                                       disabled></el-input>
                         </el-form-item>
                         <el-form-item label="type" prop="type">
                             <el-input v-model="state.node.type"
                                       placeholder="Please enter the type"
                                       clearable
                                       disabled></el-input>
                         </el-form-item>
                         <el-form-item label="left coordinate" prop="left">
                             <el-input v-model="state.node.left"
                                       placeholder="Please enter the left coordinate"
                                       clearable
                                       disabled></el-input>
                         </el-form-item>
                         <el-form-item label="top coordinates" prop="top">
                             <el-input v-model="state.node.top"
                                       placeholder="Please enter top coordinates"
                                       clearable
                                       disabled></el-input>
                         </el-form-item>
                         <el-form-item label="icon icon" prop="icon">
                             <el-input v-model="state.node.icon"
                                       placeholder="Please enter icon"
                                       clearable></el-input>
                         </el-form-item>
                         <el-form-item label="name" prop="name">
                             <el-input v-model="state.node.name"
                                       placeholder="Please enter name"
                                       clearable></el-input>
                         </el-form-item>
                         <el-form-item>
                             <el-button class="mb15" @click="onNodeRefresh">
                                 <SvgIcon name="ele-RefreshRight" />
                                 reset
                             </el-button>
                             <el-button type="primary" class="mb15" @click="onNodeSubmit">
                                 <SvgIcon name="ele-Check" />
                                 save
                             </el-button>
                         </el-form-item>
                     </el-form>
                 </el-scrollbar>
             </el-tab-pane>
         </el-tabs>
     </div>
</template>

<script lang="ts" setup>
    import { reactive, toRefs, ref, nextTick, getCurrentInstance, Ref } from "vue";
    import {
        ElButton,
        ElForm,
        ElFormItem,
        ElInput,
        ElMessage,
        ElScrollbar,
        ElTabPane,
        ElTabs,
    } from "element-plus";
    import monaco from "/@/components/monaco/monaco.vue";
    import node from "element-plus/es/components/cascader-panel/src/node";
    //Define the interface to define the type of object
    interface WorkflowDrawerNodeState {
        configwidth: string;
        configheight: string;
        node: nodedata;
        nodeRules: any;
        form: any;
        tabsActive: string;
        loading: {
            extend: boolean;
        };
    }

    interface nodedata {
        id?: string;
        contextMenuClickId?: number;
        content?: string;
        from?: string;
        icon?: string;
        label?: string;
        left?: string;
        mata?: string;
        name?: string;
        nodeId?: string;
        nodeclass?: string;
        nodenamespace?: string;
        nodetype?: string;
        result?: string;
        top?: string;
        type?: string;
    }

    const props = defineProps({
        modelValue: {
            type: Object,
            default: {},
        },
    });

    const emit = defineEmits(["close", "submit"]);
    const { proxy } = <any>getCurrentInstance();
    const nodeFormRef = ref();
    const extendFormRef = ref();
    const chartsMonitorRef = ref();
    const state = reactive<WorkflowDrawerNodeState>({
        configwidth: "100%",
        configheight: "100%",
        node: props.modelValue,
        nodeRules: {
            id: [{ required: true, message: "Please enter the data id", trigger: "blur" }],
            nodeId: [{ required: true, message: "Please enter the node id", trigger: "blur" }],
            type: [{ required: true, message: "Please enter the type", trigger: "blur" }],
            left: [{ required: true, message: "Please enter the left coordinate", trigger: "blur" }],
            top: [{ required: true, message: "Please enter top coordinates", trigger: "blur" }],
            icon: [{ required: true, message: "Please enter the icon icon", trigger: "blur" }],
            name: [{ required: true, message: "Please enter a name", trigger: "blur" }],
        },
        form: {
            module: [],
        },
        tabsActive: "1",
        loading: {
            extend: false,
        },
    });// Get parent component data
    // const getParentData = (data: object) => {
    // state.tabsActive = "1";
    // state.node = data;
    // };

    onMounted(() => { });
    //Node edit-reset
    const onNodeRefresh = () => {
        state.node.icon = "";
        state.node.name = "";
    };
    //Node edit-save
    const onNodeSubmit = () => {
        nodeFormRef.value.validate((valid: boolean) => {
            if (valid) {
                emit("submit", state.node);
                emit("close");
            } else {
                return false;
            }
        });
    };
    watch(
        () => props.modelValue,
        () => {
            console.log(state)
            state.node = props.modelValue
        }
    );


    defineExpose({
        //getParentData,
    });
//Chart visualization-initialization
</script>

<style scoped lang="scss">
.workflow-drawer-node {
  :deep {
    .el-tabs {
      box-shadow: unset;
      border: unset;

      .el-tabs__nav {
        display: flex;
        width: 100%;

        .el-tabs__item {
          flex: 1;
          padding: unset;
          text-align: center;

          &:first-of-type.is-active {
            border-left-color: transparent;
          }

          &:last-of-type.is-active {
            border-right-color: transparent;
          }
        }
      }

      .el-tabs__content {
        padding: 0;
        height: calc(100vh - 90px);

        .el-tab-pane {
          height: 100%;
          .codeTip{
            padding:5px 15px;
            border: 1px solid #eaeaea;
            color: #4a4949;
            margin:8px;
            font-size: 12px;
            clear:both;
            pre{
                background: #1e1e1e;
                color: #c6c6c6;
                padding: 4px;
            }
          }
        }
      }
    }
  }
}
</style>
