import { IListQueryParam } from '../iapiresult';
import request from '/@/utils/request';

/**
  * Tenant api interface collection
  * @method tenantList tenant list
  * @method gettenant Get the tenant
  * @method posttenant Add tenant
  * @method puttenant Modify tenant
  * @method deletetenant delete tenant
  */
export function tenantApi() {
	return {
		tenantList: (params: QueryParam) => {
			return request({
				url: '/api/Tenants',
				method: 'get',
				params,
			});
		},
		gettenant: (tenantId: string) => {
			return request({
				url: '/api/Tenants/' + tenantId,
				method: 'get',
			});
		},

		posttenant: (params: any) => {
			return request({
				url: '/api/Tenants',
				method: 'post',
				data: params,
			});
		},

		puttenant: (params: any) => {
			return request({
				url: '/api/Tenants/' + params.id,
				method: 'put',
				data: params,
			});
		},
		deletetenant: (id: string) => {
			return request({
				url: '/api/Tenants/' + id,
				method: 'delete',
				data: {},
			});
		},
	};
}

export interface QueryParam extends IListQueryParam {
	name?: string;
}
