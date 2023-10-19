import { nextTick } from 'vue';
import * as svg from '@element-plus/icons-vue';

// Get Alibaba font icon
const getAlicdnIconfont = () => {
    return new Promise((resolve, reject) => {
        nextTick(() => {
            const styles: any = document.styleSheets;
            let sheetsList = [];
            let sheetsIconList = [];
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].href && styles[i].href.indexOf('at.alicdn.com') > -1) {
                    sheetsList.push(styles[i]);
                }
            }
            for (let i = 0; i < sheetsList.length; i++) {
                for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
                    if (sheetsList[i].cssRules[j].selectorText && sheetsList[i].cssRules[j].selectorText.indexOf('.icon-') > -1) {
                        sheetsIconList.push(
                            `${sheetsList[i].cssRules[j].selectorText.substring(1, sheetsList[i].cssRules[j].selectorText.length).replace(/\:\:before/gi, '')}`
                        );
                    }
                }
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList);
            else reject('No value was obtained, please refresh and try again');
        });
    });
};

// Initialize to get the css style, get the svg icon that comes with element plus, add the ele- prefix, when using: ele-Aim
const getElementPlusIconfont = () => {
    return new Promise((resolve, reject) => {
        nextTick(() => {
            const icons = svg as any;
            const sheetsIconList = [];
            for (const i in icons) {
                sheetsIconList.push(`ele-${icons[i].name}`);
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList);
            else reject('No value was obtained, please refresh and try again');
        });
    });
};

// Initialize to get css style, here use fontawesome icon
const getAwesomeIconfont = () => {
    return new Promise((resolve, reject) => {
        nextTick(() => {
            const styles: any = document.styleSheets;
            let sheetsList = [];
            let sheetsIconList = [];
            for (let i = 0; i < styles.length; i++) {
                if (styles[i].href && styles[i].href.indexOf('netdna.bootstrapcdn.com') > -1) {
                    sheetsList.push(styles[i]);
                }
            }
            for (let i = 0; i < sheetsList.length; i++) {
                for (let j = 0; j < sheetsList[i].cssRules.length; j++) {
                    if (
                        sheetsList[i].cssRules[j].selectorText &&
                        sheetsList[i].cssRules[j].selectorText.indexOf('.fa-') === 0 &&
                        sheetsList[i].cssRules[j].selectorText.indexOf(',') === -1
                    ) {
                        if (/::before/.test(sheetsList[i].cssRules[j].selectorText)) {
                            sheetsIconList.push(
                                `${sheetsList[i].cssRules[j].selectorText.substring(1, sheetsList[i].cssRules[j].selectorText.length).replace(/\:\:before/gi, '')}`
                            );
                        }
                    }
                }
            }
            if (sheetsIconList.length > 0) resolve(sheetsIconList.reverse());
            else reject('No value was obtained, please refresh and try again');
        });
    });
};

/**
  * Get font icon `document.styleSheets`
  * @method ali Get the Ali font icon `<i class="iconfont icon class name"></i>`
  * @method ele Get element plus’s own icon `<i class="icon class name"></i>`
  * @method ali Get the icon of fontawesome `<i class="fa icon class name"></i>`
  */
const initIconfont = {
    // iconfont
    ali: () => {
        return getAlicdnIconfont();
    },
    // element plus
    ele: () => {
        return getElementPlusIconfont();
    },
    // fontawesome
    awe: () => {
        return getAwesomeIconfont();
    },
};

//Export method
export default initIconfont;