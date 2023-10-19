// font icon url
const cssCdnUrlList: Array<string> = [
    '//at.alicdn.com/t/font_2298093_y6u00apwst.css',
    '//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
];
// Third-party js url
const jsCdnUrlList: Array<string> = [];

// Dynamically set font icons in batches
export function setCssCdn() {
    if (cssCdnUrlList.length <= 0) return false;
    cssCdnUrlList.map((v) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = v;
        link.crossOrigin = 'anonymous';
        document.getElementsByTagName('head')[0].appendChild(link);
    });
}

// Dynamically set third-party js in batches
export function setJsCdn() {
    if (jsCdnUrlList.length <= 0) return false;
    jsCdnUrlList.map((v) => {
        let link = document.createElement('script');
        link.src = v;
        document.body.appendChild(link);
    });
}

/**
  * Set font icons and dynamic js in batches
  * @method cssCdn Dynamically set font icons in batches
  * @method jsCdn dynamically sets third-party js in batches
  */
const setIntroduction = {
    // Set css
    cssCdn: () => {
        setCssCdn();
    },
    // Set js
    jsCdn: () => {
        setJsCdn();
    },
};

//Export function method
export default setIntroduction;