//Define the interface to define the type of object
export interface TableDataRow {
	address?: string;
	city?: string;
	deviceType?: string;
	country?: string;
	eMail?: string;
	id?: string;
	name?: string;
	phone?: string;
	province?: string;
	street?: string;
	zipCode?: string;
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
