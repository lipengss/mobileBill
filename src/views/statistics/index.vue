<template>
	<filterData />
	<div class="container mb10">
		<div class="tag">
			<CheckBoxTag :options="formatMap(STATISTICS_TYPE)" v-model:value="statisticsType" @change="setPieData" :activeColor="themeColor" />
		</div>
		<PieChart :option="pieOption" />
	</div>
	<div class="container mb10">
		<van-cell
			v-for="item in pieOption.series.data"
			:value="'￥' + formatNum(item.value)"
			is-link
			center
			:to="{
				path: '/purposeTotal',
				query: {
					title: item.name,
					key: item.key,
					total: item.value,
					date: filter.month,
					expenses: filter.expenses,
					statisticsType: statisticsType,
				},
			}"
		>
			<template #icon>
				<div class="icon-purpose" :style="{ '--color': themeColor }">
					<svg-icon :name="formatIcon(item.key)" />
				</div>
			</template>
			<template #title>
				<div class="name">{{ item.name }}</div>
				<van-progress :percentage="item.per" :show-pivot="false" :color="themeColor" />
			</template>
		</van-cell>
	</div>
	<div class="container">
		<div class="big-title">每日对比</div>
		<BarChart :option="dayRatioOption" />
	</div>
</template>
<script lang="ts">
export default {
	name: 'statistics',
};
</script>
<script setup lang="ts">
import { ref, computed, watch, onActivated, watchEffect } from 'vue';
import { EXPENSES, formatMap, PURPOSE, STATISTICS_TYPE, PAY_METHOD, formatNumber } from '@/assets/data';
import { useBill } from '@/hooks/useBill';
import { sortBy, dayjs, formatNum, convertToPercentages } from '@/utils/tools';
import { useChangeColor } from '@/hooks/useColor';
import CheckBoxTag from '@/components/CheckBoxTag/index.vue';
import PieChart from '@/components/PieChart/index.vue';
import BarChart from '@/components/BarChart/index.vue';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import filterData from '@/views/bill/filterData.vue';

const { filter } = storeToRefs(useBillStore());
const { incomeTotal, payTotal, filterMonthData } = useBill();
const { getLightColor } = useChangeColor();

const statisticsType = ref<'purpose' | 'payMethod'>('purpose');
const total = ref('0.00');

const pieOption = ref<any>({
	grid: {
		top: 10,
	},
	series: {
		type: 'pie',
		radius: ['34%', '60%'],
		center: ['50%', '50%'],
		data: [],
		silent: true,
		padAngle: 2,
		itemStyle: {
			borderRadius: 2,
		},
		label: {
			formatter: '{b} {per|{d}%}',
			minMargin: 5,
			edgeDistance: 10,
			lineHeight: 15,
			rich: {
				per: {
					color: '#999',
				},
			},
		},
		emphasis: {
			itemStyle: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: 'rgba(0, 0, 0, 0.5)',
			},
		},
	},
});
const dayRatioOption = ref<any>({
	tooltip: {},
	grid: {
		containLabel: true,
		left: 10,
		top: 10,
		right: 20,
	},
	yAxis: {
		type: 'value',
		splitLine: {
			lineStyle: {
				color: '#eee',
			},
		},
		axisLabel: {
			color: '#969799',
			formatter: (val: number) => formatNumber(val),
		},
	},
	xAxis: {
		type: 'category',
		data: [],
		axisTick: {
			show: false,
		},
		axisLine: {
			lineStyle: {
				color: '#ccc',
			},
		},
		axisLabel: {
			color: '#969799',
		},
	},
	series: {
		type: 'bar',
		data: [],
		barMaxWidth: 20,
		itemStyle: {
			borderRadius: 2,
		},
		label: {
			formatter: '{b} {per|{d}%}',
			minMargin: 5,
			edgeDistance: 10,
			lineHeight: 15,
			rich: {
				per: {
					color: '#999',
				},
			},
		},
		emphasis: {
			itemStyle: {
				shadowBlur: 10,
				shadowOffsetX: 0,
				shadowColor: 'rgba(0, 0, 0, 0.5)',
			},
		},
	},
});
const themeColor = computed(() => EXPENSES.get(filter.value.expenses)?.color || '');

watchEffect(() => {
	total.value = filter.value.expenses === 'income' ? incomeTotal(filter.value.month) : payTotal(filter.value.month);
	pieOption.value.color = Array.from({ length: 10 }).map((n, index) => {
		return getLightColor(themeColor.value, index / 6);
	});
	dayRatioOption.value.color = themeColor.value;
});

// 过滤日期相同的数据 并返回所有账单记录
const allOrderList = computed(() => filterMonthData(filter.value.month, filter.value.expenses));

function formatIcon(key: string): string {
	return statisticsType.value === 'purpose' ? PURPOSE.get(key)?.icon || '' : PAY_METHOD.get(key)?.icon || '';
}

function setPieData() {
	const data: { [key: string]: number } = {};
	// 将不同类型的账单分别累加
	allOrderList.value.forEach((n) => {
		if (data[n[statisticsType.value]]) {
			data[n[statisticsType.value]] = data[n[statisticsType.value]] + parseFloat(n.price);
		} else {
			data[n[statisticsType.value]] = parseFloat(n.price);
		}
	});
	// 将累加后的金额 以最大的为基数 转化成百分比
	const perList = convertToPercentages(Object.values(data));
	const dataList = Object.keys(data).map((n, index) => {
		return {
			value: data[n],
			name: statisticsType.value === 'purpose' ? PURPOSE.get(n)?.label : PAY_METHOD.get(n)?.label,
			key: n,
			per: perList[index],
		};
	});
	// 设置饼图的数据
	pieOption.value.series.data = sortBy(dataList, 'per').reverse();
	setBarData();
}

function setBarData() {
	const data: { [key: string]: number } = {};
	// 将不同类型的账单分别累加
	allOrderList.value.forEach((n) => {
		const day = dayjs(n.date).format('YYYY-MM-DD');
		if (data[day]) {
			data[day] = data[day] + parseFloat(n.price);
		} else {
			data[day] = parseFloat(n.price);
		}
	});
	dayRatioOption.value.xAxis.data = Object.keys(data).map((n) => dayjs(n).format('D'));
	dayRatioOption.value.series.data = Object.values(data);
}

watch(() => filter.value.expenses, setPieData, {
	immediate: true,
});

watch(() => filter.value.month, setPieData);
onActivated(() => {
	setPieData();
});
</script>
<style lang="scss" scoped>
.tag {
	padding-top: 10px;
	display: flex;
	justify-content: center;
}
:deep .van-cell {
	display: grid;
	grid-template-columns: 46px 2fr 1fr 20px;
	.van-cell__title {
		display: grid;
		align-items: center;
		grid-template-columns: 60px 1fr;
		grid-column-gap: 10px;
		.name {
			text-align: justify;
		}
	}
}
.van-nav-bar {
	background-color: v-bind(themeColor);
	:deep .van-nav-bar__title {
		color: var(--van-white);
	}
}
.big-title {
	line-height: 40px;
	padding: 10px 20px;
}
.chart {
	height: 240px;
}
</style>
