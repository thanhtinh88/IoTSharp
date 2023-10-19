<template>
    <div class="layout-navbars-tagsview" :class="{ 'layout-navbars-tagsview-shadow': getThemeConfig.layout === 'classic' }">
        <el-scrollbar ref="scrollbarRef" @wheel.prevent="onHandleScroll">
            <ul class="layout-navbars-tagsview-ul" :class="setTagsStyle" ref="tagsUlRef">
                <li v-for="(v, k) in tagsViewList"
                    :key="k"
                    class="layout-navbars-tagsview-ul-li"
                    :data-url="v.url"
                    :class="{ 'is-active': isActive(v) }"
                    @contextmenu.prevent="onContextmenu(v, $event)"
                    @click="onTagsClick(v, k)"
                    :ref="
                    (el)=>
                    {
                    if (el) tagsRefs[k] = el;
                    }
                    "
                    >
                    <i class="iconfont icon-webicon318 layout-navbars-tagsview-ul-li-iconfont" v-if="isActive(v)"></i>
                    <SvgIcon :name="v.meta.icon" v-if="!isActive(v) && getThemeConfig.isTagsviewIcon" class="pr5" />
                    <span>{{ setTagsViewNameI18n(v) }}</span>
                    <template v-if="isActive(v)">
                        <SvgIcon name="ele-RefreshRight"
                                 class="ml5 layout-navbars-tagsview-ul-li-refresh"
                                 @click.stop="refreshCurrentTagsView($route.fullPath)" />
                        <SvgIcon name="ele-Close"
                                 class="layout-navbars-tagsview-ul-li-icon layout-icon-active"
                                 v-if="!v.meta.isAffix"
                                 @click.stop="closeCurrentTagsView(getThemeConfig.isShareTagsView ? v.path : v.url)" />
                    </template>
                    <SvgIcon name="ele-Close"
                             class="layout-navbars-tagsview-ul-li-icon layout-icon-three"
                             v-if="!v.meta.isAffix"
                             @click.stop="closeCurrentTagsView(getThemeConfig.isShareTagsView ? v.path : v.url)" />
                </li>
            </ul>
        </el-scrollbar>
        <Contextmenu :dropdown="dropdown" ref="contextmenuRef" @currentContextmenuClick="onCurrentContextmenuClick" />
    </div>
</template>

