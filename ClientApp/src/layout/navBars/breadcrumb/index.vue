<template>
    <div class="layout-navbars-breadcrumb-index">
        <Logo v-if="setIsShowLogo" />
        <Breadcrumb />
        <Horizontal :menuList="menuList" v-if="isLayoutTransverse" />
        <User />
    </div>
</template>

<script lang="ts">
    import { computed, reactive, toRefs, onMounted, onUnmounted, getCurrentInstance, defineComponent } from 'vue';
    import { useRoute } from 'vue-router';
    import { storeToRefs } from 'pinia';
    import { useRoutesList } from '/@/stores/routesList';
    import { useThemeConfig } from '/@/stores/themeConfig';
    import Breadcrumb from '/@/layout/navBars/breadcrumb/breadcrumb.vue';
    import User from '/@/layout/navBars/breadcrumb/user.vue';
    import Logo from '/@/layout/logo/index.vue';
    import Horizontal from '/@/layout/navMenu/horizontal.vue';

    //Define the interface to define the type of object
    interface IndexState {
        menuList: object[];
    }

    export default defineComponent({
        name: 'layoutBreadcrumbIndex',
        components: { Breadcrumb, User, Logo, Horizontal },
        setup() {
            const { proxy } = <any>getCurrentInstance();
            const stores = useRoutesList();
            const storesThemeConfig = useThemeConfig();
            const { themeConfig } = storeToRefs(storesThemeConfig);
            const { routesList } = storeToRefs(stores);
            const route = useRoute();
            const state = reactive<IndexState>({
                menuList: [],
            });
            //Set logo to show/hide
            const setIsShowLogo = computed(() => {
                let { isShowLogo, layout } = themeConfig.value;
                return (isShowLogo && layout === 'classic') || (isShowLogo && layout === 'transverse');
            });
            //Set whether to display the horizontal navigation menu
            const isLayoutTransverse = computed(() => {
                let { layout, isClassicSplitMenu } = themeConfig.value;
                return layout === 'transverse' || (isClassicSplitMenu && layout === 'classic');
            });
            //Set/filter routing (non-static routing/whether to display in the menu)
            const setFilterRoutes = () => {
                let { layout, isClassicSplitMenu } = themeConfig.value;
                if (layout === 'classic' && isClassicSplitMenu) {
                    state.menuList = delClassicChildren(filterRoutesFun(routesList.value));
                    const resData = setSendClassicChildren(route.path);
                    proxy.mittBus.emit('setSendClassicChildren', resData);
                } else {
                    state.menuList = filterRoutesFun(routesList.value);
                }
            };
            // When the split menu is set, delete the children at the bottom
            const delClassicChildren = (arr: Array<object>) => {
                arr.map((v: any) => {
                    if (v.children) delete v.children;
                });
                return arr;
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
            //When the page loads
            onMounted(() => {
                setFilterRoutes();
                proxy.mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
                    setFilterRoutes();
                });
            });
            //When the page is unloaded
            onUnmounted(() => {
                proxy.mittBus.off('getBreadcrumbIndexSetFilterRoutes', () => { });
            });
            return {
                setIsShowLogo,
                isLayoutTransverse,
                ...toRefs(state),
            };
        },
    });
</script>

<style scoped lang="scss">
    .layout-navbars-breadcrumb-index {
        height: 50px;
        display: flex;
        align-items: center;
        background: var(--next-bg-topBar);
        border-bottom: 1px solid var(--next-border-color-light);
    }
</style>
