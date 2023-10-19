import { ElMessage } from 'element-plus';

/**
  * hex color to rgb color
  * @param str color value string
  * @returns returns the processed color value
  */
export function hexToRgb(str: any) {
    let hexs: any = '';
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(str)) return ElMessage.warning('Input wrong hex');
    str = str.replace('#', '');
    hexs = str.match(/../g);
    for (let i = 0; i < 3; i++) hexs[i] = parseInt(hexs[i], 16);
    return hexs;
}

/**
  * Convert rgb color to Hex color
  * @param r represents red
  * @param g represents green
  * @param b represents blue
  * @returns returns the processed color value
  */
export function rgbToHex(r: any, g: any, b: any) {
    let reg = /^\d{1,3}$/;
    if (!reg.test(r) || !reg.test(g) || !reg.test(b)) return ElMessage.warning('Input wrong rgb color value');
    let hexs = [r.toString(16), g.toString(16), b.toString(16)];
    for (let i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = `0${hexs[i]}`;
    return `#${hexs.join('')}`;
}

/**
  * Deepen color value
  * @param color color value string
  * @param level The degree of deepening, limited to 0-1
  * @returns returns the processed color value
  */
export function getDarkColor(color: string, level: number) {
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(color)) return ElMessage.warning('Input wrong hex color value');
    let rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) rgb[i] = Math.floor(rgb[i] * (1 - level));
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

/**
  * Lighten the color value
  * @param color color value string
  * @param level The degree of deepening, limited to 0-1
  * @returns returns the processed color value
  */
export function getLightColor(color: string, level: number) {
    let reg = /^\#?[0-9A-Fa-f]{6}$/;
    if (!reg.test(color)) return ElMessage.warning('Input wrong hex color value');
    let rgb = hexToRgb(color);
    for (let i = 0; i < 3; i++) rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i]);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}