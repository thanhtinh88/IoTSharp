import { defineStore } from 'pinia';
import { RequestOldRoutesState } from './interface';

/**
  * The backend returns the original route (when not processed)
  * @methods setCacheKeepAlive sets the original routing data of the interface
  */
export const useRequestOldRoutes = defineStore('requestOldRoutes', {
	state: (): RequestOldRoutesState => ({
		requestOldRoutes: [],
	}),
	actions: {
		async setRequestOldRoutes(routes: Array<string>) {
			this.requestOldRoutes = routes;
		},
	},
});
