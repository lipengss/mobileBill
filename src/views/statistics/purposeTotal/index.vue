<template>
	<van-nav-bar left-text="返回" left-arrow fixed placeholder @click-left="router.back()" :title="dayjs(date).format('M月') + query.title" />
	<div class="container mb10">
		<div class="text">{{ dayjs(date).format('M月') }}{{ query.title }}{{ query.expenses === 'income' ? '共收入' : '共支出' }}</div>
		<div class="total"><small>￥</small>{{ formatNum(total) }}</div>
	</div>
	<OrderItem v-for="bill in allOrderList" :bill="bill" />
</template>
<script setup lang="ts">
import { computed, ref, onActivated } from 'vue';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { useRoute, useRouter, type LocationQuery } from 'vue-router';
import { dayjs, formatNum } from '@/utils/tools';
import OrderItem from '@/components/OrderItem/index.vue';

const route = useRoute();
const router = useRouter();
const { billList } = storeToRefs(useBillStore());

const total = ref(0);
const date = ref('');

const query = computed<LocationQuery>(() => route.query);

function initData() {
	if (typeof query.value.total === 'string') {
		total.value = parseFloat(query.value.total);
	}
	if (typeof query.value.date === 'string') {
		date.value = query.value.date;
	}
}

interface ENUMITEM extends IOrder {
	[key: string]: any;
}

// 过滤日期相同的数据 并返回当前类型的消费订单
const allOrderList = computed(() => {
	// 根据 月份 和支出/收入 和 支付平台/用途 过滤出数据
	const list = billList.value.filter(
		(n: ENUMITEM) =>
			dayjs(date.value).isSame(n.date, 'month') &&
			n.expenses === query.value.expenses &&
			typeof query.value.statisticsType === 'string' &&
			n[query.value.statisticsType] === query.value.key
	);
	return list;
});

onActivated(() => {
	initData();
});
</script>
<style scoped lang="scss">
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 30px 0 20px;
	.text {
		color: var(--van-gray-6);
		line-height: 40px;
	}
	.total {
		font-size: 40px;
	}
}
</style>
