import { deviceApi } from '/@/api/devices';
import _ from 'lodash-es';
import { compute, dict } from '@fast-crud/fast-crud';
import { TableDataRow } from '/@/views/iot/devices/model';
import { ElMessage } from 'element-plus';
import { formatToDateTime } from '/@/utils/dateUtil';
import dayjs from 'dayjs';
// eslint-disable-next-line no-unused-vars
export const createDevicePropsCrudOptions = function ({ expose }, deviceId, state) {
	const deviceId_param = deviceId;
	let records: any[] = [];
	const FsButton = {
		link: true,
	};
	const customSwitchComponent = {
		activeColor: 'var(--el-color-primary)',
		inactiveColor: 'var(el-switch-of-color)',
	};
	const pageRequest = async (query) => {
		const res = await deviceApi().getDeviceAttributes(deviceId_param);
		records = res.data.map((x) => {
			var _dataTime = '';
			if (x.dateTime) {
				_dataTime=dayjs.tz(x.dateTime, 'Asia/Shanghai').add(8, 'hour').format('YYYY-MM-DD HH:mm:ss')
			} else {
				_dataTime='';
			}

			if (x.dataType == 'DateTime') {
				if (x.value) {
					return {
						keyName: x.keyName,
						dataType: x.dataType,
						dateTime: _dataTime,
						value: dayjs.tz(x.value, 'Asia/Shanghai').add(8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
					};
				} else {
					return { keyName: x.keyName, dataType: x.dataType, dateTime: _dataTime, value: x.value };
				}
			} else {
				return { keyName: x.keyName, dataType: x.dataType, dateTime: _dataTime, value: x.value};
			}
		});

		return {
			records,
			currentPage: 0,
			pageSize: records.length,
			total: records.length,
		};
	};
	const delRequest = async ({ row }) => {
		try {
			await deviceApi().removeDeviceAttributes(deviceId, row);
			_.remove(records, (item: TableDataRow) => {
				return item.id === row.id;
			});
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};

	const addRequest = async ({ form }) => {
		try {
			form.deviceId = deviceId;
			form.value = null;
			await deviceApi().addDeviceAttributes(deviceId, form);
			records.push(form);
			return form;
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};
	return {
		deviceId,
		crudOptions: {
			actionbar: {
				buttons: {
					add: {
						show: true,
					},
					custom: {
						text: 'Property modification', //parameters of fs-button component
						show: true, //Whether to display this button
						type: 'primary',
						click() {
							state.currentPageState = 'editprop';
						}, //Click event, open the add dialog box by default
					},
				},
			},
			request: {
				pageRequest,
				addRequest,
				delRequest,
			},
			table: {
				border: false,
			},
			form: {
				labelWidth: '130px', //
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
					remove: {
						icon: 'Delete',
						...FsButton,
						order: 5,
					}, //Delete button
				},
			},
			columns: {
				keyName: {
					title: 'Attribute name',
					type: 'text',
					column: {
						width: 260,
					},
				},
				value: {
					title: 'value',
					column: {
						width: 158,
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
				dataSide: {
					title: 'data side',
					type: 'dict-select',
					dict: dict({
						data: [
							{ value: 'AnySide', label: 'AnySide', color: 'warning' },
							{ value: 'ClientSide', label: 'ClientSide' },
							{ value: 'ServerSide', label: 'ServerSide', color: 'info' },
						],
					}),
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: false,
						component: customSwitchComponent,
					},
				},
				dateTime: {
					title: 'Time',
					type: 'text',
					column: {
						width: 158,
						formatter(context) {
							return formatToDateTime(context.value);
						},
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
