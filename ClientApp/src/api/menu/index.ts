import request from '/@/utils/request';

/**
  * The backend control menu simulates json, the path is https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu
  * Backend control routing, if isRequestRoutes is true, backend control routing is enabled
  * @method getMenuAdmin Get the backend dynamic routing menu (admin)
  * @method getMenuTest Get the backend dynamic routing menu (test)
  */
export function useMenuApi() {
	return {
		getMenuAdmin: (params?: object) => {
			return request({
				url: '/api/Menu/GetProfile',
				method: 'get',
				params,
			});
		},
		getMenuTest: (params?: object) => {
			return request({
				url: '/gitee/lyt-top/vue-next-admin-images/raw/master/menu/testMenu.json',
				method: 'get',
				params,
			});
		},
	};
}
