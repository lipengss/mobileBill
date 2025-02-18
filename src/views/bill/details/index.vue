<template>
	<van-nav-bar left-text="返回" left-arrow fixed :border="false" @click-left="router.back()" />
	<div class="container">
		<div class="content">
			<div class="icon-line">
				<div class="icon-purpose" :style="`--color: ${EXPENSES.get(currentBill.expenses)?.color}`">
					<svg-icon :name="PURPOSE.get(currentBill.purpose)?.icon || ''" />
				</div>
				{{ PURPOSE.get(currentBill.purpose)?.label }}
			</div>
			<div class="line-price">{{ EXPENSES.get(currentBill.expenses)?.unit }}{{ formatNum(currentBill.price) }}</div>
			<div class="line">
				<div class="title">类型</div>
				<div class="value">
					<van-tag :type="EXPENSES.get(currentBill.expenses)?.type">{{ EXPENSES.get(currentBill.expenses)?.label }}</van-tag>
				</div>
			</div>
			<div class="line">
				<div class="title">支付尝试</div>
				<div class="value">
					{{ PAY_METHOD.get(currentBill.payMethod)?.label }}
				</div>
			</div>
			<div class="line" v-if="currentBill.serviceFee">
				<div class="title">服务费</div>
				<div class="value">-{{ currentBill.serviceFee }}</div>
			</div>
			<div class="line">
				<div class="title">记录时间</div>
				<div class="value">
					{{ currentBill.date }}
				</div>
			</div>
			<div class="line">
				<div class="title">备注</div>
				<div class="value">
					{{ currentBill.remarks || '无' }}
				</div>
			</div>
			<div class="line bins">
				<van-button type="danger" icon="delete-o" block plain round class="btn1" @click="billStore.deleteBillOrder(currentBill.id, true)">
					删除
				</van-button>
				<van-button type="primary" icon="edit" block plain round @click="formRef.onEditOrder(currentBill)">编辑</van-button>
			</div>
		</div>
	</div>
	<formData ref="formRef" @pull="setData" />
</template>

<script setup lang="ts">
import { ref, onActivated } from 'vue';
import { EXPENSES, PURPOSE, PAY_METHOD } from '@/assets/data';
import { useBillStore } from '@/stores/bill';
import { useRouter, useRoute, type LocationQuery } from 'vue-router';
import formData from '../formData.vue';
import { cloneDeep, formatNum } from '@/utils/tools';

const billStore = useBillStore();
const router = useRouter();

const route = useRoute();
const formRef = ref();
const currentBill = ref<IOrder>(cloneDeep(billStore.defaultBillItemData));

function setData() {
	const { id }: LocationQuery = route.query;
	const curItem = billStore.billList.filter((n) => n.id === id);
	if (curItem.length) {
		currentBill.value = cloneDeep(curItem[0]);
	}
}

onActivated(() => {
	setData();
});
</script>

<style scoped lang="scss">
.container {
	padding: 10px;
	.content {
		padding: 40px 16px 0 16px;
		border-radius: 10px;
		background-color: var(--van-white);
		.icon-line {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 20px;
		}
		.line-price {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: 30px;
			margin-bottom: 10px;
		}
		.line {
			display: flex;
			align-items: first baseline;
			line-height: 22px;
			margin-bottom: 10px;
			font-size: 14px;
			.title {
				min-width: 90px;
				text-align: justify;
				color: var(--van-cell-label-color);
			}
			.btn1 {
				margin-right: 20px;
			}
		}
		.bins {
			margin-top: 20px;
			padding-bottom: 20px;
		}
	}
}
</style>
