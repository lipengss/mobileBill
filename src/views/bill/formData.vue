<template>
	<van-popup v-model:show="state.showPopup" round closeable position="bottom" :style="{ height: '94%' }">
		<van-form @submit="onSubmit" @failed="onFailed" :show-error-message="false" :validate-first="true" :style="{ '--color': themeColor }">
			<van-cell>
				<template #title>
					<div class="expenses-wrap">
						<CheckBoxTag :options="formatMap(EXPENSES)" v-model:value="billStore.filter.expenses" :active-color="themeColor" />
						<DateTag v-model:value="state.data.date" />
					</div>
				</template>
			</van-cell>
			<van-field
				v-model="state.data.price"
				readonly
				name="price"
				clickable
				@touchstart.stop="state.showKeyboard = true"
				size="large"
				:rules="[{ required: true, message: '填写金额' }]"
			>
				<template #left-icon><svg-icon name="symbol" /></template>
			</van-field>
			<van-number-keyboard
				v-model="state.data.price"
				:show="state.showKeyboard"
				:extra-key="['00', '.']"
				:maxlength="6"
				theme="custom"
				close-button-text="完成"
				@blur="state.showKeyboard = false"
			/>
			<van-cell>
				<template #title>
					<GridItem :options="formatMap(PURPOSE)" v-model:value="state.data.purpose" :active-color="themeColor" />
				</template>
			</van-cell>
			<van-cell>
				<template #title>
					<CheckBoxTag :options="formatMap(PAY_METHOD)" v-model:value="state.data.payMethod" :active-color="themeColor" size="small" />
				</template>
			</van-cell>
			<van-field v-if="currentPayMethod?.rate !== undefined" label="手续费" v-model="state.data.serviceFee" border>
				<template #right-icon>
					<van-cell title="费率" class="fee-cell" style="width: 120px" :value="currentPayMethod?.rate">
						<template #right-icon>%</template>
					</van-cell>
				</template>
			</van-field>
			<van-field v-model="state.data.remarks" border rows="2" autosize type="textarea" maxlength="50" placeholder="备注信息" show-word-limit />
			<van-cell>
				<van-button round block native-type="submit" :type="EXPENSES.get(billStore.filter.expenses)?.type" sizi="large">保存</van-button>
			</van-cell>
		</van-form>
	</van-popup>
</template>
<script setup lang="ts">
import { reactive, computed, defineExpose, defineEmits, watchEffect } from 'vue';
import { EXPENSES, PURPOSE, PAY_METHOD, formatMap } from '@/assets/data';
import { useBillStore } from '@/stores/bill';
import { showToast } from 'vant';
import { cloneDeep, nanoid, dayjs, multiply } from '@/utils/tools';
import CheckBoxTag from '@/components/CheckBoxTag/index.vue';
import GridItem from '@/components/GridItem/index.vue';
import DateTag from '@/components/DateTag/index.vue';

const billStore = useBillStore();

const state: IBillState = reactive({
	showPopup: false,
	showKeyboard: true,
	showPicker: false,
	data: cloneDeep(billStore.defaultBillItemData),
});
const themeColor = computed(() => {
	return EXPENSES.get(billStore.filter.expenses)?.color;
});

const emits = defineEmits(['pull']);

// 显示 添加账单弹窗
function onAddOrder() {
	state.data.price = '';
	state.data.remarks = '';
	state.showPopup = true;
}
// 显示 修改账单弹窗
function onEditOrder(data: IOrder) {
	state.data = cloneDeep(data);
	state.showPopup = true;
}

const currentPayMethod = computed(() => {
	return PAY_METHOD.get(state.data.payMethod);
});

watchEffect(() => {
	if (currentPayMethod.value) {
		const rate = currentPayMethod.value?.rate;
		if (rate === undefined) {
			state.data.serviceFee = 0;
			return;
		}
		const sFee = multiply(state.data.price, rate);
		state.data.serviceFee = typeof sFee === 'number' ? sFee : parseFloat(sFee);
	} else {
		state.data.serviceFee = 0;
	}
});

// 监听错误
function onFailed(errorInfo: any) {
	const msg = errorInfo.errors[0].message;
	showToast(msg);
}

// 提交账单
function onSubmit() {
	state.data.expenses = billStore.filter.expenses;
	const data = cloneDeep(state.data);
	data.date = dayjs(state.data.date).format('YYYY-MM-DD HH:mm:ss');
	if (data.id === '') {
		data.id = nanoid();
		billStore.addBill(data);
	} else {
		billStore.editBill(data);
	}
	emits('pull', data);
	state.showPopup = false;
}

defineExpose({ onAddOrder, onEditOrder });
</script>

<style scoped lang="scss">
.van-form {
	padding: 50px 0 10px;
	.expenses-wrap {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}
}
:deep .fee-cell {
	font-size: 12px;
	color: var(--van-cell-value-color);
	padding: 0;
	.van-cell__value {
		text-align: center;
	}
}
</style>
