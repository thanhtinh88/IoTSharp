import { IListQueryParam } from '../iapiresult';
import request from '/@/utils/request';

/**
  * Tenant api interface collection
  * @method ruleList tenant list
  * @method getrule Get the tenant
  * @method postrule Add tenant
  * @method putrule Modify tenant
  * @method deleterule delete tenant
  */
export function ruleApi() {
	return {
		ruleList: (params: QueryParam) => {
			return request({
				url: '/api/rules/Index',
				method: 'post',
				data: params,
			});
		},
		getrule: (ruleId: string) => {
			return request({
				url: '/api/rules/Get?id=' + ruleId,
				method: 'get',
			});
		},

		postrule: (params: any) => {
			return request({
				url: '/api/rules/Save',
				method: 'post',
				data: params,
			});
		},

		putrule: (params: any) => {
			return request({
				url: '/api/rules/Update',
				method: 'post',
				data: params,
			});
		},
		deleterule: (id: string) => {
			return request({
				url: '/api/rules/Delete?id=' + id,
				method: 'get',
				data: {},
			});
		},
		getexecutors: () => {
			return request({
				url: '/api/rules/getexecutors',
				method: 'get',
				data: {},
			});
		},

		getDiagram: (id: string) => {
			return request({
				url: '/api/rules/GetDiagramV?id=' + id,
				method: 'get',
			});
		},
		saveDiagramV: (data: any) => {
			return request({
				url: '/api/rules/SaveDiagramV',
				method: 'post',
				data: data,
			});
		},


		active: (data: any) => {
			return request({
				url: '/api/rules/active',
				method: 'post',
				data: data,
			});
		},

		floweventslist: (data: any) => {
			return request({
				url: '/api/rules/flowevents',
				method: 'post',
				data: data,
			});
		},


		getFlows: (ruleId: string) => {
			return request({
				url: '/api/rules/GetFlows?ruleId=' + ruleId,
				method: 'get',
			});
		},
		bindDevice: (data: any) => {
			return request({
				url: '/api/rules/binddevice',
				method: 'post', data: data,
			});
		},




	};
}

interface QueryParam extends IListQueryParam {
	name?: string
}
