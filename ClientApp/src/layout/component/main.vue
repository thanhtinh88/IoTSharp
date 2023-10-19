<template>
	<el-main class="layout-main">
		<el-scrollbar
			ref="layoutScrollbarRef"
			:class="{
				'layout-scrollbar':
					(!isClassicOrTransverse && !currentRouteMeta.isLink && !currentRouteMeta.isIframe) ||
					(!isClassicOrTransverse && currentRouteMeta.isLink && !currentRouteMeta.isIframe),
			}"
		>
			<LayoutParentView
				:style="{
					padding: !isClassicOrTransverse || (currentRouteMeta.isLink && currentRouteMeta.isIframe) ? '0' : '15px',
					transition: 'padding 0.3s ease-in-out',
				}"
			/>
			<Footer v-if="themeConfig.isFooter" />
		</el-scrollbar>
	</el-main>
</template>

<script lang="ts">
import { defineComponent, toRefs, reactive, getCurrentInstance, watch, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import LayoutParentView from '/@/layout/routerView/parent.vue';
import Footer from '/@/layout/footer/index.vue';

//Define the interface to define the type of object
interface MainState {
	headerHeight: string | number;
	currentRouteMeta: any;
}

export default defineComponent({
	name: 'layoutMain',
	components: { LayoutParentView, Footer },
	setup() {
		const { proxy } = <any>getCurrentInstance();
		const storesThemeConfig = useThemeConfig();
		const { themeConfig } = storeToRefs(storesThemeConfig);
		const route = useRoute();
		const state = reactive<MainState>({
			headerHeight: '',
			currentRouteMeta: {},
		});
        // Determine layout
        const isClassicOrTransverse = computed(() => {
            const { layout } = themeConfig.value;
            return layout === 'classic' || layout === 'transverse';
        });
        //Set the height of main
        const initHeaderHeight = () => {
            const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe;
            let { isTagsview } = themeConfig.value;
            if (isTagsview) return (state.headerHeight = bool ? `86px` : `115px`);
            else return (state.headerHeight = `80px`);
        };
        // Initialize to get the current route meta, which is used to set iframes padding
        const initGetMeta = () => {
            state.currentRouteMeta = route.meta;
        };
        // Before the page is loaded
        onMounted(async () => {
            await initGetMeta();
            initHeaderHeight();
            NextLoading.done();
        });
        // Monitor routing changes
        watch(
            () => route.path,
            () => {
                state.currentRouteMeta = route.meta;
                const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe;
                state.headerHeight = bool ? `86px` : `115px`;
                proxy.$refs.layoutScrollbarRef.update();
            }
        );
		// Monitor changes in the themeConfig configuration file and update the height of the menu el-scrollbar
		watch(
			themeConfig,
			(val) => {
				state.currentRouteMeta = route.meta;
				const bool = state.currentRouteMeta.isLink && state.currentRouteMeta.isIframe;
				state.headerHeight = val.isTagsview ? (bool ? `86px` : `115px`) : '51px';
				proxy.$refs?.layoutScrollbarRef?.update();
			},
			{
				deep: true,
			}
		);
		return {
			themeConfig,
			isClassicOrTransverse,
			...toRefs(state),
		};
	},
});
</script>
