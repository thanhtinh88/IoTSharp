import { dict } from '@fast-crud/fast-crud';

export const deviceDetailBaseInfoColumns = {
    name: {
        title: 'Device name',
        type: 'button',
    },
    deviceType: {
        title: 'Device type',
        type: 'dict-select',
        dict: dict({
            data: [
                { value: 'Gateway', label: 'Gateway' },
                { value: 'Device', label: 'Device', color: 'warning' },
            ],
        }),
    },

    active: {
        title: 'Activity status',
        type: 'dict-switch',
        dict: dict({
            data: [
                { value: true, label: 'Activity' },
                { value: false, label: 'silent', color: 'danger' },
            ],
        }),
    },
    lastActivityDateTime: {
        title: 'Last activity time',
        type: 'text',
    },
    identityType: {
        title: 'Authentication method',
        type: 'dict-select',
        dict: dict({
            data: [
                { value: 'AccessToken', label: 'AccessToken' },
                { value: 'X509Certificate', label: 'X509Certificate' },
            ],
        }),
    },
    identityId: {
        title: 'Token',
        type: 'text',
    },
    timeout: {
        title: 'Timeout',
        type: 'text',
    },
};