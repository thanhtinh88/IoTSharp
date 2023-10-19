<template>
	<div class="h100" v-show="!isTagsViewCurrenFull">
		<el-aside class="layout-aside" :class="setCollapseStyle">
<!--			<Logo v-if="setShowLogo" />-->
      <div class="z-menu-logo" v-if="setShowLogo">
        <AppLogo style="width:160px"></AppLogo>
      </div>
			<el-scrollbar class="flex-auto" ref="layoutAsideScrollbarRef" @mouseenter="onAsideEnterLeave(true)" @mouseleave="onAsideEnterLeave(false)">
				<Vertical :menuList="menuList" />
			</el-scrollbar>
		</el-aside>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, watch, getCurrentInstance, onBeforeMount, defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import Logo from '/@/layout/logo/index.vue';
import Vertical from '/@/layout/navMenu/vertical.vue';
import AppLogo from "/@/components/AppLogo.vue";
export default defineComponent({
	name: 'layoutAside',
	components: { Logo, Vertical, AppLogo },
	setup() {
		const { proxy } = <any>getCurrentInstance();
		const stores = useRoutesList();
		const storesThemeConfig = useThemeConfig();
		const storesTagsViewRoutes = useTagsViewRoutes();
		const { routesList } = storeToRefs(stores);
		const { themeConfig } = storeToRefs(storesThemeConfig);
		const { isTagsViewCurrenFull } = storeToRefs(storesTagsViewRoutes);
		const state = reactive({
			menuList: [],
			clientWidth: 0,
		});
		//Set the width of the menu when it is expanded/collapsed
		const setCollapseStyle = computed(() => {
			const { layout, isCollapse, menuBar } = themeConfig.value;
			const asideBrTheme = ['#FFFFFF', '#FFF', '#fff', '#ffffff'];
			const asideBrColor = asideBrTheme.includes(menuBar) ? 'layout-el-aside-br-color' : '';
			// Determine whether it is a mobile phone
			if (state.clientWidth <= 1000) {
				if (isCollapse) {
					document.body.setAttribute('class', 'el-popup-parent--hidden');
					const asideEle = document.querySelector('.layout-container') as HTMLElement;
					const modeDivs = document.createElement('div');
					modeDivs.setAttribute('class', 'layout-aside-mobile-mode');
					asideEle.appendChild(modeDivs);
					modeDivs.addEventListener('click', closeLayoutAsideMobileMode);
					return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-open'];
				} else {
					//Close pop-up window
					closeLayoutAsideMobileMode();
					return [asideBrColor, 'layout-aside-mobile', 'layout-aside-mobile-close'];
				}
			} else {
				if (layout === 'columns') {
					// Column layout, the width is 1px when the menu is collapsed
					if (isCollapse) return [asideBrColor, 'layout-aside-pc-1'];
					else return [asideBrColor, 'layout-aside-pc-220'];
				} else {
					// Other layouts give 64px
					if (isCollapse) return [asideBrColor, 'layout-aside-pc-64'];
					else return [asideBrColor, 'layout-aside-pc-220'];
				}
			}
		});
		// Close the mobile mask
		const closeLayoutAsideMobileMode = () => {
			const el = document.querySelector('.layout-aside-mobile-mode');
			el?.setAttribute('style', 'animation: error-img-two 0.3s');
			setTimeout(() => {
				el?.parentNode?.removeChild(el);
			}, 300);
			const clientWidth = document.body.clientWidth;
			if (clientWidth < 1000) themeConfig.value.isCollapse = false;
			document.body.setAttribute('class', '');
		};
		//Set to show/hide logo
		const setShowLogo = computed(() => {
			let { layout, isShowLogo } = themeConfig.value;
			return (isShowLogo && layout === 'defaults') || (isShowLogo && layout === 'columns');
		});
		//Set/filter routing (non-static routing/whether to display in the menu)
		const setFilterRoutes = () => {
			if (themeConfig.value.layout === 'columns') return false;
			(state.menuList as any) = filterRoutesFun(routesList.value);
		};
		// Route filtering recursive function
		const filterRoutesFun = (arr: Array<string>) => {
			return arr
				.filter((item: any) => !item.meta.isHide)
				.map((item: any) => {
					item = Object.assign({}, item);
					if (item.children) item.children = filterRoutesFun(item.children);
					return item;
				});
		};
		//Set whether the menu navigation is fixed (mobile terminal)
		const initMenuFixed = (clientWidth: number) => {
			state.clientWidth = clientWidth;
		};
		//Mouse in and out
		const onAsideEnterLeave = (bool: Boolean) => {
			let { layout } = themeConfig.value;
			if (layout !== 'columns') return false;
			if (!bool) proxy.mittBus.emit('restoreDefault');
			stores.setColumnsMenuHover(bool);
		};
		// Monitor changes in the themeConfig configuration file and update the height of the menu el-scrollbar
		watch(themeConfig.value, (val) => {
			if (val.isShowLogoChange !== val.isShowLogo) {
				if (!proxy.$refs.layoutAsideScrollbarRef) return false;
				proxy.$refs.layoutAsideScrollbarRef.update();
			}
		});
		// Monitor changes in vuex values and dynamically assign values to the menu
		watch(
			pinia.state,
			(val) => {
				let { layout, isClassicSplitMenu } = val.themeConfig.themeConfig;
				if (layout === 'classic' && isClassicSplitMenu) return false;
				setFilterRoutes();
			},
			{
				deep: true,
			}
		);
		// Before the page is loaded
		onBeforeMount(() => {
			initMenuFixed(document.body.clientWidth);
            setFilterRoutes();
			// This interface does not need to cancel monitoring (proxy.mittBus.off('setSendColumnsChildren))
			// Because some monitors need to be used when switching layouts, if the monitors are cancelled, some operations will not take effect.
			proxy.mittBus.on('setSendColumnsChildren', (res: any) => {
				state.menuList = res.children;
			});
			proxy.mittBus.on('setSendClassicChildren', (res: any) => {
				let { layout, isClassicSplitMenu } = themeConfig.value;
				if (layout === 'classic' && isClassicSplitMenu) {
					state.menuList = [];
					state.menuList = res.children;
				}
			});
			proxy.mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
				setFilterRoutes();
			});
			proxy.mittBus.on('layoutMobileResize', (res: any) => {
				initMenuFixed(res.clientWidth);
				closeLayoutAsideMobileMode();
			});
		});
		return {
			setCollapseStyle,
			setShowLogo,
			isTagsViewCurrenFull,
			onAsideEnterLeave,
			...toRefs(state),
		};
	},
});
</script>
<style lang="scss" scoped>
.z-menu-logo {
  display: flex;
  box-sizing: border-box;
  padding-left: 20px;
  height: 92px;
  border-bottom: 1px solid var(--el-border-color-light);
}
</style>
