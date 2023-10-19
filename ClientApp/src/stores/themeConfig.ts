import { defineStore } from 'pinia';
import { ThemeConfigStates, ThemeConfigState } from './interface';

/**
  * Layout configuration
  * Fixed: https://gitee.com/lyt-top/vue-next-admin/issues/I567R1, thanks to @lanbao123
  * Optimized on 2020.05.28 by lyt. Problem that configuration does not take effect during development
  * When modifying the configuration:
  * 1. You need to clear the `window.localStorage` browser permanent cache every time
  * 2. Or click the `One-click restore to default` button at the bottom of the layout configuration to see the effect.
  */
export const useThemeConfig = defineStore('themeConfig', {
	state: (): ThemeConfigStates => ({
		themeConfig: {
			// Whether to open the layout configuration drawer
			isDrawer: false,

			/**
			* Global theme
			*/
			//Default primary theme color
			primary: '#4945FF',
			// Whether to enable dark mode
			isIsDark: false,

			/**
			* Menu/top bar
			* Note: v1.0.17 version removes setting layout switching and resetting theme style (initSetLayoutChange).
			* To switch layouts, you need to manually set the style. The set style will automatically synchronize with each layout.
			* Code location: /@/layout/navBars/breadcrumb/settings.vue
			*/
			//Default top bar navigation background color
			topBar: '#ffffff',
			//Default top bar navigation font color
			topBarColor: '#606266',
			// Whether to enable the top bar background color gradient
			isTopBarColorGradual: false,
			//Default menu navigation background color
			menuBar: '#ffffff',
			//Default menu navigation font color
			menuBarColor: '#666687',
			// Whether to enable menu background color gradient
			isMenuBarColorGradual: false,
			//Default column menu background color
			columnsMenuBar: '#545c64',
			//Default column menu font color
			columnsMenuBarColor: '#e6e6e6',
			// Whether to enable the background color gradient of the column menu
			isColumnsMenuBarColorGradual: false,

			/**
			* Interface settings
			*/
			// Whether to enable the horizontal folding effect of the menu
			isCollapse: false,
			// Whether to enable the menu accordion effect
			isUniqueOpened: false,
			// Whether to enable fixed Header
			isFixedHeader: false,
			// Initialize variable, used to update the height of menu el-scrollbar, please do not delete it
			isFixedHeaderChange: false,
			// Whether to enable the classic layout split menu (only classic layout takes effect)
			isClassicSplitMenu: false,
			// Whether to turn on automatic screen lock
			isLockScreen: false,
			// Enable automatic screen lock countdown (s/seconds)
			lockScreenTime: 30,

			/**
			* Interface display
			*/
			// Whether to enable the sidebar logo
			isShowLogo: true,
			// Initialization variable, used for height update of el-scrollbar, please do not delete it
			isShowLogoChange: false,
			// Whether to turn on Breadcrumb and force the classic and horizontal layout not to be displayed
			isBreadcrumb: true,
			// Whether to enable Tagsview
			isTagsview: true,
			// Whether to enable the Breadcrumb icon
			isBreadcrumbIcon: false,
			// Whether to enable Tagsview icon
			isTagsviewIcon: false,
			// Whether to enable TagsView caching
			isCacheTagsView: false,
			// Whether to enable TagsView drag and drop
			isSortableTagsView: true,
			// Whether to enable TagsView sharing
			isShareTagsView: false,
			// Whether to enable the copyright information at the bottom of the Footer
			isFooter: false,
			// Whether to enable gray mode
			isGrayscale: false,
			// Whether to enable color weak mode
			isInvert: false,
			// Whether to enable watermark
			isWartermark: false,
			// watermark copy
			wartermarkText: 'IoTSharp',

			/**
						 * Other settings
			*/
			// Tagsview style: optional value "<tags-style-one|tags-style-four|tags-style-five>", default tags-style-five
			// The defined value has the same name as the class in `/src/layout/navBars/tagsView/tagsView.vue`
			tagsStyle: 'tags-style-five',
			// Main page switching animation: optional value "<slide-right|slide-left|opacitys>", default slide-right
			animation: 'slide-right',
			// Column highlighting style: optional value "<columns-round|columns-card>", default columns-round
			columnsAsideStyle: 'columns-round',
			// Column layout style: optional value "<columns-horizontal|columns-vertical>", default columns-horizontal
			columnsAsideLayout: 'columns-vertical',

			/**
			* Layout switching
			* Note: For demonstration purposes, when switching layouts, the colors will be restored to default. Code location: /@/layout/navBars/breadcrumb/settings.vue
			* `initSetLayoutChange(set layout switching, reset theme style)` method in
			*/
			// Layout switching: optional value "<defaults|classic|transverse|columns>", default defaults
			layout: 'defaults',

			/**
			* Backend control routing
			*/
			// Whether to enable backend control routing
			isRequestRoutes: true,

			/**
			* Global website title/subtitle
			*/
			// Main title of the website (menu navigation, browser current web page title)
			globalTitle: 'IoTSharp',
			// Website subtitle (text at the top of the login page)
			globalViceTitle: 'IoTSharp',
			//Default initial language, optional value "<zh-cn|en|zh-tw>", default en
			globalI18n: 'en',
			//Default global component size, optional value "<large|'default'|small>", default 'large'
			globalComponentSize: 'default',
		},
	}),
	actions: {
		setThemeConfig(data: ThemeConfigState) {
			this.themeConfig = data;
		},
	},
});