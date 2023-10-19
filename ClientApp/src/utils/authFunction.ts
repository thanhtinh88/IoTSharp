import { useUserInfo } from '/@/stores/userInfo';
import { judementSameArr } from '/@/utils/arrayOperation';

/**
  * Single permission verification
  * @param value permission value
  * @returns If you have permission, return `true`, otherwise the opposite is true
  */
export function auth(value: string): boolean {
    const stores = useUserInfo();
    return stores.userInfos.authBtnList.some((v: string) => v === value);
}

/**
  * Multiple permission verification, if one is satisfied, it will be true
  * @param value permission value
  * @returns If you have permission, return `true`, otherwise the opposite is true
  */
export function auths(value: Array<string>): boolean {
    let flag = false;
    const stores = useUserInfo();
    stores.userInfos.authBtnList.map((val: string) => {
        value.map((v: string) => {
            if (val === v) flag = true;
        });
    });
    return flag;
}

/**
  * Multiple permission verification, if all are satisfied, it will be true
  * @param value permission value
  * @returns If you have permission, return `true`, otherwise the opposite is true
  */
export function authAll(value: Array<string>): boolean {
    const stores = useUserInfo();
    return judementSameArr(value, stores.userInfos.authBtnList);
}