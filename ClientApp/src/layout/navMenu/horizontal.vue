<template>
	<div class="el-menu-horizontal-warp">
		<el-scrollbar @wheel.native.prevent="onElMenuHorizontalScroll" ref="elMenuHorizontalScrollRef">
			<el-menu router :default-active="defaultActive" :ellipsis="false" background-color="transparent" mode="horizontal">
				<template v-for="val in menuLists">
					<el-sub-menu :index="val.path" v-if="val.children && val.children.length > 0" :key="val.path">
						<template #title>
							<SvgIcon :name="val.meta.icon" />
							<span>{{ $t(val.meta.title) }}</span>
						</template>
						<SubItem :chil="val.children" />
					</el-sub-menu>
					<template v-else>
						<el-menu-item :index="val.path" :key="val.path">
							<template #title v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
								<SvgIcon :name="val.meta.icon" />
								{{ $t(val.meta.title) }}
							</template>
							<template #title v-else>
								<a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">
									<SvgIcon :name="val.meta.icon" />
									{{ $t(val.meta.title) }}
								</a>
							</template>
						</el-menu-item>
					</template>
				</template>
			</el-menu>
		</el-scrollbar>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, defineComponent, getCurrentInstance, onMounted, nextTick, onBeforeMount } from 'vue';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import SubItem from '/@/layout/navMenu/subItem.vue';

export default defineComponent({
	name: 'navMenuHorizontal',
	components: { SubItem },
	props: {
		menuList: {
			type: Array,
			default: () => [],
		},
	},
	setup(props) {
		const { proxy } = <any>getCurrentInstance();
		const stores = useRoutesList();
		const storesThemeConfig = useThemeConfig();
		const { routesList } = storeToRefs(stores);
		const { themeConfig } = storeToRefs(storesThemeConfig);
		const route = useRoute();
		const state = reactive({
			defaultActive: null,
		});
        // Get parent menu data
        const menuLists = computed(() => {
            return <any>props.menuList;
        });
        // Set the horizontal scroll bar to scroll with the mouse wheel
        const onElMenuHorizontalScroll = (e: any) => {
            const eventDelta = e.wheelDelta || -e.deltaY * 40;
            proxy.$refs.elMenuHorizontalScrollRef.$refs.wrap$.scrollLeft = proxy.$refs.elMenuHorizontalScrollRef.$refs.wrap$.scrollLeft + eventDelta / 4;
        };
        // Initialize data. When the page is refreshed, the scroll bar scrolls to the corresponding position.
        const initElMenuOffsetLeft = () => {
            nextTick(() => {
                let els: any = document.querySelector('.el-menu.el-menu--horizontal li.is-active');
                if (!els) return false;
                proxy.$refs.elMenuHorizontalScrollRef.$refs.wrapRef.scrollLeft = els.offsetLeft;
            });
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
        //Transmit the current child data to the menu
        const setSendClassicChildren = (path: string) => {
            const currentPathSplit = path.split('/');
            let currentData: any = {};
            filterRoutesFun(routesList.value).map((v, k) => {
                if (v.path === `/${currentPathSplit[1]}`) {
                    v['k'] = k;
                    currentData['item'] = [{ ...v }];
                    currentData['children'] = [{ ...v }];
                    if (v.children) currentData['children'] = v.children;
                }
            });
            return currentData;
        };
        //Set the current route highlighting on the page
        const setCurrentRouterHighlight = (currentRoute: any) => {
            const { path, meta } = currentRoute;
            if (themeConfig.value.layout === 'classic') {
                (<any>state.defaultActive) = `/${path.split('/')[1]}`;
            } else {
                const pathSplit = meta.isDynamic ? meta.isDynamicPath.split('/') : path.split('/');
                if (pathSplit.length >= 4 && meta.isHide) state.defaultActive = pathSplit.splice(0, 3).join('/');
                else state.defaultActive = path;
            }
        };
        // Before the page is loaded
        onBeforeMount(() => {
            setCurrentRouterHighlight(route);
        });
        //When the page loads
        onMounted(() => {
            initElMenuOffsetLeft();
        });
		//When routing is updated
		onBeforeRouteUpdate((to) => {
            // Fix: https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
            setCurrentRouterHighlight(to);
			//Fixed the problem that when the cutting menu is opened in the classic layout, the left navigation menu data does not change after clicking tagsView
			let { layout, isClassicSplitMenu } = themeConfig.value;
			if (layout === 'classic' && isClassicSplitMenu) {
				proxy.mittBus.emit('setSendClassicChildren', setSendClassicChildren(to.path));
			}
		});
		return {
			menuLists,
			onElMenuHorizontalScroll,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.el-menu-horizontal-warp {
	flex: 1;
	overflow: hidden;
	margin-right: 30px;
	:deep(.el-scrollbar__bar.is-vertical) {
		display: none;
	}
	:deep(a) {
		width: 100%;
	}
	.el-menu.el-menu--horizontal {
		display: flex;
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
}
</style>
