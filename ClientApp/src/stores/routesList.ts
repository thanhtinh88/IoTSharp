import { defineStore } from 'pinia';
import { RoutesListState } from './interface';

/**
  *Route list
  * @methods setRoutesList Set routing data
  * @methods setColumnsMenuHover sets the column layout menu when the mouse moves into boolean
  * @methods setColumnsNavHover sets the leftmost navigation of the column layout and moves the mouse into Boolean
  */
export const useRoutesList = defineStore('routesList', {
	state: (): RoutesListState => ({
		routesList: [],
		isColumnsMenuHover: false,
		isColumnsNavHover: false,
	}),
	actions: {
		async setRoutesList(data: Array<string>) {
			this.routesList = data;
		},
		async setColumnsMenuHover(bool: Boolean) {
			this.isColumnsMenuHover = bool;
		},
		async setColumnsNavHover(bool: Boolean) {
			this.isColumnsNavHover = bool;
		},
	},
});
