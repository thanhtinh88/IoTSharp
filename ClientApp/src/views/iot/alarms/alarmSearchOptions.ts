export const alarmStatusOptions = [
    {
        value: '-1',
        label: 'all',
    },
    {
        value: '0',
        label: 'Activation Unanswered',
    },
    {
        value: '1',
        label: 'Activation answered',
    },
    {
        value: '2',
        label: 'Clear unanswered',
    },
    {
        value: '3',
        label: 'Clear answered',
    },
];

export const serverityOptions = [
    {
        value: '-1',
        label: 'all',
    },
    {
        value: '0',
        label: 'uncertain',
    },
    {
        value: '1',
        label: 'warning',
    },
    {
        value: '2',
        label: 'Secondary',
    },
    {
        value: '3',
        label: 'Important',
    },
    {
        value: '4',
        label: 'error',
    },
];

export const originatorTypeOptions = [
    {
        value: '-1',
        label: 'all',
        key: 'All',
    },
    {
        value: '0',
        label: 'Unknown',
        key: 'Unknown',
    },
    {
        value: '1',
        label: 'equipment',
        key: 'Device',
    },
    {
        value: '2',
        label: 'gateway',
        key: 'Gateway',
    },
    {
        value: '3',
        label: 'Asset',
        key: 'Asset',
    },
];

export const serverityBadge = new Map([
    ['Indeterminate', { text: 'Undetermined', color: 'var(--el-color-info)' }],
    ['Warning', { text: 'Warning', color: 'var(--el-color-warning)' }],
    ['Minor', { text: 'Minor', color: 'var(--el-color-primary)' }],
    ['Major', { text: 'Major', color: 'var(--el-color-primary-dark-2)' }],
    ['Critical', { text: 'Error', color: 'var(--el-color-error)' }],
]);

export const alarmStatusTAG = new Map([
    ['Active_UnAck', { text: 'Active UnAck', color: 'var(--el-color-error)' }],
    ['Active_Ack', { text: 'Active Answered', color: 'var(--el-color-primary)' }],
    ['Cleared_UnAck', { text: 'Clear UnAck', color: 'var(--el-color-warning)' }],
    ['Cleared_Act', { text: 'Cleared Answered', color: 'var(--el-color-success)' }],
]);

export const originatorTypeTAG = new Map([
    ['Unknow', { text: 'Unknown', color: 'var(--el-color-info)' }],
    ['Device', { text: 'Device', color: 'var(--el-color-primary)' }],
    ['Gateway', { text: 'Gateway', color: 'var(--el-color-warning)' }],
    ['Asset', { text: 'Asset', color: 'var(--el-color-success)' }],
]);