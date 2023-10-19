import { createI18n } from 'vue-i18n';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import zhcnLocale from "element-plus/dist/locale/zh-cn.mjs";
import enLocale from "element-plus/dist/locale/en.mjs";
import nextZhcn from '/@/i18n/lang/zh-cn';
import nextEn from '/@/i18n/lang/en';
import nextZhtw from '/@/i18n/lang/zh-tw';
import pagesLoginZhcn from '/@/i18n/pages/login/zh-cn';
import pagesLoginEn from '/@/i18n/pages/login/en';
import pagesLoginZhtw from '/@/i18n/pages/login/zh-tw';
import pagesFormI18nZhcn from '/@/i18n/pages/formI18n/zh-cn';
import pagesFormI18nEn from '/@/i18n/pages/formI18n/en';
import pagesFormI18nZhtw from '/@/i18n/pages/formI18n/zh-tw';

// Define language internationalization content
/**
  * illustrate:
  * ts under /src/i18n/lang is the international content of the framework
  * ts under /src/i18n/pages is the internationalized content of each interface
  */
const messages = {
	[zhcnLocale.name]: {
		...zhcnLocale,
		message: {
			...nextZhcn,
			...pagesLoginZhcn,
			...pagesFormI18nZhcn,
		},
	},
	[enLocale.name]: {
		...enLocale,
		message: {
			...nextEn,
			...pagesLoginEn,
			...pagesFormI18nEn,
		},
	},
};

//Read pinia default language
const stores = useThemeConfig(pinia);
const { themeConfig } = storeToRefs(stores);

// Export language internationalization
// https://vue-i18n.intlify.dev/guide/essentials/fallback.html#explicit-fallback-with-one-locale
export const i18n = createI18n({
	legacy: false,
	silentTranslationWarn: true,
	missingWarn: false,
	silentFallbackWarn: true,
	fallbackWarn: false,
	locale: themeConfig.value.globalI18n,
	fallbackLocale: enLocale.name,
	messages,
});
