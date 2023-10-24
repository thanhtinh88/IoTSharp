export const telemetryHistoryChartOptions = {
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		// data: ['publishFailed', 'publishSuccessed', 'subscribeFailed', 'subscribeSuccessed'],
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: [],
	},
	yAxis: {
		type: 'value',
		boundaryGap: [0, '100%'],
	},
	dataZoom: [
		{
			type: 'inside',
			start: 0,
			end: 100,
		},
		{
			start: 0,
			end: 100,
			height: 10, //Here you can set the size of dataZoom
			bottom: 0,
		},
	],
	series: [],
};