<script lang="ts">
    import {
        toRefs,
        reactive,
        onMounted,
        computed,
        ref,
        nextTick,
        onBeforeUpdate,
        onBeforeMount,
        onUnmounted,
        getCurrentInstance,
        watch,
        defineComponent,
    } from 'vue';
    import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router';
    import Sortable from 'sortablejs';
    import { ElMessage } from 'element-plus';
    import { storeToRefs } from 'pinia';
    import pinia from '/@/stores/index';
    import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
    import { useThemeConfig } from '/@/stores/themeConfig';
    import { useKeepALiveNames } from '/@/stores/keepAliveNames';
    import { Session } from '/@/utils/storage';
    import { isObjectValueEqual } from '/@/utils/arrayOperation';
    import other from '/@/utils/other.ts';
    import Contextmenu from '/@/layout/navBars/tagsView/contextmenu.vue';

    //Define the interface to define the type of object
    interface TagsViewState {
        routeActive: string;
        routePath: string | unknown;
        dropdown: {
            x: string | number;
            y: string | number;
        };
        sortable: any;
        tagsRefsIndex: number;
        tagsViewList: any[];
        tagsViewRoutesList: any[];
    }
    interface RouteParams {
        path: string;
        url: string;
        query: object;
        params: object;
    }
    interface CurrentContextmenu {
        meta: {
            isDynamic: boolean;
        };
        params: any;
        query: any;
        path: string;
        contextMenuClickId: string | number;
    }

    export default defineComponent({
        name: 'layoutTagsView',
        components: { Contextmenu },
        setup() {
            const { proxy } = <any>getCurrentInstance();
            const tagsRefs = ref<any[]>([]);
            const scrollbarRef = ref();
            const contextmenuRef = ref();
            const tagsUlRef = ref();
            const stores = useTagsViewRoutes();
            const storesThemeConfig = useThemeConfig();
            const storesTagsViewRoutes = useTagsViewRoutes();
            const { themeConfig } = storeToRefs(storesThemeConfig);
            const { tagsViewRoutes } = storeToRefs(storesTagsViewRoutes);
            const storesKeepALiveNames = useKeepALiveNames();
            const route = useRoute();
            const router = useRouter();
            const state = reactive<TagsViewState>({
                routeActive: '',
                routePath: route.path,
                dropdown: { x: '', y: '' },
                sortable: '',
                tagsRefsIndex: 0,
                tagsViewList: [],
                tagsViewRoutesList: [],
            });
            // Dynamically set tagsView style
            const setTagsStyle = computed(() => {
                return themeConfig.value.tagsStyle;
            });
            // Get layout configuration information
            const getThemeConfig = computed(() => {
                return themeConfig.value;
            });
            // Set custom tagsView name, custom tagsView name internationalization
            const setTagsViewNameI18n = computed(() => {
                return (v: any) => {
                    return other.setTagsViewNameI18n(v);
                };
            });
             //Set tagsView highlighting
            const isActive = (v: RouteParams) => {
                if (getThemeConfig.value.isShareTagsView) {
                    return v.path === state.routePath;
                } else {
                    if ((v.query && Object.keys(v.query).length) || (v.params && Object.keys(v.params).length)) {
                        // Ordinary parameter passing
                        return v.url ? v.url === state.routeActive : v.path === state.routeActive;
                    } else {
                        // Pass parameters through name, take the value of params, and the parameters will disappear when the page is refreshed.
                        // https://gitee.com/lyt-top/vue-next-admin/issues/I51RS9
                        return v.path === state.routePath;
                    }
                }
            };
            // Store tagsViewList in the browser's temporary cache, and keep the record when the page is refreshed.
            const addBrowserSetSession = (tagsViewList: Array<object>) => {
                Session.set('tagsViewList', tagsViewList);
            };
            // Get the tagsViewRoutes list in vuex
            const getTagsViewRoutes = async () => {
                state.routeActive = await setTagsViewHighlight(route);
                state.routePath = (await route.meta.isDynamic) ? route.meta.isDynamicPath : route.path;
                state.tagsViewList = [];
                state.tagsViewRoutesList = tagsViewRoutes.value;
                initTagsView();
            };
            // Obtain routing information in vuex: If fixed (isAffix) is set, initialize the display
            const initTagsView = async () => {
                if (Session.get('tagsViewList') && getThemeConfig.value.isCacheTagsView) {
                    state.tagsViewList = await Session.get('tagsViewList');
                } else {
                    await state.tagsViewRoutesList.map((v: any) => {
                        if (v.meta.isAffix && !v.meta.isHide) {
                            v.url = setTagsViewHighlight(v);
                            state.tagsViewList.push({ ...v });
                            storesKeepALiveNames.addCachedView(v);
                        }
                    });
                    await addTagsView(route.path, route);
                }
                //Initialize the subscript of the current element (li)
                getTagsRefsIndex(getThemeConfig.value.isShareTagsView ? state.routePath : state.routeActive);
            };
            // Processing can open multi-label details, single-label details (dynamic routing (xxx/:id/:name"), ordinary routing processing)
            const solveAddTagsView = async (path: string, to?: any) => {
                let isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path;
                let current = state.tagsViewList.filter(
                    (v: any) =>
                        v.path === isDynamicPath &&
                        isObjectValueEqual(
                            to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
                            to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
                        )
                );
                if (current.length <= 0) {
                    // prevent：Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.
                    let findItem = state.tagsViewRoutesList.find((v: any) => v.path === isDynamicPath);
                    if (!findItem) return false;
                    if (findItem.meta.isAffix) return false;
                    if (findItem.meta.isLink && !findItem.meta.isIframe) return false;
                    to.meta.isDynamic ? (findItem.params = to.params) : (findItem.query = to.query);
                    findItem.url = setTagsViewHighlight(findItem);
                    state.tagsViewList.push({ ...findItem });
                    await storesKeepALiveNames.addCachedView(findItem);
                    addBrowserSetSession(state.tagsViewList);
                }
            };
            // When processing a single tag, the second value does not overwrite the first tagsViewList value (Session Storage)
            const singleAddTagsView = (path: string, to?: any) => {
                let isDynamicPath = to.meta.isDynamic ? to.meta.isDynamicPath : path;
                state.tagsViewList.forEach((v) => {
                    if (
                        v.path === isDynamicPath &&
                        !isObjectValueEqual(
                            to.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
                            to.meta.isDynamic ? (to?.params ? to?.params : null) : to?.query ? to?.query : null
                        )
                    ) {
                        to.meta.isDynamic ? (v.params = to.params) : (v.query = to.query);
                        v.url = setTagsViewHighlight(v);
                        addBrowserSetSession(state.tagsViewList);
                    }
                });
            };
            // 1. Add tagsView: Hide (isHide) is not set and is also added to tagsView (multi-tag details and single-tag details can be turned on)
            const addTagsView = (path: string, to?: any) => {
                // Prevent routing information from not being obtained
                nextTick(async () => {
                    // Fix: https://gitee.com/lyt-top/vue-next-admin/issues/I3YX6G
                    let item: any = '';
                    if (to && to.meta.isDynamic) {
                        // Dynamic routing (xxx/:id/:name"): different parameters, open multiple tagsview
                        if (!getThemeConfig.value.isShareTagsView) await solveAddTagsView(path, to);
                        else await singleAddTagsView(path, to);
                        if (state.tagsViewList.some((v: any) => v.path === to.meta.isDynamicPath)) return false;
                        item = state.tagsViewRoutesList.find((v: any) => v.path === to.meta.isDynamicPath);
                    } else {
                        // Ordinary routing: different parameters, open multiple tagsview
                        if (!getThemeConfig.value.isShareTagsView) await solveAddTagsView(path, to);
                        else await singleAddTagsView(path, to);
                        if (state.tagsViewList.some((v: any) => v.path === path)) return false;
                        item = state.tagsViewRoutesList.find((v: any) => v.path === path);
                    }
                    if (!item) return false;
                    if (item.meta.isLink && !item.meta.isIframe) return false;
                    if (to && to.meta.isDynamic) item.params = to?.params ? to?.params : route.params;
                    else item.query = to?.query ? to?.query : route.query;
                    item.url = setTagsViewHighlight(item);
                    await storesKeepALiveNames.addCachedView(item);
                    await state.tagsViewList.push({ ...item });
                    await addBrowserSetSession(state.tagsViewList);
                });
             };
            // 2. Refresh the current tagsView:
            const refreshCurrentTagsView = async (fullPath: string) => {
                const item = state.tagsViewList.find((v: any) => (getThemeConfig.value.isShareTagsView ? v.path === fullPath : v.url === fullPath));
                if (item != null) {
                    await storesKeepALiveNames.delCachedView(item);
                    proxy.mittBus.emit('onTagsViewRefreshRouterView', fullPath);
                    if (item.meta.isKeepAlive) storesKeepALiveNames.addCachedView(item);
                }
            };
            // 3. Close the current tagsView: If it is set to be fixed (isAffix), it cannot be closed.
            const closeCurrentTagsView = (path: string) => {
                state.tagsViewList.map((v: any, k: number, arr: any) => {
                    if (!v.meta.isAffix) {
                        if (getThemeConfig.value.isShareTagsView ? v.path === path : v.url === path) {
                            storesKeepALiveNames.delCachedView(v);
                            state.tagsViewList.splice(k, 1);
                            setTimeout(() => {
                                if (state.tagsViewList.length === k && getThemeConfig.value.isShareTagsView ? state.routePath === path : state.routeActive === path) {
                                    // When the last one is highlighted
                                    if (arr[arr.length - 1].meta.isDynamic) {
                                        // Dynamic routing (xxx/:id/:name")
                                        if (k !== arr.length) router.push({ name: arr[k].name, params: arr[k].params });
                                        else router.push({ name: arr[arr.length - 1].name, params: arr[arr.length - 1].params });
                                    } else {
                                        // Ordinary routing
                                        if (k !== arr.length) router.push({ path: arr[k].path, query: arr[k].query });
                                        else router.push({ path: arr[arr.length - 1].path, query: arr[arr.length - 1].query });
                                    }
                                } else {
                                    // When it is not the last one and is highlighted, jump to the next one
                                    if (state.tagsViewList.length !== k && getThemeConfig.value.isShareTagsView ? state.routePath === path : state.routeActive === path) {
                                        if (arr[k].meta.isDynamic) {
                                            // Dynamic routing (xxx/:id/:name")
                                            router.push({ name: arr[k].name, params: arr[k].params });
                                        } else {
                                            // Ordinary routing
                                            router.push({ path: arr[k].path, query: arr[k].query });
                                        }
                                    }
                                }
                            }, 0);
                        }
                    }
                });
                addBrowserSetSession(state.tagsViewList);
            };
            // 4. Close other tagsView: If fixed (isAffix) is set, it will not be closed.
            const closeOtherTagsView = (path: string) => {
                if (Session.get('tagsViewList')) {
                    state.tagsViewList = [];
                    Session.get('tagsViewList').map((v: any) => {
                        if (v.meta.isAffix && !v.meta.isHide) {
                            v.url = setTagsViewHighlight(v);
                            storesKeepALiveNames.delOthersCachedViews(v);
                            state.tagsViewList.push({ ...v });
                        }
                    });
                    addTagsView(path, route);
                    addBrowserSetSession(state.tagsViewList);
                }
            };
            // 5. Close all tagsView: If fixed (isAffix) is set, it will not be closed.
            const closeAllTagsView = () => {
                if (Session.get('tagsViewList')) {
                    storesKeepALiveNames.delAllCachedViews();
                    state.tagsViewList = [];
                    Session.get('tagsViewList').map((v: any) => {
                        if (v.meta.isAffix && !v.meta.isHide) {
                            v.url = setTagsViewHighlight(v);
                            state.tagsViewList.push({ ...v });
                            router.push({ path: state.tagsViewList[state.tagsViewList.length - 1].path });
                        }
                    });
                    addBrowserSetSession(state.tagsViewList);
                }
            };
            // 6. Open the current page in full screen
            const openCurrenFullscreen = async (path: string) => {
                const item = state.tagsViewList.find((v: any) => (getThemeConfig.value.isShareTagsView ? v.path === path : v.url === path));
                if (item.meta.isDynamic) await router.push({ name: item.name, params: item.params });
                else await router.push({ name: item.name, query: item.query });
                stores.setCurrenFullscreen(true);
            };
            // Click on the right-click menu of the current item, compare the currently clicked routing path with the tagsView routing array in the browser cache, and obtain the detailed routing information of the currently clicked item.
            // Prevent tagsView from operating abnormally when it is not displayed on the current page
            const getCurrentRouteItem = (path: string, cParams: any) => {
                const itemRoute = Session.get('tagsViewList') ? Session.get('tagsViewList') : state.tagsViewList;
                return itemRoute.find((v: any) => {
                    if (
                        v.path === path &&
                        isObjectValueEqual(
                            v.meta.isDynamic ? (v.params ? v.params : null) : v.query ? v.query : null,
                            cParams && Object.keys(cParams ? cParams : {}).length > 0 ? cParams : null
                        )
                    ) {
                        return v;
                    } else if (v.path === path && Object.keys(cParams ? cParams : {}).length <= 0) {
                        return v;
                    }
                });
            };
            // Current item right-click menu click
            const onCurrentContextmenuClick = async (item: CurrentContextmenu) => {
                const cParams = item.meta.isDynamic ? item.params : item.query;
                if (!getCurrentRouteItem(item.path, cParams)) return ElMessage({ type: 'warning', message: 'Please enter the path and complete parameters (query, params) correctly' });
                const { path, name, params, query, meta, url } = getCurrentRouteItem(item.path, cParams);
                switch (item.contextMenuClickId) {
                    case 0:
                        // Refresh the current
                        if (meta.isDynamic) await router.push({ name, params });
                        else await router.push({ path, query });
                        refreshCurrentTagsView(route.fullPath);
                        break;
                    case 1:
                        // Close the current
                        closeCurrentTagsView(getThemeConfig.value.isShareTagsView ? path : url);
                        break;
                    case 2:
                        // Close other
                        if (meta.isDynamic) await router.push({ name, params });
                        else await router.push({ path, query });
                        closeOtherTagsView(path);
                        break;
                    case 3:
                        // Close all
                        closeAllTagsView();
                        break;
                    case 4:
                        // Turn on the current page in full screen
                        openCurrenFullscreen(getThemeConfig.value.isShareTagsView? path: url);
                        break;
                }
            };
            // When right-clicking: pass x,y coordinate values ​​to the subcomponent (props)
            const onContextmenu = (v: any, e: any) => {
                const { clientX, clientY } = e;
                state.dropdown.x = clientX;
                state.dropdown.y = clientY;
                contextmenuRef.value.openContextmenu(v);
            };
            //When the current tagsView item is clicked
            const onTagsClick = (v: any, k: number) => {
                state.tagsRefsIndex = k;
                router.push(v);
            };
            // Handle tagsView highlighting (used for multi-tag details, not used for single-tag details)
            const setTagsViewHighlight = (v: any) => {
                let params = v.query && Object.keys(v.query).length > 0 ? v.query : v.params;
                if (!params || Object.keys(params).length <= 0) return v.path;
                let path = '';
                for (let i in params) {
                    path += params[i];
                }
                // Determine whether it is a dynamic route (xxx/:id/:name")
                return `${v.meta.isDynamic ? v.meta.isDynamicPath : v.path}-${path}`;
            };
            //Update scroll bar display
            const updateScrollbar = () => {
                proxy.$refs.scrollbarRef.update();
            };
            //Mouse wheel scrolling
            const onHandleScroll = (e: any) => {
                proxy.$refs.scrollbarRef.$refs.wrap$.scrollLeft += e.wheelDelta / 4;
            };
            // tagsView horizontal scrolling
            const tagsViewmoveToCurrentTag = () => {
                nextTick(() => {
                    if (tagsRefs.value.length <= 0) return false;
                    // current li element
                    let liDom = tagsRefs.value[state.tagsRefsIndex];
                    //The current li element index
                    let liIndex = state.tagsRefsIndex;
                    //The total length of li elements under the current ul
                    let liLength = tagsRefs.value.length;
                    // top li
                    let liFirst: any = tagsRefs.value[0];
                    //Final li
                    let liLast: any = tagsRefs.value[tagsRefs.value.length - 1];
                    //The value of the current scroll bar
                    let scrollRefs = proxy.$refs.scrollbarRef.$refs.wrapRef;
                    //Current scroll bar scrolling width
                    let scrollS = scrollRefs.scrollWidth;
                    //Current scroll bar offset width
                    let offsetW = scrollRefs.offsetWidth;
                    // Current scroll bar offset distance
                    let scrollL = scrollRefs.scrollLeft;
                    // Previous tags li dom
                    let liPrevTag: any = tagsRefs.value[state.tagsRefsIndex - 1];
                    // next tags li dom
                    let liNextTag: any = tagsRefs.value[state.tagsRefsIndex + 1];
                    //The offset distance of the previous tags li dom
                    let beforePrevL: any = '';
                    //Offset distance of next tags li dom
                    let afterNextL: any = '';
                    if (liDom === liFirst) {
                        //head
                        scrollRefs.scrollLeft = 0;
                    } else if (liDom === liLast) {
                        // tail
                        scrollRefs.scrollLeft = scrollS - offsetW;
                    } else {
                        //Non-head/tail
                        if (liIndex === 0) beforePrevL = liFirst.offsetLeft - 5;
                        else beforePrevL = liPrevTag?.offsetLeft - 5;
                        if (liIndex === liLength) afterNextL = liLast.offsetLeft + liLast.offsetWidth + 5;
                        else afterNextL = liNextTag.offsetLeft + liNextTag.offsetWidth + 5;
                        if (afterNextL > scrollL + offsetW) {
                            scrollRefs.scrollLeft = afterNextL - offsetW;
                        } else if (beforePrevL < scrollL) {
                            scrollRefs.scrollLeft = beforePrevL;
                        }
                    }
                    //Update the scroll bar to prevent it from appearing
                    updateScrollbar();
                });
            };
            // Get the subscript of tagsView: used to handle horizontal scrolling when tagsView is clicked
            const getTagsRefsIndex = (path: string | unknown) => {
                nextTick(async () => {
                    // await uses this writing method to prevent the tagsViewList list data from being incomplete.
                    let tagsViewList = await state.tagsViewList;
                    state.tagsRefsIndex = tagsViewList.findIndex((v: any) => {
                        if (getThemeConfig.value.isShareTagsView) {
                            return v.path === path;
                        } else {
                            return v.url === path;
                        }
                    });
                    //Add initialization horizontal scroll bar to move to the corresponding position
                    tagsViewmoveToCurrentTag();
                });
            };
            //Set tagsView to enable drag and drop
            const initSortable = async () => {
                const el = <HTMLElement>document.querySelector('.layout-navbars-tagsview-ul');
                if (!el) return false;
                state.sortable.el && state.sortable.destroy();
                state.sortable = Sortable.create(el, {
                    animation: 300,
                    dataIdAttr: 'data-url',
                    disabled: getThemeConfig.value.isSortableTagsView ? false : true,
                    onEnd: () => {
                        const sortEndList: any = [];
                        state.sortable.toArray().map((val: any) => {
                            state.tagsViewList.map((v: any) => {
                                if (v.url === val) sortEndList.push({ ...v });
                            });
                        });
                        addBrowserSetSession(sortEndList);
                    },
                });
            };
            //Drag issues, https://gitee.com/lyt-top/vue-next-admin/issues/I3ZRRI
            const onSortableResize = async () => {
                await initSortable();
                if (other.isMobile()) state.sortable.el && state.sortable.destroy();
            };
            // Before the page is loaded
        onBeforeMount(() => {
        // Initialization to prevent direct access from the mobile phone and drag and drop
                onSortableResize();
                //Drag issues, https://gitee.com/lyt-top/vue-next-admin/issues/I3ZRRI
                window.addEventListener('resize', onSortableResize);
                // Monitor non-this page calls 0 refresh the current, 1 close the current, 2 close others, 3 close all 4 the current page full screen
                proxy.mittBus.on('onCurrentContextmenuClick', (data: CurrentContextmenu) => {
                    onCurrentContextmenuClick(data);
                });
                // Monitor layout configuration interface to open/close drag and drop
                proxy.mittBus.on('openOrCloseSortable', () => {
                    initSortable();
                });
                // Listen to the layout configuration to enable TagsView sharing, and restore the default value for demonstration
                proxy.mittBus.on('openShareTagsView', () => {
                    if (getThemeConfig.value.isShareTagsView) {
                        router.push('/home');
                        state.tagsViewList = [];
                        state.tagsViewRoutesList.map((v: any) => {
                            if (v.meta.isAffix && !v.meta.isHide) {
                                v.url = setTagsViewHighlight(v);
                                state.tagsViewList.push({ ...v });
                            }
                        });
                    }
                });
            });
            //When the page is unloaded
            onUnmounted(() => {
                //Cancel call monitoring for non-this page
                proxy.mittBus.off('onCurrentContextmenuClick', () => { });
                //Cancel monitoring layout configuration interface to turn on/off drag and drop
                proxy.mittBus.off('openOrCloseSortable', () => { });
                // Cancel the listening layout configuration and enable TagsView sharing
                proxy.mittBus.off('openShareTagsView', () => { });
                //Cancel window resize monitoring
                window.removeEventListener('resize', onSortableResize);
            });
            //When the page is updated
            onBeforeUpdate(() => {
                tagsRefs.value = [];
            });
            //When the page loads
            onMounted(() => {
                //Initialize the tagsViewRoutes list in pinia
                getTagsViewRoutes();
                initSortable();
            });
            //When routing is updated (life hook within component)
            onBeforeRouteUpdate(async (to) => {
                state.routeActive = setTagsViewHighlight(to);
                state.routePath = to.meta.isDynamic ? to.meta.isDynamicPath : to.path;
                await addTagsView(to.path, to);
                getTagsRefsIndex(getThemeConfig.value.isShareTagsView ? state.routePath : state.routeActive);
            });
            // Monitor route changes and dynamically assign values to tagsView
            watch(
                pinia.state,
                (val) => {
                    if (val.tagsViewRoutes.tagsViewRoutes.length === state.tagsViewRoutesList.length) return false;
                    getTagsViewRoutes();
                },
                {
                    deep: true,
                }
            );
            return {
                isActive,
                onContextmenu,
                onTagsClick,
                tagsRefs,
                contextmenuRef,
                scrollbarRef,
                tagsUlRef,
                onHandleScroll,
                getThemeConfig,
                setTagsStyle,
                setTagsViewNameI18n,
                refreshCurrentTagsView,
                closeCurrentTagsView,
                onCurrentContextmenuClick,
                ...toRefs(state),
            };
        },
    });
