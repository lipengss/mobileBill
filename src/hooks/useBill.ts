import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { dayjs, formatNum, subtract, add } from '@/utils/tools';
export function useBill() {
	const { billList } = storeToRefs(useBillStore());
	// 根据月份过滤数据
	function filterMonthData(month: string, expenses: string): IOrder[] {
		const filterList = computed(() => billList.value.filter((n) => dayjs(month).isSame(n.date, 'month')).filter((n) => n.expenses === expenses));
		return filterList.value;
	}
	// 收入合计
	function incomeTotal(month: string): string {
		const filterList = filterMonthData(month, 'income');
		const total = computed(() =>
			filterList.reduce((pre, cur) => {
				return parseFloat(add(pre, cur.price));
			}, 0)
		);

		return formatNum(total.value);
	}
	// 支出合计
	function payTotal(month: string): string {
		const filterList = filterMonthData(month, 'pay');
		const total = computed(() =>
			filterList.reduce((pre, cur) => {
				return parseFloat(add(pre, cur.price));
			}, 0)
		);
		return formatNum(total.value);
	}
	function serviceFeeTotal(month: string): string {
		const incomeList = filterMonthData(month, 'income').filter((n) => n.serviceFee);
		const payList = filterMonthData(month, 'pay').filter((n) => n.serviceFee);
		const total = computed(() =>
			[...payList, ...incomeList].reduce((pre, cur) => {
				return parseFloat(add(pre, cur.serviceFee));
			}, 0)
		);
		return formatNum(total.value);
	}
	function platformFeeTotal(month: string, payMethod: 'douyin' | 'meituan' | 'alipay') {
		const filterList = billList.value.filter((n) => dayjs(month).isSame(n.date, 'month')).filter((n) => n.payMethod === payMethod && n.serviceFee);
		const total = computed(() =>
			filterList.reduce((pre, cur) => {
				return parseFloat(add(pre, cur.serviceFee));
			}, 0)
		);
		return formatNum(total.value);
	}
	function balance(month: string): string {
		return subtract(incomeTotal(month), add(payTotal(month), serviceFeeTotal(month)));
	}
	return {
		incomeTotal,
		payTotal,
		balance,
		serviceFeeTotal,
		filterMonthData,
		platformFeeTotal,
	};
}
