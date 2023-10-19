/**
  * Define the interface to define the type of object
  * `stores` All types are defined here
  */

// User Info
export interface UserInfosState {
    authBtnList: string[];
    photo: string;
    roles: string[];
    time: number;
    userName: string;
    customer?: any;
    tenant?: any;
}
export interface UserInfosStates {
    userInfos: UserInfosState;
}

// Route cache list
export interface KeepAliveNamesState {
    keepAliveNames: string[];
    cachedViews: string[];
}

// The backend returns the original route (when not processed)
export interface RequestOldRoutesState {
    requestOldRoutes: string[];
}

// TagsView routing list
export interface TagsViewRoutesState {
    tagsViewRoutes: string[];
    isTagsViewCurrenFull: Boolean;
}

//Route list
export interface RoutesListState {
    routesList: string[];
    isColumnsMenuHover: Boolean;
    isColumnsNavHover: Boolean;
}

//Layout configuration
export interface ThemeConfigState {
    isDrawer: boolean;
    primary: string;
    topBar: string;
    topBarColor: string;
    isTopBarColorGradual: boolean;
    menuBar: string;
    menuBarColor: string;
    isMenuBarColorGradual: boolean;
    columnsMenuBar: string;
    columnsMenuBarColor: string;
    isColumnsMenuBarColorGradual: boolean;
    isCollapse: boolean;
    isUniqueOpened: boolean;
    isFixedHeader: boolean;
    isFixedHeaderChange: boolean;
    isClassicSplitMenu: boolean;
    isLockScreen: boolean;
    lockScreenTime: number;
    isShowLogo: boolean;
    isShowLogoChange: boolean;
    isBreadcrumb: boolean;
    isTagsview: boolean;
    isBreadcrumbIcon: boolean;
    isTagsviewIcon: boolean;
    isCacheTagsView: boolean;
    isSortableTagsView: boolean;
    isShareTagsView: boolean;
    isFooter: boolean;
    isGrayscale: boolean;
    isInvert: boolean;
    isIsDark: boolean;
    isWartermark: boolean;
    wartermarkText: string;
    tagsStyle: string;
    animation: string;
    columnsAsideStyle: string;
    columnsAsideLayout: string;
    layout: string;
    isRequestRoutes: boolean;
    globalTitle: string;
    globalViceTitle: string;
    globalI18n: string;
    globalComponentSize: string;
}
export interface ThemeConfigStates {
    themeConfig: ThemeConfigState;
}
export interface AppInfo {
    version: string; // User information
    installed: boolean; // Route cache list
    caCertificate: boolean; // The backend returns the original route (when not processed)
    domain: string; // TagsView routing list
    brokerThumbprint?: any; // routing list
    caThumbprint?: any; // Layout configuration
}