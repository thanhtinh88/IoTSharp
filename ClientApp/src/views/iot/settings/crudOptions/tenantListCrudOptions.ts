import { tenantApi } from '/@/api/tenants';
import _ from 'lodash-es';
import { useRouter } from 'vue-router';
import { TableDataRow } from '../model/tenantListModel';
import { ElMessage } from 'element-plus';
export const createTenantListCrudOptions = function ({ expose }) {
	let records: any[] = [];
	const router = useRouter();
	const FsButton = {
		link: true,
	};
	const customSwitchComponent = {
		activeColor: 'var(--el-color-primary)',
		inactiveColor: 'var(el-switch-of-color)',
	};
	const pageRequest = async (query) => {
		let {
			form: { name },
			page: { currentPage: currentPage, pageSize: limit },
		} = query;
		let offset = currentPage === 1 ? 0 : currentPage - 1;
		const res = await tenantApi().tenantList({ name, limit, offset });
		return {
			records: res.data.rows,
			currentPage: currentPage,
			pageSize: limit,
			total: res.data.total,
		};
	};
	const editRequest = async ({ form, row }) => {
		form.id = row.id;
		try {
			await tenantApi().puttenant(form);
			return form;
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};
	const delRequest = async ({ row }) => {
		try {
			await tenantApi().deletetenant(row.id);
			_.remove(records, (item: TableDataRow) => {
				return item.id === row.id;
			});
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};

	const addRequest = async ({ form }) => {
		try {
			await tenantApi().posttenant(form);
			records.push(form);
			return form;
		} catch (e) {
			ElMessage.error(e.response.msg);
		}
	};
	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				delRequest,
				editRequest,
			},
			table: {
				border: false,
			},
			form: {
				labelWidth: '80px', //
			},
			search: {
				show: true,
			},
			rowHandle: {
				width: 250,
				scope: 'id',
				buttons: {
					view: {
						icon: 'View',
						show: false,
						...FsButton,
					},
					edit: {
						icon: 'EditPen',
						...FsButton,
						order: 2,
					},
					custom: {
						text: 'Customer Management',
						title: 'Customer Management',
						icon: 'User',
						order: 1,
						type: 'info',
						...FsButton,
						click: (e) => {
							router.push({
								path: '/iot/settings/customerlist',
								query: {
									id: e.row.id,
								},
							});
						},
					},
					remove: {
						icon: 'Delete',
						order: 3,
						...FsButton,
					},
				},
			},
			columns: {
				name: {
					title: 'name',
					type: 'text',
					column: { width: 200 },
					search: { show: true },
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				email: {
					title: 'Mail',
					type: 'text',
					column: { width: 180 },
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				phone: {
					title: 'Telephone',
					column: { width: 150 },
					type: 'text',
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				country: {
					title: 'Country',
					column: { width: 80 },
					type: 'text',
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				province: {
					title: 'province',
					type: 'text',
					column: { width: 80 },
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				city: {
					title: 'city',
					type: 'text',
					column: { width: 100 },
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				street: {
					title: 'street',
					column: { width: 180 },
					type: 'text',
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				address: {
					title: 'address',
					column: { width: 180 },
					type: 'text',
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
				zipCode: {
					title: 'Postcode',
					column: { width: 150 },
					type: 'text',
					addForm: {
						show: true,
						component: customSwitchComponent,
					},
					editForm: {
						show: true,
						component: customSwitchComponent,
					},
				},
			},
		},
	};
};
