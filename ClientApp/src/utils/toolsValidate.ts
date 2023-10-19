/**
  * 2020.11.29 lyt finishing
  * Collection of tools, suitable for daily development
  * Added multi-line comment information, you can view it by placing the mouse on the method name
  */

/**
  * Verification percentage (no decimals allowed)
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyNumberPercentage(val: string): string {
	// match spaces
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// Can only be numbers and decimal points, not other inputs
	v = v.replace(/[^\d]/g, '');
	// Cannot start with 0
	v = v.replace(/^0/g, '');
	// If the number exceeds 100, assign it to the maximum value of 100
	v = v.replace(/^[1-9]\d\d{1,3}$/, '100');
	//return result
	return v;
}

/**
  * Verification percentage (can be decimal)
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyNumberPercentageFloat(val: string): string {
	let v = verifyNumberIntegerAndFloat(val);
	// If the number exceeds 100, assign it to the maximum value of 100
	v = v.replace(/^[1-9]\d\d{1,3}$/, '100');
	// No more input values will be given after exceeding 100
	v = v.replace(/^100\.$/, '100');
	//return result
	return v;
}

/**
  * Decimal or integer (cannot be negative)
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyNumberIntegerAndFloat(val: string) {
	// match spaces
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// Can only be numbers and decimal points, not other inputs
	v = v.replace(/[^\d.]/g, '');
	// Only one can be entered starting with 0
	v = v.replace(/^0{2}$/g, '0');
	// Ensure that the first digit can only be a number, not a point
	v = v.replace(/^\./g, '');
	// Only 1 decimal place can appear
	v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
	// Keep 2 digits after the decimal point
	v = v.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
	//return result
	return v;
}

/**
  * Positive integer verification
  * @param val current value string
  * @returns returns the processed string
  */
export function verifiyNumberInteger(val: string) {
	// match spaces
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// Remove '.' to prevent problems when pasting, such as 0.1.12.12
	v = v.replace(/[\.]*/g, '');
	// Remove the numbers starting with 0 to prevent problems when pasting, such as 00121323
	v = v.replace(/(^0[\d]*)$/g, '0');
	//The first bit is 0 and can only appear once
	v = v.replace(/^0\d$/g, '0');
	// only match numbers
	v = v.replace(/[^\d]/g, '');
	//return result
	return v;
}

/**
  * Remove Chinese characters and spaces
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyCnAndSpace(val: string) {
	// Match Chinese characters and spaces
	let v = val.replace(/[\u4e00-\u9fa5\s]+/g, '');
	// match spaces
	v = v.replace(/(^\s*)|(\s*$)/g, '');
	//return result
	return v;
}

/**
  * Remove English and spaces
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyEnAndSpace(val: string) {
	// Match English and spaces
	let v = val.replace(/[a-zA-Z]+/g, '');
	// match spaces
	v = v.replace(/(^\s*)|(\s*$)/g, '');
	//return result
	return v;
}

/**
  * Do not enter spaces
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyAndSpace(val: string) {
	// match spaces
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	//return result
	return v;
}

/**
  * Amounts are separated by `,`
  * @param val current value string
  * @returns returns the processed string
  */
export function verifyNumberComma(val: string) {
	//Call decimal or integer (not negative) method
	let v: any = verifyNumberIntegerAndFloat(val);
	//Convert string to array
	v = v.toString().split('.');
	// \B matches non-word boundaries, with word characters on both sides or non-word characters on both sides
	v[0] = v[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	//Convert array to string
	v = v.join('.');
	//return result
	return v;
}

/**
  * Match text changes color (when searching)
  * @param val current value string
  * @param text The string value to be processed
  * @param color font highlight color when searched
  * @returns returns the processed string
  */
export function verifyTextColor(val: string, text = '', color = 'red') {
	//Return content, add color
	let v = text.replace(new RegExp(val, 'gi'), `<span style='color: ${color}'>${val}</span>`);
	//return result
	return v;
}

/**
  * Convert numbers to Chinese capital letters
  * @param val current value string
  * @param unit Default: Hundreds of billions of dollars
  * @returns returns the processed string
  */
export function verifyNumberCnUppercase(val: any, unit = 'Thousands of billions', v = '') {
	// Add 2 0s to the current content string, why??
	val += '00';
	//Returns the position where a specified string value first appears in the string. If it does not appear, this method returns -1
	let lookup = val.indexOf('.');
	// substring: does not contain the ending subscript content, substr: contains the ending subscript content
	if (lookup >= 0) val = val.substring(0, lookup) + val.substr(lookup + 1, 2);
	//According to the length of the content val, intercept and return the corresponding uppercase
	unit = unit.substr(unit.length - val.length);
	// Loop to intercept and splice uppercase letters
	for (let i = 0; i < val.length; i++) {
		v += 'zero one two three four five Lu seven eight nine'.substr(val.substr(i, 1), 1) + unit.substr(i, 1);
	}
	// Regular processing
	v = v
		.replace(/zero angle zero cent$/, 'whole')
		.replace(/zero[Qianbaishi]/g, 'zero')
		.replace(/zero{2,}/g, 'zero')
		.replace(/zero([hundred|million])/g, '$1')
		.replace(/zero+yuan/, 'yuan')
		.replace(/billion{0,3}wan/, 'billion')
		.replace(/^yuan/, 'zero yuan');
	//return result
	return v;
}

/**
  * phone number
  * @param val current value string
  * @returns returns true: the mobile phone number is correct
  */
export function verifyPhone(val: string) {
	// false: The mobile phone number is incorrect
	if (!/^((12[0-9])|(13[0-9])|(14[5|7])|(15([0-3]|[5-9]))| (18[0|1,5-9]))\d{8}$/.test(val)) return false;
	// true: mobile phone number is correct
	else return true;
}

/**
  *Domestic phone number
  * @param val current value string
  * @returns returns true: the domestic phone number is correct
  */
export function verifyTelPhone(val: string) {
	// false: The domestic phone number is incorrect
	if (!/\d{3}-\d{8}|\d{4}-\d{7}/.test(val)) return false;
	// true: domestic phone number is correct
	else return true;
}

/**
  * Login account (starts with a letter, allows 5-16 bytes, allows alphanumeric underscores)
  * @param val current value string
  * @returns returns true: the login account is correct
  */
export function verifyAccount(val: string) {
	// false: The login account is incorrect
	if (!/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/.test(val)) return false;
	// true: The login account is correct
	else return true;
}

/**
  * Password (starts with a letter, has a length between 6 and 16, and can only contain letters, numbers and underscores)
  * @param val current value string
  * @returns returns true: the password is correct
  */export function verifyPassword(val: string) {
	// false: The password is incorrect
	if (!/^[a-zA-Z]\w{5,15}$/.test(val)) return false;
	// true: Password is correct
	else return true;
}

/**
  * Strong password (letters + numbers + special characters, length between 6-16)
  * @param val current value string
  * @returns returns true: strong password is correct
  */
export function verifyPasswordPowerful(val: string) {
	// false: strong password is incorrect
	if (!/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA -z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$ )[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val))
		return false;
	// true: strong password is correct
	else return true;
}

