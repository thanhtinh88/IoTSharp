import { nextTick } from 'vue';
import type { App } from 'vue';
import * as svg from '@element-plus/icons-vue';
import router from '/@/router/index';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { i18n } from '/@/i18n/index';
import { Local } from '/@/utils/storage';
import SvgIcon from '/@/components/svgIcon/index.vue';

/**
  * Export global registration element plus svg icon
  * @param app vue instance
  * @description Use: https://element-plus.gitee.io/zh-CN/component/icon.html
  */
export function elSvg(app: App) {
	const icons = svg as any;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
	app.component('SvgIcon', SvgIcon);
}

/**
  * Set browser title internationalization
  * @method const title = useTitle(); ==> title()
  */
export function useTitle() {
	const stores = useThemeConfig(pinia);
	const { themeConfig } = storeToRefs(stores);
	nextTick(() => {
		let webTitle = '';
		let globalTitle: string = themeConfig.value.globalTitle;
		const { path, meta } = router.currentRoute.value;
		if (path === '/login') {
			webTitle = <any>meta.title;
		} else {
			webTitle = setTagsViewNameI18n(router.currentRoute.value);
		}
		document.title = `${webTitle} - ${globalTitle}` || globalTitle;
	});
}

/**
  * Set custom tagsView name, custom tagsView name internationalization
  * @param params routing query, tagsViewName in params
  * @returns returns the current tagsViewName name
  */
export function setTagsViewNameI18n(item: any) {
	let tagsViewName: any = '';
	const { query, params, meta } = item;
	if (query?.tagsViewName || params?.tagsViewName) {
		if (/\/zh-cn|en|zh-tw\//.test(query?.tagsViewName) || /\/(zh-cn|en|zh-tw)\//.test(params?.tagsViewName)) {
			// globalization
			const urlTagsParams = (query?.tagsViewName && JSON.parse(query?.tagsViewName)) || (params?.tagsViewName && JSON.parse(params?.tagsViewName));
			tagsViewName = urlTagsParams[i18n.global.locale];
		} else {
			// non-internationalization
			tagsViewName = query?.tagsViewName || params?.tagsViewName;
		}
	} else {
		//Non-custom tagsView name
		tagsViewName = i18n.global.t(<any>meta.title);
	}
	return tagsViewName;
}

/**
  * Lazy loading of images
  * @param el dom target element
  * @param arr list data
  * @description data-xxx attributes are used to store private custom data for pages or applications
  */
export const lazyImg = (el: any, arr: any) => {
	const io = new IntersectionObserver((res) => {
		res.forEach((v: any) => {
			if (v.isIntersecting) {
				const { img, key } = v.target.dataset;
				v.target.src = img;
				v.target.onload = () => {
					io.unobserve(v.target);
					arr[key]['loading'] = false;
				};
			}
		});
	});
	nextTick(() => {
		document.querySelectorAll(el).forEach((img) => io.observe(img));
	});
};

/**
  * Global component size
  * @returns Returns the cached value `globalComponentSize` read in `window.localStorage`
  */
export const globalComponentSize = (): string => {
	const stores = useThemeConfig(pinia);
	const { themeConfig } = storeToRefs(stores);
	return Local.get('themeConfig')?.globalComponentSize || themeConfig.value?.globalComponentSize;
};

/**
  * Object deep cloning
  * @param obj source object
  * @returns cloned object
  */
export function deepClone(obj: any) {
	let newObj: any;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (obj[attr] && typeof obj[attr] === 'object') {
			newObj[attr] = deepClone(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

/**
  * Determine whether it is a mobile terminal
  */
export function isMobile() {
	if (
		navigator.userAgent.match(
			/('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
		)
	) {
		return true;
	} else {
		return false;
	}
}

/**
  * Determine whether all attributes in the array object are empty. If they are empty, delete the current row object.
  * @description @Thank you Dahuang
  * @param list array object
  * @returns array object after deleting null values
  */
export function handleEmpty(list: any) {
	const arr = [];
	for (const i in list) {
		const d = [];
		for (const j in list[i]) {
			d.push(list[i][j]);
		}
		const leng = d.filter((item) => item === '').length;
		if (leng !== d.length) {
			arr.push(list[i]);
		}
	}
	return arr;
}

/**
  * Unified batch export
  * @method elSvg Export global registration element plus svg icon
  * @method useTitle Set browser title internationalization
  * @method setTagsViewNameI18n Set custom tagsView name, custom tagsView name internationalization
  * @method lazyImg image lazy loading
  * @method globalComponentSize() element plus global component size
  * @method deepClone object deep cloning
  * @method isMobile determines whether it is a mobile terminal
  * @method handleEmpty determines whether all attributes in the array object are empty. If they are empty, delete the current row object.
  */
const other = {
	elSvg: (app: App) => {
		elSvg(app);
	},
	useTitle: () => {
		useTitle();
	},
	setTagsViewNameI18n(route: any) {
		return setTagsViewNameI18n(route);
	},
	lazyImg: (el: any, arr: any) => {
		lazyImg(el, arr);
	},
	globalComponentSize: () => {
		return globalComponentSize();
	},
	deepClone: (obj: any) => {
		return deepClone(obj);
	},
	isMobile: () => {
		return isMobile();
	},
	handleEmpty: (list: any) => {
		return handleEmpty(list);
	},
};

// Unified batch export
export default other;
//delay function
export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}