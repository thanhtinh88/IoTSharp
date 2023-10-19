import type { App } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { judementSameArr } from '/@/utils/arrayOperation';

/**
  * User permission instructions
  * @directive Single permission verification (v-auth="xxx")
  * @directive Multiple permission verification, if one is met, it will be displayed (v-auths="[xxx,xxx]")
  * @directive Multiple permission verification, if all are satisfied, it will be displayed (v-auth-all="[xxx,xxx]")
  */
export function authDirective(app: App) {
    //Single permission verification (v-auth="xxx")
    app.directive('auth', {
        mounted(el, binding) {
            const stores = useUserInfo();
            if (!stores.userInfos.authBtnList.some((v: string) => v === binding.value)) el.parentNode.removeChild(el);
        },
    });
    //Multiple permission verifications, if one is satisfied, it will be displayed (v-auths="[xxx,xxx]")
    app.directive('auths', {
        mounted(el, binding) {
            let flag = false;
            const stores = useUserInfo();
            stores.userInfos.authBtnList.map((val: string) => {
                binding.value.map((v: string) => {
                    if (val === v) flag = true;
                });
            });
            if (!flag) el.parentNode.removeChild(el);
        },
    });
    // Multiple permission verification, if all are satisfied, it will be displayed (v-auth-all="[xxx,xxx]")
    app.directive('auth-all', {
        mounted(el, binding) {
            const stores = useUserInfo();
            const flag = judementSameArr(binding.value, stores.userInfos.authBtnList);
            if (!flag) el.parentNode.removeChild(el);
        },
    });
}