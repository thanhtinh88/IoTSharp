import { assetApi } from '/@/api/asset';
import { dict } from '@fast-crud/fast-crud';
// eslint-disable-next-line no-unused-vars
export const createAssetPropsCrudOptions = function ({ expose }, assetId) {
	const FsButton = {
		link: true,
	};
	const customSwitchComponent = {
		activeColor: 'var(--el-color-primary)',
		inactiveColor: 'var(el-switch-of-color)',
	};
	const pageRequest = async () => {
		const res = await assetApi().assetRelations({assetId});
		return {
			records: res.data.rows,
		};
	};
	return {
		crudOptions: {
			request: {
				pageRequest,
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
			actionbar: {
				buttons: {
					add: {
						show: false,
					},
				},
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
						text: 'Attributes',
						...FsButton,
						icon: 'operation',
					},
				},
				buttons: {
					view: { show: false },
					edit: { show: false },
					remove: { show: false }, // delete button
				},
			},
			columns: {
				keyName: {
					title: 'Property name',
					type: 'text',
					column: {
						width: 260,
					},
				},
				dataType: {
					title: 'type of data',
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
					title: 'Date time',
					type: 'text',
					addForm: {
						show: false,
					},
					editForm: {
						show: false,
					},
				},
				value: {
					title: 'Value',
					type: 'text',
					addForm: {
						show: false,
					},
					editForm: {
						show: false,
					},
				}
			}
		},
	};
};
