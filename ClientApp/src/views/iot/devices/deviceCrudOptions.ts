import { deviceApi } from '/@/api/devices';
import _ from 'lodash-es';
import { compute, dict } from '@fast-crud/fast-crud';
import { TableDataRow } from '/@/views/iot/devices/model';
import dayjs from 'dayjs';

// eslint-disable-next-line no-unused-vars
export const createDeviceCrudOptions = function ({ expose }, customerId, deviceDetailRef?, addRulesRef?, selectedItems?) {



	let records: any[] = [];
	const FsButton = {
		link: true,
	};
	const customSwitchComponent = {
		activeColor: 'var(--el-color-primary)',
		inactiveColor: 'var(el-switch-of-color)',
	};

	const onSelectionChange = (changed) => {
		selectedItems.value = changed.map((item) => item);
	};
	const pageRequest = async (query) => {
		const params = reactive({
			offset: query.page.currentPage - 1,
			limit: query.page.pageSize,
			onlyActive: query.form.active ?? false,
			customerId,
			name: query.form.name ?? '',
		});

		const res = await deviceApi().devcieList(params);
		records = res.data.rows;
		return {
			records,
			currentPage: params.offset + 1,
			pageSize: params.limit,
			total: res.data.total,
		};
	};
	const editRequest = async ({ form, row }) => {
		const newItem = _.clone(form);
		newItem.id = row.id;
		const target = _.find(records, (item: TableDataRow) => {
			return row.id === item.id;
		});
		try {
			await deviceApi().putdevcie(newItem);
			_.merge(target, form);
			return target;
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};
	const delRequest = async ({ row }) => {
		try {
			await deviceApi().deletedevcie(row.id);
			_.remove(records, (item: TableDataRow) => {
				return item.id === row.id;
			});
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};

	const addRequest = async ({ form }) => {
		await deviceApi().postdevcie(form);
		records.push(form);
		return form;
	};
	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},

			// search: {
			// 	...FsButton,
			// 	show: true,
			// 	doSearch(query) {

			// 	},
			// },

			pagination: {
				'page-sizes': [10, 20, 30, 40, 100, 250],
			},

			table: {
				border: false,
				onSelectionChange,
			},
			form: {
				labelWidth: '130px', //
			},
			rowHandle: {
				width: 180,
				dropdown: {
					more: {
						//More button configurations
						text: 'property',
						...FsButton,
						icon: 'operation',
					},
				},

				buttons: {
					view: {
						show: false,
					},
					edit: {
						icon: 'editPen',
						...FsButton,
						order: 1,
					}, //Edit button
					remove: {
						icon: 'Delete',
						...FsButton,
						order: 5,
					}, //Delete button
				},
			},
			columns: {
				$checked: {
					title: 'Select',
					form: { show: false },
					column: {
						type: 'selection',
						align: 'center',
						width: '55px',
						columnSetDisabled: false, //Disable selection in column settings
						selectable(row, index) {
							return true;
						},
					},
				},
				name: {
					title: 'Device name',
					type: 'button',
					search: { show: true },
					column: {
						component: {
							...FsButton,
							type: 'primary',
							on: {
								onClick({ row }) {
									deviceDetailRef.value.openDialog(row);
								},
							},
						},
					},
				},
				deviceType: {
					title: 'Device type',
					type: 'dict-select',
					search: { show: false },
					dict: dict({
						data: [
							{ value: 'Gateway', label: 'Gateway' },
							{ value: 'Device', label: 'Device', color: 'warning' },
						],
					}),

					column: { width: '80px' },
				},

				active: {
					title: 'Activity status',
					type: 'dict-switch',
					search: { show: true },
					dict: dict({
						data: [
							{ value: true, label: 'Activity' },
							{ value: false, label: 'silent', color: 'danger' },
						],
					}),
					column: { width: '80px' },
					viewForm: {
						show: true,
						component: customSwitchComponent,
					},
					addForm: {
						show: false,
						component: customSwitchComponent,
					},
					editForm: {
						show: false,
						component: customSwitchComponent,
					},
				},
				lastActivityDateTime: {
					title: 'Last activity time',
					type: 'datetime',

					column: {
						formatter: (context) => {
							if (context.value) {
								return dayjs.tz(context.value, "Asia/Shanghai").add(8, 'hour').format('YYYY-MM-DD HH:mm:ss');
							} else {
								return '';
							}

						},
						show: false,
					},
					search: { show: false },
					addForm: {
						show: false,
					},
					editForm: {
						show: false,
					},
				},
				identityType: {
					title: 'Authentication method',
					type: 'dict-select',
					search: { show: false },
					column: { width: '120px' },
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
					search: { show: false },
					column: {
						show: false,
					},
					viewForm: {
						show: false,
					},
					addForm: {
						show: false,
					},
					editForm: {
						show: false,
					},
				},
				timeout: {
					column: {
						show: false,
					},
					title: 'Timeout',
					form: {
						value: 300,
					},
					type: 'text',
					search: { show: false },
				},
			},
		},
	};
};
