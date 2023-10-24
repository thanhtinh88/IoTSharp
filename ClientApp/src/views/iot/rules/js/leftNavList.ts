import {ruleApi} from "/@/api/flows";
import importIcon from '~icons/mdi/import'
import stopIcon from '~icons/mdi/stop'
import uploadIcon from '~icons/mdi/upload'
import bellRingIcon from '~icons/mdi/bell-ring'
import attrIcon from '~icons/mdi/format-list-bulleted-triangle'
import telemetry from '~icons/carbon/ibm-cloud-pak-data'
import deviceIcon from '~icons/carbon/iot-platform'
import message from "~icons/ic/baseline-message"
import js from "~icons/logos/javascript"
import py from "~icons/logos/python"
import pgsql from "~icons/logos/postgresql"
import lua from "~icons/logos/lua"
import csharp from "~icons/logos/c-sharp"

export const customIcons = {
    importIcon,
    stopIcon,
    uploadIcon,
    bellRingIcon,
    attrIcon,
    telemetry,
    deviceIcon,
    message,
    js,
    py,
    pgsql,
    lua,
    csharp
}

const excuterIconMap = {
    'PublishAlarmDataTask': 'bellRingIcon',
    'PublishAttributeDataTask': 'attrIcon',
    'PublishTelemetryDataTask': 'telemetry',
    'AlarmPullExcutor': 'bellRingIcon',
    'CustomeAlarmPullExcutor': 'bellRingIcon',
    'DeviceActionExcutor': 'deviceIcon',
    'MessagePullExecutor': 'message',
    'RangerCheckExcutor': 'attrIcon',
    'TelemetryArrayPullExcutor': 'telemetry',
}

export interface LeftNavItem {
    title: string,
    icon: any,
    isOpen: boolean,
    color: string,
    id: string,
    children: LeftNavItemChild[],
}

export interface LeftNavItemChild {
    icon: any;
    name: string;
    id: string;
    nodetype: string;
    nodenamespace: string;
    mata: string;
}

const leftNavList: LeftNavItem[] = [
    {
        title: "Basic",
        icon: "iconfont icon-shouye",
        color: '#F1F0FF',
        isOpen: true,
        id: "1",
        children: [
            {
                icon: 'importIcon',
                name: "start",
                nodetype: "basic",
                nodenamespace: "bpmn:StartEvent",
                mata: "begin",
                id: "begin",
            },
            {
                icon: 'stopIcon',
                nodetype: "basic",
                nodenamespace: "bpmn:EndEvent",
                mata: "end",
                name: "End",
                id: "end",
            },
        ],
    },
    {
        color: '#E6F7FF',
        title: "executor",
        icon: "iconfont icon-shouye",
        isOpen: true,
        id: "1",
        children: [],
    },
    {
        color: '#FFFFE6',
        title: "Script",
        icon: "iconfont icon-shouye",
        isOpen: true,
        id: "1",
        children: [



            {
                icon: 'js',
                name: "javascript",
                id: "javascript",
                nodetype: "script",
                nodenamespace: 'bpmn:Task',
                mata: "javascript",
            },
            {
                icon: 'py',
                name: "python",
                id: "python",
                nodetype: "script",
                nodenamespace: 'bpmn:Task',
                mata: "python",
            },
            {
                icon: 'pgsql',
                name: "sql",
                id: "sql",
                nodetype: "script",
                nodenamespace: 'bpmn:Task',
                mata: "sql",
            },
            {
                icon: 'lua',
                name: "lua",
                id: "lua",
                nodetype: "script",
                nodenamespace: 'bpmn:Task',
                mata: "lua",
            },
            {
                icon: 'csharp',
                name: "csharp",
                id: "csharp",
                nodetype: "script",
                nodenamespace: 'bpmn:Task',
                mata: "csharp",
            },


        ],
    },
];
function getIcon (name:string) {
    let item:any = ''
    Object.entries(excuterIconMap).forEach(([key, value])=> {
        if ( name.toLowerCase().includes(key.toLowerCase())) {
            item = value
            return
        }
    });
    return item
    // return item.value

}
export const getGetLeftNavList = async () => {
    try {
        leftNavList[1].children=[];
        const res = await ruleApi().getexecutors()
        res.data.forEach((item: any) => {
            leftNavList[1].children.push({
                icon: getIcon(item.value),
                name: item.label,
                id: item.label,
                nodetype: "executor",
                nodenamespace: 'bpmn:Task',
                mata: item.value,
            });
        });

        return leftNavList
    } catch (e) {
        console.log(`getGetLeftNavList@leftNavList:121`, e)
    }
}
