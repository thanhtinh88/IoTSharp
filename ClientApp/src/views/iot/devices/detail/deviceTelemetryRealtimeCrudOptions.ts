import { deviceApi } from '/@/api/devices';
import { dateUtil, formatToDateTime } from '/@/utils/dateUtil';
import { compute, dict } from '@fast-crud/fast-crud';
// eslint-disable-next-line no-unused-vars
export const createDeviceTelemetryRealtimeCrudOptions = function ({ expose }, deviceId, state) {
	const deviceId_param = deviceId;
	let records: any[] = [];
	const FsButton = {
		link: true,
	};
	const formatColumnDataTime = (row, column, cellValue, index) => {
		return formatToDateTime(row.value);
	};
	const pageRequest = async (query) => {
		const res = await deviceApi().getDeviceLatestTelemetry(deviceId_param);



		state.telemetryKeys = res.data.filter((x) => typeof x.value === 'number').map((c) => c.keyName); // DeviceDetailTelemetry component status, to be passed to the telemetry history component
		records = res.data;
		return {
			total:records.length,
			pageSize:records.length,
			currentPage:0,
			records,
		};
	};
	return {
		deviceId,
		crudOptions: {
			actionbar: {
				buttons: {
					add: {
						show: false,
					},
				},
			},
			request: {
				pageRequest,
			},
			table: {
				border: false,
			},
			form: {
				labelWidth: '130px', 
			},
			search: {
				show: false,
			},
			toolbar: {
				buttons: {
					search: {
						show: false,
					},
				},
			},
			pagination: {
				show: false,
			},
			rowHandle: {
				width: 100,
				show: false,
				dropdown: {
					more: {
						//More button configurations
						text: 'property',
						...FsButton,
						icon: 'operation',
					},
				},
				buttons: {
					view: { show: false },
					edit: { show: false },
					remove: { show: false }, //Delete button
				},
			},
			columns: {
				keyName: {
					title: 'Attribute name',
					type: 'text',
					column: {
						width: 260,
					},
				}, value: {
					title: 'value',
					type: 'text',
					column: {

						formatter(context) {
							if (context.row.dataType === 'DateTime') {
								return formatToDateTime(context.value);
							} else {
								//Solve the problem of not displaying the value if it is false
								if (context.value || context.value == false) {
									return context.value.toString();
								}
								return '';
							}
						},

					},
					addForm: {
						show: false,
					},
					editForm: {
						show: false,
					},
				},
				dataType: {
					title: 'data type',
					type: 'dict-select',
					dict: dict({
						data: [
							{ value: 'Boolean', label: 'Boolean' },
							{ value: 'String', label: 'String' },
							{ value: 'Long', label: 'Long' },
							{ value: 'Double', label: 'Double' },
							{ value: 'Json', label: 'Json' },
							{ value: 'XML', label: 'XML' },
							{ value: 'Binary', label: 'Binary' },
							{ value: 'DateTime', label: 'DateTime' },
						],
					}),
				},
				dateTime: {
					title: 'Time',
					type: 'text',
					column: {
						formatter: formatColumnDataTime,
					},
					addForm: {
						show: false,
					},
					editForm: {
						show: false,
					},
				},

			},
		},
	};
};
