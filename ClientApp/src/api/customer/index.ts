import { IListQueryParam } from '../iapiresult';
import request from '/@/utils/request';

/**
  * Customer api interface collection
  * @method customerList customer list
  * @method getCustomer Get customers
  * @method postCustomer Add new customer
  * @method putCustomer Modify customer
  * @method deleteCustomer delete customer
  */
export function customerApi() {
	return {
		customerList: (params: QueryParam) => {
			return request({
				url: `/api/Customers/Tenant`,
				method: 'post',
				data: params,
			});
		},
		getCustomer: (customerId: string) => {
			return request({
				url: '/api/Customers/' + customerId,
				method: 'get',
			});
		},

		postCustomer: (params: any) => {
			return request({
				url: '/api/Customers',
				method: 'post',
				data: params,
			});
		},

		putCustomer: (params: any) => {
			return request({
				url: '/api/Customers/' + params.id,
				method: 'put',
				data: params,
			});
		},
		deleteCustomer: (id: string) => {
			return request({
				url: '/api/Customers/' + id,
				method: 'delete',
				data: {},
			});
		},
	};
}

export interface QueryParam extends IListQueryParam {
	name?: string;
	tenantId?: string;
}
