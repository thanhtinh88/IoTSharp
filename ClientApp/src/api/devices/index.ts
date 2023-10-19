import { authDirective } from '/@/utils/authDirective';

import { IListQueryParam } from '../iapiresult';
import request from '/@/utils/request';

/**
  * Device api interface collection
  * @method deviceList device list
  * @method getdevcie Get the device
  * @method postdevice new device
  * @method putdevice modify the device
  * @method deletedevice delete device
  */
export function deviceApi() {
	return {
		devcieList: (params: QueryParam) => {
			var url = '/api/Devices/Customers?offset=' + params.offset + '&limit=' + params.limit + '&sorter=&customerId=' + params.customerId + '&sort=';
			if (params.name) {
				url += '&name=' + params.name;
			}
			if (params.onlyActive) {
				url += '&onlyActive=' + params.onlyActive;
			}

			return request({
				url: url,
				method: 'get',
				data: params,
			});

			// return request({
			// 	url:
			// 		'/api/Devices/Customers?offset=' +
			// 		params.offset +
			// 		'&limit=' +
			// 		params.limit +
			// 		'&sorter=&onlyActive=' +
			// 		params.onlyActive +
			// 		'&customerId=' +
			// 		params.customerId +
			// 		'&name=' +
			// 		params.name +
			// 		'&sort=',
			// 	method: 'get',
			// 	data: params,
			// });
		},
		getdevcie: (deviceId: string) => {
			return request({
				url: '/api/Devices/' + deviceId,
				method: 'get',
			});
		},

		postdevcie: (params: any) => {
			return request({
				url: '/api/Devices',
				method: 'post',
				data: params,
			});
		},

		putdevcie: (params: any) => {
			return request({
				url: '/api/Devices/' + params.id,
				method: 'put',
				data: params,
			});
		},
		deletedevcie: (id: string) => {
			return request({
				url: '/api/Devices/' + id,
				method: 'delete',
			});
		},
		addDeviceAttributes: (deviceId: string, params: any) => {
			return request({
				url: '/api/Devices/' + deviceId + '/AddAttribute',
				method: 'post',
				data: params,
			});
		},
		removeDeviceAttributes: (deviceId: string, params: any) => {
			return request({
				url: '/api/Devices/RemoveAttribute',
				method: 'delete',
				data: {
					deviceId: deviceId,
					keyName: params.keyName,
					dataSide: params.dataSide,
				},
			});
		},
		editDeviceAttributes: (deviceId: string, params: any) => {
			return request({
				url: '/api/Devices/' + deviceId + '/EditAttribute',
				method: 'post',
				data: params,
			});
		},
		getDeviceAttributes: (deviceId: string) => {
			return request({
				url: '/api/Devices/' + deviceId + '/AttributeLatest',
				method: 'get',
			});
		},
		
		// Get device rules
		getDeviceRules: (deviceId: string) => {
			return request({
				url: '/api/rules/getDeviceRules?deviceId=' + deviceId,
				method: 'get',
			});
		},

		// Set rules
		setDeviceRules: (deviceId: string, ruleId: any) => {
			return request({
				url: '/api/rules/binddevice',
				method: 'post',
				data: {
					dev: [deviceId],
					rule: ruleId,
				},
			});
		},
		deleteDeviceRules: (deviceId: string, ruleId: string) => {
			return request({
				url: '/api/rules/DeleteDeviceRules',
				method: 'get',
				params: {
					deviceId,
					ruleId,
				},
			});
		},

		getDeviceLatestTelemetry: (deviceId: string) => {
			return request({
				url: '/api/devices/' + deviceId + '/telemetryLatest',
				method: 'get',
			});
		},


		getDeviceTelemetryLatestByKeys: (deviceId: string,keys:string) =>  {
			return request({
				url: '/api/devices/' + deviceId + '/telemetryLatest/'+keys,
				method: 'get',
			});
		},
		getDeviceTelemetryData: (deviceId: string, params: any) => {
			return request({
				url: '/api/devices/' + deviceId + '/telemetryData',
				method: 'post',
				data: params,
			});
		},
		downloadCertificates: (deviceId: string) => {
			return request({
				url: '/api/devices/' + deviceId + '/downloadCertificates',
				method: 'get',
				responseType: 'blob',
			});
		},
	};
}

interface QueryParam extends IListQueryParam {
	onlyActive?: boolean;
	customerId?: string;
	name?: string;
}
