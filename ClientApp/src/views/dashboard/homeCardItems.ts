import deviceIcon from '~icons/carbon/iot-platform'
import telemetry from '~icons/carbon/ibm-cloud-pak-data'
import event from '~icons/carbon/ibm-cloud-event-streams'
import warning from '~icons/ic/round-warning'
import userIcon from '~icons/ic/baseline-supervisor-account'
import product from '~icons/ic/outline-category'
import rule from '~icons/carbon/flow-modeler'
import assets from '~icons/ic/outline-devices-other'

export const homeCardItemsConfig = [
    {
        zValue: '-1',
        zKey: 'All devices',
        icon: deviceIcon,
        iconBackgroundColor: '#4945FF',
    },
    {
        zValue: '-1',
        zKey: 'online',
        icon: deviceIcon,
        iconBackgroundColor: '#10b981',
    },
    {
        zValue: '-1',
        zKey: "Today's attribute",
        icon: telemetry,
        iconBackgroundColor: '#002766',
    },
    {
        zValue: '-1',
        zKey: "Today's event",
        icon: event,
        iconBackgroundColor: '#0050B3',
    },
    {
        zValue: '-1',
        zKey: 'Alarm device',
        icon: warning,
        iconBackgroundColor: '#FA9D14',
    },
    {
        zValue: '-1',
        zKey: 'user',
        icon: userIcon,
        iconBackgroundColor: '#0091FF',
    },
    {
        zValue: '-1',
        zKey: 'product',
        icon: product,
        iconBackgroundColor: '#32C5FF',
    },
    {
        zValue: '-1',
        zKey: 'Rule',
        icon: rule,
        iconBackgroundColor: '#6DD400',
    },
];
