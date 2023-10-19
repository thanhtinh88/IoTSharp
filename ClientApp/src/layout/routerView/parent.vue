<template>
	<div class="h100">
		<router-view v-slot="{ Component }">
			<transition :name="setTransitionName" mode="out-in">
				<keep-alive :include="getKeepAliveNames">
					<component :is="Component" :key="refreshRouterViewKey" class="w100" />
				</keep-alive>
			</transition>
		</router-view>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, reactive, getCurrentInstance, onBeforeMount, onUnmounted, nextTick, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Session } from '/@/utils/storage';

//Define the interface to define the type of object
interface ParentViewState {
	refreshRouterViewKey: null | string;
	keepAliveNameList: string[];
}

export default defineComponent({
	name: 'layoutParentView',
	setup() {
		const { proxy } = <any>getCurrentInstance();
		const route = useRoute();
		const storesKeepAliveNames = useKeepALiveNames();
		const storesThemeConfig = useThemeConfig();
		const { keepAliveNames, cachedViews } = storeToRefs(storesKeepAliveNames);
		const { themeConfig } = storeToRefs(storesThemeConfig);
		const state = reactive<ParentViewState>({
			refreshRouterViewKey: null,
			keepAliveNameList: [],
		});
		//Set the main interface switching animation
		const setTransitionName = computed(() => {
			return themeConfig.value.animation;
		});
		// Get component cache list (name value)
		const getKeepAliveNames = computed(() => {
			return themeConfig.value.isTagsview ? cachedViews.value : state.keepAliveNameList;
		});
		// Before the page is loaded, the cache is processed, and the routing cache is processed when the page is refreshed.
		onBeforeMount(() => {
			state.keepAliveNameList = keepAliveNames.value;
			proxy.mittBus.on('onTagsViewRefreshRouterView', (fullPath: string) => {
				state.keepAliveNameList = keepAliveNames.value.filter((name: string) => route.name !== name);
				state.refreshRouterViewKey = null;
				nextTick(() => {
					state.refreshRouterViewKey = fullPath;
					state.keepAliveNameList = keepAliveNames.value;
				});
			});
		});
		//When the page loads
		onMounted(() => {
			// https://gitee.com/lyt-top/vue-next-admin/issues/I58U75
			// https://gitee.com/lyt-top/vue-next-admin/issues/I59RXK
			nextTick(() => {
				setTimeout(() => {
					if (themeConfig.value.isCacheTagsView) cachedViews.value = Session.get('tagsViewList')?.map((item: any) => item.name);
				}, 0);
			});
		});
		//When the page is unloaded
		onUnmounted(() => {
			proxy.mittBus.off('onTagsViewRefreshRouterView', () => {});
		});
		// Monitor routing changes to prevent the switching animation from disappearing when tagsView has multiple tags
		watch(
			() => route.fullPath,
			() => {
				state.refreshRouterViewKey = decodeURI(route.fullPath);
			}
		);
		return {
			setTransitionName,
			getKeepAliveNames,
			...toRefs(state),
		};
	},
});
</script>
