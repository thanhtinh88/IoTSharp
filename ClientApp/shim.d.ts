/* eslint-disable */

// Declaration file, files with *.vue suffix are handed over to the vue module for processing
declare module '*.vue' {
    import type { DefineComponent } from 'vue';
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

//Declare the file and define global variables. For other app.config.globalProperties.xxx, use getCurrentInstance() to obtain
interface Window {
    nextLoading: Boolean;
}