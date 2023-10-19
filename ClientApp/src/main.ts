import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n';
import other from '/@/utils/other';
import '/@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import 'virtual:windi.css';
import formCreate from '@form-create/element-ui';

// @ts-ignore formCreate auto-import element-plus required dependencies
import install from '@form-create/element-ui/auto-import';
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'\

// ! If you use unplugin-element-plus and only use the component API, you need to import the styles manually.
// ! Refer to the official documentation https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85 %A5
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/notification/style/css';
import 'element-plus/es/components/message-box/style/css';
import ElementPlus from 'element-plus';
import en from 'element-plus/es/locale/lang/en';
import 'element-plus/dist/index.css';


//Introduce CRUD components
import { FastCrud } from '@fast-crud/fast-crud';
import '@fast-crud/fast-crud/dist/style.css';
// element
import ui from '@fast-crud/ui-element';
formCreate.use(install);
import dayjs from 'dayjs'; // dayjs
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
const app = createApp(App);

directive(app);
other.elSvg(app);

app.use(ElementPlus, { locale: en });
app.use(pinia).use(router).use(i18n).use(VueGridLayout).use(formCreate);
app.use(ui);
app.use(FastCrud);
app.mount('#app');

dayjs.extend(utc)
dayjs.extend(timezone)
app.config.globalProperties.mittBus = mitt();
app.config.globalProperties.$day = dayjs; //Global mount