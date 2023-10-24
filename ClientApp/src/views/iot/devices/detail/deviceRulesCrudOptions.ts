import { deviceApi } from '/@/api/devices';
import _ from 'lodash-es';
import { dict } from '@fast-crud/fast-crud';
import { TableDataRow } from '/@/views/iot/devices/model';
import { ElMessage } from 'element-plus';
import { ruleApi } from '/@/api/flows';
// eslint-disable-next-line no-unused-vars
export const createDeviceRulesCrudOptions = function ({ expose }, deviceId) {
	let records: any[] = [];
	let rulesDict = [];

	const FsButton = {
		link: true,
	};

	const pageRequest = async () => {
		const res = await deviceApi().getDeviceRules(deviceId);
		records = res.data;
		return {
			records,
			currentPage: 1,
			pageSize: res.data.length,
			total: res.data.length,
		};
	};
	const delRequest = async ({ row }) => {
		try {
			await deviceApi().deleteDeviceRules(deviceId, row.ruleId);
			_.remove(records, (item: TableDataRow) => {
				return item.id === row.id;
			});
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};

	const addRequest = async ({ form }) => {
		try {
			await deviceApi().setDeviceRules(deviceId, form.ruleId);
			records.push(form);
			return form;
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};
	const getRulesDict = async () => {
		try {
			const res = await ruleApi().ruleList({ limit: 100 });
			rulesDict = res.data.rows;
			return res.data.rows;
		} catch (e) {
			ElMessage.error(e.response);
		}
	};

	return {
		deviceId,
		crudOptions: {
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
				ruleId: {
					title: 'Rule name',
					type: 'dict-select',
					dict: dict({
						cloneable: true,
						value: 'ruleId',
						label: 'name',
						async getData() {
							return getRulesDict();
						},
					}),
					addForm: {
						component: {
							dict: dict({
								cloneable: true,
								value: 'ruleId',
								label: 'name',
								async getData() {
									return getRulesDict();
								},
							}),
						},
					},
				},
				ruleDesc: {
					title: 'Remarks',
					type: 'text',
					addForm: {
						show: false,
					},
				},
			},
		},
	};
};
