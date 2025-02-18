import { defineStore } from 'pinia';
import { dayjs, sortBy, Local, add, subtract } from '@/utils/tools';
import { showConfirmDialog, showSuccessToast } from 'vant';
import router from '@/router';

export const useBillStore = defineStore('bill', {
	state(): StoreState {
		return {
			billList: Local.get('billList') || [],
			defaultBillItemData: {
				expenses: 'income',
				price: '',
				payMethod: 'alipay',
				purpose: 'other',
				remarks: '',
				serviceFee: 0,
				date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
				id: '',
			},
			filter: {
				month: dayjs().format('YYYY-MM'),
				expenses: 'income',
			},
		};
	},
	getters: {
		formatBillList(state) {
			const data: { [key: string]: FormatBillItem } = {};
			const filterList = state.billList.filter((n) => {
				return n.expenses === state.filter.expenses && dayjs(n.date).isSame(state.filter.month, 'month');
			});
			filterList.forEach((n) => {
				const day = dayjs(n.date).format('YYYY-MM-DD');
				if (data[day]) {
					data[day].list.push(n);
					data[day].totalIncome = sum(data[day].list.filter((n) => n.expenses === 'income').map((n) => parseFloat(n.price)));
					data[day].totalPay = sum(data[day].list.filter((n) => n.expenses === 'pay').map((n) => parseFloat(n.price)));
					data[day].totalServiceFee = sum(data[day].list.filter((n) => n.serviceFee > 0).map((n) => n.serviceFee));
				} else {
					data[day] = {
						date: day,
						totalIncome: n.expenses === 'income' ? parseFloat(n.price) : 0,
						totalPay: n.expenses === 'pay' ? parseFloat(n.price) : 0,
						totalServiceFee: n.serviceFee > 0 ? n.serviceFee : 0,
						list: [n],
					};
				}
			});
			function sum(list: number[]): number {
				return list.reduce((pre, cur) => parseFloat(add(pre, cur)), 0);
			}
			return sortBy(Object.values(data), (n) => dayjs(n.date).valueOf()).reverse();
		},
	},
	actions: {
		init() {
			if (Local.get('billList')) {
				this.billList = Local.get('billList');
			}
		},
		deleteBillOrder(id: string, bool?: boolean) {
			showConfirmDialog({
				message: '删除后无法啊恢复！是否删除？',
				beforeClose: (action) => {
					if (action === 'confirm') {
						const index: number = this.billList.findIndex((n) => n.id === id);
						if (index !== -1) {
							this.billList.splice(index, 1);
						}
						Local.set('billList', this.billList);
						bool && router.back();
					}
					return true;
				},
			}).catch(() => {});
		},
		addBill(data: IOrder) {
			if (!this.billList.some((item) => item.id === data.id)) {
				this.billList.push(data);
				Local.set('billList', this.billList);
			}
		},
		editBill(data: IOrder) {
			const { id } = data;
			const index = this.billList.findIndex((i) => i.id === id);
			if (index !== -1) {
				this.billList.splice(index, 1, data);
			}
			Local.set('billList', this.billList);
			showSuccessToast('修改成功');
		},
	},
});
