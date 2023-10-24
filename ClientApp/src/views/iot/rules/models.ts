//Define the interface to define the type of object
export interface NodeListState {
    id: string | number;
    nodeId: string | undefined;
    nodeclass: HTMLElement | string;
    left: number | string;
    top: number | string;
    icon: string;
    name: string;
    nodetype?: string;
    nodenamespace?: string;
    mata?: string;
    content?: string;
    color: string; //Node background color
}
export interface LineListState {
    sourceId: string;
    targetId: string;
    label: string;
    condition?: string;
    linename?: string;
    lineId: string;  
    linenamespace:string;
}
export interface XyState {
    x: string | number;
    y: string | number;
}
export interface FlowState {
    ruleName?: string | any;
    flowid?: string | any;
    // workflowRightRef: HTMLDivElement | null;
    // leftNavRefs: any[];
    leftNavList: any[];
    dropdownNode: XyState;
    dropdownLine: XyState;
    isShow: boolean;
    jsPlumb: any;
    jsPlumbNodeIndex: null | number;
    jsplumbDefaults: any;
    jsplumbMakeSource: any;
    jsplumbMakeTarget: any;
    jsplumbConnect: any;
    jsplumbData: {
        nodeList: Array<NodeListState>;
        lineList: Array<LineListState>;
    };
}
