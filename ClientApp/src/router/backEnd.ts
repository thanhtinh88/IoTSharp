import { RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { dynamicRoutes, frontEndRoutes, notFoundAndNoPower } from '/@/router/route';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useMenuApi } from '/@/api/menu/index';

const menuApi = useMenuApi();

const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');
// Backend control routing

/**
  * Get all .vue and .tsx files in the directory
  * @method import.meta.glob
  * @link Reference: https://cn.vitejs.dev/guide/features.html#json
  */
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...layouModules }, { ...viewsModules });

/**
  * Backend control routing: initialization method to prevent routing loss during refresh
  * @method NextLoading interface loading animation starts execution
  * @method useUserInfo().setUserInfos() triggers initialization of user information pinia
  * @method useRequestOldRoutes().setRequestOldRoutes() stores the original routes of the interface (unprocessed components), which can be used according to needs
  * @method setAddRoute Add dynamic routing
  * @method setFilterMenuAndCacheTagsViewRoutes sets routes to vuex routesList (processed into multi-level nested routes) and caches the one-dimensional array processed by multi-level nested arrays
  */
export async function initBackEndControlRoutes() {
	//Interface loading animation starts execution
	if (window.nextLoading === undefined) NextLoading.start();
	//No token, stop executing the next step
	if (!Session.get('token')) return false;
	// Trigger initialization of user information pinia
	// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
	await useUserInfo().setUserInfos();
	// Get routing menu data
	const res = await getBackEndControlRoutes();
	let routes: any[] = [];
	// var routes:any[]=_dynamicRoutes;
	transformItem(res.data.menu, routes);
	// * Modify the menu returned by the server
	routes = [...routes[0].children]; // Remove the top menu
	//Remove the dashboard layer
	routes = routes.map((route) => {
		if (route.name === 'dashboard') {
			route.children[0].component = '/dashboard/index';
			route = JSON.parse(JSON.stringify(route.children[0]));
		}
		return route;
	});
	//Storage the original route of the interface (unprocessed component), select and use according to needs
	useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(routes)));
	// Process routing (component) and replace the route of the first top-level children of dynamicRoutes (/@/router/route)
	dynamicRoutes[0].children = await backEndComponent(routes);
	//Add dynamic route
	await setAddRoute();
	// Set routes to vuex routesList (processed into multi-level nested routes) and cache the one-dimensional array processed by multi-level nested arrays
	await setFilterMenuAndCacheTagsViewRoutes();
}

/**
  * Set routes to vuex routesList (processed into multi-level nested routes) and cache the one-dimensional array processed by multi-level nested arrays
  * @description used to display the left menu and horizontal menu
  * @description used in tagsView, menu search: unfiltered hidden (isHide)
  */
export function setFilterMenuAndCacheTagsViewRoutes() {
	const storesRoutesList = useRoutesList(pinia);
	// storesRoutesList.setRoutesList(dynamicRoutes[0].children as any);
	storesRoutesList.setRoutesList(dynamicRoutes[0].children as any);
	setCacheTagsViewRoutes();
}

/**
  * Cache the one-dimensional array processed by multi-level nested arrays
  * @description used in tagsView, menu search: unfiltered hidden (isHide)
  */
export function setCacheTagsViewRoutes() {
	const storesTagsView = useTagsViewRoutes(pinia);
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children);
}

/**
  * Process route format and add capture all routes or 404 Not found routes
  * @description Replaces the route of the first top-level children of dynamicRoutes (/@/router/route)
  * @returns returns the replaced routing array
  */
export function setFilterRouteEnd() {
	dynamicRoutes[0].children?.push(...frontEndRoutes);
	let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
	filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
  * Add dynamic routing
  * @method router.addRoute
  * @description The loop here is the routing one-dimensional array of the first top-level children of dynamicRoutes (/@/router/route), not multi-level nesting
  * @link Reference: https://next.router.vuejs.org/zh/api/#addroute
  */
export async function setAddRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
}

/**
  * Request the backend routing menu interface
  * @description isRequestRoutes is true, then enable backend control routing
  * @returns Returns the backend routing menu data
  */
export function getBackEndControlRoutes() {
	// Simulate admin and test
	const stores = useUserInfo(pinia);
	const { userInfos } = storeToRefs(stores);
	// TODO permission processing
	// const auth = userInfos.value.roles[0];
	//Administrator admin
	// if (auth === 'admin') {
	// return menuApi.getMenuAdmin();
	// } else {
	// return menuApi.getMenuTest();
	// }

	return menuApi.getMenuAdmin();
	// other users test
}

/**
  * Request the backend routing menu interface
  * @description is used to refresh the menu in the menu management interface (not tested)
  * @description path:/src/views/system/menu/component/addMenu.vue
  */
export function setBackEndControlRefreshRoutes() {
	getBackEndControlRoutes();
}

/**
  * Backend routing component conversion
  * @param routes routing table array returned by the backend
  * @returns returns the component processed into a function
  */
export function backEndComponent(routes: any) {
	if (!routes) return;
	return routes.map((item: any) => {
		if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component as string);
		item.children && backEndComponent(item.children);
		return item;
	});
}

/**
  * Backend routing component conversion function
  * @param dynamicViewsModules Get all .vue and .tsx files in the directory
  * @param component The item component currently to be processed
  * @returns returns the component processed into a function
  */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
	const keys = Object.keys(dynamicViewsModules);
	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '');
		return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		return false;
	}
}

function transformItem(source: any[], target: any[]) {
	for (let item of source) {
		let newItem: any = {
			path: item.vpath,
			name: item.routename,
			component: item.vpath,
			meta: {
				title: item.text,
				isLink: '',
				isHide: false,
				isKeepAlive: true,
				isAffix: false,
				isIframe: false,
				roles: ['admin', 'common'],
				icon: '',
			},
			children: [],
		};
		target.push(newItem);
		if (item.children && item.children.length > 0) {
			transformItem(item.children, newItem.children);
		}
	}
}
