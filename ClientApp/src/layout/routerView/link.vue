<template>
	<div class="layout-view-bg-white flex layout-view-link" :style="{ height: `calc(100vh - ${setLinkHeight}` }">
		<a :href="currentRouteMeta.isLink" target="_blank" rel="opener" class="flex-margin">
			{{ $t(currentRouteMeta.title) }}：{{ currentRouteMeta.isLink }}
		</a>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, computed, watch } from 'vue';
import { useRoute, RouteMeta } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

//Define the interface to define the type of object
interface LinkViewState {
	currentRouteMeta: {
		isLink: string;
		title: string;
	};
}
interface LinkViewRouteMeta extends RouteMeta {
	isLink: string;
	title: string;
}

export default defineComponent({
	name: 'layoutLinkView',
	setup() {
		const storesThemeConfig = useThemeConfig();
		const { themeConfig } = storeToRefs(storesThemeConfig);
		const route = useRoute();
		const state = reactive<LinkViewState>({
			currentRouteMeta: {
				isLink: '',
				title: '',
			},
		});
		//Set the height of the link
		const setLinkHeight = computed(() => {
			let { isTagsview } = themeConfig.value;
			if (isTagsview) return `115px`;
			else return `80px`;
		});
		// Monitor routing changes and set content
		watch(
			() => route.path,
			() => {
				state.currentRouteMeta = <LinkViewRouteMeta>route.meta;
			},
			{
				immediate: true,
			}
		);
		return {
			setLinkHeight,
			...toRefs(state),
		};
	},
});
</script>
