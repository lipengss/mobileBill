<template>
	<van-popup v-model:show="showDialog" position="bottom" :style="{ height: '56%' }" round safe-area-inset-bottom>
		<van-nav-bar title="粘贴账单" left-text="取消" right-text="导入" @click-left="showDialog = false" @click-right="onConfirm" />
		<van-field
			v-model="billData"
			rows="2"
			autofocus
			clearable
			:autosize="{ maxHeight: 390, minHeight: 390 }"
			type="textarea"
			:placeholder="placeholder"
		/>
		<van-cell title="账单条数" :value="length" center>
			<template #right-icon>
				<van-icon :name="statusMap[status].icon" :color="statusMap[status].color" size="20" style="margin-left: 10px" />
			</template>
		</van-cell>
	</van-popup>
</template>
<script setup lang="ts">
import { ref, defineExpose, computed } from 'vue';
import { showToast } from 'vant';
import { isEqual } from '@/utils/tools';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { exportBillDocx } from './exportBillDocx';

const { addBill } = useBillStore();
const { billList, defaultBillItemData } = storeToRefs(useBillStore());

const showDialog = ref(false);
const billData = ref();
const status = ref();
const statusMap: any = {
	close: {
		icon: 'close',
		color: '#ee0a24',
	},
	passed: {
		icon: 'passed',
		color: '#07c160',
	},
	warning: {
		icon: 'warning-o',
		color: '#969799',
	},
};

const length = computed(() => {
	if (billData.value === undefined || billData.value === '') {
		status.value = 'warning';
		return 0 + ' 条';
	} else {
		try {
			status.value = 'passed';
			return JSON.parse(billData.value).length + ' 条';
		} catch (err) {
			status.value = 'close';
			return '数据格式错误，请检查！';
		}
	}
});

const placeholder = `
	[
		{
			date: "2024-06-01 14:26:45",
			expenses: "pay",
			id: "ZrhNqy3FrANgq8JUs8HHc",
			payMethod: "cash",
			price: "1000",
			purpose: "other",
			remarks: "备注信息",
			staff: "员工"
		}...
	]
	`;

// 粘贴
function onConfirm() {
	try {
		const json = JSON.parse(billData.value);
		// 判断是否是数组
		if (Array.isArray(json)) {
			for (const item of json) {
				const index = billList.value.findIndex((n) => n.id === item.id);
				if (index !== -1) {
					billList.value.splice(index, 1, item);
				} else {
					addBill(item);
				}
			}
		}
		// 判断是否是对象
		if (Object.prototype.toString.call(json) === '[object Object]') {
			if (isEqual(Object.keys(json), Object.keys(defaultBillItemData.value))) {
				addBill(json);
			}
		}
		showDialog.value = false;
	} catch (err) {
		showToast('导入的数据格式有误');
	}
}
function operation(method: string) {
	switch (method) {
		case 'load':
			showDialog.value = true;
			break;
		default:
			exportBillDocx();
	}
}

defineExpose({
	operation,
});
</script>
<style scoped lang="scss">
.van-popup {
	display: flex;
	flex-direction: column;
	.van-field {
		flex: 1;
	}
}
</style>
