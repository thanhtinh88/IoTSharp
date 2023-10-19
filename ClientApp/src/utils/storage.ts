import Cookies from 'js-cookie';

/**
  * window.localStorage browser permanent cache
  * @method set set permanent cache
  * @method get Get the permanent cache
  * @method remove Remove permanent cache
  * @method clear removes all permanent caches
  */
export const Local = {
    // Set up permanent cache
    set(key: string, val: any) {
        window.localStorage.setItem(key, JSON.stringify(val));
    },
    // Get permanent cache
    get(key: string) {
        let json: any = window.localStorage.getItem(key);
        return JSON.parse(json);
    },
    // Remove permanent cache
    remove(key: string) {
        window.localStorage.removeItem(key);
    },
    // Remove all permanent caches
    clear() {
        window.localStorage.clear();
    },
};

/**
  * window.sessionStorage browser temporary cache
  * @method set Set temporary cache
  * @method get Get the temporary cache
  * @method remove remove temporary cache
  * @method clear removes all temporary caches
  */
export const Session = {
    // Set up temporary cache
    set(key: string, val: any) {
        if (key === 'token') return Cookies.set(key, val);
        window.sessionStorage.setItem(key, JSON.stringify(val));
    },
    // Get temporary cache
    get(key: string) {
        if (key === 'token') return Cookies.get(key);
        let json: any = window.sessionStorage.getItem(key);
        return JSON.parse(json);
    },
    // Remove temporary cache
    remove(key: string) {
        if (key === 'token') return Cookies.remove(key);
        window.sessionStorage.removeItem(key);
    },
    // Remove all temporary caches
    clear() {
        Cookies.remove('token');
        window.sessionStorage.clear();
    },
};