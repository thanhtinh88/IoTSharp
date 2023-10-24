//Define the interface to define the type of object
export interface TableDataRow {
	assetType?: string;
	description?: string;
	id?: string;
	name?: string;
}

export interface TableDataState {
	tableData: {
		rows: Array<TableDataRow>;
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
		};
	};
}
