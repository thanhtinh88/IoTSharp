import { IListQueryParam } from '../iapiresult';
import request from '/@/utils/request';

/**
  * Asset management API interface collection
  * @method assetList asset list
  * @method postAsset new assets
  * @method putAsset Modify assets
  * @method deleteAsset delete assets
  */
export function assetApi() {
	return {
		assetList: (params: QueryParam) => {
			return request({
				url: `/api/Asset/List`,
				method: 'get',
				params,
			});
		},
		assetRelations: (params: {assetId: string} ) => {
			return request({
				url: `/api/Asset/AssetRelations`,
				method: 'get',
				params,
			});
		},
		relations: (params: {assetId: string} ) => {
			return request({
				url: `/api/Asset/Relations`,
				method: 'get',
				params,
			});
		},
		postAsset: (params: any) => {
			return request({
				url: '/api/Asset/Save',
				method: 'post',
				data: params,
			});
		},

		putAsset: (params: any) => {
			return request({
				url: '/api/Asset/Update',
				method: 'put',
				data: params,
			});
		},
		deleteAsset: (id: string) => {
			return request({
				url: '/api/Asset/Delete' + id,
				method: 'delete',
				data: {},
			});
		},
	};
}

export interface QueryParam extends IListQueryParam {
	name?: string;
}
