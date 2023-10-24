<template>
	<div class="home-container">
		<!-- Kanban -->
		<el-row :gutter="15" class="home-card-one mb15" style="row-gap: 15px">
			<home-card-item :item="item" :index="index" v-for="(item, index) in kanbanData" :key="index"></home-card-item>
		</el-row>
		<!-- Charts + Health -->
		<el-row :gutter="15" class="mb15">
			<el-col :span="12">
				<card title="Device online rate" :icon="checkNetwork" style="height: 400px">
					<div style="height: 100%" ref="onlineChartRef"></div>
				</card>
			</el-col>
			<el-col :span="12">
				<card title="Equipment Alarm Rate" :icon="warning" style="height: 400px">
					<div style="height: 100%" ref="warningChartRef"></div>
				</card>
			</el-col>
		</el-row>
		<!-- Message -->
		<el-row :gutter="15" class="mb15">
			<el-col :span="16">
				<card title="Message Bus" :icon="iconChart" style="height: 400px">
					<div style="height: 310px" ref="messageChartRef"></div>
				</card>
			</el-col>
			<el-col :span="8">
				<card title="Health Check" :icon="monitor">
					<div class="pt-10px">
						<div v-for="(item, index) in healthChecks" class="flex items-center mb-20px text-lg" :key="index">
							<el-icon class="text-2xl mr-8px">
								<CircleCheckFilled class="text-green-500" v-if="item.status === 'Healthy'" />
								<CircleCloseFilled class="text-red-500" v-else />
							</el-icon>
							{{ item.name }}
						</div>
					</div>
				</card>
			</el-col>
		</el-row>
	</div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts';
import { EChartsOption } from 'echarts';
import { storeToRefs } from 'pinia';
import checkNetwork from '~icons/mdi/check-network';
import warning from '~icons/ic/round-warning';
import message from '~icons/ic/baseline-message';
import monitor from '~icons/ic/round-monitor-heart';
import iconChart from '~icons/mdi/chart-bar-stacked';
import Card from '/@/components/card/index.vue';

