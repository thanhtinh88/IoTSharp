import request from '/@/utils/request';

/**
  * Login api interface collection
  * @method signIn User login
  * @method signOut User logs out
  */
export function useLoginApi() {
	return {
		signIn: (params: object) => {
			return request({
				url: '/api/Account/Login',
				method: 'post',
				data: params,
			});
		},
		signOut: (params: object) => {
			return request({
				url: '/api/Account/Logout',
				method: 'post',
				data: params,
			});
		},

		GetUserInfo: (params: object) => {
			return request({
				url: '/api/Account/MyInfo',
				method: 'get',
				data: params,
			});
		},
	};
}



