import { RouteRecordRaw } from 'vue-router';

/**
  * Description of routing meta object parameters
  * meta: {
  * title: menu bar and tagsView bar, menu search name (internationalization)
  * isLink: Whether to hyperlink menu, open external link conditions, `1. isLink: link address is not empty`
  * isHide: Whether to hide this route
  * isKeepAlive: Whether to cache component status
  * isAffix: Whether it is fixed on the tagsView bar
  * isIframe: Whether to embed the window, opening conditions, `1. isIframe: true 2. isLink: the link address is not empty`
  *roles: Current routing authority identifier, take role management. Control route display and hiding. Super administrator: admin Common role: common
  * icon: menu, tagsView icon, Alibaba: add `iconfont xxx`, fontawesome: add `fa xxx`
  * }
  */

/**
  * Define dynamic routing
  * To add routing to the front end, please add it in the `children array` of the top-level node
  * @description Used when isRequestRoutes is not enabled (front-end control routing). When enabled, the route of the first top-level children will be replaced with the routing data returned by the interface request.
  * @description For each field, please view ruleForm` under `/@/views/system/menu/component/addMenu.vue`
  * @returns Returns routing menu data
  */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/dashboard',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/dashboard',
				name: 'dashboard',
				component: () => import('/@/views/dashboard/index.vue'),
				meta: {
					title: 'message.router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},


		],
	},



];

// Some front-end managed routes
export const frontEndRoutes = [
	{
		path: '/profile',
		name: 'profile',
		component: () => import('/@/views/profile/index.vue'),
		meta: {
			title: 'Profile',
			isHide: true,
		},
	},
	{
		path: '/iot/rules/flowdesigner',
		name: 'flowdesigner',
		component: () => import('/@/views/iot/rules/flowdesigner.vue'),
		meta: {
			title: 'Flow Designer',
			isHide: true,
		},
	},
	{
		path: '/iot/forms/edit',
		name: 'edit',
		component: () => import('/@/views/iot/forms/edit.vue'),
		meta: {
			title: 'Edit',
			isHide: true,
		},
	},
	{
		path: '/iot/rules/flowsimulator',
		name: 'flowsimulator',
		component: () => import('/@/views/iot/rules/flowsimulator.vue'),
		meta: {
			title: 'message.router.home',
			isHide: true,
		},
	},
	{
		path: '/iot/devices/assetdesigner',
		name: 'assetdesigner',
		component: () => import('/@/views/iot/assets/designer/assetdesigner.vue'),
		meta: {
			title: 'message.router.home',
			isHide: true,
		},
	},
	{
		path: '/iot/devices/gatewaydesigner',
		name: 'gatewaydesigner',
		component: () => import('/@/views/iot/devices/gatewaydesigner.vue'),
		meta: {
			title: 'message.router.home',
			isHide: true,
		},
	},
]

/**
  * Define 404 and 401 interfaces
  * @link Reference: https://next.router.vuejs.org/zh/guide/essentials/history-mode.html#netlify
  */
export const notFoundAndNoPower = [
	{
		path: '/:path(.*)*',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
			isHide: true,
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
			isHide: true,
		},
	},


];

/**
  * Define static route (default route)
  * Do not move this route. If you want to add a route on the front end, please add it in the `dynamicRoutes array`
  * @description The front-end control directly changes the routes in dynamicRoutes. The back-end control does not need to be modified. When requesting interface routing data, the content of the first top-level children of dynamicRoutes will be overwritten (full screen, excluding route exits in layout)
  * @returns Returns routing menu data
  */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: 'Log in',
		},
	},
	{
		path: '/setup',
		name: 'setup',
		component: () => import('/@/views/setup/index.vue'),
		meta: {
			title: 'Initialize the system',
		},
	},
	{
		path: '/signup',
		name: 'signup',
		component: () => import('/@/views/login/signup.vue'),
		meta: {
			title: 'Initialize the system',
		},
	},
	/**
	 * Tip: What is written here is a full-screen interface. It is not recommended to write here.
	 * Please write it in the `dynamicRoutes` routing array
	 * */
];
