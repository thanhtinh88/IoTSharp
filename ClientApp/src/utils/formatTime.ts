/**
  * Time and date conversion
  * @param date current time, new Date() format
  * @param format The time format string to be converted
  * @description format The string is arbitrary, such as `YYYY-mm, YYYY-mm-dd`
  * @description format quarter: "YYYY-mm-dd HH:MM:SS QQQQ"
  * @description format Day of the week: "YYYY-mm-dd HH:MM:SS WWW"
  * @description format weeks: "YYYY-mm-dd HH:MM:SS ZZZ"
  * @description format quarter + week + weeks: "YYYY-mm-dd HH:MM:SS WWW QQQQ ZZZ"
  * @returns Returns the spliced time string
  */
export function formatDate(date: Date, format: string): string {
	let we = date.getDay(); // day of the week
	let z = getWeek(date); // week
	let qut = Math.floor((date.getMonth() + 3) / 3).toString(); // Quarter
	const opt: { [key: string]: string } = {
		'Y+': date.getFullYear().toString(), // year
		'm+': (date.getMonth() + 1).toString(), // Month (the month starts from 0 and needs to be +1)
		'd+': date.getDate().toString(), // day
		'H+': date.getHours().toString(), // hour
		'M+': date.getMinutes().toString(), // minutes
		'S+': date.getSeconds().toString(), // seconds
		'q+': qut, // quarter
	};
	// Chinese numerals (weekday)
	const week: { [key: string]: string } = {
		'0': 'Zero',
		'1': "One",
		'2': 'Two',
		'3': 'Three',
		'4': 'Four',
		'5': 'Five',
		'6': 'Six',
	};
	//Chinese numbers (quarter)
	const quarter: { [key: string]: string } = {
		'1': 'One',
		'2': 'Two',
		'3': 'Three',
		'4': 'Four',
	};
	if (/(W+)/.test(format))
		format = format.replace(RegExp.$1, RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? 'week' + week[we] : 'week' + week[we]) : week[we]);
	if (/(Q+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 4 ? 'th' + quarter[qut] + 'quarter' : quarter[qut]);
	if (/(Z+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 3 ? 'th' + z + 'week' : z + '');
	for (let k in opt) {
		let r = new RegExp('(' + k + ')').exec(format);
		// If the input length is not 1, pad the front with zeros
		if (r) format = format.replace(r[1], RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'));
	}
	return format;
}

/**
  * Get the current week number of the date
  * @param dateTime currently passed in date value
  * @returns Returns the numeric value of the week
  */
export function getWeek(dateTime: Date): number {
	let temptTime = new Date(dateTime.getTime());
	// which day
	let weekday = temptTime.getDay() || 7;
	// 1+5 days of the week = Saturday
	temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);
	let firstDay = new Date(temptTime.getFullYear(), 0, 1);
	let dayOfWeek = firstDay.getDay();
	let spendDay = 1;
	if (dayOfWeek != 0) spendDay = 7 - dayOfWeek + 1;
	firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay);
	let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
	let result = Math.ceil(d / 7);
	return result;
}

/**
  * Convert time to `a few seconds ago`, `a few minutes ago`, `a few hours ago`, `a few days ago`
  * @param param current time, new Date() format or string time format
  * @param format The time format string to be converted
  * @description param 10 seconds: 10 * 1000
  * @description param 1 point: 60 * 1000
  * @description param 1 hour: 60 * 60 * 1000
  * @description param 24 hours: 60 * 60 * 24 * 1000
  * @description param 3 days: 60 * 60 * 24 * 1000 * 3
  * @returns Returns the spliced time string
  */
export function formatPast(param: string | Date, format: string = 'YYYY-mm-dd'): string {
	//Incoming format processing, storage conversion value
	let t: any, s: number;
	// Get js timestamp
	let time: number = new Date().getTime();
	// Whether it is an object
	typeof param === 'string' || 'object' ? (t = new Date(param).getTime()) : (t = param);
	// Current timestamp - incoming timestamp
	time = Number.parseInt(`${time - t}`);
	if (time < 10000) {
		// within 10 seconds
		return 'just';
	} else if (time < 60000 && time >= 10000) {
		// More than 10 seconds and less than 1 minute
		s = Math.floor(time / 1000);
		return `${s} seconds ago`;
	} else if (time < 3600000 && time >= 60000) {
		// More than 1 minute and less than 1 hour
		s = Math.floor(time / 60000);
		return `${s} minutes ago`;
	} else if (time < 86400000 && time >= 3600000) {
		// More than 1 hour and less than 24 hours
		s = Math.floor(time / 3600000);
		return `${s} hours ago`;
	} else if (time < 259200000 && time >= 86400000) {
		// More than 1 day and less than 3 days
		s = Math.floor(time / 86400000);
		return `${s}days ago`;
	} else {
		// More than 3 days
		let date = typeof param === 'string' || 'object' ? new Date(param) : param;
		return formatDate(date, format);
	}
}

/**
  * Time greeting
  * @param param current time, new Date() format
  * @description param calls `formatAxis(new Date())` to output `Good morning`
  * @returns Returns the spliced time string
  */
export function formatAxis(param: Date): string {
	let hour: number = new Date(param).getHours();
	if (hour < 6) return 'Good morning';
	else if (hour < 9) return 'Good morning';
	else if (hour < 12) return 'Good morning';
	else if (hour < 14) return 'Good afternoon';
	else if (hour < 17) return 'Good afternoon';
	else if (hour < 19) return 'Good evening';
	else if (hour < 22) return 'Good evening';
	else return 'Have a good night';
}