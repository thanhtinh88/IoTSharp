<template>
	<div class="layout-columns-aside">
		<el-scrollbar>
			<ul @mouseleave="onColumnsAsideMenuMouseleave()">
				<li
					v-for="(v, k) in columnsAsideList"
					:key="k"
					@click="onColumnsAsideMenuClick(v, k)"
					@mouseenter="onColumnsAsideMenuMouseenter(v, k)"
					:ref="
						(el) => {
							if (el) columnsAsideOffsetTopRefs[k] = el;
						}
					"
					:class="{ 'layout-columns-active': liIndex === k, 'layout-columns-hover': liHoverIndex === k }"
					:title="$t(v.meta.title)"
				>
					<div :class="themeConfig.columnsAsideLayout" v-if="!v.meta.isLink || (v.meta.isLink && v.meta.isIframe)">
						<SvgIcon :name="v.meta.icon" />
						<div class="columns-vertical-title font12">
							{{
								$t(v.meta.title) && $t(v.meta.title).length >= 4
									? $t(v.meta.title).substr(0, themeConfig.columnsAsideLayout === 'columns-vertical' ? 4 : 3)
									: $t(v.meta.title)
							}}
						</div>
					</div>
					<div :class="themeConfig.columnsAsideLayout" v-else>
						<a :href="v.meta.isLink" target="_blank">
							<SvgIcon :name="v.meta.icon" />
							<div class="columns-vertical-title font12">
								{{
									$t(v.meta.title) && $t(v.meta.title).length >= 4
										? $t(v.meta.title).substr(0, themeConfig.columnsAsideLayout === 'columns-vertical' ? 4 : 3)
										: $t(v.meta.title)
								}}
							</div>
						</a>
					</div>
				</li>
				<div ref="columnsAsideActiveRef" :class="themeConfig.columnsAsideStyle"></div>
			</ul>
		</el-scrollbar>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, ref, onMounted, nextTick, getCurrentInstance, watch, onUnmounted, defineComponent } from 'vue';
