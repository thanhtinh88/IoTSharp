import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Session } from '/@/utils/storage';
import { staticRoutes } from '/@/router/route';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';

/**
  * 1. When the front-end controls routing: isRequestRoutes is false, roles need to be written, and the setFilterRoute method needs to be used.
  * 2. When the backend controls routing: isRequestRoutes is true, there is no need to write roles, and there is no need to use the setFilterRoute method),
  * The related methods have been disassembled into the corresponding `backEnd.ts` and `frontEnd.ts` (they do not affect each other, and there is no need to change 2 files at the same time).
  * Special Note:
  * 1. Front-end control: The routing menu is written by the front-end (no menu management interface, there is a role management interface). There is a roles attribute in role management, which needs to be returned to userInfo.
  * 2. Backend control: The routing menu is returned from the backend (there is a menu management interface and a role management interface)
  */

 // Read `/src/stores/themeConfig.ts` to check whether to enable backend control routing configuration
const storesThemeConfig = useThemeConfig(pinia);
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isRequestRoutes } = themeConfig.value;

/**
  * Create a routing instance that can be used by Vue applications
  * @method createRouter(options: RouterOptions): Router
  * @link Reference: https://next.router.vuejs.org/zh/api/#createrouter
  */
export const router = createRouter({
	history: createWebHashHistory(),
	routes: staticRoutes,
});

/**
  * Route multi-level nested arrays into one-dimensional arrays
  * @param arr passed in routing menu data array
  * @returns Returns the processed one-dimensional routing menu array
  */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
  * One-dimensional arrays are processed into multi-level nested arrays (only level two is retained: that is, all levels above level two are processed into only level two, and keep-alive supports level two cache)
  * @description isKeepAlive handles the `name` value for caching. Top level is closed, all are not cached
  * @link Reference: https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
  * @param arr processed one-dimensional routing menu array
  * @returns Returns the one-dimensional array reprocessed into the format of `define dynamic routes (dynamicRoutes)`
  */
export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false;
	const newArr: any = [];
	const cacheList: Array<string> = [];
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			// Determine whether it is a dynamic route (xx/:id/:name), used in tagsView, etc.
			// Fix: https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
			//Save the name value and use it in include in keep-alive to implement route caching.
			// Path: /@/layout/routerView/parent.vue
			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name);
				const stores = useKeepALiveNames(pinia);
				stores.setCacheKeepAlive(cacheList);
			}
		}
	});
	return newArr;
}

// Before routing is loaded
router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false });
	if (to.meta.title) NProgress.start();
	const token = Session.get('token');
	if ((to.path === '/login' || to.path === '/setup' || to.path === '/signup') && !token) {
		next();
		NProgress.done();
	} else {
		if (!token) {
			next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
			Session.clear();
			NProgress.done();
		} else if (token && to.path === '/login') {
			next('/dashboard');
			NProgress.done();
		} else {
			const storesRoutesList = useRoutesList(pinia);
			const { routesList } = storeToRefs(storesRoutesList);
			if (routesList.value.length === 0) {
				if (isRequestRoutes) {
					// Backend control routing: routing data initialization to prevent loss during refresh
					await initBackEndControlRoutes();
					// Dynamically add routes: prevent the problem of jumping back to the homepage when refreshing the non-homepage
					// Ensure that the dynamically added routes have been fully loaded during addRoute()
					next({ ...to, replace: true });
				} else {
					// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
					await initFrontEndControlRoutes();
					next({ ...to, replace: true });
				}
			} else {
				next();
			}
		}
	}
});

//After the route is loaded
router.afterEach(() => {
	NProgress.done();
});

// Export route
export default router;
