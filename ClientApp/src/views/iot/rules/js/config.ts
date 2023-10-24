// jsplumb default configuration
export const jsplumbDefaults = {
    // Multiple anchor points [source anchor point, target anchor point]
    Anchors: [
        'Top',
        'TopCenter',
        'TopRight',
        'TopLeft',
        'Right',
        'RightMiddle',
        'Bottom',
        'BottomCenter',
        'BottomRight',
        'BottomLeft',
        'Left',
        'LeftMiddle',
    ],
    //Container id of the connection
    Container: 'workflow-right',
    //Set the shape of the link line, such as straight line or curve. Anchor can set the position of the anchor point. Optional value "<Bezier|Flowchart|StateMachine|Straight>"
    Connector: ['Bezier', { curviness: 100 }],
    // Whether the node can be disconnected by dragging it with the mouse, the default is true. You can use the mouse to link a connection, or you can use the mouse to drag it to disconnect it. Set to false to allow dragging without automatically disconnecting.
    ConnectionsDetachable: false,
    //Nodes are not deleted when deleting lines
    DeleteEndpointsOnDetach: false,
    // Will be used whenever an Endpoint is added or otherwise created and jsPlumb has not yet given any explicit Endpoint definition
    Endpoint: ['Blank', { Overlays: '' }],
    //Default appearance of the source and target endpoints in the connection
    EndpointStyle: { fill: '#1879ffa1', outlineWidth: 1 },
    // Whether jsPlumb's internal logging is turned on
    LogEnabled: true,
    //Default appearance of the connector
    PaintStyle: {
        stroke: '#BFB6DC',
        strokeWidth: 2,
        outlineStroke: 'transparent',
        outlineWidth: 10,
    },
    // Default options for configuring any draggable element jsPlumb.draggable
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    // Default overlay added to connectors and endpoints. Deprecated: Starting in 4.x, this feature will not be supported. Not all overlays can be connected to connectors and endpoints.
    Overlays: [
        [
            'Arrow',
            {
                width: 10, // width of arrow tail
                length: 8, //The distance from the tail to the head of the arrow
                location: 1, // Location, it is recommended to use a value between 0 and 1
                direction: 1, // Direction, the default value is 1 (meaning forward), optional -1 (meaning backward)
                foldback: 0.623, // foldback, which is the angle of the tail, defaults to 0.623, when it is 1, it is a right triangle
            },
        ],
        [
            'Label',
            {
                label: '',
                location: 0.5,
                cssClass: 'aLabel',
            },
        ],
    ],
    //Default rendering mode svg, canvas
    RenderMode: 'svg',
    //Default appearance of connections in hover state
    HoverPaintStyle: { stroke: '#b0b2b5', strokeWidth: 1 },
    //Default appearance of endpoints in hover state
    EndpointHoverStyle: { fill: 'red' },
    //Default scope for endpoints and connections. Scopes provide basic control over which endpoints can connect to which other endpoints
    Scope: 'jsPlumb_DefaultScope',
};

//The entire node serves as source or target
export const jsplumbMakeSource = {
    //Set the class name that can be dragged and dropped. As long as the mouse moves to the DOM on the class name, the connection can be dragged and dropped.
    filter: '.workflow-icon-drag',
    filterExclude: false,
    anchor: 'Continuous',
    // Whether to allow myself to connect to myself
    allowLoopback: false,
    maxConnections: -1,
};

//The entire node serves as source or target
export const jsplumbMakeTarget = {
    filter: '.workflow-icon-drag',
    filterExclude: false,
    // Whether to allow myself to connect to myself
    anchor: 'Continuous',
    allowLoopback: true,
    dropOptions: { hoverClass: 'ef-drop-hover' },
};

//Connection parameters
export const jsplumbConnect = {
    isSource: true,
    isTarget: true,
    // Dynamic anchor point, provides 4 directions Continuous, AutoDefault
    anchor: 'Continuous',
};