</script>

<style scoped lang="scss">
    .layout-navbars-tagsview {
        background-color: var(--el-color-white);
        border-bottom: 1px solid var(--next-border-color-light);
        position: relative;
        z-index: 4;

        :deep(.el-scrollbar__wrap) {
            overflow-x: auto !important;
        }

        &-ul {
            list-style: none;
            margin: 0;
            padding: 0;
            height: 34px;
            display: flex;
            align-items: center;
            color: var(--el-text-color-regular);
            font-size: 12px;
            white-space: nowrap;
            padding: 0 15px;

            &-li {
                height: 26px;
                line-height: 26px;
                display: flex;
                align-items: center;
                border: 1px solid var(--el-border-color-lighter);
                padding: 0 15px;
                margin-right: 5px;
                border-radius: 2px;
                position: relative;
                z-index: 0;
                cursor: pointer;
                justify-content: space-between;

                &:hover {
                    background-color: var(--el-color-primary-light-9);
                    color: var(--el-color-primary);
                    border-color: var(--el-color-primary-light-5);
                }

                &-iconfont {
                    position: relative;
                    left: -5px;
                    font-size: 12px;
                }

                &-icon {
                    border-radius: 100%;
                    position: relative;
                    height: 14px;
                    width: 14px;
                    text-align: center;
                    line-height: 14px;
                    right: -5px;

                    &:hover {
                        color: var(--el-color-white);
                        background-color: var(--el-color-primary-light-3);
                    }
                }

                .layout-icon-active {
                    display: block;
                }

                .layout-icon-three {
                    display: none;
                }
            }

            .is-active {
                color: var(--el-color-white);
                background: var(--el-color-primary);
                border-color: var(--el-color-primary);
                transition: border-color 3s ease;
            }
        }
        // style 4
        .tags-style-four {
            .layout-navbars-tagsview-ul-li {
                margin-right: 0 !important;
                border: none !important;
                position: relative;
                border-radius: 3px !important;

                .layout-icon-active {
                    display: none;
                }

                .layout-icon-three {
                    display: block;
                }

                &:hover {
                    background: none !important;
                }
            }

            .is-active {
                background: none !important;
                color: var(--el-color-primary) !important;
            }
        }
        // style 5
        .tags-style-five {
            align-items: flex-end;

            .tags-style-five-svg {
                -webkit-mask-box-image: url("data:image/svg+xml,%3Csvg width='68' height='34' viewBox='0 0 68 34' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='m27,0c-7.99582,0 -11.95105,0.00205 -12,12l0,6c0,8.284 -0.48549,16.49691 -8.76949,16.49691l54.37857,-0.11145c-8.284,0 -8.60908,-8.10146 -8.60908,-16.38546l0,-6c0.11145,-12.08445 -4.38441,-12 -12,-12l-13,0z' fill='%23409eff'/%3E%3C/svg%3E") 12 27 15;
            }

            .layout-navbars-tagsview-ul-li {
                padding: 0 5px;
                border-width: 15px 27px 15px;
                border-style: solid;
                border-color: transparent;
                margin: 0 -15px;

                .layout-icon-active,
                .layout-navbars-tagsview-ul-li-iconfont,
                .layout-navbars-tagsview-ul-li-refresh {
                    display: none;
                }

                .layout-icon-three {
                    display: block;
                }

                &:hover {
                    @extend .tags-style-five-svg;
                    background: var(--el-color-primary-light-9);
                    color: unset;
                }
            }

            .is-active {
                @extend .tags-style-five-svg;
                background: var(--el-color-primary-light-9) !important;
                color: var(--el-color-primary) !important;
                z-index: 1;
            }
        }
    }

    .layout-navbars-tagsview-shadow {
        box-shadow: rgb(0 21 41 / 4%) 0px 1px 4px;
    }
</style>