import { modbusmapping } from "../../models/modbusmapping";
import { v4 as uuidv4, NIL as NIL_UUID } from "uuid";
export const modbusprofile = {
    devnamespace: 'modbus',
    name: 'ModBus Gateway',
    shape: 'gateway',
    baseinfoschema: {},
    command: {

        toolbar: [],
        contextmenu: [
            { command: 'deletegateway', txt: "delete", icon: "ele-Delete" },
            { command: 'editmodbusprop', txt: "Edit properties", icon: "ele-Edit" },
            { command: 'editmodbusmapping', txt: "Edit Mapping", icon: "ele-Edit" },
        ],
    },
    mappings: []
}