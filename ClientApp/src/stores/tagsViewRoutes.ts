import { defineStore } from 'pinia';
import { TagsViewRoutesState } from './interface';
import { Session } from '/@/utils/storage';

/**
  * TagsView routing list
  * @methods setTagsViewRoutes sets the TagsView routing list
  * @methods setCurrenFullscreen sets the Boolean state when turning on/off full screen
  */
export const useTagsViewRoutes = defineStore('tagsViewRoutes', {
	state: (): TagsViewRoutesState => ({
		tagsViewRoutes: [],
		isTagsViewCurrenFull: false,
	}),
	actions: {
		async setTagsViewRoutes(data: Array<string>) {
			this.tagsViewRoutes = data;
		},
		setCurrenFullscreen(bool: Boolean) {
			Session.set('isTagsViewCurrenFull', bool);
			this.isTagsViewCurrenFull = bool;
		},
	},
});
