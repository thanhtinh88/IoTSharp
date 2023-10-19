import { defineStore } from 'pinia';
import { KeepAliveNamesState } from './interface';

/**
  * Route cache list
  * @methods setCacheKeepAlive Set the routing names to be cached (enable Tagsview)
  * @methods addCachedView Add routing names to be cached (close Tagsview)
  * @methods delCachedView Delete route names to be cached (close Tagsview)
  * @methods delOthersCachedViews Right-click menu `Close Others`, delete route names to be cached (close Tagsview)
  * @methods delAllCachedViews Right-click menu `Close All`, delete route names to be cached (close Tagsview)
  */
export const useKeepALiveNames = defineStore('keepALiveNames', {
	state: (): KeepAliveNamesState => ({
		keepAliveNames: [],
		cachedViews: [],
	}),
	actions: {
		async setCacheKeepAlive(data: Array<string>) {
			this.keepAliveNames = data;
		},
		async addCachedView(view: any) {
			if (this.cachedViews.includes(view.name)) return;
			if (view.meta.isKeepAlive) this.cachedViews.push(view.name);
		},
		async delCachedView(view: any) {
			const index = this.cachedViews.indexOf(view.name);
			index > -1 && this.cachedViews.splice(index, 1);
		},
		async delOthersCachedViews(view: any) {
			if (view.meta.isKeepAlive) this.cachedViews = [view.name];
			else this.cachedViews = [];
		},
		async delAllCachedViews() {
			this.cachedViews = [];
		},
	},
});
