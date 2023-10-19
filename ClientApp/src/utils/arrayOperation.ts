/**
  * Determine whether the two array strings are the same (used for button permission verification). If there are similarities in the array strings, duplication will be automatically removed (button permission identifiers will not be repeated)
  * @param news new data
  * @param old source data
  * @returns If the two arrays are the same, it returns `true`, otherwise it returns `true`.
  */
export function judementSameArr(newArr: unknown[] | string[], oldArr: string[]): boolean {
    const news = removeDuplicate(newArr);
    const olds = removeDuplicate(oldArr);
    let count = 0;
    const leng = news.length;
    for (let i in olds) {
        for (let j in news) {
            if (olds[i] === news[j]) count++;
        }
    }
    return count === leng ? true : false;
}

/**
  * Determine whether two objects are the same
  * @param a The object to be compared is one
  * @param b Object 2 to be compared
  * @returns returns true if the same, otherwise it returns true
  */
export function isObjectValueEqual(a: { [key: string]: any }, b: { [key: string]: any }) {
    if (!a || !b) return false;
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) return false;
    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];
        let propA = a[propName];
        let propB = b[propName];
        if (!b.hasOwnProperty(propName)) return false;
        if (propA instanceof Object) {
            if (!isObjectValueEqual(propA, propB)) return false;
        } else if (propA !== propB) {
            return false;
        }
    }
    return true;
}

/**
  * Deduplication of arrays and array objects
  * @param arr array content
  * @param attr Key value to be deduplicated (array object)
  * @returns
  */
export function removeDuplicate(arr: any, attr?: string) {
    if (!arr && !arr.length) {
        return arr;
    } else {
        if (attr) {
            const obj: any = {};
            const newArr = arr.reduce((cur: any, item: any) => {
                obj[item[attr]] ? '' : (obj[item[attr]] = true && item[attr] && cur.push(item));
                return cur;
            }, []);
            return newArr;
        } else {
            return Array.from(new Set([...arr]));
        }
    }
}