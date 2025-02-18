<template>
	<v-chart class="chart" :option="option" autoresize />
</template>
<script setup lang="ts">
import { withDefaults, defineProps, provide, reactive } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import VChart, { THEME_KEY } from 'vue-echarts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import 'echarts-liquidfill';

interface Props {
	data: number;
}
const props = withDefaults(defineProps<Props>(), {
	data: 0.5,
});

const option = reactive({
	series: [
		{
			type: 'liquidFill',
			radius: '80%',
			data: [props.data],
			label: {
				color: '#fff',
				insideColor: 'transparent',
				textStyle: {
					fontSize: 30,
					fontWeight: 'bold',
				},
			},
			color: [
				{
					type: 'linear',
					x: 0,
					y: 1,
					x2: 0,
					y2: 0,
					colorStops: [
						{
							offset: 1,
							color: ['#6a7feb'], // 0% 处的颜色
						},
						{
							offset: 0,
							color: ['#27e5f1'], // 100% 处的颜色
						},
					],
					global: false, // 缺省为 false
				},
			],
			outline: {
				show: true,
				borderDistance: 5,
				itemStyle: {
					borderColor: 'rgba(67,209,100,1)',
					borderWidth: 0,
				},
			},
		},
	],
});

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

provide(THEME_KEY, 'light');
</script>
