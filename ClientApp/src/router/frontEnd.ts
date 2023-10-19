import { RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/route';
import pinia from '/@/stores/index';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useRoutesList } from '/@/stores/routesList';
import { NextLoading } from '/@/utils/loading';

//Front-end control routing

/**
  * Front-end control routing: initialization method to prevent routing loss during refresh
  * @method NextLoading interface loading animation starts execution
  * @method useUserInfo(pinia).setUserInfos() triggers initialization of user information pinia
  * @method setAddRoute Add dynamic routing
  * @method setFilterMenuAndCacheTagsViewRoutes sets recursive filtering of authorized routes to vuex routesList (processed into multi-level nested routes) and caches the one-dimensional array processed by multi-level nested arrays
  */
export async function initFrontEndControlRoutes() {
	//Interface loading animation starts execution
	if (window.nextLoading === undefined) NextLoading.start();
	//No token, stop executing the next step
	if (!Session.get('token')) return false;
	// Trigger initialization of user information pinia
	// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
	await useUserInfo(pinia).setUserInfos();
	//Add dynamic route
	await setAddRoute();
	//Set recursive filtering of authorized routes into vuex routesList (processed into multi-level nested routes) and cache the one-dimensional array processed by multi-level nested arrays
	await setFilterMenuAndCacheTagsViewRoutes();
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
  * Delete/reset routing
  * @method router.removeRoute
  * @description The loop here is the routing one-dimensional array of the first top-level children of dynamicRoutes (/@/router/route), not multi-level nesting
  * @link Reference: https://next.router.vuejs.org/zh/api/#push
  */
export async function frontEndsResetRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		const routeName: any = route.name;
		router.hasRoute(routeName) && router.removeRoute(routeName);
	});
}

/**
  * Obtain the route array with the current user permission identification and replace the original route
  * @description Replaces the route of the first top-level children of dynamicRoutes (/@/router/route)
  * @returns returns the replaced routing array
  */
export function setFilterRouteEnd() {
	let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
	filterRouteEnd[0].children = [...setFilterRoute(filterRouteEnd[0].children), ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
  * Get the current user permission ID to compare the routing table (not processed into multi-level nested routing)
  * @description This is mainly used for adding dynamic routes, router.addRoute
  * @link Reference: https://next.router.vuejs.org/zh/api/#addroute
  * @param chil dynamicRoutes (/@/router/route) the first top-level children's lower route collection
  * @returns Returns the routing array with the current user permission identifier
  */
export function setFilterRoute(chil: any) {
	const stores = useUserInfo(pinia);
	const { userInfos } = storeToRefs(stores);
	let filterRoute: any = [];
	chil.forEach((route: any) => {
		if (route.meta.roles) {
			route.meta.roles.forEach((metaRoles: any) => {
				userInfos.value.roles.forEach((roles: any) => {
					if (metaRoles === roles) filterRoute.push({ ...route });
				});
			});
		}
	});
	return filterRoute;
}

/**
  * Cache the one-dimensional array processed by multi-level nested arrays
  * @description used in tagsView, menu search: unfiltered hidden (isHide)
  */
export function setCacheTagsViewRoutes() {
	// Get the authorized routes, otherwise the routes without permissions in tagsView and menu search will also be displayed.
	const stores = useUserInfo(pinia);
	const storesTagsView = useTagsViewRoutes(pinia);
	const { userInfos } = storeToRefs(stores);
	let rolesRoutes = setFilterHasRolesMenu(dynamicRoutes, userInfos.value.roles);
	// Add to pinia setTagsViewRoutes
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(rolesRoutes))[0].children);
}

/**
  * Set recursive filtering of authorized routes to vuex routesList (processed into multi-level nested routes) and cache the one-dimensional array processed by multi-level nested arrays
  * @description used to display the left menu and horizontal menu
  * @description used in tagsView, menu search: unfiltered hidden (isHide)
  */
export function setFilterMenuAndCacheTagsViewRoutes() {
	const stores = useUserInfo(pinia);
	const storesRoutesList = useRoutesList(pinia);
	const { userInfos } = storeToRefs(stores);
	storesRoutesList.setRoutesList(setFilterHasRolesMenu(dynamicRoutes[0].children, userInfos.value.roles));
	setCacheTagsViewRoutes();
}

/**
  * Determine whether the route `meta.roles` contains the permission field of the current logged in user
  * @param roles User permission identifier, in the roles (cached to the browser when logging in to the login page) array of userInfos (user information)
  * @param route The routing item during the current loop
  * @returns Returns the routing items with permissions after comparison
  */
export function hasRoles(roles: any, route: any) {
	if (route.meta && route.meta.roles) return roles.some((role: any) => route.meta.roles.includes(role));
	else return true;
}

/**
  * Obtain the current user permission ID to compare the routing table, and set up recursive filtering of permissioned routes.
  * @param routes current route children
  * @param roles User permission identifier, in the roles (cached to the browser when logging in to the login page) array of userInfos (user information)
  * @returns Returns the controls in the authorized routing array `meta.roles`
  */
export function setFilterHasRolesMenu(routes: any, roles: any) {
	const menu: any = [];
	routes.forEach((route: any) => {
		const item = { ...route };
		if (hasRoles(roles, item)) {
			if (item.children) item.children = setFilterHasRolesMenu(item.children, roles);
			menu.push(item);
		}
	});
	return menu;
}
