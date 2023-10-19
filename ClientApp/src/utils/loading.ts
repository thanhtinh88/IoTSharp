import { nextTick } from 'vue';
import '/@/theme/loading.scss';

/**
  * Page global Loading
  * @method start create loading
  * @method done remove loading
  */
export const NextLoading = {
    //Create loading
    start: () => {
        const bodies: Element = document.body;
        const div = <HTMLElement>document.createElement('div');
        div.setAttribute('class', 'loading-next');
        const htmls = `
<div class="loading-next-box">
<div class="loading-next-box-warp">
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
<div class="loading-next-box-item"></div>
</div>
</div>
`;
        div.innerHTML = htmls;
        bodies.insertBefore(div, bodies.childNodes[0]);
        window.nextLoading = true;
    },
    // remove loading
    done: () => {
        nextTick(() => {
            window.nextLoading = false;
            const el = <HTMLElement>document.querySelector('.loading-next');
            el?.parentNode?.removeChild(el);
        });
    },
};