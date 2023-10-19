//general function
import useClipboard from 'vue-clipboard3';
import { ElMessage } from 'element-plus';
import { formatDate } from '/@/utils/formatTime';
import { useI18n } from 'vue-i18n';

export default function () {
	const { t } = useI18n();
	const { toClipboard } = useClipboard();
	//percentage formatting
	const percentFormat = (row: any, column: number, cellValue: any) => {
		return cellValue ? `${cellValue}%` : '-';
	};
	//List date and time formatting
	const dateFormatYMD = (row: any, column: number, cellValue: any) => {
		if (!cellValue) return '-';
		return formatDate(new Date(cellValue), 'YYYY-mm-dd');
	};
	//List date and time formatting
	const dateFormatYMDHMS = (row: any, column: number, cellValue: any) => {
		if (!cellValue) return '-';
		return formatDate(new Date(cellValue), 'YYYY-mm-dd HH:MM:SS');
	};
	//List date and time formatting
	const dateFormatHMS = (row: any, column: number, cellValue: any) => {
		if (!cellValue) return '-';
		let time = 0;
		if (typeof row === 'number') time = row;
		if (typeof cellValue === 'number') time = cellValue;
		return formatDate(new Date(time * 1000), 'HH:MM:SS');
	};
	// Decimal formatting
	const scaleFormat = (value: any = 0, scale: number = 4) => {
		return Number.parseFloat(value).toFixed(scale);
	};
	// Decimal formatting
	const scale2Format = (value: any = 0) => {
		return Number.parseFloat(value).toFixed(2);
	};
	//Click to copy text
	const copyText = (text: string) => {
		return new Promise((resolve, reject) => {
			try {
				//copy
				toClipboard(text);
				//You can set the prompt box for successful copying and other operations below.
				ElMessage.success(t('message.layout.copyTextSuccess'));
				resolve(text);
			} catch (e) {
				//Copy failed
				ElMessage.error(t('message.layout.copyTextError'));
				reject(e);
			}
		});
	};
	return {
		percentFormat,
		dateFormatYMD,
		dateFormatYMDHMS,
		dateFormatHMS,
		scaleFormat,
		scale2Format,
		copyText,
	};
}