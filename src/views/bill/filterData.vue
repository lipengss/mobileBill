<template>
	<div class="top-bg">
		<van-sticky>
			<div class="flex-bl-bt">
				<DatePicker v-model:value="filter.month" show-format="YYYY年MM月" bg-color="transparent" color="#fff" />
				<CheckBoxTag
					:options="formatMap(EXPENSES)"
					v-model:value="filter.expenses"
					bg-color="transparent"
					color="#fff"
					size="small"
					active-color="rgba(255,255,255,.2)"
				/>
			</div>
		</van-sticky>
		<div class="banner-info">
			<div class="banner-bot">
				<div class="details">
					<div class="line">
						<div class="title">总收入</div>
						<div class="value">+ {{ incomeTotal(filter.month) }}</div>
					</div>
					<div class="line">
						<div class="title">总支出</div>
						<div class="value">- {{ payTotal(filter.month) }}</div>
					</div>
					<div class="line">
						<div class="title">总手续费</div>
						<div class="value">- {{ serviceFeeTotal(filter.month) }}</div>
					</div>
				</div>
				<div class="balance">
					<div class="title">结余</div>
					<div class="value">￥ {{ parseFloat(balance(filter.month)) }}</div>
				</div>
			</div>
			<van-space style="justify-content: flex-end">
				<van-tag type="primary" size="large" @click="copyBill.visible = true">复制</van-tag>
				<van-tag type="success" size="large" @click="dataSourceRef.operation('load')">粘贴</van-tag>
				<van-tag type="warning" size="large" @click="dataSourceRef.operation('export')">导出</van-tag>
			</van-space>
		</div>
	</div>

	<dataSource ref="dataSourceRef" />
	<van-popup v-model:show="copyBill.visible" position="bottom" :style="{ height: '60%' }" round safe-area-inset-bottom>
		<van-nav-bar
			:title="`共 ${expandBillList.length} 笔 账单`"
			left-text="取消"
			right-text="全部复制"
			class="mb10"
			@click-left="copyBill.visible = false"
			@click-right="onCopy"
		/>
		<van-list>
			<van-cell title="分割" border class="popup-cell">
				<template #value>
					<CheckBoxTag :options="splitNums" v-model:value="copyBill.splitNum" bg-color="#f7f8fa" color="#969799" active-color="rgba(25,137,250,1)" />
				</template>
			</van-cell>
			<van-cell v-for="(bill, index) in splitBillList" :title="formatTitle(bill, index)">
				<template #value>
					<van-button size="mini" type="success" @click="copySplitBill(bill, index)">复制</van-button>
				</template>
			</van-cell>
		</van-list>
	</van-popup>
</template>
<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { useBill } from '@/hooks/useBill';
import dataSource from './dataSource.vue';
import { EXPENSES, formatMap } from '@/assets/data';
import { showToast } from 'vant';
import { useClipboard } from '@/hooks/useClipboard';
import { flatten } from '@/utils/tools';
import { splitArrayIntoChunks } from '@/assets/data';

const splitNums = [
	{ text: 10, value: '10' },
	{ text: 30, value: '30' },
	{ text: 50, value: '50' },
	{ text: 70, value: '70' },
];

const { copy } = useClipboard();

const { filter, formatBillList } = storeToRefs(useBillStore());
const { incomeTotal, payTotal, serviceFeeTotal, balance } = useBill();

const copyBill = reactive({
	visible: false,
	splitNum: '30',
});

const expandBillList = computed(() => flatten(formatBillList.value.map((n: FormatBillItem) => n.list)));

const splitBillList = computed(() => splitArrayIntoChunks<IOrder>(expandBillList.value, Number(copyBill.splitNum)));

const dataSourceRef = ref();

// 拷贝
function onCopy() {
	const content = JSON.stringify(expandBillList.value, undefined, 4);
	copy(content);
	showToast(`账单 ${formatBillList.value.length} 条已复制到粘贴板！`);
}

function copySplitBill(bill: IOrder[], index: number) {
	const title = formatTitle(bill, index);
	const content = JSON.stringify(bill, undefined, 4);
	copy(content);
	showToast(`账单 ${title} 已复制到粘贴板！`);
}

function formatTitle(bill: IOrder[], index: number) {
	const start = index * Number(copyBill.splitNum) + 1; // 当前块的起始索引
	const end = start + bill.length - 1; // 当前块的结束索引
	return `${start} ~ ${end} 条`;
}
</script>

<style scoped lang="scss">
.top-bg {
	min-height: 100px;
	border-bottom-left-radius: 16px;
	border-bottom-right-radius: 16px;
	background-image: url(../../assets//banner.svg);
	background-size: cover;
	overflow: hidden;
	.flex-bl-bt {
		padding: 10px;
		background-image: url(../../assets//banner.svg);
		background-size: cover;
	}
}
.banner-info {
	margin: 0 10px 0;
	min-height: 90px;
	padding: 10px;
	background-image: linear-gradient(to top, var(--van-primary-color), rgba(255, 255, 255, 0.3));
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	border-radius: 10px;
	.banner-bot {
		display: grid;
		grid-template-columns: 140px 1fr;
		align-items: center;
		color: #fff;
		.details {
			.line {
				display: grid;
				line-height: 22px;
				font-size: 14px;
				grid-template-columns: 60px 80px;
				.value {
					text-align: right;
				}
			}
		}
		.balance {
			flex: 2;
			text-align: right;
			.title {
				font-size: 14px;
				padding-left: 8px;
			}
			.value {
				font-size: 30px;
			}
		}
	}
}
.van-popup {
	display: flex;
	flex-direction: column;
	.van-list {
		flex: 1;
		overflow-y: auto;
	}
	:deep .popup-cell {
		.van-cell__value {
			flex: 2;
		}
	}
}
</style>
