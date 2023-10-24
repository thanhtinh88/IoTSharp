export const funcodes = new Map(
    [
        ['ReadCoils', { label: 'Read Coils', value: 1 }],
        ['ReadDiscreteInputs', { label: 'Read discrete inputs', value: 2 }],
        ['ReadMultipleHoldingRegisters', { label: 'Read holding registers', value: 3 }],
        ['ReadInputRegisters', { label: 'Read input registers', value: 4 }],
        ['WriteSingleCoil', { label: 'Write a single coil', value: 5 }],
        ['WriteSingleHoldingRegister', { label: 'Write single holding register', value: 6 }],
        ['WriteMultipleCoils', { label: 'Write multiple coils', value: 15 }],
        ['WriteMultipleHoldingRegisters', { label: 'Write multiple holding registers', value: 16 }],
    ],
);


export const datatypes = new Map(
    [
        ['Boolean', { label: 'logical', value: 0 }],
        ['String', { label: 'string', value: 1 }],
        ['Long', { label: 'integer', value: 2 }],
        ['Double', { label: 'Floating point number', value: 3 }],
        ['DateTime', { label: 'time', value: 4 }],
    ]
);
export const datacatalogs = new Map(
    [
        ['AttributeData', { label: 'AttributeData', value: 0 }],
        ['TelemetryData', { label: 'Telemetry Data', value: 1 }],

    ]
);
