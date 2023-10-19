import { IListQueryParam } from '../iapiresult';
import request from '/@/utils/request';

/**
  * User api interface collection
  * @method accountList user list
  * @method getAccount Get the user
  * @method postAccount new user
  * @method putAccount Modify user
  * @method deleteAccount delete user
  */
export function accountApi() {
	return {
		accountList: (params: CustomerQueryParam) => {
			return request({
				url: `/api/Account/List`,
				method: 'get',
				params,
			});
		},
		getAccount: (id: string) => {
			return request({
				url: '/api/Account/Get',
				method: 'get',
				params: { id },
			});
		},

		putAccount: (data: any) => {
			return request({
				url: '/api/Account/Modify',
				method: 'put',
				data: data,
			});
		},
		updateAccountStatus: (data: any) => {
			return request({
				url: '/api/Account/Lock',
				method: 'put',
				data: data,
			});
		},
		deleteAccount: (id: string) => {
			return request({
				url: '/api/Account/' + id,
				method: 'delete',
				data: {},
			});
		},
	};
}

export interface CustomerQueryParam extends IListQueryParam {
	name?: string;
	customerId?: string;
}
