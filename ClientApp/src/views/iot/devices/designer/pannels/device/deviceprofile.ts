import { opcuamapping } from "../../models/opcuamapping";
export const deviceprofile = {
    devnamespace: 'iot.device.test',
    shape: 'device',
    name: 'Test Equipment',
    baseinfoschema: {},
    command: {

        toolbar: [],
        contextmenu: [
            { command: 'deletegateway', txt: "delete", icon: "ele-Delete" },
            { command: 'editmodbusmapping', txt: "edit", icon: "ele-Edit" },
        ]
    },
    mappings: []
}