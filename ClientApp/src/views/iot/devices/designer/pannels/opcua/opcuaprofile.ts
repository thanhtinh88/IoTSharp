import { opcuamapping } from "../../models/opcuamapping";
export const opcuaprofile = {
    devnamespace: 'opcua',
    name: 'opcua gateway',
    shape: 'gateway',
    baseinfoschema: {},
    command: {

        toolbar: [],
        contextmenu: [
            { command: 'deletegateway', txt: "delete", icon: "ele-Delete" },
            { command: 'editopcuaprop', txt: "edit properties", icon: "ele-Edit" },
            { command: 'editopcuamapping', txt: "Edit Mapping", icon: "ele-Edit" },
        ]
    },
    mappings: []
}