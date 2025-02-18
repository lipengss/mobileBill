<template>
	<van-collapse v-model="activeNames">
		<van-collapse-item v-for="[year, monthObj] in mapData" :title="`${year}年 账单`" :name="year">
			<van-cell class="cell-item" v-for="[month, dayObj] in monthObj" is-link center :value="`${dayObj.length} 笔`">
				<template #title>
					<div class="name">{{ dayjs(month).format('M月份') }}</div>
					<van-progress :percentage="rate(dayObj.length)" :show-pivot="false" />
				</template>
				<template #right-icon>
					<van-button size="small" type="danger" plain style="margin-left: 10px" @click="clearMonthData(month, dayObj)">清除</van-button>
				</template>
			</van-cell>
		</van-collapse-item>
	</van-collapse>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { dayjs, numeral, Local } from '@/utils/tools';
import { showConfirmDialog, showNotify } from 'vant';
import 'vant/es/notify/style';
const { billList } = storeToRefs(useBillStore());

const activeNames = ref<Array<string>>([]);

const mapData = computed(() => {
	const mapData = new Map();
	billList.value.forEach((n) => {
		const year = dayjs(n.date).format('YYYY');
		const month = dayjs(n.date).format('YYYY-MM');
		// 没有年份的话
		if (mapData.has(year)) {
			if (mapData.get(year).has(month)) {
				mapData.get(year).get(month).push(n);
			} else {
				mapData.get(year).set(month, [n]);
			}
		} else {
			let map = new Map();
			map.set(month, [n]);
			mapData.set(year, map);
		}
	});
	return mapData;
});

function rate(monthTotal: number): number {
	const rate = numeral(numeral(monthTotal).divide(100)).multiply(100).format('0.00');
	return parseFloat(rate);
}

function clearMonthData(month: string, list: IOrder[]) {
	showConfirmDialog({
		title: `${dayjs(month).format('YYYY年MM月')}`,
		message: '清除数据后无法恢复，请提前备份！',
		confirmButtonText: '确认删除',
		confirmButtonColor: '#ee0a24',
		cancelButtonText: '取消',
	})
		.then(() => {
			const dates = list.map((n) => n.date);
			const filterBillList = billList.value.filter((n) => !dates.includes(n.date));
			Local.set('billList', filterBillList);
			billList.value = filterBillList;
			showNotify({ message: '清除成功！', type: 'success' });
		})
		.catch(() => {
			// on cancel
		});
}
activeNames.value = Array.from(mapData.value.keys());
</script>
<style lang="scss" scoped>
:deep .van-collapse-item__content {
	padding: 0;
}
.cell-item {
	display: grid;
	grid-template-columns: 2fr 60px 60px;
	:deep .van-cell__title {
		display: grid;
		align-items: center;
		grid-template-columns: 40px 1fr;
		grid-column-gap: 10px;
		.name {
			text-align: justify;
		}
	}
}
</style>