/**
  * password strength
  * @param val current value string
  * @description weak: pure numbers, pure letters, pure special characters
  * @description: letters + numbers, letters + special characters, numbers + special characters
  * @description Strong: letters + numbers + special characters
  * @returns Returns the processed string: weak, medium, strong
  */
export function verifyPasswordStrength(val: string) {
	let v = '';
	// Weak: pure numbers, pure letters, pure special characters
	if (/^(?:\d+|[a-zA-Z]+|[!@#$%^&\.*]+){6,16}$/.test(val)) v = 'Weak ';
	// Medium: letters + numbers, letters + special characters, numbers + special characters
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)[a-zA-Z\d !@#$%^&\.*]{6,16}$/.test(val)) v = 'middle';
	// Strong: letters + numbers + special characters
	if (/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\.*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\.*]+$)(?![\d!@#$%^&\.*]+$)[a-zA-Z\d!@#$%^&\.*]{6,16}$/.test(val))
		v = 'strong';
	//return result
	return v;
}

/**
  *IP address
  * @param val current value string
  * @returns returns true: the IP address is correct
  */
export function verifyIPAddress(val: string) {
	// false: IP address is incorrect
	if (
		!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d |2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]) \.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(
			val
		)
	)
		return false;
	// true: IP address is correct
	else return true;
}

/**
  * Mail
  * @param val current value string
  * @returns returns true: the email is correct
  */
export function verifyEmail(val: string) {
	// false: Email is incorrect
	if (
		!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@" ]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1, 3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})) $/.test(
			val
		)
	)
		return false;
	// true: Email is correct
	else return true;
}

/**
  * ID card
  * @param val current value string
  * @returns returns true: ID card is correct
  */
export function verifyIdCard(val: string) {
	// false: ID card is incorrect
	if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0 -2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) return false;
	// true: ID card is correct
	else return true;
}

/**
  * Name
  * @param val current value string
  * @returns returns true: the name is correct
  */
export function verifyFullName(val: string) {
	// false: name is incorrect
	if (!/^[\u4e00-\u9fa5]{1,6}(·[\u4e00-\u9fa5]{1,6}){0,2}$/.test(val)) return false;
	// true: name is correct
	else return true;
}

/**
  * postal code
  * @param val current value string
  * @returns returns true: the postal code is correct
  */
export function verifyPostalCode(val: string) {
	// false: Postal code is incorrect
	if (!/^[1-9][0-9]{5}$/.test(val)) return false;
	// true: the zip code is correct
	else return true;
}

/**
  * url processing
  * @param val current value string
  * @returns returns true: url is correct
  */
export function verifyUrl(val: string) {
	// false: url is incorrect
	if (
		!/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
			val
		)
	)
		return false;
	// true: url is correct
	else return true;
}

/**
  * number plate
  * @param val current value string
  * @returns returns true: the license plate number is correct
  */
export function verifyCarNum(val: string) {
	// false: The license plate number is incorrect
	if (
		!/^(([Beijing, Tianjin, Shanghai, Chongqing, Hebei, Yunnan, Liaoning, Hunan, Anhui, Shandong, New Jiangsu, Zhejiang, Jiangxi, Hubei, Guangxi, Gansu, Mongolia, Shaanxi, Jilin, Fujian, Guangdong, Qinghai, Tibet, Sichuan, Ningqiong, envoys][A-Z](([0-9]{5}[DF ])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([Beijing, Tianjin, Shanghai, Chongqing, Hebei, Yunnan, Liaoning, Heilongjiang, Anhui, Shandong, New Jiangsu, Zhejiang, Jiangxi, Hubei and Guangxi Envoys from Gansu, Shanxi, Shaanxi, Jilin, Fujian, Guizhou, Guangdong, Qinghai, Tibet, Sichuan, Ningqiong][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9, Ambassadors from Hong Kong and Macao]))$ /.test(
			val
		)
	)
		return false;
	// true: the license plate number is correct
	else return true;
}