import { useRoute, useRouter, onBeforeRouteUpdate, RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';

//Define the interface to define the type of object
interface ColumnsAsideState {
	columnsAsideList: any[];
	liIndex: number;
	liOldIndex: null | number;
	liHoverIndex: null | number;
	liOldPath: null | string;
	difference: number;
	routeSplit: string[];
}
    export default defineComponent({
        name: 'layoutColumnsAside',
        setup() {
            const columnsAsideOffsetTopRefs: any = ref([]);
            const columnsAsideActiveRef = ref();
            const { proxy } = <any>getCurrentInstance();
            const stores = useRoutesList();
            const storesThemeConfig = useThemeConfig();
            const { routesList, isColumnsMenuHover, isColumnsNavHover } = storeToRefs(stores);
            const { themeConfig } = storeToRefs(storesThemeConfig);
            const route = useRoute();
            const router = useRouter();
            const state = reactive<ColumnsAsideState>({
                columnsAsideList: [],
                liIndex: 0,
                liOldIndex: null,
                liHoverIndex: null,
                liOldPath: null,
                difference: 0,
                routeSplit: [],
            });
            //Move the highlight position of the settings menu
            const setColumnsAsideMove = (k: number) => {
                state.liIndex = k;
                columnsAsideActiveRef.value.style.top = `${columnsAsideOffsetTopRefs.value[k].offsetTop + state.difference}px`;
            };
            //Menu highlight click event
            const onColumnsAsideMenuClick = (v: Object, k: number) => {
                setColumnsAsideMove(k);
                let { path, redirect } = v as any;
                if (redirect) router.push(redirect);
                else router.push(path);
            };
            //When the mouse moves in, the current sub-menu is displayed.
            const onColumnsAsideMenuMouseenter = (v: RouteRecordRaw, k: number) => {
                let { path } = v;
                state.liOldPath = path;
                state.liOldIndex = k;
                state.liHoverIndex = k;
                proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(path));
                stores.setColumnsMenuHover(false);
                stores.setColumnsNavHover(true);
            };
            //When the mouse is moved, the original sub-menu is displayed
            const onColumnsAsideMenuMouseleave = async () => {
                await stores.setColumnsNavHover(false);
                //Add a delayer to prevent the store.state.routesList value from not being the latest one.
                setTimeout(() => {
                    if (!isColumnsMenuHover && !isColumnsNavHover) proxy.mittBus.emit('restoreDefault');
                }, 100);
            };
            //Set the dynamic position of the highlight
            const onColumnsAsideDown = (k: number) => {
                nextTick(() => {
                    setColumnsAsideMove(k);
                });
            };
            // Set/filter routing (non-static routing/whether to display in the menu)
            const setFilterRoutes = () => {
                state.columnsAsideList = filterRoutesFun(routesList.value);
                const resData: any = setSendChildren(route.path);
                if (Object.keys(resData).length <= 0) return false;
                onColumnsAsideDown(resData.item[0].k);
                proxy.mittBus.emit('setSendColumnsChildren', resData);
            };
            //Transmit the current child data to the menu
            const setSendChildren = (path: string) => {
                const currentPathSplit = path.split('/');
                let currentData: any = {};
                state.columnsAsideList.map((v: any, k: number) => {
                    if (v.path === `/${currentPathSplit[1]}`) {
                        v['k'] = k;
                        currentData['item'] = [{ ...v }];
                        currentData['children'] = [{ ...v }];
                        if (v.children) currentData['children'] = v.children;
                    }
                });
                return currentData;
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
            // When tagsView is clicked, search the subscript columnsAsideList according to the route to highlight the left menu
            const setColumnsMenuHighlight = (path: string) => {
                state.routeSplit = path.split('/');
                state.routeSplit.shift();
                const routeFirst = `/${state.routeSplit[0]}`;
                const currentSplitRoute = state.columnsAsideList.find((v: any) => v.path === routeFirst);
                if (!currentSplitRoute) return false;
                //Delay getting the value to prevent failure to get it
                setTimeout(() => {
                    onColumnsAsideDown((<any>currentSplitRoute).k);
                }, 0);
            };
            // Monitor changes in layout configuration information and dynamically increase the menu highlight position and move pixels
            watch(
                pinia.state,
                (val) => {
                    val.themeConfig.themeConfig.columnsAsideStyle === 'columnsRound' ? (state.difference = 3) : (state.difference = 0);
                    if (!val.routesList.isColumnsMenuHover && !val.routesList.isColumnsNavHover) {
                        state.liHoverIndex = null;
                        proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(route.path));
                    } else {
                        state.liHoverIndex = state.liOldIndex;
                        if (!state.liOldPath) return false;
                        proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(state.liOldPath));
                    }
                },
                {
                    deep: true,
                }
            );
            //When the page loads
            onMounted(() => {
                setFilterRoutes();
                // Destroy the variable to prevent the last record from being retained when the mouse moves in again
                proxy.mittBus.on('restoreDefault', () => {
                    state.liOldIndex = null;
                    state.liOldPath = null;
                });
            });
            //When the page is unloaded
            onUnmounted(() => {
                proxy.mittBus.off('restoreDefault', () => { });
            });
            //When routing is updated
            onBeforeRouteUpdate((to) => {
                setColumnsMenuHighlight(to.path);
                proxy.mittBus.emit('setSendColumnsChildren', setSendChildren(to.path));
            });
            return {
                themeConfig,
                columnsAsideOffsetTopRefs,
                columnsAsideActiveRef,
                onColumnsAsideDown,
                onColumnsAsideMenuClick,
                onColumnsAsideMenuMouseenter,
                onColumnsAsideMenuMouseleave,
                ...toRefs(state),
            };
        },
    });
</script>

<style scoped lang="scss">
.layout-columns-aside {
	width: 70px;
	height: 100%;
	background: var(--next-bg-columnsMenuBar);
	ul {
		position: relative;
		li {
			color: var(--next-bg-columnsMenuBarColor);
			width: 100%;
			height: 50px;
			text-align: center;
			display: flex;
			cursor: pointer;
			position: relative;
			z-index: 1;
			.columns-vertical {
				margin: auto;
				.columns-vertical-title {
					padding-top: 1px;
				}
			}
			.columns-horizontal {
				display: flex;
				height: 50px;
				width: 100%;
				align-items: center;
				padding: 0 5px;
				i {
					margin-right: 3px;
				}
				a {
					display: flex;
					.columns-horizontal-title {
						padding-top: 1px;
					}
				}
			}
			a {
				text-decoration: none;
				color: var(--next-bg-columnsMenuBarColor);
			}
		}
		.layout-columns-active {
			color: var(--next-bg-columnsMenuBarColor) !important;
			transition: 0.3s ease-in-out;
		}
		.layout-columns-hover {
			color: var(--el-color-primary);
			a {
				color: var(--el-color-primary);
			}
		}
		.columns-round {
			background: var(--el-color-primary);
			color: var(--el-color-white);
			position: absolute;
			left: 50%;
			top: 2px;
			height: 44px;
			width: 65px;
			transform: translateX(-50%);
			z-index: 0;
			transition: 0.3s ease-in-out;
			border-radius: 5px;
		}
		.columns-card {
			@extend .columns-round;
			top: 0;
			height: 50px;
			width: 100%;
			border-radius: 0;
		}
	}
}
</style>