let global: any = {
	homeChartOne: null,
	homeChartTwo: null,
	homeCharThree: null,
	dispose: [null, '', undefined],
};
import HomeCardItem from '/@/views/dashboard/HomeCardItem.vue';
import { homeCardItemsConfig } from '/@/views/dashboard/homeCardItems';
import { nextTick, onActivated, onMounted, ref, watch } from 'vue';
import { useThemeConfig } from '/@/stores/themeConfig';
import { getHealthChecks, getKanban, getMessageInfo } from '/@/api/dashboard';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const onlineChartRef = ref();
const warningChartRef = ref();
const messageChartRef = ref();
const myCharts = reactive([]); // All charts on the page are saved here
const charts = reactive({
	theme: '',
	bgColor: '',
	color: '#303133',
});
const healthChecks = reactive([]);
const colorList = [themeConfig.value.primary, '#D8D8D8'];
const onlineChartOption = {
	backgroundColor: charts.bgColor,
	tooltip: { trigger: 'item', formatter: '{b} <br/> {c}' },
	legend: {
		type: 'scroll',
		orient: 'vertical',
		right: '0%',
		left: '65%',
		top: 'center',
		itemWidth: 14,
		itemHeight: 14,
        data: ['online device', 'offline device'],
		textStyle: {
			rich: {
				name: {
					fontSize: 14,
					fontWeight: 400,
					width: 200,
					height: 35,
					padding: [0, 0, 0, 60],
					color: charts.color,
				},
				rate: {
					fontSize: 15,
					fontWeight: 500,
					height: 35,
					width: 40,
					padding: [0, 0, 0, 30],
					color: charts.color,
				},
			},
		},
	},
	series: [
		{
			type: 'pie',
			radius: ['60', themeConfig.value.isIsDark ? '50' : '102'],
			center: ['32%', '50%'],
			itemStyle: {
				color: function (params: any) {
					return colorList[params.dataIndex];
				},
			},
			label: { show: false },
			labelLine: { show: false },
            data: [
                {
                    name: 'online device',
                    value: 99,
                },
                { name: 'Offline device', value: 10 },
            ],
		},
	],
};
const warningChartOption = {
	backgroundColor: charts.bgColor,
	tooltip: { trigger: 'item', formatter: '{b} <br/> {c}' },
	legend: {
		type: 'scroll',
		orient: 'vertical',
		right: '0%',
		left: '65%',
		top: 'center',
		itemWidth: 14,
		itemHeight: 14,
        data: ['normal', 'common alarm', 'important alarm', 'emergency alarm'],
		textStyle: {
			rich: {
				name: {
					fontSize: 14,
					fontWeight: 400,
					width: 200,
					height: 35,
					padding: [0, 0, 0, 60],
					color: charts.color,
				},
				rate: {
					fontSize: 15,
					fontWeight: 500,
					height: 35,
					width: 40,
					padding: [0, 0, 0, 30],
					color: charts.color,
				},
			},
		},
	},
	series: [
		{
			type: 'pie',
			radius: ['60', themeConfig.value.isIsDark ? '50' : '102'],
			center: ['32%', '50%'],
			// itemStyle: {
			//   color: function (params: any) {
			//     return colorList[params.dataIndex];
			//   },
			// },
			color: [themeConfig.value.primary, '#F6BD16', '#FF8728', '#E23711'],
			label: { show: false },
			labelLine: { show: false },
            data: [
                { name: 'normal', value: '99' },
                { name: 'Common alarm', value: '10' },
                { name: 'Important alarm', value: '10' },
                { name: 'Emergency Alarm', value: '10' },
            ],
		},
	],
};
const messageChartOption = {
	tooltip: {
		trigger: 'axis',
	},
	legend: {
		data: ['publishFailed', 'publishSuccessed', 'subscribeFailed', 'subscribeSuccessed'],
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
	series: [
		{
			name: 'publishFailed',
			type: 'line',
			smooth: true,
			seriesLayoutBy: 'row',
			stack: 'Total',
			data: [],
		},
		{
			name: 'publishSuccessed',
			type: 'line',
			smooth: true,
			seriesLayoutBy: 'row',
			stack: 'Total',
			data: [],
		},
		{
			name: 'subscribeFailed',
			type: 'line',
			smooth: true,
			seriesLayoutBy: 'row',
			stack: 'Total',
			data: [],
		},
		{
			name: 'subscribeSuccessed',
			type: 'line',
			smooth: true,
			seriesLayoutBy: 'row',
			stack: 'Total',
			data: [],
		},
	],
};
const kanbanData = reactive(homeCardItemsConfig);
/**
 *
 * Where @param target is displayed, it is a Dom element and is assigned to a variable through <div ref="xxx">
 * @param option:EChartsOption chart parameters
 * @param name:string initEchartsResizeFun requires a list of all charts on the page, so use name to save them separately
 */
const initPieChart = (target: any, option: EChartsOption, name: string) => {
	// if (!global.dispose.some((b: any) => b === global.homeChartTwo)) global.homeChartTwo.dispose();
	global[name] = <any>echarts.init(target.value, charts.theme);
	(<any>global[name]).setOption(option);
	(<any>myCharts).push(global[name]);
};

// Batch settings echarts resize
const initEchartsResizeFun = () => {
	nextTick(() => {
		for (let i = 0; i < myCharts.length; i++) {
			setTimeout(() => {
				(<any>myCharts[i]).resize();
			}, i * 1000);
		}
	});
};
// Batch settings echarts resize
const initEchartsResize = () => {
	window.addEventListener('resize', initEchartsResizeFun);
};
// When the page loads
onMounted(async () => {
	await getData();
	initEchartsResize();
});
// due to page caching，keep-alive
onActivated(() => {
	initEchartsResizeFun();
});

async function getData() {
	// card data
	const res = await getKanban();
	const { eventCount, onlineDeviceCount, attributesDataCount, deviceCount, alarmsCount, userCount, produceCount, rulesCount } = res.data;
	kanbanData[3].zValue = eventCount;
	kanbanData[1].zValue = onlineDeviceCount;
	kanbanData[0].zValue = deviceCount;
	kanbanData[2].zValue = attributesDataCount;
	kanbanData[4].zValue = alarmsCount;
	kanbanData[5].zValue = userCount;
	kanbanData[6].zValue = produceCount;
	kanbanData[7].zValue = rulesCount;

	// Configure online device chart data
	onlineChartOption.series[0].data[0].value = onlineDeviceCount;
	onlineChartOption.series[0].data[1].value = deviceCount - onlineDeviceCount;

	const messageInfo = await getMessageInfo();
	const { dayHour, publishFailed, publishSuccessed, subscribeSuccessed, subscribeFailed } = messageInfo.data;
	messageChartOption.xAxis.data = dayHour;
	messageChartOption.series[0].data = publishFailed;
	messageChartOption.series[1].data = publishSuccessed;
	messageChartOption.series[2].data = subscribeFailed;
	messageChartOption.series[3].data = subscribeSuccessed;
	// health data
	const healthRes: any = await getHealthChecks();
	Object.assign(healthChecks, healthRes[0].entries);
}

watch(
	() => themeConfig.value.isIsDark,
	(isIsDark) => {
		nextTick(() => {
			charts.theme = isIsDark ? 'dark' : '';
			charts.bgColor = isIsDark ? 'transparent' : '';
			charts.color = isIsDark ? '#dadada' : '#303133';
			setTimeout(() => {
				// initLineChart();
			}, 500);
			setTimeout(() => {
				initPieChart(onlineChartRef, onlineChartOption as EChartsOption, 'onlineChart');
				initPieChart(warningChartRef, warningChartOption as EChartsOption, 'warningChart');
				initPieChart(messageChartRef, messageChartOption as EChartsOption, 'messageChart');
			}, 700);
			setTimeout(() => {
				// initBarChart();
			}, 1000);
		});
	},
	{
		deep: true,
		immediate: true,
	}
);
</script>
<style scoped lang="scss">
.home-container {
	overflow: hidden;

	.home-card-two,
	.home-card-three {
		.home-card-item {
			height: 400px;
			width: 100%;
			overflow: hidden;

			.home-monitor {
				height: 100%;

				.flex-warp-item {
					width: 25%;
					height: 111px;
					display: flex;

					.flex-warp-item-box {
						margin: auto;
						text-align: center;
						color: var(--el-text-color-primary);
						display: flex;
						border-radius: 5px;
						background: var(--next-bg-color);
						cursor: pointer;
						transition: all 0.3s ease;

						&:hover {
							background: var(--el-color-primary-light-9);
							transition: all 0.3s ease;
						}
					}
				}
			}
		}
	}
}
</style>
